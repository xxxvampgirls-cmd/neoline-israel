#!/usr/bin/env python3
"""NEOLINE Israel news — direct publisher links, original art, four locales.

RSS is used only for factual metadata and links; no republished article text.
Every dated item has a generated *unique* editorial SVG, shared across
Russian/Hebrew/English/Arabic. Missing translations remain clearly source
language instead of being fabricated. Never keep items older than 30 days.
"""
from __future__ import annotations
import datetime as dt
import hashlib
import html
import json
import os
import math
import random
import re
import time
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET
import feedparser
import requests
from collections import Counter, defaultdict
from bs4 import BeautifulSoup
from telegram_news import collect as collect_public_telegram

ROOT=Path("assets/news")
IMAGES=ROOT/"images"
DEST=ROOT/"news.json"
REPORT=ROOT/"sync-report.json"
UTC=dt.timezone.utc
NOW=dt.datetime.now(UTC)
CUTOFF=NOW-dt.timedelta(days=30)
MAX_ITEMS=300
NEW_PER_RUN=100
MAX_PER_SOURCE=65
S=requests.Session()
S.headers.update({"User-Agent":"Mozilla/5.0 (compatible; NEOLINE-Israel-Headlines/2.0)","Accept-Language":"he-IL,he;q=.8,en;q=.5"})
# Direct, public RSS feeds published by the outlets. Avoid Google News article
# redirect URLs which return "We're sorry" / 429 to the end user.
FEEDS=[
 ("Walla · Авто","https://rss.walla.co.il/feed/4705"),
 ("Walla · Безопасность","https://rss.walla.co.il/feed/4734"),
 ("Walla · Право и страхование","https://rss.walla.co.il/feed/4715"),
 ("Walla · Все автомобили","https://rss.walla.co.il/feed/4700"),
 ("Walla · Новости Израиля","https://www.walla.co.il/rss/feed/news/israel"),
 ("The Times of Israel","https://www.timesofisrael.com/feed/"),
 ("The Jerusalem Post","https://www.jpost.com/rss/rssfeedsfrontpage.aspx"),
 ("Arutz Sheva · Israel National News","https://www.inn.co.il/Rss.aspx"),
 # Additional independent Israeli publications; failures are logged and skipped.
 ("Maariv · חדשות","https://www.maariv.co.il/rss/rsschadashot"),
 ("Maariv · מבזקים","https://www.maariv.co.il/rss/rssfeedsmivzakichadashot"),
 ("Maariv · כלכלה","https://www.maariv.co.il/rss/rssfeedskalkalabaarez"),
 ("Israel Hayom","https://www.israelhayom.co.il/rss.xml"),
 ("Globes · צרכנות","https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=821"),
 ("Autonews Israel","https://autonews.co.il/feed/"),
 ("Mako · Израиль","https://rcs.mako.co.il/rss/news-israel.xml"),
 ("Минтранс Израиля · Новости","https://www.gov.il/he/api/NewsApi/rss/48eaee91-0c97-4ef3-b364-50ae52e3b56f"),
 ("Srugim","https://www.srugim.co.il/feed"),
 ("Haaretz","https://www.haaretz.com/srv/israel-news-rss"),
 ("Israel Hayom · English","https://www.israelhayom.com/feed/"),
]
CATEGORIES=("accidents","speed","laws","roads","cars")
# Require explicit road/vehicle language: generic Hebrew "רכב" also occurs
# inside unrelated words like "מורכב", and "במהירות" means merely "quickly".
KEYWORDS={
 "accidents":["תאונ","התנגש","דרס","נדרס","פגע וברח","פגיעת רכב","נפגע מרכב","התהפך הרכב","דריסת","collision","crash","accident","road fatal","hit-and-run","road death","дтп","авари"],
 "speed":["מהירות מופרזת","מצלמות מהירות","נהיגה במהירות","מכמונת","מצלמת מהירות","אכיפת מהירות","מהירות של","מד מהירות","מהירות ממוצעת","ממל\"ז","ממל״ז","הגבלת מהירות","מצלמות א-3","טס במהירות","speed camera","speeding","speed limit","speed trap","speed enforcement","скорост","дорожный радар","радар скорости","штраф за скорость"],
 "laws":["תקנות התעבורה","חוקי תנועה","חוק התעבורה","רישיון נהיגה","רשיון נהיגה","רשיון b","רישיון b","קנסות נהגים","קנסות תנועה","נהיגה בשכרות","חובה להדליק אורות","driving law","traffic law","road regulation","driving licens","traffic fine","правила дорожного движения"],
 "roads":["חסימות כבישים","סגירת כביש","כביש חסום","כביש 6","כביש 1","נתיבי איילון","פקק","עומס תנועה","עומסי תנועה","מחלף","road closure","highway closure","traffic jam","highway traffic","дорог","шоссе","пробк"],
 "cars":["רכבי","רכבים","רכב חדש","מכונית","מכוניות","חשמליות","טעינה","כלי רכב","byd","טסלה","יונדאי","פולקסווגן","car ","cars","automotive","vehicle","electric vehicle","tesla","автомобил","электромобил"],
}
EXCLUDE=("טיל","איראן","לבנון","מלחמה","טיסה","מטוס","אירוויזיון",
 "כדורגל","מכבי חיפה","הפועל באר שבע","וולט","wolt","aircraft","airline","missile","רכבת","רכבות","אוטובוס","train","autopsy",
 "פיגוע","מחבל","טרור","גרזן","גרזנ","הותקף","תקפו","terror attack","terrorist","attackers","ניתוח","תינוק")
LOCALES=("ru","he","en","ar")
BRIEFS={
 "accidents":{"ru":"Дорожное происшествие в Израиле. Обстоятельства и актуальные сведения — в материале источника.","he":"דיווח על תאונת דרכים בישראל. פרטים ועדכונים בכתבת המקור.","en":"A reported road incident in Israel. Details and updates are in the original report.","ar":"تقرير عن حادث مروري في إسرائيل. التفاصيل والتحديثات في المصدر."},
 "speed":{"ru":"Сообщение о контроле скорости или дорожных камерах. Проверьте место и действующие правила в источнике.","he":"דיווח על אכיפת מהירות או מצלמות. יש לבדוק את המיקום והכללים במקור.","en":"An update on speed enforcement or road cameras. Check locations and current rules in the source.","ar":"تحديث بشأن ضبط السرعة أو كاميرات الطرق. تحقق من الموقع والقواعد الحالية في المصدر."},
 "laws":{"ru":"Публикация о правилах для водителей. Статус закона и дату вступления в силу нужно сверять с официальными документами.","he":"דיווח על תקנות נהיגה. יש לאמת את מעמד החוק ותאריך התחולה במקור רשמי.","en":"A report concerning driving rules. Verify legal status and effective dates with official documents.","ar":"تقرير حول قواعد القيادة. تحقق من حالة القانون وتاريخ سريانه في المصادر الرسمية."},
 "roads":{"ru":"Информация о дорожной ситуации. Перед поездкой проверьте, действуют ли ограничения сейчас.","he":"עדכון על מצב התנועה. לפני הנסיעה בדקו אם ההגבלות עדיין בתוקף.","en":"A road-conditions update. Check whether restrictions still apply before travelling.","ar":"تحديث عن حالة الطرق. تحقق من استمرار القيود قبل السفر."},
 "cars":{"ru":"Материал об автомобиле или автомобильном рынке Израиля. Подробности — на сайте издания.","he":"כתבה על מכוניות או שוק הרכב בישראל. פרטים באתר המקור.","en":"An update about vehicles or Israel's car market. Details are available at the source.","ar":"تحديث عن السيارات أو سوق المركبات في إسرائيل. التفاصيل في المصدر."}
}
def tidy(value):
 return re.sub(r"\s+"," ",BeautifulSoup(html.unescape(str(value or "")),"html.parser").get_text(" ",strip=True)).strip()
def allowed(url):
 try:
  p=urlparse(str(url))
  return (p.scheme=="https" and p.hostname
    and not p.hostname.endswith(("google.com","news.google.com","google.co.il"))
    and p.hostname not in ("localhost","127.0.0.1"))
 except Exception:return False
def aware(value):
 if not value:return None
 try:
  if hasattr(value,"tm_year"):
   return dt.datetime(*value[:6],tzinfo=UTC)
  t=dt.datetime.fromisoformat(str(value).replace("Z","+00:00"))
  return t.astimezone(UTC) if t.tzinfo else t.replace(tzinfo=UTC)
 except Exception:return None
def relevant(title):
 low=title.lower()
 if any(x in low for x in EXCLUDE):return None
 if any(x in low for x in ("פיגוע","מחבלים","טרור","גרזנים","טרוריסט")):return None
 # Accidents are identified before the generic vehicle category.
 # A military radar and a car manufacturer's speed record are NOT traffic
 # speed-enforcement news. Only a clear police/road context qualifies.
 if re.search(r'\d{2,3}\s*קמ["״׳]?ש',low) and (
     "כביש" in low or "משטר" in low or "שוטר" in low or "אכיפ" in low):
  return "speed"
 if "км/ч" in low and any(x in low for x in ("полици","штраф","водител","дорог","шоссе","нарушен")):
  return "speed"
 for section in ("speed","accidents","laws","roads"):
  if any(x in low for x in KEYWORDS[section]):return section
 if any(x in low for x in KEYWORDS["cars"]):return "cars"
 # Hebrew standalone vehicle nouns, optionally with common prepositions:
 if re.search(r"(?<![א-ת])(?:רכב|הרכב|ברכב|לרכב|מרכב)(?![א-ת])",low):
  return "cars"
 return None
def feed(url):
 err=None
 for attempt in range(2):
  try:
   r=S.get(url,timeout=(9,20),allow_redirects=True)
   r.raise_for_status()
   p=feedparser.parse(r.content)
   if not p.entries:raise ValueError("Feed has no entries")
   return p.entries
  except (requests.RequestException,ValueError) as e:
   err=e
   if attempt==0:time.sleep(1.5)
 raise err
def translate(value,to_lang):
 # The endpoint is optional, not guaranteed; failed translations are not faked.
 if not value:return ""
 if to_lang=="he" and re.search(r"[\u0590-\u05ff]",value):return value
 if to_lang=="en" and value.isascii():return value
 try:
  resp=S.get("https://translate.googleapis.com/translate_a/single",
   params={"client":"gtx","sl":"auto","tl":to_lang,"dt":"t","q":value[:250]},
   timeout=(6,10))
  resp.raise_for_status()
  result="".join(x[0] for x in resp.json()[0] if isinstance(x,list) and x and isinstance(x[0],str))
  return tidy(result)[:250] if result else ""
 except (ValueError,requests.RequestException):return ""
def unique_svg(entry):
 """Deterministic original automotive illustration made from story keywords.
    Does not depict or claim to depict the real incident or persons involved."""
 cat=entry["category"]
 id=entry["id"]
 randomizer=random.Random(int(id[:12],16))
 blue=randomizer.choice(["#1688d5","#0a72b3","#2097ce"])
 ink=randomizer.choice(["#17334c","#1e425d","#254563"])
 pale=randomizer.choice(["#edf9ff","#e2f4ff","#dcecff"])
 sunset=randomizer.randint(42,64)
 lane=randomizer.choice([620,660,710])
 carx=randomizer.randint(500,790)
 sedan=(f'<g transform="translate({carx} 490)">'
   '<ellipse cx="158" cy="199" rx="190" ry="22" fill="#163b5c" opacity=".16"/>'
   f'<path d="M8 133 49 80Q68 56 101 51L241 49q34 5 53 40l32 44 28 9v51H-8v-43z" fill="{ink}" stroke="#81c8eb" stroke-width="5"/>'
   '<path d="m69 83 36-19h125l34 42H50z" fill="#94dfff" opacity=".92"/>'
   '<rect x="15" y="141" width="37" height="21" rx="8" fill="#dcf5ff"/><rect x="310" y="141" width="35" height="20" rx="8" fill="#ffdbb0"/>'
   '<circle cx="78" cy="192" r="30" fill="#102c42" stroke="#b0e4ff" stroke-width="9"/>'
   '<circle cx="285" cy="192" r="30" fill="#102c42" stroke="#b0e4ff" stroke-width="9"/></g>')
 city=''.join(f'<rect x="{n*113-14}" y="{randomizer.randint(250,340)}" width="{randomizer.randint(55,83)}" height="250" rx="6" fill="#ffffff" opacity=".20"/>' for n in range(16))
 if cat=="speed":
  focus=(f'<g transform="translate(198 268)"><rect x="0" y="25" width="236" height="186" rx="34" fill="#ffffff" stroke="{blue}" stroke-width="10"/>'
   f'<circle cx="118" cy="115" r="69" fill="{pale}" stroke="{blue}" stroke-width="8"/>'
   f'<path d="m119 115 45-36" stroke="{ink}" stroke-width="12" stroke-linecap="round"/><circle cx="119" cy="115" r="10" fill="{ink}"/>'
   f'<rect x="208" y="74" width="70" height="68" rx="13" fill="{ink}"/><circle cx="241" cy="108" r="19" fill="{blue}"/></g>')
 elif cat=="laws":
  focus=(f'<g transform="translate(175 200) rotate({randomizer.randint(-5,5)} 190 180)">'
   f'<rect x="64" y="24" width="278" height="350" rx="30" fill="#ffffff" stroke="{blue}" stroke-width="9"/>'
   f'<path d="M100 108h188M100 155h188M100 202h165M100 248h185" stroke="#9bbdd5" stroke-width="10" stroke-linecap="round"/>'
   '<circle cx="284" cy="297" r="50" fill="#b7edff" stroke="#1a81c8" stroke-width="9"/>'
   f'<path d="m261 298 16 17 27-36" stroke="{ink}" stroke-width="12" fill="none" stroke-linecap="round"/></g>')
 elif cat=="accidents":
  focus=('<g transform="translate(215 275)"><path d="M175 0 340 290H10Z" fill="#fff4e4" stroke="#efac4b" stroke-width="18" stroke-linejoin="round"/>'
   '<path d="M175 90v93" stroke="#b96e11" stroke-width="22" stroke-linecap="round"/><circle cx="175" cy="231" r="12" fill="#b96e11"/>'
   '</g>')
 elif cat=="roads":
  focus=(f'<g transform="translate(230 270)"><rect x="0" y="0" width="320" height="195" rx="20" fill="{ink}" stroke="#b6e6ff" stroke-width="11"/>'
    '<path d="M35 54h250" stroke="#e0f8ff" stroke-width="17" stroke-linecap="round"/>'
    '<path d="M35 126h250" stroke="#e0f8ff" stroke-width="17" stroke-dasharray="30 26" stroke-linecap="round"/>'
    f'<path d="m185 95 46 40 54-59" fill="none" stroke="{blue}" stroke-width="17" stroke-linecap="round"/></g>')
 else:
  focus=(f'<g transform="translate(240 225)"><circle cx="215" cy="190" r="145" fill="#ffffff" opacity=".52"/>'
   f'<path d="M85 285q-40-22-20-65l44-90q18-38 64-37h142q51 0 68 46l35 83q9 35-22 63" fill="{ink}" stroke="#83d4f4" stroke-width="9"/>'
   '<path d="M128 153h202l34 89H90z" fill="#8fddf8" opacity=".85"/>'
   '<circle cx="136" cy="289" r="34" fill="#102c42" stroke="#b1e7ff" stroke-width="12"/>'
   '<circle cx="347" cy="289" r="34" fill="#102c42" stroke="#b1e7ff" stroke-width="12"/></g>')
 dots=''.join(f'<circle cx="{randomizer.randint(85,1510)}" cy="{randomizer.randint(125,435)}" r="{randomizer.randint(4,16)}" fill="#ffffff" opacity="{randomizer.randint(15,40)/100:.2f}"/>' for _ in range(23))
 # Deliberately no text in the image: one asset in all four languages.
 return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Independent automotive editorial illustration">'
  f'<defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="{pale}"/><stop offset=".67" stop-color="#abdaf3"/><stop offset="1" stop-color="#6baedb"/></linearGradient>'
  '<linearGradient id="road" x2="0" y2="1"><stop stop-color="#476982"/><stop offset="1" stop-color="#0d243a"/></linearGradient>'
  '<filter id="shade"><feGaussianBlur stdDeviation="12"/></filter></defs>'
  '<rect width="1600" height="900" fill="url(#sky)"/>'
  f'<circle cx="1270" cy="{sunset*6}" r="250" fill="#ffffff" opacity=".31"/>'
  f'{city}{dots}'
  f'<path d="M0 630Q500 530 1600 605v330H0Z" fill="#a3d1e8"/>'
  f'<path d="M{lane-220} 525h{lane+180}l430 405H50z" fill="url(#road)"/>'
  '<path d="M790 560 870 900" fill="none" stroke="#c1e6f9" stroke-width="12" stroke-dasharray="65 60" opacity=".75"/>'
  f'<ellipse cx="790" cy="700" rx="395" ry="70" fill="#173652" opacity=".22" filter="url(#shade)"/>'
  f'{sedan}{focus}'
  f'<path d="M0 55H1600M0 830H1600" stroke="{blue}" stroke-width="24" opacity=".34"/>'
  '<rect x="43" y="47" width="1514" height="806" rx="46" fill="none" stroke="#ffffff" stroke-width="5" opacity=".52"/>'
  '</svg>')
def publisher_name(provider):
 if provider.startswith("Walla"):return "Walla"
 if provider.startswith("Maariv"):return "Maariv"
 if provider.startswith("Ynet"):return "Ynet"
 if provider.startswith("Israel Hayom"):return "Israel Hayom"
 if provider.startswith("Globes"):return "Globes"
 return provider

def article(entry,provider):
 title=tidy(entry.get("title",""))
 pub=aware(entry.get("published_parsed") or entry.get("updated_parsed") or entry.get("published"))
 url=str(entry.get("link",""))
 if not (14<len(title)<250 and pub and CUTOFF<=pub<=NOW+dt.timedelta(hours=6) and allowed(url)):return None
 kind=relevant(title)
 if not kind:return None
 # Publisher must be an actual article link, not front page or feed itself.
 path=urlparse(url).path
 if path in ("/","/rss","/feed") or "/rss/" in path:return None
 id=hashlib.sha256(url.split("?")[0].encode("utf-8")).hexdigest()[:20]
 return {"id":id,"titleOriginal":title,"sourceLanguage":"he" if re.search(r"[\u0590-\u05ff]",title) else "en",
  "date":pub.isoformat().replace("+00:00","Z"),"url":url,"publisher":publisher_name(provider),
  "category":kind,"art":kind,"image":f"./assets/news/images/{id}.svg",
  "official":False,"translations":{}}
def valid(item):
 if not isinstance(item,dict):return False
 stamp=aware(item.get("date"))
 return (bool(stamp and CUTOFF<=stamp<=NOW+dt.timedelta(hours=6)) and allowed(item.get("url"))
  and item.get("category") in CATEGORIES and item.get("id")
  and item.get("titleOriginal") and
  relevant(item.get("titleOriginal",""))==item.get("category")
  and not any(x in item["titleOriginal"].lower() for x in EXCLUDE))
def read_previous():
 try:
  p=json.loads(DEST.read_text(encoding="utf-8"))
  return [x for x in p.get("items",[]) if valid(x)]
 except (ValueError,OSError):return []
def enrich(item):
 titles=item.get("translations",{})
 if not isinstance(titles,dict):titles={}
 original=item["titleOriginal"]
 if not any(x in titles for x in LOCALES):
  titles["he"]={"title":original,"summary":BRIEFS[item["category"]]["he"]} if item["sourceLanguage"]=="he" else {}
 for lang in LOCALES:
  cached=titles.get(lang,{})
  if cached.get("title") and cached.get("summary"):continue
  head=original if (lang==item["sourceLanguage"]) else translate(original,lang)
  if head:titles[lang]={"title":head,"summary":BRIEFS[item["category"]][lang]}
 # The UI will fall back to the original headline (not to a false translation).
 item["translations"]=titles
 item["title"]=titles.get("ru",{}).get("title") or original
 item["summary"]=titles.get("ru",{}).get("summary") or BRIEFS[item["category"]]["ru"]
 item["translated"]=bool(titles.get("ru",{}).get("title"))
 return item
def select_diverse(candidates):
 groups=defaultdict(list)
 for item in sorted(candidates,key=lambda x:x["date"],reverse=True):
  groups[publisher_name(item["publisher"])].append(item)
 chosen=[]
 counts=Counter()
 while len(chosen)<MAX_ITEMS:
  eligible=[name for name,items in groups.items() if items and counts[name]<MAX_PER_SOURCE]
  if not eligible:break
  recently=[publisher_name(x["publisher"]) for x in chosen[-2:]]
  options=[name for name in eligible if name not in recently] or eligible
  name=max(options,key=lambda n:groups[n][0]["date"])
  chosen.append(groups[name].pop(0))
  counts[name]+=1
 return chosen

def main():
 ROOT.mkdir(parents=True,exist_ok=True)
 IMAGES.mkdir(parents=True,exist_ok=True)
 previous=read_previous()
 keep={}
 for x in previous:
  if not valid(x):continue
  canonical_id=hashlib.sha256(x["url"].split("?")[0].encode("utf-8")).hexdigest()[:20]
  if canonical_id in keep:continue
  x["id"]=canonical_id
  photo=IMAGES/(canonical_id+".webp")
  x["image"]=(f"./assets/news/images/{canonical_id}.webp" if photo.is_file()
              else f"./assets/news/images/{canonical_id}.svg")
  keep[canonical_id]=x
 # Prune the old broken Google News links instead of sending readers to 429 pages.
 existing_google=sum(1 for x in previous if "google." in urlparse(x.get("url","")).netloc)
 feed_stats={}
 errors={}
 discovered=0
 for provider,url in FEEDS:
  try:
   entries=feed(url)
   feed_stats[provider]=len(entries)
   for e in entries[:180]:
    item=article(e,provider)
    if not item or item["id"] in keep:continue
    keep[item["id"]]=item;discovered+=1
   print(f"FEED {provider}: {len(entries)} entries, collected {len(keep)}",flush=True)
  except Exception as exc:
   errors[provider]=f"{type(exc).__name__}: {str(exc)[:100]}"
   print(f"WARN {provider}: {errors[provider]}",flush=True)
  time.sleep(.5)
 # Public Telegram message previews from verified Israel traffic/safety channels.
 # Keep publisher attribution and direct original post links, never embed media.
 telegram_stats={}
 try:
  telegram_posts,telegram_stats,telegram_errors=collect_public_telegram(S,CUTOFF,NOW)
  for name,entry in telegram_posts:
   item=article(entry,name)
   if not item or item["id"] in keep:continue
   keep[item["id"]]=item;discovered+=1
  errors.update(telegram_errors)
  print(f"TELEGRAM {len(telegram_posts)} collected; channels={telegram_stats}",flush=True)
 except Exception as exc:
  errors["Telegram public channels"]=f"{type(exc).__name__}: {str(exc)[:100]}"
 recent=select_diverse(x for x in keep.values() if valid(x))
 new_count=0
 for x in recent:
  has_full=all(isinstance(x.get("translations",{}).get(lang),dict)
               and x["translations"][lang].get("title") for lang in LOCALES)
  if has_full or new_count<NEW_PER_RUN:
   if not has_full:new_count+=1
   enrich(x)
  else:
   x["title"]=x["titleOriginal"]
   x["summary"]=BRIEFS[x["category"]]["ru"]
  # Photographic thumbnails are created separately in build_news_thumbnails.py.
  photo=IMAGES/(x["id"]+".webp")
  x["image"]=("./assets/news/images/"+x["id"]+".webp") if photo.is_file() else None
 # Avoid accumulating stale image files beyond one month.
 live_names={x["id"]+".webp" for x in recent}
 deleted=0
 for path in list(IMAGES.glob("*.svg"))+list(IMAGES.glob("*.webp")):
  if path.name not in live_names:path.unlink();deleted+=1
 last=NOW.isoformat().replace("+00:00","Z") if feed_stats else ""
 payload={"version":1,"retentionDays":30,"updated":last,"items":recent}
 report={"attempted":NOW.isoformat().replace("+00:00","Z"),"feeds":feed_stats,"telegram":telegram_stats,
  "new":discovered,"retained":len(recent),"imageCount":sum(bool(x["image"]) for x in recent),
  "deletedImages":deleted,"discardedGoogleLinks":existing_google,"errors":errors,
  "directLinksOnly":all(allowed(x["url"]) for x in recent),
  "sourceCount":len(set(x["publisher"] for x in recent)),
  "sources":dict(Counter(x["publisher"] for x in recent))}
 assert all(valid(x) for x in recent) and report["directLinksOnly"]
 DEST.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print("RESULT "+json.dumps(report,ensure_ascii=False),flush=True)
if __name__=="__main__":main()
