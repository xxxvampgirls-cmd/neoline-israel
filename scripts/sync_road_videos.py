#!/usr/bin/env python3
"""Curate a truthful rolling 30-day YouTube road-video gallery for NEOLINE.

Only videos actually published by the three listed official Israeli channels
are accepted. Never fill missing slots with guessed links or stock pictures.
YouTube Atom feeds normally expose just the newest 15 entries; hourly polling
and persisted video IDs grow the real month archive over time.
"""
from __future__ import annotations

import datetime as dt
import json
import re
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "news" / "road-videos.json"
DAYS = 30
LIMIT = 72
UTC = dt.timezone.utc
CHANNELS = (
    ("news13", "UCvQmPpU20hw1Trss_CVwaew", "חדשות 13"),
    ("kan11", "UC_HwfTAcjBESKZRJq6BTCpg", "כאן חדשות"),
    ("police", "UCrwyHUb4iIrpknhP6MTvnww", "משטרת ישראל"),
)
CHANNEL_NAMES = {cid: name for cid, _, name in CHANNELS}
ATOM = {"a": "http://www.w3.org/2005/Atom",
        "yt": "http://www.youtube.com/xml/schemas/2015"}
ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
# Road and traffic topics only. A military/political report that merely
# mentions a road incident should not become automotive video coverage.
ROAD = re.compile(
    r"תאונ|התנגשות|התנגש|דריס|נדרס|התהפכ|כביש|בכביש|"
    r"נהג|נהיגה|נהגת|הגה|מכונ|רכב|מכונית|משאית|אוטובוס|"
    r"אופנוע|קטנוע|קורקינט|אופניים|רמזור|מהירות|"
    r"פקק|חניה|תמרור|נתיב|איילון|בכבישים|"
    r"תנועה|שוטרי התנועה|אכיפת תנועה|"
    r"traffic|driv(?:ing|er|ers)|road|highway|crash|accident|"
    r"speed(?:ing)?|dashcam|collision|motorcycl|police car|"
    r"дтп|авари|дорожн|водител|штраф|камера скорости",
    re.IGNORECASE)
EXCLUDE = re.compile(
    r"פיגוע|מחבל|טרור|חמאס|עזה|איראן|צה\x22ל|"
    r"terror|missile|rocket attack|"
    r"теракт|террор|ракетн",
    re.IGNORECASE)
CRASH = re.compile(
    r"תאונ|התנגשות|התנגש|דריס|נדרס|התהפכ|"
    r"crash|accident|collision|дтп|авари",
    re.IGNORECASE)
ENFORCEMENT = re.compile(
    r"משטר|שוטר|אכיפ|קנס|דו\x22ח|דוח|דו״ח|מהירות|מצלמ|"
    r"police|ticket|fine|enforc|speed(?:ing)?|"
    r"полици|штраф|радар",
    re.IGNORECASE)


def parsedate(value: str) -> dt.datetime | None:
    try:
        when = dt.datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if when.tzinfo is None:
            return None
        return when.astimezone(UTC)
    except (TypeError, ValueError, OverflowError):
        return None


def relevant(title: str) -> bool:
    return bool(ROAD.search(title)) and not bool(EXCLUDE.search(title))


def category(title: str) -> str:
    if CRASH.search(title):
        return "accidents"
    if ENFORCEMENT.search(title):
        return "police"
    return "reports"


def parse_feed(raw: bytes, source_id: str, now: dt.datetime) -> list[dict]:
    root = ET.fromstring(raw)
    cutoff = now - dt.timedelta(days=DAYS)
    items = []
    for entry in root.findall("a:entry", ATOM):
        vid = (entry.findtext("yt:videoId", "", ATOM) or "").strip()
        title = (entry.findtext("a:title", "", ATOM) or "").strip()
        published = parsedate(entry.findtext("a:published", "", ATOM))
        if not ID_RE.fullmatch(vid) or not title or not published:
            continue
        if not cutoff <= published <= now + dt.timedelta(hours=12):
            continue
        if not relevant(title):
            continue
        items.append({
            "id": vid,
            "title": title[:220],
            "date": published.isoformat(timespec="seconds").replace("+00:00", "Z"),
            "source": source_id,
            "publisher": CHANNEL_NAMES[source_id],
            "category": category(title),
            "url": "https://www.youtube.com/watch?v=" + vid,
        })
    return items


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (compatible; NEOLINE-Israel-RoadVideoIndex/1.0)",
        "Accept": "application/atom+xml,application/xml,text/xml,*/*",
    })
    with urllib.request.urlopen(request, timeout=18) as response:
        if response.status != 200:
            raise ValueError("HTTP " + str(response.status))
        raw = response.read(1_200_000)
        if len(raw) >= 1_200_000:
            raise ValueError("unexpectedly large feed")
        return raw


def refresh(now: dt.datetime | None = None) -> dict:
    now = (now or dt.datetime.now(UTC)).astimezone(UTC)
    cutoff = now - dt.timedelta(days=DAYS)
    merged = {}
    try:
        previous = json.loads(OUTPUT.read_text(encoding="utf-8"))
    except (OSError, ValueError, TypeError):
        previous = {}
    for row in previous.get("items", []):
        if not isinstance(row, dict):
            continue
        vid, title, source = row.get("id"), row.get("title"), row.get("source")
        when = parsedate(row.get("date"))
        if (isinstance(vid, str) and ID_RE.fullmatch(vid) and
            isinstance(title, str) and relevant(title) and
            source in CHANNEL_NAMES and when and cutoff <= when <= now):
            merged[vid] = {
                "id": vid, "title": title[:220], "source": source,
                "publisher": CHANNEL_NAMES[source], "category": category(title),
                "date": when.isoformat(timespec="seconds").replace("+00:00", "Z"),
                "url": "https://www.youtube.com/watch?v=" + vid,
            }
    successes, failures, discovered = 0, [], 0
    for source, channel_id, _ in CHANNELS:
        # Latest uploads and regular uploads (no Shorts). Two feeds improve
        # coverage without a YouTube API key or unauthorized scraping.
        feeds = (
            ("all", f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"),
            ("videos", f"https://www.youtube.com/feeds/videos.xml?playlist_id=UULF{channel_id[2:]}"),
        )
        for kind, url in feeds:
            try:
                incoming = parse_feed(fetch(url), source, now)
            except (OSError, ValueError, ET.ParseError) as err:
                failures.append(f"{source}/{kind}: {type(err).__name__}")
                continue
            successes += 1
            for row in incoming:
                if row["id"] not in merged:
                    discovered += 1
                merged[row["id"]] = row
    items = sorted(merged.values(), key=lambda row: row["date"], reverse=True)[:LIMIT]
    result = {
        "version": 1,
        "retentionDays": DAYS,
        "updated": now.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "status": "ok" if successes else "sources_unavailable",
        "sourceCount": successes,
        "sources": [{"id": cid, "name": name,
                     "channel": "https://www.youtube.com/channel/" + channel_id}
                    for cid, channel_id, name in CHANNELS],
        "items": items,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    # Stable data to avoid spam commits on failed feeds that yield no change.
    if result.get("status") != "ok" and previous.get("items") == items:
        result["updated"] = previous.get("updated", result["updated"])
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Road videos: {len(items)} kept, {discovered} new; "
          f"{successes}/6 feeds working; errors={failures[:6]}")
    return result


def self_test() -> None:
    now = dt.datetime(2026, 11, 20, 18, 0, tzinfo=UTC)
    sample = b'''<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015">
      <entry><yt:videoId>AbC123_def0</yt:videoId>
        <title>תאונת דרכים בכביש 6: תיעוד</title>
        <published>2026-11-18T10:15:00+00:00</published></entry>
      <entry><yt:videoId>BgO123_def0</yt:videoId>
        <title>חדשות על מזג האוויר</title>
        <published>2026-11-17T10:15:00+00:00</published></entry>
      <entry><yt:videoId>Old123_def0</yt:videoId>
        <title>תאונת דרכים ישנה</title>
        <published>2026-09-01T10:15:00+00:00</published></entry>
    </feed>'''
    found = parse_feed(sample, "news13", now)
    assert len(found) == 1 and found[0]["category"] == "accidents", found
    assert found[0]["url"].endswith("/watch?v=AbC123_def0")
    assert relevant("תיעוד האכיפה בכביש 4")
    assert category("שוטרי התנועה בדוחות נהגים") == "police"
    assert not relevant("פיגוע דריסה בכביש")
    print("Road video source filtering and 30-day expiry self-test passed")


if __name__ == "__main__":
    import sys
    if "--self-test" in sys.argv:
        self_test()
    else:
        refresh()
