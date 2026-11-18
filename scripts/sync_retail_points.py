#!/usr/bin/env python3
"""Nationwide shop locations for prospective NEOLINE retail partners.

Use only OpenStreetMap's real shop coordinates and explicit matching brands.
Not a representation that these retailers stock or distribute NEOLINE products.
Unconfirmed shops are excluded. Keeps prior valid snapshot on API failure.
"""
import datetime as dt
import json
import re
import sys
import time
from pathlib import Path

import requests
from sync_pickup_points import BOX, SOURCES, within_service_envelope

OUT = Path("assets/retail/points.json")
# Use name / brand with shop tags; never invent locations or partnerships.
BRANDS = {
    "ksp": r"^(?:KSP|קיי[.\s-]?אס[.\s-]?פי|קיי אס פי)(?:\b|$)",
    "ivory": r"^(?:Ivory|אייבורי)(?:\b|$)",
    "bug": r"^(?:BUG|באג)(?:\b|$)",
    "autodepot": r"^(?:Auto\s*-?\s*Depot|אוטו\s*דיפו)(?:\b|$)",
    "ace": r"^(?:ACE|אייס)(?:\b|$)",
    "payngo": r"^(?:מחסני\s*חשמל|Machsan(?:ei|ey)\s*Hashmal)(?:\b|$)",
    "shekem": r"^(?:שקם\s*אלקטריק|Shekem\s*Electric)(?:\b|$)",
    "alm": r"^(?:א\.?ל\.?מ\.?|ALM|A\.L\.M\.)(?:\b|$)",
}
RX = {name: re.compile(pattern, re.I) for name, pattern in BRANDS.items()}
# Small OSM amenity set for dedicated shop branches only.
QUERY = (
    "[out:json][timeout:55];"
    "("
    f'nwr["shop"]["name"~"KSP|Ivory|אייבורי|באג|BUG|אוטו.?דיפו|Auto.?Depot|אייס|ACE|מחסני חשמל|Machsan|שקם אלקטריק|Shekem|א\\.ל\\.מ|ALM",i]({BOX});'
    f'nwr["shop"]["brand"~"KSP|Ivory|אייבורי|באג|BUG|אוטו.?דיפו|Auto.?Depot|אייס|ACE|מחסני חשמל|Machsan|שקם אלקטריק|Shekem|א\\.ל\\.מ|ALM",i]({BOX});'
    ");out center;"
)

def classify(tags):
    label = " ".join(str(tags.get(k) or "") for k in
                     ("brand", "name", "name:en", "name:he", "brand:en", "brand:he")).strip()
    for name, rx in RX.items():
        if rx.search(label):
            return name
    return None

def normalize(data):
    if not isinstance(data.get("elements"), list):
        raise ValueError("Malformed Overpass response")
    rows, seen = [], set()
    for item in data["elements"]:
        loc = item.get("center") or item
        lat, lon = loc.get("lat"), loc.get("lon")
        if lat is None or lon is None:
            continue
        lat, lon = float(lat), float(lon)
        if not within_service_envelope(lat, lon):
            continue
        tags = item.get("tags") or {}
        shop = str(tags.get("shop") or "")
        if not shop or shop == "no":
            continue
        brand = classify(tags)
        if brand is None:
            continue
        ident = str(item.get("type"))+":"+str(item.get("id"))
        if ident in seen:
            continue
        seen.add(ident)
        street = " ".join(str(tags.get(k) or "") for k in
                          ("addr:street", "addr:housenumber")).strip()
        city = str(tags.get("addr:city") or tags.get("addr:suburb") or "").strip()
        rows.append({
            "key": ident,
            "lat": lat,
            "lon": lon,
            "id": brand,
            "title": str(tags.get("name") or tags.get("brand") or "")[:140],
            "address": ", ".join(x for x in (street, city) if x)[:200],
            "shop": shop,
        })
    rows.sort(key=lambda x: (x["id"],x["lat"],x["lon"]))
    return rows

def main():
    error = None
    records = None
    source = None
    for i, endpoint in enumerate(SOURCES):
        try:
            res = requests.get(
                endpoint, params={"data": QUERY}, timeout=(12, 70),
                headers={"User-Agent": "NEOLINE-Israel-ProspectiveRetailMap/1.0",
                         "Accept": "application/json"},
            )
            res.raise_for_status()
            data = res.json()
            if data.get("remark") and not data.get("elements"):
                raise ValueError(data["remark"])
            rows = normalize(data)
            if len(rows) < 8:
                raise ValueError(f"Too few retailer coordinates: {len(rows)}")
            records, source = rows, endpoint
            break
        except Exception as ex:
            error = str(ex)
            print("Overpass retail source", i + 1, "failed:", error, file=sys.stderr)
            if i + 1 < len(SOURCES):
                time.sleep(4)
    if records is None:
        if OUT.exists():
            older = json.loads(OUT.read_text(encoding="utf-8"))
            if len(older.get("points") or []) >= 8:
                print("Keeping previous verified retailer snapshot")
                return
        raise SystemExit("Could not get a verified retailer snapshot: " + str(error))
    result = {
        "version": 1,
        "updated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "source": "OpenStreetMap contributors (ODbL)",
        "source_url": "https://www.openstreetmap.org/copyright",
        "notice": "Only mapped retail locations; no NEOLINE stock/partnership implied",
        "count": len(records),
        "points": records,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False,separators=(",",":"))+"\n", encoding="utf-8")
    print(f"Recorded {len(records)} real retailer coordinates from {source}")

if __name__ == "__main__":
    main()
