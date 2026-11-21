#!/usr/bin/env python3
"""Discover authentic Israeli road videos beyond the three official feeds.

Preferred: YouTube Data API v3 with YOUTUBE_API_KEY secret (publishedAfter,
videoEmbeddable, and videos.list checks). Fallback: yt-dlp search metadata.
Never fabricate uploads, publication dates, locations, channel identities,
URLs or thumbnails. A regionCode=IL is NOT geographical proof.
"""
from __future__ import annotations
import datetime as dt
import json
import os
import re
import urllib.parse
import urllib.request

UTC = dt.timezone.utc
VIDEO_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")
CHANNEL_ID = re.compile(r"^UC[A-Za-z0-9_-]{22}$")
# Search across all four NEOLINE languages, rotating no country-generic clips.
# YouTube regionCode=IL is availability, not filming-location verification.
SEARCH_TERMS = (
    "תאונת דרכים מצלמת רכב ישראל",
    "חדשות 13 תאונות דרכים תיעוד",
    "כאן חדשות תאונת דרכים כתב",
    "תיעוד תאונה כביש 6 ישראל",
    "משטרת התנועה תאונות דרכים ישראל",
    "ДТП Израиль видео с регистратора",
    "авария Израиль дорожная полиция репортаж",
    "авария Тель Авив Хайфа видео",
    "новости Израиля дорожные аварии видео",
    "дорожные происшествия Израиль видео очевидцев",
    "Israel traffic accident dashcam report",
    "Israel road crash news footage",
    "Israel police traffic incident video",
    "Israel highway accident video report",
    "Israeli road safety cameras accident",
    "حوادث طرق إسرائيل فيديو",
    "حادث سير في إسرائيل تقرير",
    "حادث طريق تل أبيب فيديو",
    "شرطة المرور إسرائيل حادث سير",
    "حادث سير حيفا القدس فيديو",
)
ROAD = re.compile(
    r"תאונ|נדרס|דריס|התנגש|התנגשות|תאונות|התהפכ|פגע בהולך|פגעה בהולך|"
    r"כביש|נהג|נהיגה|רכב|מכונית|משאית|אוטובוס|אופנוע|קטנוע|קורקינט|"
    r"רוכב|מהירות|תנועה|רמזור|הגה|מצלמת דרך|מצלמת רכב|"
    r"רדאר|לייזר|מצלמות מהירות|מכמונ|אכיפת|"
    r"dash.?cam|driv(?:ing|er)|traffic|road|car crash|speed camera|radar|"
    r"collision|accident|motorcyc|pedestrian|highway|"
    r"дтп|авари|водител|дорог|видеорегистратор|наезд|радар|"
    r"حادث سير|حوادث سير|حوادث طرق|تصادم|دهس|شرطة المرور|طريق|سيارة|كاميرا سرعة",
    re.I)
ISRAEL = re.compile(
    r"ישראל|ישראלי|בישראל|בארץ|כביש\s*\d{1,3}|"
    r"תל[ -]?אביב|ירושלים|חיפה|רמת גן|ראשון לציון|פתח תקווה|"
    r"נתניה|באר שבע|בני ברק|רעננה|אשדוד|אשקלון|הרצליה|"
    r"רחובות|חולון|נצרת|כפר סבא|מודיעין|איילון|"
    r"צומת גלילות|כביש החוף|השרון|בשומרון|"
    r"\bisrael\b|\bisraeli\b|\btel[ -]?aviv\b|\bhaifa\b|"
    r"\bjerusalem\b|\bbeersheba\b|\bnetanya\b|"
    r"израил|тель[ -]?авив|иерусалим|хайфа|"
    r"إسرائيل|اسرائيل|تل أبيب|تل ابيب|حيفا|القدس|بئر السبع",
    re.I)
FOREIGN = re.compile(
    r"באמריקה|בארה.ב|בארצות הברית|באירופה|בברזיל|בסין|ברוסיה|"
    r"בהודו|בתאילנד|באוקראינה|בקנדה|ביפן|"
    r"\busa\b|\bbrazil\b|\bchina\b|\bindia\b|"
    r"\brussia\b|\bthailand\b|\bukraine\b|"
    r"бразили|в китае|в россии|в сша|в индии",
    re.I)
EXCLUDE = re.compile(
    r"פיגוע|מחבל|טרור|חמאס|עזה|איראן|צה.ל|"
    r"terror|missile|rocket attack|war footage|gaza|hamas|"
    r"теракт|террор|ракетн|взрыв на войне|هجوم إرهابي|صاروخ|حماس",
    re.I)
INCIDENT = re.compile(
    r"תאונ|דריס|נדרס|התנגש|התנגשות|התהפכ|פגע בהולך|"
    r"crash|collision|accident|hit.and.run|"
    r"дтп|авاري|авари|наезд|حادث سير|حوادث طرق|تصادم|دهس", re.I)
DASHCAM = re.compile(
    r"מצלמת רכב|מצלמת דרך|מצלמת דשבורד|מצלמות רכב|"
    r"תיעוד מהכביש|דאשקאם|"
    r"dash.?cam|dashboard camera|car camera|"
    r"видеорегистратор|с регистратора", re.I)
FUNNY = re.compile(
    r"מצחיק|מצחיקים|הזוי|פדיחה|כמעט תאונה|כמעט התנגש|"
    r"נהגים גרועים|נהג הזוי|שטויות בכביש|"
    r"funny|fails?|idiots in cars|crazy drivers|"
    r"прикол|смешн|нелеп|курьез|قيادة متهورة", re.I)
RADAR = re.compile(
    r"רדאר|מכמונ|ממל.ז|מצלמות מהירות|אקדח מהירות|"
    r"מד מהירות|אכיפת מהירות|"
    r"speed camera|speed gun|radar|laser speed|"
    r"камера скорости|радар|превышени.{0,16}скорост", re.I)
ROAD_BEHAVIOUR = re.compile(
    r"כביש|צומת|רמזור|נהיגה מסוכנת|נהג פרוע|עבירת תנועה|"
    r"פקק|תמרור|סטייה מנתיב|עקיפה מסוכנת|"
    r"driving fails|road rage|reckless driving|wrong way driving|"
    r"опасн.{0,12}вожден|дорожн.{0,12}наруш",
    re.I)
PRODUCT_ONLY = re.compile(
    r"מבחן רכב|רכב חדש|רכב חשמלי חדש|מחיר הרכב|"
    r"לקנות רכב|השוואת רכבים|ליסינג|"
    r"car review|vehicle review|new suv|test drive|"
    r"обзор автомобиля|тест[ -]?драйв", re.I)
POLICE = re.compile(
    r"משטר|שוטר|דוח|דו.ח|אכיפ|קנס|"
    r"police|traffic enforc|fine|speeding ticket|"
    r"полици|штраф|гибдд|شرطة المرور|الشرطة", re.I)
KNOWN_LOCAL_CHANNELS = re.compile(
    r"חדשות 13|כאן חדשות|חדשות 12|ערוץ 14|עכשיו 14|ynet|mako|"
    r"news 13|israel police|משטרת ישראל|חדשות 14|n12|i24news|איי24", re.I)
DATA_API = "https://www.googleapis.com/youtube/v3/"


def is_local(title: str, description: str = "", channel: str = "",
             known_official: bool = False) -> bool:
    """Prefer precision to labeling foreign driving as an event in Israel."""
    if not isinstance(title, str) or not ROAD.search(title) or EXCLUDE.search(title):
        return False
    # A general Israeli car review is not footage of driving incidents.
    if PRODUCT_ONLY.search(title) and not (INCIDENT.search(title) or
                                          DASHCAM.search(title) or RADAR.search(title)):
        return False
    if not any(p.search(title) for p in
               (INCIDENT, DASHCAM, FUNNY, RADAR, POLICE, ROAD_BEHAVIOUR)):
        return False
    text = title + " " + (description or "")[:600]
    # A foreign crash mentioning "road 50" is not suddenly an Israeli one.
    # Numbered highways are insufficient to override explicit foreign context.
    if FOREIGN.search(title):
        explicit_israel = re.search(
            r"ישראל|ישראלי|בישראל|תל[ -]?אביב|ירושלים|חיפה|"
            r"\bisrael\b|\bisraeli\b|израил|тель[ -]?авив",
            title, re.I)
        if not explicit_israel:
            return False
    # A channel name can establish a source identity, but NEVER by itself
    # establish the clip's filming location unless the title is local.
    if ISRAEL.search(title):
        return True
    if ISRAEL.search(text) and not FOREIGN.search(title):
        return True
    return bool(known_official and KNOWN_LOCAL_CHANNELS.search(channel)
                and re.search(r"[א-ת]{3,}", title))


def tags_for(title: str, source: str = "") -> list[str]:
    tags = []
    if INCIDENT.search(title):
        tags.append("accidents")
    if DASHCAM.search(title):
        tags.append("dashcam")
    if FUNNY.search(title):
        tags.append("funny")
    if RADAR.search(title):
        tags.append("radars")
    if source == "police" or POLICE.search(title):
        tags.append("police")
    if not tags:
        tags = ["reports"]
    return tags


def primary_category(title: str, source: str = "") -> str:
    tags = tags_for(title, source)
    for key in ("accidents", "radars", "funny", "dashcam", "police", "reports"):
        if key in tags:
            return key
    return "reports"


def _dt(value: str) -> dt.datetime | None:
    if not isinstance(value, str):
        return None
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.astimezone(UTC) if parsed.tzinfo else None
    except (ValueError, OverflowError):
        return None


def _published_date_from_ytdlp(info: dict) -> dt.datetime | None:
    upload = info.get("upload_date") or info.get("release_date")
    if isinstance(upload, str) and re.fullmatch(r"\d{8}", upload):
        try:
            return dt.datetime.strptime(upload, "%Y%m%d").replace(tzinfo=UTC)
        except ValueError:
            pass
    stamp = info.get("release_timestamp") or info.get("timestamp")
    if isinstance(stamp, (int, float)) and stamp > 0:
        try:
            return dt.datetime.fromtimestamp(stamp, tz=UTC)
        except (ValueError, OverflowError, OSError):
            pass
    return None


def normalize_video(vid: str, title: str, published: dt.datetime,
                    channel_id: str, channel_name: str,
                    description: str, now: dt.datetime,
                    official_ids: dict[str, str],
                    allow_discovery: bool = True) -> dict | None:
    if (not VIDEO_ID.fullmatch(vid or "") or not CHANNEL_ID.fullmatch(channel_id or "")
        or not isinstance(title, str) or not title.strip()
        or not isinstance(published, dt.datetime) or published.tzinfo is None):
        return None
    published = published.astimezone(UTC)
    if not (now - dt.timedelta(days=30) <= published <= now + dt.timedelta(hours=12)):
        return None
    source = official_ids.get(channel_id, "youtube")
    if source == "youtube" and not allow_discovery:
        return None
    if source != "youtube":
        if not ROAD.search(title) or EXCLUDE.search(title):
            return None
    elif not is_local(title, description, channel_name):
        return None
    pub = (channel_name or "").strip()[:100]
    if not pub:
        return None
    categories = tags_for(title, source)
    return {
        "id": vid, "title": title.strip()[:220],
        "date": published.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "source": source,
        "publisher": pub,
        "channelId": channel_id,
        # Keep the fact that the location was verified in the original public
        # metadata; later hourly refreshes must not lose a valid report just
        # because its title alone did not contain an Israeli place name.
        "localVerified": True,
        "category": primary_category(title, source),
        "tags": categories,
        "url": "https://www.youtube.com/watch?v=" + vid,
    }


def _http_json(endpoint: str, params: dict[str, str | int], api_key: str) -> dict:
    args = dict(params)
    args["key"] = api_key
    uri = DATA_API + endpoint + "?" + urllib.parse.urlencode(args)
    req = urllib.request.Request(uri, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=18) as response:
        return json.loads(response.read(2_000_000))


def via_data_api(now: dt.datetime, official_ids: dict[str, str],
                 max_queries: int = 20) -> list[dict]:
    """Use real video publish dates and embeddability from videos.list."""
    key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if not key:
        return []
    cutoff = now - dt.timedelta(days=30)
    discovered = {}
    requests_made = 0
    for q in SEARCH_TERMS[:max_queries]:
        try:
            found = _http_json("search", {
                "part": "snippet", "type": "video", "q": q, "maxResults": 50,
                "order": "date", "regionCode": "IL",
                "publishedAfter": cutoff.isoformat(timespec="seconds").replace("+00:00", "Z"),
                "publishedBefore": (now + dt.timedelta(minutes=5)).isoformat(
                    timespec="seconds").replace("+00:00", "Z"),
                "videoEmbeddable": "true", "safeSearch": "moderate",
            }, key)
            requests_made += 1
            ids = [row.get("id", {}).get("videoId", "")
                   for row in found.get("items") or []]
            ids = [vid for vid in ids if VIDEO_ID.fullmatch(vid)]
            if not ids:
                continue
            details = _http_json("videos", {
                "part": "snippet,status,contentDetails", "id": ",".join(ids),
                }, key)
            for vid in details.get("items") or []:
                status = vid.get("status", {})
                restrictions = vid.get("contentDetails", {}).get("regionRestriction") or {}
                if status.get("privacyStatus") != "public" or status.get("embeddable") is False:
                    continue
                if "IL" in restrictions.get("blocked", []):
                    continue
                if "allowed" in restrictions and "IL" not in restrictions["allowed"]:
                    continue
                snippet = vid.get("snippet", {})
                published = _dt(snippet.get("publishedAt"))
                if published is None:
                    continue
                video = normalize_video(
                    vid.get("id", ""), snippet.get("title", ""), published,
                    snippet.get("channelId", ""), snippet.get("channelTitle", ""),
                    snippet.get("description", ""), now, official_ids)
                if video is not None:
                    discovered[video["id"]] = video
        except Exception as exc:
            # No API quota, temporary outage or missing permission should not
            # affect the existing hourly official RSS pipeline.
            print(f"YouTube Data API query skipped: {type(exc).__name__}")
    print(f"YouTube Data API: {len(discovered)} dated Israel clips from {requests_made} searches")
    return list(discovered.values())


def via_ytdlp(now: dt.datetime, official_ids: dict[str, str],
              max_queries: int = 16, per_query: int = 8) -> list[dict]:
    """Best-effort search when the API key isn't configured.

    A search result is accepted only when YouTube's actual video extractor
    provides the channel ID AND publish date; no estimates or guessed IDs.
    """
    try:
        import yt_dlp
    except ImportError:
        print("Community YouTube search: yt-dlp missing")
        return []
    options = {
        "quiet": True, "no_warnings": True, "skip_download": True,
        "ignoreerrors": True, "socket_timeout": 12,
        "retries": 1, "extractor_retries": 1, "playlistend": per_query,
    }
    discovered = {}
    for query in SEARCH_TERMS[:max_queries]:
        try:
            with yt_dlp.YoutubeDL(options) as client:
                result = client.extract_info(f"ytsearchdate{per_query}:" + query, download=False)
        except Exception as exc:
            print(f"Community video search unavailable: {type(exc).__name__}")
            continue
        for info in (result or {}).get("entries") or ():
            if not isinstance(info, dict):
                continue
            if info.get("availability") in ("private", "premium_only", "subscriber_only"):
                continue
            published = _published_date_from_ytdlp(info)
            if published is None:
                continue
            video = normalize_video(
                info.get("id", ""), info.get("title", ""), published,
                info.get("channel_id", ""), info.get("channel", "") or info.get("uploader", ""),
                info.get("description", ""), now, official_ids)
            if video is not None:
                discovered[video["id"]] = video
    print(f"YouTube metadata search (no API key): {len(discovered)} verified dated videos")
    return list(discovered.values())


def discover(now: dt.datetime, official_ids: dict[str, str]) -> list[dict]:
    # If user connects the YouTube API, search every requested category
    # efficiently. Without a key, search results are best-effort (not exhaustive).
    if os.environ.get("YOUTUBE_API_KEY"):
        return via_data_api(now, official_ids)
    return via_ytdlp(now, official_ids)


def self_test() -> None:
    now = dt.datetime(2026, 11, 20, 18, tzinfo=UTC)
    ids = {"UC" + "x" * 22: "news13"}
    known = normalize_video(
        "AbC123_def0", "תאונה בכביש 6 מצלמת רכב", now - dt.timedelta(days=4),
        "UC" + "z" * 22, "נהגים בישראל", "אירוע על כביש 6", now, ids)
    assert known and known["category"] == "accidents" and "dashcam" in known["tags"]
    assert not normalize_video(
        "AbC123_def0", "Crash in Brazil", now - dt.timedelta(days=4),
        "UC" + "z" * 22, "Unknown channel", "", now, ids)
    assert not normalize_video(
        "AbC123_def0", "תאונה בכביש 6", now - dt.timedelta(days=35),
        "UC" + "z" * 22, "Israel", "", now, ids)
    assert primary_category("נהגים מצחיקים בכבישי ישראל") == "funny"
    assert primary_category("רדאר מצלמת מהירות בישראל") == "radars"
    assert "dashcam" in tags_for("dashcam accident in Israel")
    assert not is_local("מצלמת רכב מצחיקה בברזיל")
    assert not is_local("מבחן רכב חדש בישראל")
    assert is_local("נהיגה הזויה בכבישי ישראל")
    assert is_local("תאונה בכביש 6 מצלמת רכב")
    assert is_local("حادث سير في تل أبيب إسرائيل فيديو")
    assert primary_category("حادث سير في حيفا إسرائيل") == "accidents"
    assert _published_date_from_ytdlp({"upload_date": "20261118"}) == (
        dt.datetime(2026, 11, 18, tzinfo=UTC))
    print("Community YouTube video geography, 30-day, IDs and category checks passed")


if __name__ == "__main__":
    self_test()
