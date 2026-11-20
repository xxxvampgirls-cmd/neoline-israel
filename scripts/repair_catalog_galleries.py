#!/usr/bin/env python3
"""Remove unsafe/duplicate gallery *references*, never original image files.

This cleans 54+ imported product galleries with conservative RGB matching.
It never manufactures extra pictures to satisfy a five-photo quota.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

from PIL import UnidentifiedImageError

from catalog_photo_quality import duplicate_kind, photo_signature

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets/catalog/catalog.json"
REPORT = ROOT / "assets/catalog/gallery-repair-report.json"


def clean(*, apply: bool) -> dict:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    changed_products = []
    counters = Counter()
    records = []

    for product in data.get("products", []):
        before = product.get("images") or []
        selected = []
        signatures = []
        for relative in before:
            if not isinstance(relative, str) or not relative.startswith("./assets/catalog/images/"):
                counters["invalidPath"] += 1
                records.append({"product":product.get("name"),"photo":relative,"reason":"invalid path"})
                continue
            path = (ROOT / relative).resolve()
            if not path.is_relative_to(ROOT / "assets/catalog/images") or not path.is_file():
                counters["missing"] += 1
                records.append({"product":product.get("name"),"photo":relative,"reason":"missing"})
                continue
            try:
                signature = photo_signature(path)
            except (ValueError, UnidentifiedImageError, OSError) as error:
                counters["brokenOrTooSmall"] += 1
                records.append({"product":product.get("name"),"photo":relative,
                                "reason": "bad image: "+str(error)})
                continue
            duplicate = next(
                ((known, kind, metric) for known, old in signatures
                 for kind, metric in [duplicate_kind(old, signature)]
                 if kind in ("identical", "perceptual")), None
            )
            if duplicate:
                earlier, kind, metric = duplicate
                counters["duplicates"] += 1
                records.append({"product":product.get("name"),"photo":relative,
                                "reason":kind,"kept":earlier,"metric":metric})
                continue
            selected.append(relative)
            signatures.append((relative, signature))
        if selected != before:
            changed_products.append(product.get("name"))
            if apply:
                product["images"] = selected
        counters["photosBefore"] += len(before)
        counters["photosAfter"] += len(selected)
        if len(selected) < 5:
            counters["fewerThanFive"] += 1
        if not selected:
            counters["withoutPhotos"] += 1

    report = {
        "mode":"apply" if apply else "dry-run",
        "products":len(data.get("products",[])),
        "changedProducts":len(changed_products),
        "photosBefore":counters["photosBefore"],
        "photosAfter":counters["photosAfter"],
        "removedVerifiedDuplicates":counters["duplicates"],
        "removedBrokenOrTooSmall":counters["brokenOrTooSmall"],
        "removedInvalidOrMissing":counters["invalidPath"]+counters["missing"],
        "productsWithFewerThanFive":counters["fewerThanFive"],
        "productsWithoutPhotos":counters["withoutPhotos"],
        "affectedProductNames":changed_products,
        "removedReferences":records,
        "safety":"Only the JSON image references change. Original photo files remain for rollback; no stock images are used.",
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n",encoding="utf-8")
    if apply and changed_products:
        MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2)+"\n",encoding="utf-8")
    print(json.dumps({k:v for k,v in report.items()
                      if k not in ("affectedProductNames","removedReferences")},
                     ensure_ascii=False,indent=2))
    for row in records[:15]:
        print("REMOVED" if apply else "WOULD REMOVE",row)
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply",action="store_true",
                        help="Rewrite only catalog.json image lists; do not delete photos")
    clean(apply=parser.parse_args().apply)
