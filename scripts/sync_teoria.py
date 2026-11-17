#!/usr/bin/env python3
"""Import the actual Israeli Ministry of Transport driving-theory Q&A bank.

Source: data.gov.il tqru/tqhe/tqen CC BY datasets. Only answers explicitly
marked by "correctAnswerNNNN" in official source are used. No invented tickets.
All questions are copied as learning material with Ministry attribution.
"""
from __future__ import annotations
import datetime as dt
import io
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

BASE="https://data.gov.il"
OUT=Path("assets/teoria")
LANGS={"ru":"tqru","he":"tqhe","en":"tqen"}
S=requests.Session()
S.headers.update({"User-Agent":"NEOLINE-Israel-Educational-Theory/1.0 (+source: data.gov.il)", "Accept":"application/json"})
LICENSE="Creative Commons Attribution (CC BY)"
MAX_ROWS=2500
def api(path,params):
    r=S.get(BASE+"/api/3/action/"+path,params=params,timeout=(12,80))
    r.raise_for_status()
    d=r.json()
    if not d.get("success"):raise ValueError("Official API returned success=false")
    return d["result"]
def package(name):
    # CKAN package_show accepts short package slug. The dataset publisher is MOT.
    return api("package_show",{"id":name})
def resource_rows(info):
    # Prefer actual datastore-backed XLSX; the older XML resource often lacks a datastore.
    resources=sorted(info["resources"],key=lambda r:(
        (r.get("format") or "").upper() not in ("XLSX","XLS"),
        not bool(r.get("datastore_active",False))
    ))
    errors=[]
    for resource in resources:
        rid=resource["id"]
        try:
            collected=[]
            offset=0
            while offset<MAX_ROWS:
                result=api("datastore_search",{"resource_id":rid,"limit":500,"offset":offset})
                rows=result.get("records",[])
                collected.extend(rows)
                offset+=len(rows)
                if not rows or offset>=result.get("total",MAX_ROWS):break
            if len(collected)>100:
                print("Official datastore",rid,"rows",len(collected),flush=True)
                return collected,rid
        except Exception as e:errors.append(str(e)[:160])
        # Some resources expose downloadable XLSX files but no CKAN DataStore.
        if (resource.get("format") or "").upper()=="XLSX":
            url=str(resource.get("url",""))
            parsed=urlparse(url)
            if parsed.scheme!="https" or parsed.hostname not in ("data.gov.il","www.data.gov.il"):
                continue
            try:
                import openpyxl
                response=S.get(url,timeout=(12,100))
                response.raise_for_status()
                if len(response.content)>18_000_000:raise ValueError("Unexpectedly large XLSX")
                book=openpyxl.load_workbook(io.BytesIO(response.content),read_only=True,data_only=True)
                sheet=book.active
                iterator=sheet.values
                headers=[str(x or "").strip() for x in next(iterator)]
                data=[dict(zip(headers,row)) for row in iterator if any(x is not None for x in row)]
                book.close()
                if len(data)>100:
                    print("Official XLSX",rid,"rows",len(data),flush=True)
                    return data,rid
            except Exception as e:errors.append(type(e).__name__+" "+str(e)[:130])
    raise RuntimeError("No validated official question resource: "+"; ".join(errors[:4]))
def category(value):
    t=str(value or "").lower()
    if any(x in t for x in ("תמרור","traffic sign","road sign","дорожные знаки","дорожные зна","знаки", "signs")):return "signs"
    if any(x in t for x in ("בטיחות","safety","безопасност","veilig")):return "safety"
    if any(x in t for x in ("רכב","vehicle","автомобил","транспортного средства","устройство")):return "vehicle"
    return "laws"
def strip(v):
    return re.sub(r"\s+"," ",str(v or "")).strip()
def text(node):
    return strip(node.get_text(" ",strip=True))
def question(row):
    title=strip(row.get("title2") or row.get("title_2") or row.get("question") or "")
    html=str(row.get("description4") or row.get("description_4") or row.get("answers") or "")
    if not title or not html or len(title)>1100: return None
    m=re.match(r"^\s*0*(\d{1,5})[\.\):\-]\s*(.+)",title)
    if not m:return None
    number=int(m.group(1));prompt=strip(m.group(2))
    if number<=0 or number>50000 or len(prompt)<9:return None
    soup=BeautifulSoup(html,"html.parser")
    ul=soup.find("ul")
    if not ul:return None
    lis=ul.find_all("li",recursive=False)
    if len(lis)!=4:return None
    answers=[];correct=[]
    for i,li in enumerate(lis):
        answer=text(li)
        if not answer or len(answer)>850:return None
        answers.append(answer)
        if li.find(attrs={"id":re.compile(r"^correctAnswer",re.I)}):correct.append(i)
    if len(correct)!=1 or len(set(answers))!=4:return None
    # The canonical official question marks licence categories with guillemets.
    raw_codes=re.findall(r"«\s*([^»]+?)\s*»",html)
    classes=[]
    for code in raw_codes:
        c=strip(code).upper().replace("В","B").replace("А","A").replace("С","C")
        if c in ("A","B","C","C1","D","1","A1","A2","A3") and c not in classes:classes.append(c)
    if not classes:return None
    picture=None
    img=soup.find("img",src=True)
    if img:
        src=str(img.get("src","")).strip()
        url=urlparse(src)
        if url.scheme=="https" and url.hostname in ("www.gov.il","gov.il") and "/BlobFolder/" in url.path and re.search(r"\.(jpg|png|jpeg|webp)$",url.path,re.I):
            picture=src
    return {"id":str(number),"q":prompt,"a":answers,"correct":correct[0],
            "topic":category(row.get("category")), "classes":classes,"image":picture}
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    results={}
    for lang,dataset in LANGS.items():
        meta=package(dataset)
        name=meta.get("name") or dataset
        if (meta.get("license_id") or "").lower() not in ("cc-by","cc-by-4.0","cc-by-3.0"):
            raise RuntimeError(dataset+" is not marked CC BY: "+str(meta.get("license_id")))
        rows,rid=resource_rows(meta)
        items={}
        for row in rows:
            obj=question(row)
            if obj:items[obj["id"]]=obj
        if len(items)<900:
            raise RuntimeError(dataset+" only "+str(len(items))+" validated questions; refuse incomplete deployment")
        ordered=sorted(items.values(),key=lambda q:int(q["id"]))
        result={"version":1,"language":lang,"fetched":dt.datetime.now(dt.timezone.utc).isoformat(),
                "source":BASE+"/he/datasets/ministry_of_transport/"+dataset,
                "resourceId":rid,"license":LICENSE,"publisher":"Israel Ministry of Transport and Road Safety",
                "total":len(ordered),"questions":ordered}
        results[lang]=result
        print("VALIDATED",lang,len(ordered),"B",sum("B" in x["classes"] for x in ordered),
              "with images",sum(bool(x["image"]) for x in ordered),flush=True)
    # Commit only once all three original-language banks are valid.
    for lang,record in results.items():
        (OUT/(lang+".json")).write_text(json.dumps(record,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf8")
    (OUT/"manifest.json").write_text(json.dumps({
        "version":1,"fetched":dt.datetime.now(dt.timezone.utc).isoformat(),
        "languages":{lang:{"count":item["total"],"classB":sum("B" in q["classes"] for q in item["questions"]),
                           "imageCount":sum(bool(q["image"]) for q in item["questions"])}
                     for lang,item in results.items()},
        "source":"https://data.gov.il/he/datasets/ministry_of_transport/tqru",
        "license":LICENSE,"publisher":"Israel Ministry of Transport and Road Safety"
    },ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print("TEORIA OFFICIAL DATASET SYNC COMPLETE",flush=True)
if __name__=="__main__":main()
