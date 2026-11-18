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
# Conservative geographic service envelope for Israel and nearby localities
# included in nationwide delivery searches. This is used ONLY to reject
# accidentally returned points in neighbouring countries; it is not a
# presentation of borders or an assertion of service availability.
# Coarse geographic coordinates are factual WGS84 reference values.
ISRAEL_AREA = [
    (35.719918, 32.709192),
    (35.545665, 32.393992),
    (35.18393, 32.532511),
    (34.974641, 31.866582),
    (35.225892, 31.754341),
    (34.970507, 31.616778),
    (34.927408, 31.353435),
    (35.397561, 31.489086),
    (35.420918, 31.100066),
    (34.922603, 29.501326),
    (34.265433, 31.219361),
    (34.556372, 31.548824),
    (34.488107, 31.605539),
    (34.752587, 32.072926),
    (34.955417, 32.827376),
    (35.098457, 33.080539),
    (35.126053, 33.0909),
    (35.460709, 33.08904),
    (35.552797, 33.264275),
    (35.821101, 33.277426),
    (35.836397, 32.868123),
    (35.700798, 32.716014),
    (35.719918, 32.709192),
]
WEST_BANK_AREA = [
    (35.545665, 32.393992),
    (35.545252, 31.782505),
    (35.397561, 31.489086),
    (34.927408, 31.353435),
    (34.970507, 31.616778),
    (35.225892, 31.754341),
    (34.974641, 31.866582),
    (35.18393, 32.532511),
    (35.545665, 32.393992),
]


def _inside_ring(latitude: float, longitude: float, ring: list) -> bool:
    inside = False
    prev = ring[-1]
    for point in ring:
        x1, y1 = point
        x2, y2 = prev
        if (y1 > latitude) != (y2 > latitude):
            cross_lon = (x2 - x1) * (latitude - y1) / (y2 - y1) + x1
            if longitude < cross_lon:
                inside = not inside
        prev = point
    return inside


def within_service_envelope(lat: float, lon: float) -> bool:
    return _inside_ring(lat, lon, ISRAEL_AREA) or _inside_ring(lat, lon, WEST_BANK_AREA)


PATTERNS = {
    "boxit": r"box\s*[- ]?\s*it|בוקסיט|בוקס.?איט",
    "done": r"\bdone\b|דאן|דון לוקרים",
    "doar": r"israel\s*post|דואר\s*ישראל|doar\s*israel",
    "epost": r"(?<![A-Za-z])e[-\s.]?post\b|\bhfd\b|אי.?פוסט|איפוסט",
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
        if not within_service_envelope(lat, lon):
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
