#!/usr/bin/env python3
"""Publish real OSM postal/parcel facilities, once daily.

Does not scrape or invent carrier locations. OSM labels are sometimes missing;
in that case the map displays 'other operator', never guesses the brand.
Maintains the previous verified snapshot if Overpass is unavailable.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import time
from pathlib import Path

import requests

OUTPUT = Path("assets/pickup/points.json")
SOURCES = (
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
)
# Bounding rectangle with a countrywide spread, not a list of city centers.
BOX = "29.42,34.20,33.42,35.91"
QUERY = (
    "[out:json][timeout:45];"
    "("
    f'nwr["amenity"~"^(post_office|parcel_locker)$"]({BOX});'
    f'nwr["shop"="parcel_pickup"]({BOX});'
    f'nwr["parcel_pickup"="yes"]({BOX});'
    f'nwr["post_office"="post_partner"]({BOX});'
    ");out center;"
)
PATTERNS = {
    "boxit": r"box\s*[- ]?\s*it|בוקסיט|בוקס.?איט",
    "done": r"\bdone\b|דאן|דון לוקרים",
    "doar": r"israel\s*post|דואר\s*ישראל|doar\s*israel",
    "epost": r"e[\s.-]?post|hfd|אי.?פוסט|איפוסט",
    "pickup": r"pick\s*[- ]?\s*up|פיקאפ",
    "cheetah": r"cheetah|chita|צ.?יטה",
    "zigzag": r"zig.?zag|זיג.?זג",
    "shlager": r"shlager|שלאגר",
    "easypoint": r"easy\s*point|איזי פוינט",
    "cargo": r"\bcargo\b|קארגו",
    "dhl": r"\bdhl\b",
    "fedex": r"fed\s*ex|פדאקס",
}


def provider(tags: dict[str, str]) -> str:
    # Never infer one courier's location from another courier's address.
    label = " ".join(
        str(tags.get(k) or "")
        for k in ("brand", "operator", "network", "name", "name:en", "name:he",
                  "brand:en", "operator:en", "operator:he")
    )
    for key, pattern in PATTERNS.items():
        if re.search(pattern, label, re.I):
            return key
    return "other"


def normalize(data: dict) -> list[dict]:
    if not isinstance(data.get("elements"), list):
        raise ValueError("Malformed OSM data")
    points = []
    seen = set()
    for item in data["elements"]:
        loc = item.get("center") if item.get("center") else item
        lat = loc.get("lat")
        lon = loc.get("lon")
        if lat is None or lon is None:
            continue
        lat, lon = float(lat), float(lon)
        if not (29.42 <= lat <= 33.42 and 34.20 <= lon <= 35.91):
            continue
        key = f"{item.get('type', 'unknown')}:{item.get('id', 'unknown')}"
        if key in seen:
            continue
        seen.add(key)
        tags = item.get("tags") or {}
        street = " ".join(str(tags.get(k) or "") for k in ("addr:street", "addr:housenumber")).strip()
        city = str(tags.get("addr:city") or tags.get("addr:suburb") or "").strip()
        addr = ", ".join(x for x in (street, city) if x)
        points.append({
            "key": key,
            "lat": lat,
            "lon": lon,
            "id": provider(tags),
            "title": str(tags.get("name") or tags.get("name:en") or "")[:140],
            "address": addr[:200],
            "post": tags.get("amenity") == "post_office",
        })
    points.sort(key=lambda p: (p["lat"], p["lon"], p["key"]))
    return points


def main() -> None:
    last_error = None
    points = None
    source = None
    for index, endpoint in enumerate(SOURCES):
        try:
            response = requests.get(
                endpoint,
                params={"data": QUERY},
                timeout=(12, 63),
                headers={"User-Agent": "NEOLINE-Israel-ReferenceMap/1.0 (public OSM daily data export)",
                         "Accept": "application/json"},
            )
            response.raise_for_status()
            data = response.json()
            if data.get("remark") and not data.get("elements"):
                raise ValueError(str(data["remark"])[:300])
            result = normalize(data)
            if len(result) < 25:
                raise ValueError(f"Suspiciously few real OSM points: {len(result)}")
            points, source = result, endpoint
            break
        except Exception as err:
            last_error = repr(err)
            print(f"OSM source #{index + 1} error: {last_error}", file=sys.stderr)
            if index + 1 < len(SOURCES):
                time.sleep(4)
    if points is None:
        # Don't overwrite a working older countrywide snapshot with an empty set.
        if OUTPUT.exists():
            old = json.loads(OUTPUT.read_text(encoding="utf-8"))
            if len(old.get("points") or []) > 0:
                print(f"Keeping last valid snapshot ({len(old['points'])} facilities).")
                return
        raise SystemExit("No valid initial OpenStreetMap snapshot. " + str(last_error))
    payload = {
        "version": 1,
        "updated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "source": "OpenStreetMap contributors (ODbL)",
        "source_url": "https://www.openstreetmap.org/copyright",
        "coverage": "partial; only facilities with public OSM coordinates",
        "count": len(points),
        "points": points,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Saved {len(points)} verified OSM facilities via {source}")


if __name__ == "__main__":
    main()
