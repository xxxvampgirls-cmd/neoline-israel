#!/usr/bin/env python3
"""NEOLINE Israel: short-lived road updates from the OFFICIAL public traffic police channel.

Do NOT present these reports as an authoritative live map of closures:
they are timestamped source posts, not confirmation of a road's current state.
No Waze extraction, credentials, private Telegram access or copied media.
Runs in GitHub Actions, publishes tiny JSON on a separate branch so that
Cloudflare Pages is NOT rebuilt every ten minutes.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

UTC = dt.timezone.utc
SOURCE_URL = "https://t.me/s/Atanpolice"
HANDLE = "Atanpolice"
MAX_AGE_MINUTES = 180
MAX_ITEMS = 6
OUTPUT = Path(os.getenv("TRAFFIC_OUTPUT", "/tmp/neoline-traffic-live.json"))

# A match of generic "traffic" alone is not a closure claim.
ROAD_RE = re.compile(r"(?:\bכביש(?:ים)?\s*(?:מס[׳\"']?\s*)?|(?:\broad\b|\broute\b)\s*)(\d{1,3})", re.I)
CONTEXT_RE = re.compile(
    r"כביש|נתיב|מחלף|צומת|תנועה|איילון|גשר|road|lane|highway", re.I
)
CLOSED_RE = re.compile(
    r"נחסמ|נחסם|חסומ|חסום|חסימה|חסימות|נסגר|סגור|סגיר|חסמ|חסם|סגר|"
    r"blocked|closed|closure", re.I
)
OPENED_RE = re.compile(
    r"נפתח|נפתחה|נפתחו|פתיחת|הוסרה החסימה|שוחרר לתנועה|"
    r"reopen|open to traffic", re.I
)
SLOW_RE = re.compile(r"עומסי תנועה|עומס תנועה|פקק|שיבושי תנועה|congestion|traffic jam", re.I)
INCIDENT_RE = re.compile(r"תאונת דרכים|משאית.*התהפכ|רכב.*עולה באש|road accident", re.I)
PLANNED_RE = re.compile(r"צפוי(?:ה)? להיחס|תיחסמ|תיסגר|מחר|בשעות הלילה|planned closure", re.I)

def classify(text: str) -> str | None:
    if not CONTEXT_RE.search(text):
        return None
    closed = bool(CLOSED_RE.search(text))
    opened = bool(OPENED_RE.search(text))
    slow = bool(SLOW_RE.search(text))
    incident = bool(INCIDENT_RE.search(text))
    planned = bool(PLANNED_RE.search(text))
    if not any((closed, opened, slow, incident)):
        return None
    if planned:
        return "planned"
    if opened and not closed:
        return "reopened"
    if closed and not opened:
        return "closure"
    if slow and not closed:
        return "congestion"
    return "update"  # Mixed road statuses: never guess which section is open.

def parse_posts(page: str, now: dt.datetime) -> list[dict]:
    soup = BeautifulSoup(page, "html.parser")
    posts = soup.select(".tgme_widget_message_wrap")
    if not posts:
        raise ValueError("Telegram public preview has no message wrappers")
    items = []
    for post in posts:
        el = post.select_one(".tgme_widget_message")
        message_id = str(el.get("data-post", "")) if el else ""
        match = re.fullmatch(r"Atanpolice/(\d+)", message_id, re.I)
        if not match:
            continue
        time_el = post.select_one("time[datetime]")
        text_el = post.select_one(".tgme_widget_message_text")
        if time_el is None or text_el is None:
            continue
        try:
            published = dt.datetime.fromisoformat(time_el["datetime"].replace("Z", "+00:00"))
            published = published.astimezone(UTC) if published.tzinfo else published.replace(tzinfo=UTC)
        except (ValueError, KeyError):
            continue
        age = (now - published).total_seconds() / 60
        if age < -5 or age > MAX_AGE_MINUTES:
            continue
        # Keep the original source language: automatic translation is risky for road directions.
        raw = text_el.get_text(" ", strip=True)
        body = re.sub(r"\s+", " ", raw).strip()
        if not body or len(body) < 18:
            continue
        kind = classify(body)
        if not kind:
            continue
        roads = list(dict.fromkeys(ROAD_RE.findall(body)))[:6]
        # Public-only official URLs, no user or location tracking.
        source = f"https://t.me/{HANDLE}/{match.group(1)}"
        if urlparse(source).hostname != "t.me":
            continue
        items.append({
            "id": message_id,
            "publishedAt": published.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "kind": kind,
            "roads": roads,
            "original": body[:480] + ("…" if len(body) > 480 else ""),
            "url": source,
        })
    items.sort(key=lambda x: x["publishedAt"], reverse=True)
    return items[:MAX_ITEMS]

def build(now: dt.datetime | None = None, session: requests.Session | None = None) -> dict:
    now = now or dt.datetime.now(UTC)
    result = {
        "version": 1,
        "checkedAt": now.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "sourceStatus": "unavailable",
        "source": "Israel Police Traffic Division",
        "sourceUrl": SOURCE_URL,
        "ttlMinutes": MAX_AGE_MINUTES,
        "events": [],
    }
    session = session or requests.Session()
    try:
        response = session.get(
            SOURCE_URL,
            timeout=(8, 18),
            headers={"User-Agent": "Mozilla/5.0 (compatible; NEOLINEIsraelTraffic/1.0)"},
        )
        response.raise_for_status()
        result["events"] = parse_posts(response.text, now)
        result["sourceStatus"] = "ok"
    except (requests.RequestException, ValueError) as error:
        print(f"Official source unavailable ({type(error).__name__}); publishing NO unverified alerts.")
    return result

if __name__ == "__main__":
    data = build()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Traffic check: source={data['sourceStatus']}, events={len(data['events'])}, bytes={OUTPUT.stat().st_size}")
