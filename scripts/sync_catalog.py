#!/usr/bin/env python3
"""Import the LIVE, non-archived Neoline Russia shop for a demonstration catalog.

Source fields are factual product metadata. Descriptions are concise original
summaries built from verified attributes, not copies of marketing copy.
Fail closed: never publish a partial/empty catalog after network errors.
"""
from __future__ import annotations
import hashlib
import io
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageOps, UnidentifiedImageError
from catalog_photo_quality import photo_signature, duplicate_kind
from catalog_promo_filter import (
  promotional_url, banned_reference, banner_diagnosis, classify_file
)

HOST = "https://neoline.ru"
SECTIONS = {
  "gibridy": ("hybrid", "Гибриды"),
  "videoregistratory": ("camera", "Видеорегистраторы"),
  "radar-detektory": ("radar", "Радар-детекторы"),
  "aksessuary": ("accessories", "Аксессуары"),
  "akustika": ("audio", "Автомобильная акустика"),
  "discount": ("sale", "Уценённые товары"),
}
OTHER_CATEGORIES = set(SECTIONS) | {
 "kompressory","kabeli-pitaniya","karty-pamyati","derzhateli",
 "komplekty","zaryadnye-ustroystva","videoregistratory-s-dvumya-kamerami",
 "discount","s-shop","catalog","sale","all"
}
OUT = Path("assets/catalog")
S = requests.Session()
S.headers.update({
 "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
 "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.5",
})
MAX_IMAGE_BYTES = 8_000_000


def tidy(value):
 return re.sub(r"\s+"," ",str(value or "")).strip()


def get(url, *, timeout=26):
 last=None
 for attempt in range(2):
  try:
   r=S.get(url,timeout=(8,timeout),allow_redirects=True)
   r.raise_for_status()
   return r
  except (requests.Timeout,requests.ConnectionError) as exc:
   last=exc
   if attempt==0:time.sleep(1.4)
 raise last


def canonical(url):
 p=urlparse(urljoin(HOST,url))
 if p.scheme != "https" or p.hostname not in ("neoline.ru","www.neoline.ru"):
  return None
 return urlunparse(("https","neoline.ru",p.path.rstrip("/")+"/","","",""))


def is_product(url):
 p=urlparse(url).path.strip("/").split("/")
 return len(p)==2 and p[0]=="shop" and p[1] not in OTHER_CATEGORIES and not p[1].endswith(".php")


def find_links(soup):
 urls=set()
 for a in soup.select("a[href]"):
  link=canonical(a.get("href",""))
  if link and is_product(link):
   urls.add(link)
 return urls


def discover():
 found={}
 metrics={}
 for slug, (category, label) in SECTIONS.items():
  base=f"{HOST}/shop/{slug}/"
  seen=set()
  for page in range(1,11):
   url=base if page==1 else base+f"?PAGEN_2={page}"
   try:
    html=get(url).text
    soup=BeautifulSoup(html,"html.parser")
    links=find_links(soup)
    # Some Bitrix versions use PAGEN_1 for catalog pagination.
    if page>1 and (not links or links==seen):
     alt=get(base+f"?PAGEN_1={page}").text
     links1=find_links(BeautifulSoup(alt,"html.parser"))
     if len(links1-seen)>len(links-seen):
      links=links1
    new=links-seen
    if not new and page>1:
     break
    seen.update(links)
    for link in sorted(links):
     found.setdefault(link,(category,label))
    print(f"Category {slug}: page={page}, unique={len(seen)}, new={len(new)}",flush=True)
    if page>1 and len(new)<2:break
    time.sleep(.25)
   except Exception as exc:
    print(f"WARN listing {slug}/{page}: {exc}",flush=True)
    break
  metrics[slug]=len(seen)
 # Explicitly validated active product pages that may be missed by listing timeouts.
 for path,group in {
  "/shop/videoregistrator-neoline-wowcam-2/":("camera","Видеорегистраторы"),
  "/shop/gibrid-videoregistratora-s-radar-detektorom-neoline-x-cop-citysmart/":("hybrid","Гибриды"),
  "/shop/gibrid-videoregistratora-s-radar-detektorom-neoline-spectrum/":("hybrid","Гибриды"),
 }.items():
  found.setdefault(HOST+path,group)
 # Root store sometimes contains products not visible in category menus.
 for page in range(1,9):
  try:
   url=f"{HOST}/shop/" + (f"?PAGEN_2={page}" if page>1 else "")
   soup=BeautifulSoup(get(url).text,"html.parser")
   links=find_links(soup)
   unseen=links-set(found)
   for link in unseen:
    found[link]=("accessories","Каталог NEOLINE")
   print(f"Root page={page} new={len(unseen)}",flush=True)
   if page>1 and not unseen:break
  except Exception as exc:
   print(f"WARN root catalog: {exc}",flush=True);break
 print(f"Discovered {len(found)} source pages",flush=True)
 return found,metrics


def nested_jsonld(soup):
 for script in soup.select('script[type="application/ld+json"]'):
  try: data=json.loads(script.get_text(" ",strip=True))
  except Exception: continue
  queue=data if isinstance(data,list) else [data]
  while queue:
   x=queue.pop(0)
   if isinstance(x,list):queue.extend(x);continue
   if not isinstance(x,dict):continue
   if "Product" in str(x.get("@type","")):return x
   graph=x.get("@graph")
   if isinstance(graph,list):queue.extend(graph)
 return {}


def image_candidates(soup, data, title):
 """Prioritize actual manufacturer product media, not recommended products/icons.

 Bitrix product pages use varying <picture>, lazy-image and zoom-gallery
 attributes. Keep only official /upload/ URLs. Similar rendered images are
 independently deduplicated after download.
 """
 options={}
 def add(raw,score):
  if isinstance(raw,dict):raw=raw.get("url") or raw.get("contentUrl")
  if not isinstance(raw,str):return
  url=canonical_image(raw)
  if not url or promotional_url(url):return
  options[url]=max(score,options.get(url,0))
 def variants(raw,is_srcset=False):
  if not isinstance(raw,str):return []
  # Bitrix may omit 1x/2x descriptors; parse all candidates conservatively.
  return [x.strip().split()[0] for x in raw.split(",") if x.strip()] if is_srcset else [raw]
 for meta in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):
  add(meta.get("content"),80)
 for item in (data.get("image",[]) if isinstance(data.get("image",[]),list) else [data.get("image")]):
  add(item,95)
 words={k for k in re.findall(r"[a-z0-9]{3,}",title.lower()) if k not in ("neoline","wifi","dual","wi")}
 excluded=re.compile(r"related|recommend|similar|also.buy|soput|catalog.list|product.list|other.products",re.I)
 gallery=re.compile(r"gallery|slider|swiper|fancybox|zoom|detail.*image|product.*image|product.*photo|main.photo|picture",re.I)
 for element in soup.select("img,picture source,source[srcset],a[data-fancybox],a[data-src],a[data-zoom-image]"):
  ancestry=element
  is_gallery=False
  reject=False
  for _ in range(7):
   if ancestry is None:break
   classes=" ".join(ancestry.get("class",[]))+" "+str(ancestry.get("id",""))
   if excluded.search(classes):
    reject=True;break
   if gallery.search(classes) or ancestry.has_attr("data-fancybox"):
    is_gallery=True
   ancestry=ancestry.parent
  if reject:continue
  alt=tidy(element.get("alt","")).lower()
  rel=len(words & set(re.findall(r"[a-z0-9]{3,}",alt)))
  score=15+min(rel*12,35)+(30 if is_gallery else 0)
  if "neoline" in alt:score+=10
  if not is_gallery and rel==0:continue
  for attr in ("data-zoom-image","data-large-image","data-original","data-full","data-big",
               "data-fancybox-href","data-src","data-lazyload","data-srcset",
               "srcset","src","href"):
   if attr=="href" and not element.has_attr("data-fancybox"):continue
   for raw in variants(element.get(attr,""),attr.endswith("srcset")):
    add(raw,score+12 if attr.startswith("data-") else score)
 for node in soup.select('[style*="background-image"],[style*="background:"]'):
  classes=" ".join(node.get("class",[]))+" "+str(node.get("id",""))
  if not gallery.search(classes):continue
  for found in re.findall(r"url\\(\\s*['\\\"]?([^'\\\"\\)]+)",node.get("style","")):
   add(found,60)
 # Do not blindly pad the gallery from unrelated footer/product tiles.
 # Keep a wider candidate pool for genuine alternate angles or larger variants.
 return [url for url,score in sorted(options.items(),key=lambda p:p[1],reverse=True)
         if score>=35][:65]

def canonical_image(raw):
 p=urlparse(urljoin(HOST,raw))
 if p.scheme!="https" or p.hostname not in ("neoline.ru","www.neoline.ru"):return None
 if not any(x in p.path for x in ("/upload/iblock/","/upload/medialibrary/","/upload/resize_cache/")):return None
 if re.search(r"\.(?:svg|pdf|gif)(?:$|\?)",p.path,re.I):return None
 return urlunparse(("https","neoline.ru",p.path,"",p.query,""))


def collect_specs(soup):
 specs=[]
 seen=set()
 def add(k,v):
  k,v=tidy(k),tidy(v)
  if (not k or not v or k==v or len(k)>65 or len(v)>150
      or len(k)<3 or "₽" in k or "₽" in v or k in seen):return
  if any(x in k.lower() for x in ("корзин","ваш","авторизац","покуп","рассроч","телефон","стоимость")):return
  if len(specs)>=38:return
  seen.add(k);specs.append({"label":k,"value":v})
 for tr in soup.select("tr"):
  cells=tr.find_all(["td","th"],recursive=False)
  if len(cells)==2:add(cells[0].get_text(" ",strip=True),cells[1].get_text(" ",strip=True))
 # Product feature lists often contain 'Parameter – Value' outside tables.
 for li in soup.select("li"):
  txt=tidy(li.get_text(" ",strip=True))
  if len(txt)>155 or len(txt)<8:continue
  for sep in (" – ", " — ", ": "):
   if sep in txt:
    k,v=txt.split(sep,1)
    if k.lower().strip() not in ("описание","характеристики","комплектация"):
     add(k,v)
    break
 # Some accessory pages use line-break text, not HTML lists or tables.
 for line in soup.get_text("\n",strip=True).split("\n"):
  line=tidy(line).lstrip("•-– ").strip()
  if len(line)>165 or len(line)<8:continue
  for separator in (" – ", " — ", ": "):
   if separator in line:
    label,value=line.split(separator,1)
    if len(label)<=52 and len(value)<=105:
     add(label,value)
    break
 for dl in soup.select("dl"):
  keys=dl.find_all("dt",recursive=False);vals=dl.find_all("dd",recursive=False)
  for k,v in zip(keys,vals):add(k.get_text(" ",strip=True),v.get_text(" ",strip=True))
 # Typical Bitrix product properties list and characteristics layout.
 for root in soup.select('[class*="props"],[class*="property"],[class*="characteristic"],[class*="specification"]'):
  if len(specs)>=38:break
  if root.name not in ("div","li","section"):continue
  children=root.find_all(["div","span","b","strong"],recursive=False)
  if len(children)==2:
   add(children[0].get_text(" ",strip=True),children[1].get_text(" ",strip=True))
 return specs


# Some pages embed recommended audio products beside unrelated accessories.
# Those speaker-only properties must never appear on radar mounts or cables.
SPEAKER_PROPERTIES={
 "Диффузор","Подвес","Материал купола","Тип акустической системы",
 "Форм-фактор","Частотный диапазон","Импеданс, Ом","Размер купола"
}
NON_SPEC_LABELS={"Сплит","Название"}

def validated_product_specs(category,specs):
 output=[]
 for row in specs:
  label=row.get("label","")
  if label in NON_SPEC_LABELS:continue
  if category!="audio" and label in SPEAKER_PROPERTIES:continue
  output.append(row)
 return output


def detail(url,group):
 try:
  soup=BeautifulSoup(get(url,timeout=22).text,"html.parser")
  data=nested_jsonld(soup)
  h=soup.find("h1")
  title=tidy(h.get_text(" ",strip=True) if h else data.get("name"))
  if not title or len(title)>180:return None
  # The shop also sells third-party memory cards, so do not require the name
  # to contain the NEOLINE brand; only verified /shop/product/ URLs qualify.
  specs=collect_specs(soup)
  cat,label=group
  title_lower=title.lower()
  if "уценк" in title_lower:cat="sale"
  elif re.search(r"кабел|креплен|держател|адаптер|компрессор|power cord|fuse cord|hardwire|x-cop magnet|x-cop pad|фильтр|powerbook|мультитул|задняя камера",title,re.I):cat="accessories"
  elif re.search(r"гибрид|радар-детектором|roadmaster|deepscan|shadow wi-fi|spectrum dual",title,re.I):cat="hybrid"
  elif re.search(r"^радар-детектор|^сигнатурный радар-детектор|^neoline x-cop (5900|6100|6200|8700|8900)",title,re.I):cat="radar"
  elif re.search(r"динамики|акустик|ultera",title,re.I):cat="audio"
  elif re.search(r"видеорегистратор|wowcam|smartway|argus|flash 2k|easydrive|g-tech",title,re.I):
   cat="dual" if re.search(r"dual|двумя камер|заднего вида|зеркало",title,re.I) else "single"
  specs=validated_product_specs(cat,specs)
  name=title if "neoline" in title.lower() else "Neoline "+title
  digits=hashlib.sha256(url.encode()).hexdigest()
  ident=1000+int(digits[:10],16)
  # Factual text constructed from metadata rather than a copied manufacturer paragraph.
  highlights=[x["label"]+": "+x["value"] for x in specs[:6]]
  # The manufacturer often uses DIV and BR for overview copy, not P tags.
  # Keep only a short source-specific factual excerpt, never full marketing text.
  tokens=[tidy(x) for x in soup.stripped_strings]
  title_pos=next((i for i,t in enumerate(tokens) if t==title),0)
  intro=[]
  for token in tokens[title_pos+1:title_pos+190]:
   if intro and token in ("Отзывы","Комплектация","В корзину","Рассчитать доставку"):break
   if len(token)<70 or len(token)>900:continue
   low=token.lower()
   if any(k in low for k in ("₽","руб./мес","в рассрочку","заказать звонок","интернет-магазин представительского класса","публичной офертой","телеграм","нашли дешевле","подписаться","cookie","соглашаетесь с политикой","политикой использования","конфиденциальности","персональных данных","оформить заказ","рассчитать доставку")):continue
   if token in intro or token==title:continue
   intro.append(token)
   if len(" ".join(intro))>=360 or len(intro)>=3:break
  excerpt=" ".join(intro) if intro else ""
  if len(excerpt)>440:
   sentence_end=excerpt.rfind(". ",245,440)
   excerpt=(excerpt[:sentence_end+1] if sentence_end>0 else excerpt[:436].rsplit(" ",1)[0]+"…")
  short=name+" — "+label.lower()+"."
  if excerpt: short+=" "+excerpt
  if highlights:short+=" Основные параметры: "+"; ".join(highlights[:4])+"."
  entry={"id":ident,"name":name,"category":cat,"group":label,
         "description":short[:700],"specs":specs,
         "source":url,"images":[],"imageSources":image_candidates(soup,data,name)}
  offers=data.get("offers",{})
  if isinstance(offers,list):offers=offers[0] if offers else {}
  if isinstance(offers,dict):
   price=offers.get("price")
   currency=offers.get("priceCurrency")
   if str(currency).upper()=="RUB":
    try: entry["priceRub"]=round(float(price))
    except (ValueError,TypeError):pass
  return entry
 except Exception as exc:
  print(f"WARN product {url}: {exc}",flush=True)
  return None


def clean_image(img):
 # Prefer the existing, conservative true-alpha processor for white source.
 from build_transparent_photos import remove_near_white_background
 img=ImageOps.exif_transpose(img)
 if img.mode=="RGBA":
  if img.getchannel("A").getextrema()[0]<250:
   img.thumbnail((1100,1100),Image.Resampling.LANCZOS)
   return img,"transparent"
 base=img.convert("RGB")
 base.thumbnail((1100,1100),Image.Resampling.LANCZOS)
 result=remove_near_white_background(base.copy())
 if result is not None:return result,"transparent"
 return base,"original"


def download_unique_image(url,path,known):
 """Save genuine product shots only, not shipping/sale banners."""
 if promotional_url(url):
  print(f"SKIP advertising URL: {url[:150]}",flush=True)
  return None
 response=get(url,timeout=24)
 if len(response.content)>MAX_IMAGE_BYTES:raise ValueError("image too large")
 img=Image.open(io.BytesIO(response.content));img.load()
 if img.width<180 or img.height<140 or img.width*img.height>20_000_000:
  raise ValueError("bad dimensions")
 promo_reason,_=banner_diagnosis(img)
 if promo_reason:
  print(f"SKIP manufacturer promo banner: {url[:150]} ({promo_reason})",flush=True)
  return None
 output,mode=clean_image(img)
 pending=path.with_name(path.stem+".pending.webp")
 try:
  output.save(pending,format="WEBP",quality=89,method=5)
  signature=photo_signature(pending)
  if any(duplicate_kind(signature,old)[0] in ("identical","perceptual") for old in known):
   return None
  # Do not expose any incomplete picture to a concurrent client.
  pending.replace(path)
  return mode,signature
 finally:
  pending.unlink(missing_ok=True)


def attach_photos(item,previous_by_id):
 """Keep existing approved views, then look for genuinely different source shots.

 The sync must not accidentally re-import references already rejected by the
 last gallery audit merely because their old .webp files remain on disk.
 """
 if not item:return None
 directory=OUT/"images"
 directory.mkdir(parents=True,exist_ok=True)
 slug=str(item["id"])
 approved=previous_by_id.get(item["id"],[])
 retained=[]
 signatures=[]
 for relative in approved:
  if not isinstance(relative,str) or not re.fullmatch(
      r"\./assets/catalog/images/[0-9]+-[0-9]+\.webp",relative):continue
  if banned_reference(relative):
   print(f"SKIP user-confirmed gallery advertisement {relative}",flush=True)
   continue
  path=Path(relative)
  if not path.is_file():
   print(f"approved picture unavailable: {path}",flush=True)
   continue
  try:
   rejected,_=classify_file(path)
   if rejected:
    print(f"SKIP existing gallery promo: {relative} ({rejected})",flush=True)
    continue
   signature=photo_signature(path)
   if any(duplicate_kind(signature,old)[0] in ("identical","perceptual")
          for old in signatures):continue
   retained.append(path.read_bytes())
   signatures.append(signature)
  except (ValueError,OSError,UnidentifiedImageError) as exc:
   print(f"approved picture decode failed {path}: {exc}",flush=True)
   continue
 print(f"approved distinct pictures retained {slug}: {len(retained)}",flush=True)
 # Retained images are written to contiguous stable numbered slots. Preserve
 # bytes first; overwriting a target cannot destroy a yet-to-be-read old photo.
 images=[]
 for index,binary in enumerate(retained[:6],start=1):
  target=directory/f"{slug}-{index}.webp"
  if not target.exists() or target.read_bytes()!=binary:
   target.write_bytes(binary)
  images.append("./"+target.as_posix())
 for url in item.pop("imageSources",[])[:65]:
  if len(images)>=6:break
  target=directory/f"{slug}-{len(images)+1}.webp"
  try:
   found=download_unique_image(url,target,signatures)
   if not found:continue
   mode,signature=found
   signatures.append(signature)
   images.append("./"+target.as_posix())
   print(f"new verified product photo {slug} {mode}: {target.name}",flush=True)
  except (requests.RequestException,ValueError,OSError,UnidentifiedImageError) as exc:
   print(f"SKIP photo {slug}: {type(exc).__name__} {str(exc)[:100]}",flush=True)
 item["images"]=images
 item["spec"]=[entry["value"] for entry in item["specs"][:3]]
 return item

def main():
 OUT.mkdir(parents=True,exist_ok=True)
 pages,category_counts=discover()
 report={"timestamp":datetime.now(timezone.utc).isoformat(),"categories":category_counts,"discovered":len(pages)}
 if len(pages)<16:
  print("Catalog source seems blocked or incomplete; keeping previous full catalog",flush=True)
  (OUT/"sync-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
  return 2
 entries=[]
 unparsed=[]
 with ThreadPoolExecutor(max_workers=5) as pool:
  futures={pool.submit(detail,url,group):url for url,group in sorted(pages.items())}
  for future in as_completed(futures):
   item=future.result()
   if item:entries.append(item)
   else:unparsed.append(futures[future])
 report["unparsedUrls"]=sorted(unparsed)
 if len(entries)<12:
  print("Insufficient verified product detail pages; not overwriting catalog",flush=True)
  report["parsed"]=len(entries)
  (OUT/"sync-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
  return 3
 # Reuse only references still approved in the CURRENT published catalog.
 # Orphan photos from an earlier generation are not reinserted automatically.
 previous_by_id={}
 try:
  old=json.loads((OUT/"catalog.json").read_text(encoding="utf-8"))
  previous_by_id={int(p["id"]):list(p.get("images") or []) for p in old.get("products",[])}
 except (OSError,ValueError,KeyError,TypeError) as exc:
  print(f"Previous catalogue unavailable; source-only media recovery: {exc}",flush=True)
 entries.sort(key=lambda p:(p["category"],p["name"].casefold(),p["source"]))
 with ThreadPoolExecutor(max_workers=3) as pool:
  list(pool.map(lambda item:attach_photos(item,previous_by_id),entries))
 report["parsed"]=len(entries)
 report["photos"]=sum(len(p["images"]) for p in entries)
 report["uniquePhotosPerProduct"]={p["name"]:len(p["images"]) for p in entries}
 report["fewerThanFive"]=[p["name"] for p in entries if len(p["images"])<5]
 report["withoutPhotos"]=[p["name"] for p in entries if not p["images"]]
 payload={"version":1,"source":"https://neoline.ru/shop/",
          "updated":report["timestamp"],"products":entries}
 (OUT/"catalog.json").write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 (OUT/"sync-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print("Catalog imported",json.dumps(report,ensure_ascii=False),flush=True)
 return 0


if __name__=="__main__":
 sys.exit(main())
