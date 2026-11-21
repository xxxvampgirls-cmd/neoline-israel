#!/usr/bin/env python3
"""Fetch publicly viewable Telegram posts; no account, bot token or private chats.

Each post becomes a short source-linked headline in the ordinary 30-day feed.
The collector never stores media or republishes whole posts. A source that
blocks preview access is skipped, never silently replaced with invented news.
"""
from __future__ import annotations
import datetime as dt
import re
import time
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup
import requests

CHANNELS = [
    ("Дорожная полиция Израиля · Telegram", "Atanpolice"),
    ("Полиция Израиля · Telegram", "israelpoliceforce"),
    ("Ихуд Ацала · Telegram", "uh1221"),
    ("Алексей Железнов · Telegram", "alexavni"),
    ("NEWSru.co.il · Telegram", "NEWSruIsrael"),
    # Source-linked, public Israeli publishers. No login or private chats.
    ("Минтранс Израиля · Telegram", "Transport_Il"),
    ("Calcalist · Telegram", "calcalist"),
    ("Маген Давид Адом · ДТП · Telegram", "mdaisrael"),
]
# Keep non-driving stories (including wartime vehicle mentions) out of the auto feed.
UNRELATED = (
    "цахал", "ливан", "газа", "бейрут", "иран", "ракета", "ракет",
    "обстрел", "авиаудар", "беспилот", "террор", "хезбол", "хамас",
    "צבא", "חמאס", "עזה", "איראן", "לבנון", "טילים", "מחבלים",
)
# A few channels post many entries a day, so paginate beyond the newest page.
MAX_PAGES = 8
MAX_PER_CHANNEL = 150

# Strong traffic signals: avoid broad references to cars in war/crime messages.
TRAFFIC_PATTERNS=(
    r"\bдтп\b", r"авари[яи]", r"пешеход", r"сбил[аои]?", r"дорожн.{0,15}происшеств",
    r"превышен.{0,12}скорост", r"\bкм/ч\b", r"радар", r"камера.{0,15}скорост",
    r"ограничен.{0,10}скорост", r"дорожн.{0,12}полици", r"штраф.{0,18}водител",
    r"перекры[тл]",r"закры[тл].{0,10}трасс",r"\bшоссе\b",r"пробк",
    r"электромобил", r"автомобил.{0,15}(рын|продаж|импорт|страхов|постав)",
    r"תאונ", r"התנגש",r"נדרס",r"דרס",r"פגע וברח",r"נפגע מרכב",
    r'קמ["״׳\']?ש',r"מהירות מופרזת",r"מצלמות מהירות",r"ממל",r"אכיפת מהירות",
    r"חסימת כביש",r"כביש נחסם",r"כביש \d",r"פקק",r"עומסי תנועה",r"תקנות התעבורה",
    r"רישיון נהיגה",r"רישיון רכב",r"רישוי רכב",r"בטיחות בדרכים",
    r"רכב חשמלי",r"רכבים חשמליים",r"מס קנייה על רכב",r"יבואני רכב",
)
TRAFFIC_RE=re.compile("|".join(TRAFFIC_PATTERNS),re.I)
SKIP_LINES=re.compile(r"^(?:[-_=]{3,}|⚡|➡|подписаться|הצטרפו לערוץ|"
                      r"ערוץ הטלגרם של|דוברות המשטרה:|דוברות איחוד הצלה|"
                      r"канал алексея|источник:|вступайте в)",re.I)
def _headline(text: str) -> str:
    """Select the first meaningful *traffic-related* line, not an ad or intro."""
    rows = [re.sub(r"\s+", " ", row).strip() for row in text.splitlines()]
    rows = [r for r in rows if r and not SKIP_LINES.match(r)]
    if not rows: return ""
    matching = [r for r in rows[:8] if TRAFFIC_RE.search(r)]
    if not matching: return ""
    line = matching[0]
    if len(line)<14 and len(matching)>1:line += " — "+matching[1]
    if len(line)>215:line=line[:212].rsplit(" ",1)[0]+"…"
    return line.strip()

def collect(session: requests.Session, cutoff: dt.datetime, now: dt.datetime):
    """Return (provider, RSS-like entry) pairs and per-channel diagnostics."""
    stories, stats, errors = [], {}, {}
    for label, handle in CHANNELS:
        before = None
        visited = set()
        count = 0
        try:
            for page in range(MAX_PAGES):
                url = f"https://t.me/s/{handle}"
                if before:
                    url += f"?before={before}"
                res = session.get(url, timeout=(7, 16), allow_redirects=True)
                res.raise_for_status()
                soup = BeautifulSoup(res.text, "html.parser")
                posts = soup.select(".tgme_widget_message_wrap")
                if not posts:
                    if page == 0:
                        raise ValueError("Public Telegram preview is empty or blocked")
                    break
                oldest = None
                dates = []
                for post in posts:
                    wrapper = post.select_one(".tgme_widget_message")
                    data_post = wrapper.get("data-post", "") if wrapper else ""
                    match = re.fullmatch(r"([A-Za-z0-9_]+)/([0-9]+)", data_post)
                    if not match or match.group(1).lower() != handle.lower():
                        continue
                    number = int(match.group(2))
                    oldest = min(oldest, number) if oldest is not None else number
                    if number in visited:
                        continue
                    visited.add(number)
                    stamp = post.select_one("time[datetime]")
                    body = post.select_one(".tgme_widget_message_text")
                    if not (stamp and body):
                        continue
                    try:
                        when = dt.datetime.fromisoformat(stamp["datetime"].replace("Z", "+00:00"))
                        if when.tzinfo is None:
                            when = when.replace(tzinfo=dt.timezone.utc)
                        when = when.astimezone(dt.timezone.utc)
                    except (ValueError, KeyError):
                        continue
                    dates.append(when)
                    if when < cutoff or when > now + dt.timedelta(hours=6):
                        continue
                    original = body.get_text("\n", strip=True)
                    headline = _headline(original)
                    if not 14 < len(headline) < 250:
                        continue
                    if any(token in headline.lower() for token in UNRELATED):
                        continue
                    # Include direct source URL and original published timestamp.
                    stories.append((label, {
                        "title": headline,
                        "link": f"https://t.me/{handle}/{number}",
                        "published": when.isoformat(),
                    }))
                    count += 1
                    if count >= MAX_PER_CHANNEL:
                        break
                if count >= MAX_PER_CHANNEL or oldest is None:
                    break
                if dates and max(dates) < cutoff:
                    break
                if before is not None and oldest >= before:
                    break
                before = oldest
                time.sleep(0.3)
            stats[label] = count
        except (requests.RequestException, ValueError) as exc:
            errors[label] = f"{type(exc).__name__}: {str(exc)[:130]}"
        time.sleep(0.3)
    return stories, stats, errors
