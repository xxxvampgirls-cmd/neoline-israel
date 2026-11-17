#!/usr/bin/env python3
"""NEOLINE Israel: rolling 30-day automotive headlines from Israeli sources.

Stores only original brief headline summaries and clickable source links, not
full articles or publishers' photos. Images are our own themed SVG artwork.
RSS is discovery metadata only. Dates are verified and enforced at import time.
"""
from __future__ import annotations
import datetime as dt
import hashlib
import html
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlencode,urlparse
import requests
import feedparser
from bs4 import BeautifulSoup

ROOT=Path("assets/news")
DEST=ROOT/"news.json"
REPORT=ROOT/"sync-report.json"
TZ=dt.timezone.utc
NOW=dt.datetime.now(TZ)
CUTOFF=NOW-dt.timedelta(days=30)
MAX_ITEMS=180
S=requests.Session()
S.headers.update({"User-Agent":"Mozilla/5.0 (compatible; NEOLINEIsraelNews/1.0; original outbound links)","Accept-Language":"he-IL,he;q=0.9,en;q=0.6"})
QUERIES={
 "accidents":'("תאונת דרכים" OR "תאונה קטלנית" OR "תאונת שרשרת") ישראל',
 "speed":'("מצלמות מהירות" OR "אכיפת מהירות" OR "דוחות מהירות") ישראל',
 "laws":'("תקנות התעבורה" OR "חוקי תנועה" OR "קנסות נהגים") ישראל',
 "roads":'("חסימות כבישים" OR "עומסי תנועה" OR "כביש נסגר") ישראל',
 "cars":'("רכב חדש" OR "מכוניות חשמליות" OR "שוק הרכב") ישראל',
}
MOT_RSS="https://www.gov.il/he/api/NewsApi/rss/48eaee91-0c97-4ef3-b364-50ae52e3b56f"
CATEGORIES=("accidents","speed","laws","roads","cars")
KEYWORDS={
 "accidents":["תאונ","התנגש","נפגע","פצוע","הרוג","נהרג","collision","crash","accident","дтп","авари"],
 "speed":["מהירות","מצלמות","מכמונת","אכיפה","קנס","דוח","speed","radar","скорост","штраф","камер"],
 "laws":["חוק","תקנ","רישיו","משטרת","עבירה","רפורמ","גזיר","regulat","law","license","закон","правил"],
 "roads":["כביש","פקק","תנועה","סגור","סגיר","נתיב","מחלף","road","traffic","дорог","шоссе","пробк"],
 "cars":["רכב","מכוני","חשמלי","טעינה","יבוא","השק","vehicle","car","automotiv","электро","автомоб"],
}
# Explicitly exclude irrelevant military, global politics and aviation results
EXCLUDE=["טיל","איראן","לבנון","מלחמה","טיסה","מטוס","אירוויזיון","עזה","כדורגל","aircraft","airline"]
def text(raw):
 return re.sub(r"\s+"," ",BeautifulSoup(html.unescape(raw or ""),"html.parser").get_text(" ",strip=True)).strip()
def safe(url):
 p=urlparse(str(url))
 return p.scheme in ("http","https") and bool(p.hostname) and not any(x in p.hostname for x in ("localhost",)) 
def aware(date):
 if not date:return None
 try:
  if hasattr(date,"tm_year"):
   return dt.datetime(*date[:6],tzinfo=TZ)
  parsed=dt.datetime.fromisoformat(str(date).replace("Z","+00:00"))
  return parsed.replace(tzinfo=TZ) if not parsed.tzinfo else parsed.astimezone(TZ)
 except Exception:return None
def category(title):
 low=title.lower()
 for kind in ("accidents","speed","laws","roads","cars"):
  if any(x in low for x in KEYWORDS[kind]):return kind
 return None
def translate_ru(value):
 if not value or not re.search(r"[\u0590-\u05ff\u0600-\u06ff]",value):return value
 # If Google Translate is inaccessible, never invent a translation.
 try:
  response=S.get("https://translate.googleapis.com/translate_a/single",
    params={"client":"gtx","sl":"auto","tl":"ru","dt":"t","q":value[:470]},timeout=9)
  response.raise_for_status()
  data=response.json()
  out="".join(piece[0] for piece in data[0] if isinstance(piece,list) and piece and isinstance(piece[0],str))
  return text(out)[:480] if out else value
 except Exception:return value
def read_feed(url):
 response=S.get(url,timeout=(10,25))
 response.raise_for_status()
 xml=feedparser.parse(response.content)
 if xml.bozo and not xml.entries:raise ValueError("Malformed/empty RSS")
 return xml.entries
def google_url(q,window):
 params={"q":q+f" when:{window}d","hl":"he","gl":"IL","ceid":"IL:he"}
 return "https://news.google.com/rss/search?"+urlencode(params)
def new_entry(entry, source_type="news"):
 title=text(entry.get("title",""))
 if not title or len(title)<14 or len(title)>250:return None
 date=aware(entry.get("published_parsed") or entry.get("updated_parsed") or entry.get("published"))
 if not date or date<CUTOFF or date>NOW+dt.timedelta(hours=12):return None
 link=str(entry.get("link",""))
 if not safe(link):return None
 source=entry.get("source",{})
 if isinstance(source,dict):source_name=text(source.get("title",""))
 else:source_name=""
 if source_type=="official":source_name="Министерство транспорта Израиля"
 if not source_name:source_name=urlparse(link).hostname or "СМИ Израиля"
 # Google News appends ' - Publisher' to RSS titles. Remove just that suffix.
 if " - " in title and source_type!="official":title=title.rsplit(" - ",1)[0].strip()
 low=title.lower()
 if source_type!="official" and any(x in low for x in EXCLUDE):return None
 section=category(title)
 if section is None:return None
 # For Google News, outbound clicks go through Google News to the publisher.
 # We do not claim that this URL is the publisher URL.
 title_ru=translate_ru(title)
 translated=title_ru!=title or not re.search(r"[\u0590-\u05ff]",title)
 snippet=""
 if source_type=="official":
  source_description=text(entry.get("summary",""))
  if source_description and len(source_description)>40:
   snippet=translate_ru(source_description[:270])
 # Avoid copying an entire RSS description or one-to-one lengthy paragraphs.
 if snippet:
  snippet=snippet[:170].rsplit(" ",1)[0]+"…" if len(snippet)>180 else snippet[:180]
 else:
  detail={"accidents":"Сообщение о дорожном происшествии в Израиле.",
          "speed":"Информация о контроле скорости, дорожных камерах или штрафах.",
          "laws":"Сообщение о возможных изменениях правил для водителей. Проверяйте статус закона в официальных источниках.",
          "roads":"Обновление о дорожной обстановке или ограничениях движения.",
          "cars":"Новости авторынка Израиля и автомобильных технологий."}
  snippet=detail[section]
 # This is NOT "law enacted" confirmation.
 uid=hashlib.sha256((title.lower()+"|"+source_name.lower()).encode("utf-8")).hexdigest()[:20]
 return {
  "id":uid,"title":title_ru[:200],"titleOriginal":title[:250],
  "summary":snippet[:250],"date":date.isoformat().replace("+00:00","Z"),
  "category":section,"publisher":source_name[:90],"url":link,
  "translated":bool(translated),"official":source_type=="official",
  "art":section,
 }
def read_previous():
 try:
  data=json.loads(DEST.read_text("utf-8"))
  if data.get("version")!=1:return []
  return [x for x in data.get("items",[]) if isinstance(x,dict)]
 except (FileNotFoundError,ValueError,OSError):return []
def clean_old(obj):
 try:
  date=aware(obj.get("date"))
  return (date is not None and CUTOFF<=date<=NOW+dt.timedelta(hours=12)
    and obj.get("category") in CATEGORIES and safe(obj.get("url",""))
    and len(str(obj.get("title","")))>8)
 except Exception:return False
def main():
 ROOT.mkdir(parents=True,exist_ok=True)
 previous=read_previous()
 merged={obj["id"]:obj for obj in previous if clean_old(obj) and "id" in obj}
 count_by_source={}
 added=0;errors={}
 first_run=not DEST.exists()
 feeds=[("Минтранс (официально)",MOT_RSS,"official")]
 for section,q in QUERIES.items():
  feeds.append((f"Израильские СМИ · {section}",google_url(q,30 if first_run else 7),"news"))
 for source_name,url,kind in feeds:
  try:
   items=read_feed(url)
   count_by_source[source_name]=len(items)
   for entry in items:
    article=new_entry(entry,kind)
    if article is None:continue
    if article["id"] not in merged:added+=1
    merged[article["id"]]=article
   print(f"OK source {source_name}: feed={len(items)} accepted-now={len(merged)}",flush=True)
  except Exception as exc:
   errors[source_name]=str(exc)[:150]
   print(f"WARN source {source_name}: {type(exc).__name__}: {exc}",flush=True)
 # If all sources fail, preserve previous CURRENT items and prune stale ones.
 items=sorted(merged.values(),key=lambda x:x["date"],reverse=True)
 used=set();retained=[]
 for obj in items:
  key=re.sub(r"[^a-zа-яё0-9\u0590-\u05ff]+","",obj.get("titleOriginal","").lower())
  if key in used:continue
  used.add(key);retained.append(obj)
 retained=retained[:MAX_ITEMS]
 payload={"version":1,"updated":NOW.isoformat().replace("+00:00","Z"),"retentionDays":30,"items":retained}
 report={"updated":payload["updated"],"sources":count_by_source,"new":added,
         "retained":len(retained),"expiredOrDuplicate":len(previous)+added-len(retained),
         "errors":errors}
 # The file should never retain material older than 30 days.
 assert all(clean_old(x) for x in retained)
 DEST.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n","utf-8")
 REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n","utf-8")
 print("RESULT "+json.dumps(report,ensure_ascii=False),flush=True)
 # No fake updates, no filler content when source unavailable.
 return 0
if __name__=="__main__":sys.exit(main())
