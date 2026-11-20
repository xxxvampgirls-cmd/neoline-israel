#!/usr/bin/env python3
"""Cache *illustrative manufacturer feature panels*, separately from product photos.

Source URLs are explicitly reviewed in feature-media-sources.json.
This tool never invents camera angles or touches the main photo galleries.
"""
from __future__ import annotations

import io
import json
from pathlib import Path
from urllib.parse import urlparse

import requests
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets/catalog"
SOURCE = ASSETS / "feature-media-sources.json"
CATALOG = ASSETS / "catalog.json"
DEST = ASSETS / "feature-media.json"
IMAGE_DIR = ASSETS / "feature-images"
MAX_BYTES = 7_000_000
MAX_PIXELS = 12_000_000
LOCALES = ("ru", "en", "he", "ar")
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Mozilla/5.0 (NEOLINE Israel catalogue/source illustration cache)"})

def trusted_source(url: str) -> bool:
    parsed = urlparse(url)
    return (parsed.scheme == "https" and parsed.hostname in ("neoline.ru", "www.neoline.ru")
            and parsed.path.startswith("/upload/medialibrary/")
            and not parsed.username and not parsed.password)

def load_image(url: str) -> bytes:
    if not trusted_source(url):
        raise ValueError("Only reviewed official NEOLINE media-library URLs are accepted")
    response = SESSION.get(url, timeout=(8, 24), allow_redirects=True)
    response.raise_for_status()
    if not trusted_source(response.url):
        raise ValueError("External image redirect rejected")
    if len(response.content) > MAX_BYTES:
        raise ValueError("Feature illustration too large")
    with Image.open(io.BytesIO(response.content)) as uploaded:
        uploaded.load()
        image = ImageOps.exif_transpose(uploaded)
        if image.width < 300 or image.height < 240:
            raise ValueError(f"Not a usable product illustration: {image.size}")
        if image.width * image.height > MAX_PIXELS:
            raise ValueError("Unexpected product illustration size")
        # Maintain original dark presentation art. Do NOT remove backgrounds
        # or apply the transparent-product-photo processor to editorial graphics.
        image = image.convert("RGB")
        image.thumbnail((950, 950), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        image.save(output, format="WEBP", quality=88, method=5)
        return output.getvalue()

def run() -> None:
    instructions = json.loads(SOURCE.read_text(encoding="utf-8"))
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    valid_products = {x["id"]: x["source"] for x in catalog.get("products", [])}
    records = []
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    try:
        previous = json.loads(DEST.read_text(encoding="utf-8"))
        cached = {entry["id"]: entry for entry in previous.get("products", [])}
    except (OSError, ValueError, KeyError, TypeError):
        cached = {}

    for product in instructions["products"]:
        product_id = product["id"]
        page = product["source"]
        if valid_products.get(product_id) != page:
            raise ValueError(f"Product/source mapping is stale: {product_id}")
        features = []
        seen_payloads = set()
        prior = cached.get(product_id, {}) if cached.get(product_id, {}).get("source") == page else {}
        prior_by_url = {entry.get("sourceUrl"): entry for entry in prior.get("features", [])}
        for slot, item in enumerate(product["features"], 1):
            url = item["url"]
            titles = item["title"]
            if not all(isinstance(titles.get(lang), str) and titles[lang].strip()
                       for lang in LOCALES):
                raise ValueError(f"Missing feature translations for {product_id}/{slot}")
            try:
                import hashlib
                target = IMAGE_DIR / f"{product_id}-{slot}.webp"
                already = prior_by_url.get(url)
                if already and already.get("image") == "./assets/catalog/feature-images/" + target.name and target.is_file():
                    data = target.read_bytes()
                    print(f"REUSE reviewed manufacturer illustration {product_id}/{slot}")
                else:
                    data = load_image(url)
                    if not target.exists() or target.read_bytes() != data:
                        target.write_bytes(data)
                    print(f"FETCH reviewed manufacturer illustration {product_id}/{slot}")
                digest = hashlib.sha256(data).hexdigest()
                if digest in seen_payloads:
                    print(f"SKIP repeated official illustration {product_id}/{slot}")
                    continue
                seen_payloads.add(digest)
                features.append({
                    "image": "./assets/catalog/feature-images/" + target.name,
                    "title": {lang: titles[lang].strip() for lang in LOCALES},
                    "sourceUrl": url
                })
                print(f"VERIFIED manufacturer illustration {product_id}/{slot}")
            except (ValueError, requests.RequestException, OSError, UnidentifiedImageError) as error:
                print(f"SKIP unreliable manufacturer illustration {product_id}/{slot}: {error}")
        if len(features) != len(product["features"]):
            old_features = prior.get("features", [])
            if len(old_features) >= 2 and all(
                (ROOT / it["image"]).is_file() for it in old_features
            ):
                records.append(prior)
                print(f"KEEP last verified manufacturer visuals for {product_id}")
            else:
                # Incomplete groups remain unpublished, and any partially
                # downloaded unverified files stay out of the public repository.
                for image in features:
                    path = ROOT / image["image"]
                    if path.is_file():
                        path.unlink()
                print(f"DEFER feature media for {product_id}: only {len(features)} of "
                      f"{len(product['features'])} official files reachable. Main product photos are unchanged.")
            continue
        records.append({"id": product_id, "source": page, "features": features})

    if not records:
        raise ValueError("No valid source gallery remains; refusing to overwrite published media manifest")
    manifest = {
        "version": 1,
        "note": "Manufacturer's feature illustrations, NOT additional product-angle photos.",
        "products": records,
    }
    content = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    if not DEST.exists() or DEST.read_text(encoding="utf-8") != content:
        DEST.write_text(content, encoding="utf-8")
    print(f"Published {sum(len(x['features']) for x in records)} official illustration(s), "
          f"{len(records)} source product(s); no main gallery changed.")

if __name__ == "__main__":
    run()
