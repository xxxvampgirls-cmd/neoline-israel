#!/usr/bin/env python3
"""Remove verified ad banners from ALL imported NEOLINE product galleries.

Edits product *references* only. The original image files are retained for
recovery from the restore branch. All removed media are documented.
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from PIL import UnidentifiedImageError

from catalog_promo_filter import classify_file, banned_reference

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "assets/catalog/catalog.json"
REPORT = ROOT / "assets/catalog/promo-image-cleanup.json"
PHOTO_ROOT = (ROOT / "assets/catalog/images").resolve()


def scan(*, apply: bool = False) -> dict:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    removed = []
    review = []
    affected = set()
    original_count = sum(len(p.get("images", [])) for p in data.get("products", []))

    for item in data.get("products", []):
        images = item.get("images", [])
        approved = []
        for image in images:
            if not isinstance(image, str):
                continue
            if not image.startswith("./assets/catalog/images/"):
                approved.append(image)
                continue
            path = (ROOT / image).resolve()
            if not path.is_relative_to(PHOTO_ROOT) or not path.is_file():
                approved.append(image)  # Other integrity audit handles missing files.
                continue
            try:
                reason, metrics = classify_file(path)
                if reason:
                    removed.append({
                        "productId": item["id"], "product": item["name"],
                        "reference": image, "reason": reason, "measurements": metrics,
                    })
                    affected.add(item["id"])
                    continue
                # Wide but not colorful enough: flag only, avoid false positives.
                if metrics.get("ratio", 0) >= 2.22:
                    review.append({
                        "productId": item["id"], "reference": image,
                        "ratio": metrics["ratio"],
                        "note": "Wide photograph retained for review: could be a genuine long accessory.",
                    })
            except (UnidentifiedImageError, OSError, ValueError) as exc:
                review.append({
                    "productId": item["id"], "reference": image,
                    "note": f"Image not decoded for banner detection: {type(exc).__name__}",
                })
            approved.append(image)
        if apply:
            item["images"] = approved

    report = {
        "version": 1,
        "scannedAt": datetime.now(timezone.utc).isoformat(),
        "mode": "apply" if apply else "preview",
        "products": len(data.get("products", [])),
        "picturesBefore": original_count,
        "picturesAfter": original_count - len(removed),
        "removedCount": len(removed),
        "affectedProducts": len(affected),
        "removed": removed,
        "reviewOnly": review,
        "policy": "Remove confirmed ads/wide marketing graphics from product photos; do not invent or pad images. Source binaries retained for rollback.",
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if apply and removed:
        CATALOG.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k not in ("removed", "reviewOnly")},
                     ensure_ascii=False, indent=2))
    for hit in removed:
        print("REMOVE", hit["reference"], hit["reason"], hit["measurements"])
    for candidate in review[:12]:
        print("REVIEW ONLY", candidate)
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true",
                        help="Remove approved promotional image references from catalog.json")
    scan(apply=parser.parse_args().apply)
