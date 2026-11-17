#!/usr/bin/env python3
"""Build tiny photoreal news thumbnail files (WebP, not megabytes).

Priority: optional opt-in OpenAI image API when OPENAI_API_KEY is configured;
otherwise obtain verified freely reusable public-domain/CC photos via Wikimedia
Commons API, cache them, and make custom editorial crops. Do not pretend that
a generic illustrative photo is an actual photograph of the reported event.
Generated content is never sent to the viewer as a remote API request.
"""
from __future__ import annotations
import base64
import datetime as dt
import hashlib
import io
import json
import os
import re
import time
from pathlib import Path
from urllib.parse import urlparse
import requests
from PIL import Image, ImageEnhance, ImageOps, ImageDraw

OUT=Path("assets/news")
PHOTOS=OUT/"images"
CACHE=Path("/tmp/neoline-news-photo-cache")
MANIFEST=OUT/"news.json"
SESSION=requests.Session()
SESSION.headers.update({"User-Agent":"NEOLINEIsrael/1.0 (editorial photo credit retained; contact GitHub project)","Accept":"application/json"})
MAX_BYTES=90_000   # each image: <90 KB
MAX_AI_PER_RUN=min(max(int(os.environ.get("MAX_AI_PER_RUN","2")),0),5)
FAILED_SEARCHES=set()
API_TOKEN=os.environ.get("OPENAI_API_KEY","").strip()
AI_MODEL=os.environ.get("NEWS_IMAGE_MODEL","gpt-image-1-mini")
# This makes an editorial photo illustration of the *topic*, never a fake
# documentary photograph of an actual event or a recognizable victim.
SEARCH_TERMS={
 "accidents":["traffic police siren road","traffic accident car highway","emergency vehicle motorway"],
 "speed":["speed camera roadside","traffic police radar camera","highway speed sign"],
 "laws":["Israeli traffic road signs","traffic light crossing","driver steering car"],
 "roads":["Israel highway road traffic","urban traffic road","Tel Aviv road"],
 "cars":["electric vehicle charging car","modern sedan highway","car interior dashboard"]
}
def date_ok(stamp,category):
 try:
  now=dt.datetime.now(dt.timezone.utc)
  published=dt.datetime.fromisoformat(stamp.replace("Z","+00:00"))
  if published>now+dt.timedelta(hours=12):return False
  if category=="laws":
   import calendar
   month_index=now.year*12+now.month-1-6
   year,month=divmod(month_index,12)
   month+=1
   cutoff=now.replace(year=year,month=month,day=min(now.day,calendar.monthrange(year,month)[1]))
  else:cutoff=now-dt.timedelta(days=30)
  return cutoff<=published
 except (ValueError,TypeError,AttributeError):return False
def image_convert(content, uid, shift=0):
 with Image.open(io.BytesIO(content)) as input_image:
  if input_image.width<400 or input_image.height<230:
   raise ValueError("Original photo too small")
  if input_image.width*input_image.height>18_000_000:
   raise ValueError("Original photo too large")
  picture=ImageOps.exif_transpose(input_image).convert("RGB")
  # Clever per-article reframing makes the same licensed subject look different,
  # without inventing new objects or pretending to be an actual crash photo.
  w,h=picture.size
  crop_w=min(w,round(h*16/9))
  crop_h=min(h,round(w*9/16))
  offset=int(uid[:4],16)
  if w>crop_w:
   left=round((w-crop_w)*(0.2+0.6*((offset%101)/100)))
   box=(left,0,left+crop_w,h)
  else:
   top=round((h-crop_h)*(0.2+0.6*((offset%101)/100)))
   box=(0,top,w,top+crop_h)
  picture=picture.crop(box).resize((640,360),Image.Resampling.LANCZOS)
  picture=ImageEnhance.Contrast(picture).enhance(1.08)
  # Cinematic dark bottom fade; labels stay HTML and change with language.
  fade=Image.new("RGBA",picture.size,(0,0,0,0))
  mask=Image.new("L",picture.size,0)
  draw=ImageDraw.Draw(mask)
  for y in range(360):
   alpha=int(110*(y/360)**2)
   draw.line((0,y,639,y),fill=alpha)
  dark=Image.new("RGB",picture.size,(5,19,32))
  picture=Image.composite(dark,picture,mask)
  data=None
  for quality in (76,68,60,52,44,36,29):
   buff=io.BytesIO()
   picture.save(buff,format="WEBP",quality=quality,method=5)
   data=buff.getvalue()
   if len(data)<=MAX_BYTES:break
  if len(data)>MAX_BYTES:raise ValueError("Cannot compress below 90 KB")
  return data
def ai_thumbnail(item):
 if not API_TOKEN:return None
 keywords=item.get("titleOriginal","")[:155]
 context={"accidents":"street-level cars, emergency services in the distance",
  "speed":"modern fixed speed camera on highway shoulder and car headlights",
  "laws":"traffic signals and road signs seen through a car windscreen",
  "roads":"cinematic expressway and city traffic",
  "cars":"modern electric car with road or charging station"}[item["category"]]
 prompt=(f"Create a premium cinematic photorealistic editorial YouTube-style "
  f"thumbnail background for an Israeli automotive news post about '{keywords}'. "
  f"Visual subject: {context}. Wide 16:9 composition, sophisticated professional "
  f"photography, visually bold but factual, blue-tinted cinematic lighting, sharp "
  f"realistic automotive detail, strong contrast, natural shadows, contemporary "
  f"Tel Aviv / Israeli city atmosphere. This is clearly a symbolic illustration "
  f"of the general news topic, NOT a faithful photo of a real incident. "
  f"NO actual crash victims, blood, injured people, recognizable faces, "
  f"logos, words, signs with legible text, dates, watermarks, license plates, "
  f"news outlet branding, or invented specific factual claims.")
 response=SESSION.post("https://api.openai.com/v1/images/generations",
  headers={"Authorization":"Bearer "+API_TOKEN},
  json={"model":AI_MODEL,"prompt":prompt,"n":1,"size":"1536x1024",
        "quality":"low","output_format":"webp","output_compression":70},
  timeout=(15,120))
 response.raise_for_status()
 encoded=response.json()["data"][0].get("b64_json")
 return base64.b64decode(encoded) if encoded else None

def commons_candidates(search):
 # Restrict results to openly reusable images, not publisher photographs.
 params={"action":"query","format":"json","generator":"search","gsrnamespace":6,
  "gsrsearch":search+" filetype:bitmap","gsrlimit":18,
  "prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":850}
 response=SESSION.get("https://commons.wikimedia.org/w/api.php",params=params,timeout=(8,20))
 response.raise_for_status()
 data=response.json()
 results=[]
 for page in (data.get("query",{}).get("pages",{}) or {}).values():
  info=(page.get("imageinfo") or [{}])[0]
  metadata=info.get("extmetadata",{})
  lic=(metadata.get("LicenseShortName") or {}).get("value","")
  url=info.get("thumburl","")
  if not url.startswith("https://") or not urlparse(url).hostname.endswith("wikimedia.org"):continue
  # CC BY / SA require attribution; unmodified photograph crop is okay for CC BY.
  if not re.search(r"CC0|Public domain|CC BY(?: \d|$)",lic,re.I):continue
  title=page.get("title","")
  author=re.sub(r"<[^>]+>","",(metadata.get("Artist") or {}).get("value","")).strip()[:100]
  description="https://commons.wikimedia.org/wiki/"+title.replace(" ","_")
  results.append({"url":url,"page":description,"credit":author or "Wikimedia Commons", "license":lic})
 return results

def photo_from_licensed_source(item):
 """Fetch original RSS photo only if the publisher explicitly grants CC reuse.

 Ordinary article pictures and social-media photographs are not copied.
 """
 meta=item.get("sourcePhoto")
 if not isinstance(meta,dict) or meta.get("sourceUrl")!=item.get("url"):return None,None
 if meta.get("license") not in ("CC0","CC BY"):return None,None
 url=str(meta.get("url",""))
 host=(urlparse(url).hostname or "").lower()
 if not url.startswith("https://") or not host or len(url)>1000:return None,None
 if host in ("localhost","127.0.0.1","169.254.169.254") or host.startswith(("10.","192.168.","172.16.","172.17.","172.18.","172.19.","172.2")):return None,None
 if not urlparse(url).path.lower().endswith((".jpg",".jpeg",".png",".webp")):return None,None
 try:
  response=SESSION.get(url,timeout=(7,16),allow_redirects=False,stream=True)
  response.raise_for_status()
  if "image/" not in response.headers.get("Content-Type",""):return None,None
  if int(response.headers.get("Content-Length","0") or 0)>4_000_000:return None,None
  chunks=[];size=0
  for chunk in response.iter_content(65536):
   size+=len(chunk)
   if size>4_000_000:return None,None
   chunks.append(chunk)
  content=b"".join(chunks)
  with Image.open(io.BytesIO(content)) as picture:
   if picture.format not in ("JPEG","PNG","WEBP"):return None,None
   if picture.width<640 or picture.height<350:return None,None
  credit={"credit":str(meta.get("credit") or item.get("publisher") or "Source")[:120],
   "license":meta["license"],"page":item["url"],"isSource":True}
  return content,credit
 except (OSError,ValueError,requests.RequestException):
  return None,None

def photo_fallback(item):
 category=item["category"];uid=item["id"]
 terms=SEARCH_TERMS[category]
 # Cache one verified photograph per query and reuse it for different news,
 # with per-story crops. Maximum six per category to save network requests.
 for variant in range(3):
  search=terms[(int(uid[-2:],16)+variant)%len(terms)]
  key=hashlib.sha1(search.encode()).hexdigest()[:12]
  cached=CACHE/(key+".jpg")
  meta=CACHE/(key+".json")
  if cached.is_file() and meta.is_file():
   return cached.read_bytes(),json.loads(meta.read_text(encoding="utf-8"))
  if search in FAILED_SEARCHES:continue
  try:
   for photo in commons_candidates(search)[:6]:
    result=SESSION.get(photo["url"],timeout=(7,16))
    if not result.ok or len(result.content)>4_000_000:continue
    with Image.open(io.BytesIO(result.content)) as check:
     if check.width<640 or check.height<350:continue
     if check.format not in ("JPEG","PNG","WEBP"):continue
    # Cache the image, but never commit the original to the Git repo.
    CACHE.mkdir(parents=True,exist_ok=True)
    cached.write_bytes(result.content)
    meta.write_text(json.dumps(photo,ensure_ascii=False),encoding="utf-8")
    return result.content,photo
  except (requests.RequestException,ValueError,KeyError,OSError) as e:
   FAILED_SEARCHES.add(search)
   print("WARN commons",search,type(e).__name__,str(e)[:80],flush=True)
 return None,None

def main():
 manifest=json.loads(MANIFEST.read_text(encoding="utf-8"))
 items=[x for x in manifest.get("items",[]) if date_ok(x.get("date"),x.get("category"))]
 PHOTOS.mkdir(parents=True,exist_ok=True)
 ai_used=0;photos_used=0;original_used=0;unavailable=0;max_size=0
 for i,item in enumerate(items):
  uid=item["id"]
  target=PHOTOS/(uid+".webp")
  # Do not re-generate a licensed photo from the same story every morning.
  # Reuse only thumbnails whose provenance can still be shown on the site.
  valid_credit=item.get("imageType")=="ai" or (
   item.get("imageType") in ("licensedPhoto","sourceLicensedPhoto") and
   isinstance(item.get("imageCredit"),dict) and
   item["imageCredit"].get("url"))
  if target.exists() and target.stat().st_size<=MAX_BYTES and valid_credit:
   # Upgrade the existing illustrative thumbnail only when the original
   # article supplied an expressly licensed photograph.
   if item.get("sourcePhoto") and item.get("imageType")!="sourceLicensedPhoto":
    source_data,source_credit=photo_from_licensed_source(item)
    if source_data:
     try:
      replacement=image_convert(source_data,uid)
      target.write_bytes(replacement)
      item["imageType"]="sourceLicensedPhoto"
      item["imageCredit"]={"text":source_credit["credit"]+" · "+source_credit["license"],
                           "url":source_credit["page"]}
      original_used+=1
     except (ValueError,OSError):
      pass
   item["image"]="./"+target.as_posix()
   continue
  if target.exists():target.unlink()
  photo,license_meta=photo_from_licensed_source(item)
  if photo:original_used+=1
  if photo is None and API_TOKEN and ai_used<MAX_AI_PER_RUN:
   try:
    photo=ai_thumbnail(item)
    if photo:ai_used+=1
   except (KeyError,ValueError,requests.RequestException) as e:
    print("WARN AI image",uid,type(e).__name__,str(e)[:140],flush=True)
  if photo is None:
   photo,license_meta=photo_fallback(item)
   if photo:photos_used+=1
  if photo:
   try:
    content=image_convert(photo,uid)
    target.write_bytes(content)
    max_size=max(max_size,len(content))
    item["image"]="./"+target.as_posix()
    item["imageType"]=("sourceLicensedPhoto" if license_meta and license_meta.get("isSource") else
      "licensedPhoto" if license_meta else "ai")
    if license_meta:
     item["imageCredit"]={"text":license_meta["credit"]+" · "+license_meta["license"],
       "url":license_meta["page"]}
    else:item.pop("imageCredit",None)
    continue
   except (ValueError,OSError) as e:
    print("WARN thumbnail conversion",uid,str(e),flush=True)
  # Do not show cartoon SVG placeholders on the new design.
  item["image"]=None
  item.pop("imageCredit",None)
  item["imageType"]="none"
  unavailable+=1
 # Prune past-month thumbnails and old cartoon-style SVGs.
 required={x["id"]+".webp" for x in items}
 deleted=0
 for image in PHOTOS.glob("*"):
  if image.is_file() and image.suffix.lower() in (".svg",".webp",".jpg",".jpeg",".png") and image.name not in required:
   image.unlink();deleted+=1
 manifest["items"]=items
 MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 summary={"articles":len(items),"aiGenerated":ai_used,
  "freeLicensedPhotoThumbsCreated":photos_used,"originalLicensedPhotosUsed":original_used,"notAvailable":unavailable,
  "existingImages":len(items)-ai_used-photos_used-unavailable,
  "maxNewImageKB":round(max_size/1024,1),"deletedExpiredImages":deleted,
  "aiKeyConfigured":bool(API_TOKEN)}
 (OUT/"image-report.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print("THUMBNAIL REPORT",json.dumps(summary,ensure_ascii=False),flush=True)
if __name__=="__main__":main()
