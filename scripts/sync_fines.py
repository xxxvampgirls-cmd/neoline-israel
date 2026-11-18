#!/usr/bin/env python3
"""Update independently sourced traffic-police enforcement figures for NEOLINE.

This is a list of dated POLICE OPERATIONS, not a complete daily register of
tickets. Figures are not summed across operations or annual police yearbooks.
Only exact numerical statements on the official police Telegram preview pass.
No Telegram token, private API, driver identities, or geolocation is used.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
from pathlib import Path

import requests
from bs4 import BeautifulSoup

UTC = dt.timezone.utc
URL = "https://t.me/s/Atanpolice"
OUTPUT = Path(os.getenv("FINES_OUTPUT", "/tmp/neoline-fines-live.json"))
PREVIOUS = Path(os.getenv("FINES_PREVIOUS", "assets/fines/operations.json"))
COUNT_RE = re.compile(r"(?<!\d)(\d{1,3}(?:,\d{3})+|\d{2,6})\s*(?:דוחות(?:\s+תנועה)?|דוחת)(?!\w)")
CONTEXT_RE = re.compile(r"אכיפה|שוטרי|משטרת\s*התנועה|אגף\s*התנועה")
REPORT_RE = re.compile(r"נרשמ|רשמ[וו]?|חולקו|ניתנו|הוציאו")
APPROX_RE = re.compile(r"(?:יותר\s*מ|מעל|למעלה\s*מ|כ-|כ\s*$|לפחות|כמעט)\s*$")
MAX_REPORTS = 130


def period_of(body: str) -> str:
    if re.search(r"במהלך\s+השבוע|בשבוע\s+(?:החולף|האחרון)|מיום\s+ראשון.{0,70}עד\s+שבת", body):
        return "week"
    if re.search(r"בסוף\s+השבוע|במהלך\s+סוף\s+השבוע", body):
        return "weekend"
    if re.search(r"במהלך\s+היממה|ביממה\s+החולפת|24\s+השעות\s+האחרונות", body):
        return "day"
    return "operation"


def exact_total(body: str) -> int | None:
    """Only totals reported near an enforcement action; never sum sub-categories."""
    if not CONTEXT_RE.search(body):
        return None
    clean = body.replace('"', "").replace("״", "").replace("׳", "").replace("’", "")
    clean = re.sub(r"\s+", " ", clean)
    for match in COUNT_RE.finditer(clean[:1700]):
        prefix = clean[max(0, match.start() - 85):match.start()]
        if APPROX_RE.search(prefix):
            continue
        # The verb must relate to THIS number, not another sentence or category.
        if not REPORT_RE.search(prefix):
            continue
        if re.search(r"(?:מתוכם|מהם|בגין|עבירות\s+מהירות|טלפון|רמזור)\s*$", prefix):
            continue
        total = int(match.group(1).replace(",", ""))
        if 20 <= total <= 150000:
            return total
    return None


def parse_posts(html: str, now: dt.datetime) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    wrappers = soup.select(".tgme_widget_message_wrap")
    if not wrappers:
        raise ValueError("Official channel preview is empty")
    records = []
    for wrapper in wrappers:
        tag = wrapper.select_one(".tgme_widget_message[data-post]")
        time_tag = wrapper.select_one("time[datetime]")
        text_tag = wrapper.select_one(".tgme_widget_message_text")
        if tag is None or time_tag is None or text_tag is None:
            continue
        match = re.fullmatch(r"Atanpolice/(\d+)", tag.get("data-post", ""), re.I)
        if not match:
            continue
        try:
            published = dt.datetime.fromisoformat(time_tag["datetime"].replace("Z", "+00:00"))
            if published.tzinfo is None:
                published = published.replace(tzinfo=UTC)
            published = published.astimezone(UTC)
        except (ValueError, KeyError):
            continue
        if not dt.timedelta(minutes=-5) <= now - published <= dt.timedelta(days=366):
            continue
        body = re.sub(r"\s+", " ", text_tag.get_text(" ", strip=True))
        number = exact_total(body)
        if number is None:
            continue
        records.append({
            "id": "atan-" + match.group(1),
            "date": published.date().isoformat(),
            "period": period_of(body),
            "scope": "traffic-police-operation",
            "count": number,
            "sourceType": "police-telegram",
            "sourceUrl": "https://t.me/Atanpolice/" + match.group(1),
            "sourceLabel": "אגף התנועה משטרת ישראל",
            "categories": {},
            "note": "Число протоколов из конкретной сводки полиции, не суточный итог Израиля."
        })
    return records


def is_valid_report(report: object) -> bool:
    if not isinstance(report, dict):
        return False
    url = report.get("sourceUrl", "")
    if not isinstance(url, str) or not (url.startswith("https://t.me/Atanpolice/") or
           url.startswith("https://www.gov.il/") or url.startswith("https://www.globes.co.il/")):
        return False
    if report.get("period") not in ("operation", "day", "week", "weekend"):
        return False
    count = report.get("count")
    if count is not None and (type(count) is not int or count < 0 or count > 2_000_000):
        return False
    try:
        dt.date.fromisoformat(report["date"])
    except (ValueError, TypeError, KeyError):
        return False
    return isinstance(report.get("id"), str) and bool(report["id"])


def build(now: dt.datetime | None = None, session: requests.Session | None = None,
          previous: dict | None = None) -> dict:
    now = now or dt.datetime.now(UTC)
    if previous is None:
        try:
            previous = json.loads(PREVIOUS.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            previous = {}
    known = {entry["id"]: entry for entry in previous.get("reports", [])
             if is_valid_report(entry)}
    checked = now.replace(microsecond=0).isoformat().replace("+00:00", "Z")
    result = {
        "version": 1,
        "checkedAt": checked,
        "sourceStatus": "unavailable",
        "source": "Israel Police Traffic Division",
        "sourceUrl": URL,
        "reports": []
    }
    session = session or requests.Session()
    try:
        response = session.get(URL, timeout=(8, 19),
                               headers={"User-Agent": "Mozilla/5.0 (NEOLINEIsraelFines/1.0)"})
        response.raise_for_status()
        fresh = parse_posts(response.text, now)
        for entry in fresh:
            known[entry["id"]] = entry
        result["sourceStatus"] = "ok"
    except (requests.RequestException, ValueError) as exc:
        print("Official channel not readable; keeping last verified items:", type(exc).__name__)
    result["reports"] = sorted(known.values(), key=lambda p: (p["date"], p["id"]), reverse=True)[:MAX_REPORTS]
    return result


if __name__ == "__main__":
    result = build()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Fines:", result["sourceStatus"], "reports:", len(result["reports"]), "file:", OUTPUT)
