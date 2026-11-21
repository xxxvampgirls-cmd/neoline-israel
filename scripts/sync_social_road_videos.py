#!/usr/bin/env python3
"""Build a conservative 30-day index of authentic Israeli road videos shared
on PUBLIC Telegram channels, including directly linked TikTok, Facebook,
Instagram Reels, VK and X video posts. Never download/rehost creators' media.

Only source-post timestamps are known for cross-posted links, so the saved
date denotes the dated Telegram reference, NOT an invented upload date.
A channel having no accessible preview is skipped; old verified entries remain
until expiration. External sites may require login: always open original URL.
"""
from __future__ import annotations
import datetime as dt
import hashlib
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

OUTPUT=Path("assets/news/social-road-videos.json")
UTC=dt.timezone.utc
CHANNELS=(
    ("Агף התנועה · дорожная полиция","Atanpolice"),
    ("Полиция Израиля","israelpoliceforce"),
    ("Ихуд Ацала","uh1221"),
    ("NEWSru Israel","NEWSruIsrael"),
    ("Алексей Железнов","alexavni"),
)
# Channel identity is curated; NEVER scrape private groups or user accounts.
TRAFFIC=re.compile(
    r"תאונ|התנגש|דריס|נדרס|כביש|נהיגה מסוכנת|נהג|מצלמת רכב|"
    r"מצלמות מהירות|תנועה|אכיפת מהירות|"
    r"дтп|авари|водител|видеорегистратор|дорог|наезд|радар|"
    r"road crash|dashcam|traffic accident|collision|speed camera|"
    r"حادث سير|حوادث سير|حوادث طرق|تصادم|دهس|طريق|شرطة المرور",
    re.I)
INCIDENT=re.compile(
    r"תאונ|התנגש|דריס|נדרס|"
    r"дтп|авари|наезд|"
    r"crash|accident|collision|hit.and.run|"
    r"حادث سير|حوادث طرق|تصادم|دهس",re.I)
EXCLUDE=re.compile(
    r"פיגוע|מחבל|טרור|חמאס|עזה|איראן|"
    r"террор|теракт|ракет|"
    r"terror|missile|war footage|gaza|hamas|"
    r"هجوم إرهابي|صاروخ|حماس",re.I)
FOREIGN=re.compile(
    r"בארה.ב|באמריקה|בסין|ברוסיה|בהודו|באירופה|"
    r"в россии|в бразилии|в китае|в сша|на украине|в украине|"
    r"кривом роге|кривой рог|днепре|одессе|"
    r"\bin the usa\b|\bin china\b|\bin brazil\b",re.I)
# A road word in a multi-topic news post is not evidence of road footage.
# Require a focused road incident or driving-enforcement report in the HEADLINE.
ROAD_REPORT=re.compile(
    r"משטרת התנועה|אגף התנועה|מצלמת רכב|מצלמות מהירות|אכיפת מהירות|"
    r"נהיגה מסוכנת|עבירת תנועה|כביש\\s*\\d{1,3}|חסימת כביש|"
    r"дорожн.{0,18}(?:полици|происшеств|движен|авари|наруш)|"
    r"видеорегистратор|дорожная камера|камера скорости|"
    r"шоссе|трассе|превышен.{0,12}скорост|"
    r"road crash|dashcam|traffic accident|traffic police|"
    r"road closure|speed camera|road report|"
    r"شرطة المرور|كاميرا سرعة|مخالفة مرور",re.I)
TRUSTED_OFFICIAL={"atanpolice","israelpoliceforce","uh1221"}
ISRAEL=re.compile(
    r"ישראל|ישראלי|כביש\s*\d{1,3}|תל אביב|ירושלים|חיפה|איילון|"
    r"израил|тель.авив|иерусалим|хайфа|"
    r"\bisrael\b|\bisraeli\b|\btel.aviv\b|"
    r"إسرائيل|اسرائيل|تل أبيب|حيفا|القدس",re.I)
# Only accepted video URL shapes; a social profile or arbitrary link is NOT
# proof that a post has footage. The referring Telegram message is dated.
VIDEO_LINKS={
    "tiktok": re.compile(r"^https://(?:www\.)?tiktok\.com/@[\w.\-]+/video/\d+",re.I),
    "facebook": re.compile(r"^https://(?:www\.|m\.)?facebook\.com/(?:watch/\?v=\d+|[^?#\s]+/videos/\d+)",re.I),
    "instagram": re.compile(r"^https://(?:www\.)?instagram\.com/reel/[\w\-]+/?",re.I),
    "x": re.compile(r"^https://(?:www\.)?(?:x|twitter)\.com/[\w_]+/status/\d+",re.I),
    "vk": re.compile(r"^https://(?:www\.)?vk\.com/video-?\d+_\d+",re.I),
}
VIDEO_MARKERS=".tgme_widget_message_video_player, .tgme_widget_message_video, .tgme_widget_message_roundvideo, video"
MAX_PAGES=5
MAX_ITEMS=160

def iso(when:dt.datetime)->str:
    return when.astimezone(UTC).isoformat(timespec="seconds").replace("+00:00","Z")

def date(value):
    try:
        x=dt.datetime.fromisoformat(str(value).replace("Z","+00:00"))
        return x.astimezone(UTC) if x.tzinfo else None
    except (ValueError,TypeError):
        return None

def permitted(title:str, body:str, handle:str="")->bool:
    if not title or not TRAFFIC.search(title):return False
    if not (INCIDENT.search(title) or ROAD_REPORT.search(title)):return False
    if EXCLUDE.search(title+" "+body[:450]) or FOREIGN.search(title+" "+body[:450]):
        return False
    # Police and rescue are locally authoritative if a HE/AR traffic heading
    # is explicitly present. General news channels MUST say Israel in title;
    # content mentioning Israel elsewhere does not establish video location.
    official=handle.lower() in TRUSTED_OFFICIAL
    israeli_title=bool(ISRAEL.search(title))
    local_script=bool(re.search(r"[א-ת]{3,}",title))
    return israeli_title or (official and local_script)

def classify(title,body):
    return "accidents" if INCIDENT.search(title+" "+body[:200]) else "reports"

def clean_title(body):
    lines=[re.sub(r"\s+"," ",line).strip() for line in body.splitlines()]
    lines=[line for line in lines if len(line)>14 and not line.startswith(("http://","https://","#"))]
    for line in lines[:8]:
        if TRAFFIC.search(line) and not EXCLUDE.search(line):
            return line[:190].rsplit(" ",1)[0] if len(line)>190 else line
    return ""

def external_links(post):
    urls=set()
    for a in post.select("a[href]"):
        href=a.get("href","").strip().replace("&amp;","&")
        if href.startswith("https://"):urls.add(href)
    for platform,expression in VIDEO_LINKS.items():
        for url in sorted(urls):
            if expression.match(url):
                yield platform,url.split("#")[0]

def extract(html, handle, publisher, cutoff, now):
    soup=BeautifulSoup(html,"html.parser")
    items=[]
    oldest=None
    for wrap in soup.select(".tgme_widget_message_wrap"):
        widget=wrap.select_one(".tgme_widget_message")
        raw=widget.get("data-post","") if widget else ""
        m=re.fullmatch(r"([\w]+)/([0-9]+)",raw)
        if not m or m.group(1).lower()!=handle.lower():continue
        number=int(m.group(2));oldest=min(number,oldest) if oldest is not None else number
        stamp=wrap.select_one("time[datetime]")
        when=date(stamp.get("datetime")) if stamp else None
        if not when or not cutoff<=when<=now+dt.timedelta(hours=6):continue
        body_el=wrap.select_one(".tgme_widget_message_text")
        body=body_el.get_text("\n",strip=True) if body_el else ""
        title=clean_title(body)
        if not permitted(title,body,handle):continue
        kind=classify(title,body)
        post_url=f"https://t.me/{handle}/{number}"
        candidates=[]
        if wrap.select_one(VIDEO_MARKERS):
            candidates.append(("telegram",post_url))
        candidates.extend(external_links(wrap))
        for platform,url in candidates:
            # Dedupe by original video identity, not by a re-shared news title.
            uid=hashlib.sha256(url.encode("utf-8")).hexdigest()[:20]
            items.append({
                "id":uid,"title":title,"publisher":publisher,"platform":platform,
                "url":url,"sourcePost":post_url,"sourceChannel":handle,
                "date":iso(when),"dateKind":"source_post",
                "category":kind,"tags":[kind],"localVerified":True,
            })
    return items,oldest

def refresh(now=None,session=None):
    now=now or dt.datetime.now(UTC)
    cutoff=now-dt.timedelta(days=30)
    session=session or requests.Session()
    session.headers.update({"User-Agent":"Mozilla/5.0 (compatible; NeolineRoadVideoSources/1.0)"})
    saved={}
    try:
        previous=json.loads(OUTPUT.read_text(encoding="utf-8"))
    except (OSError,ValueError):
        previous={}
    for row in previous.get("items",[]):
        if not isinstance(row,dict):continue
        when=date(row.get("date"))
        if when and cutoff<=when<=now and row.get("localVerified") is True and row.get("platform") in (*VIDEO_LINKS.keys(),"telegram") and permitted(str(row.get("title","")),"",str(row.get("sourceChannel",""))):
            saved[row.get("url")]=row
    stats={};errors={};new=0
    for publisher,handle in CHANNELS:
        before=None;seen=set();count=0
        try:
            for _ in range(MAX_PAGES):
                url=f"https://t.me/s/{handle}"
                if before:url+=f"?before={before}"
                response=session.get(url,timeout=(7,16))
                response.raise_for_status()
                found,oldest=extract(response.text,handle,publisher,cutoff,now)
                for row in found:
                    if row["url"] not in saved:new+=1
                    saved[row["url"]]=row;count+=1
                if oldest is None or oldest in seen:break
                seen.add(oldest)
                if oldest==before or len(saved)>=MAX_ITEMS*2:break
                before=oldest
                time.sleep(.2)
            stats[handle]=count
        except (requests.RequestException,ValueError) as err:
            errors[handle]=type(err).__name__
    items=sorted(saved.values(),key=lambda row:row["date"],reverse=True)[:MAX_ITEMS]
    result={"version":1,"retentionDays":30,"updated":iso(now) if stats else previous.get("updated",iso(now)),
            "status":"ok" if stats else "sources_unavailable",
            "sourceTimeMeaning":"Telegram post timestamp; may differ from original external video upload",
            "sources":stats,"errors":errors,"new":new,"items":items}
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    OUTPUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Public social road videos: {len(items)} verified links, {new} new, channels: {stats}, errors: {errors}")
    return result

def self_test():
    now=dt.datetime(2026,11,21,12,0,tzinfo=UTC)
    sample='''<div class="tgme_widget_message_wrap">
    <div class="tgme_widget_message" data-post="Atanpolice/123"></div>
    <time datetime="2026-11-20T10:15:00+00:00"></time>
    <div class="tgme_widget_message_text">תאונת דרכים כביש 6 בישראל</div>
    <a href="https://www.tiktok.com/@israelpolice/video/7459468831849729281">Video</a>
    <a class="tgme_widget_message_video_player" href="/x">play</a></div>'''
    items,_=extract(sample,"Atanpolice","Police",now-dt.timedelta(days=30),now)
    assert {x["platform"] for x in items}=={"telegram","tiktok"},items
    assert all(x["category"]=="accidents" and x["dateKind"]=="source_post" for x in items)
    assert not permitted("حادث سير в россии","حادث", "Atanpolice")
    assert not permitted("Жесть в Кривом Роге. На дороге лежат трупы","", "alexavni")
    assert not permitted("Падение охватило акции технологических компаний и производителей полупроводников.","на дороге", "alexavni")
    assert clean_title("حوادث طرق إسرائيل فيديو\nتابع")=="حوادث طرق إسرائيل فيديو"
    assert not list(external_links(BeautifulSoup('<a href="https://instagram.com/username/">profile</a>',"html.parser")))
    print("Social road-video verified-link self test passed")

if __name__=="__main__":
    import sys
    if "--self-test" in sys.argv:self_test()
    else:refresh()
