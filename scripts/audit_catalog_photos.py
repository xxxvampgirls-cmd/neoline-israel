#!/usr/bin/env python3
"""Audit locally saved product galleries without deleting any manufacturer photos.

Always inspect the image references in catalog.json. Exact duplicates are
errors; similar shots are advisory because two genuine angles can look alike.
The source image importer does the actual per-product dHash deduplication.
"""
from __future__ import annotations

import hashlib
import json
from collections import Counter
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "assets/catalog/catalog.json"
OUT = ROOT / "assets/catalog/gallery-quality.json"


def fingerprint(path: Path) -> int:
    with Image.open(path) as source:
        picture = ImageOps.exif_transpose(source)
        picture.load()
        if picture.width < 180 or picture.height < 140:
            raise ValueError(f"image too small: {picture.width}x{picture.height}")
        gray = picture.convert("L").resize((9, 8), Image.Resampling.LANCZOS)
        px = list(gray.getdata())
    bits = 0
    for y in range(8):
        for x in range(8):
            bits = (bits << 1) | int(px[y * 9 + x] > px[y * 9 + x + 1])
    return bits


def audit() -> int:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    products = data.get("products") or []
    errors: list[str] = []
    review: list[dict] = []
    count = Counter()
    checked_paths: set[str] = set()
    images_seen: dict[str, str] = {}

    for product in products:
        name = str(product.get("name", "Unknown"))
        files = product.get("images") or []
        if len(files) > 6:
            errors.append(f"{name}: more than 6 gallery entries ({len(files)})")
        if not files:
            review.append({"product": name, "reason": "No source photo"})
            continue
        fingerprints: list[tuple[str, int]] = []
        for relative in files:
            if not isinstance(relative, str) or not relative.startswith("./assets/catalog/images/"):
                errors.append(f"{name}: unsafe gallery path {relative!r}")
                continue
            path = (ROOT / relative).resolve()
            if not path.is_relative_to(ROOT / "assets/catalog/images"):
                errors.append(f"{name}: path traversal {relative!r}")
                continue
            if not path.is_file():
                errors.append(f"{name}: missing image {relative}")
                continue
            try:
                content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
                dhash = fingerprint(path)
            except (OSError, ValueError, UnidentifiedImageError) as error:
                errors.append(f"{name}: broken photo {relative}: {error}")
                continue

            count["photos"] += 1
            checked_paths.add(relative)
            # A single image can appear under multiple products only if
            # the products share the actual same file path in the manifest.
            old = images_seen.get(content_hash)
            if old is not None and old != relative:
                errors.append(f"Identical photo stored twice: {old} and {relative}")
            else:
                images_seen[content_hash] = relative

            for earlier, previous in fingerprints:
                distance = (dhash ^ previous).bit_count()
                if distance <= 4:
                    errors.append(
                        f"{name}: probable duplicate images {earlier} and {relative}, dHash={distance}"
                    )
                elif distance <= 8:
                    review.append(
                        {"product": name, "reason": "Visually similar; manual inspection needed",
                         "image_a": earlier, "image_b": relative, "hamming": distance}
                    )
            fingerprints.append((relative, dhash))
        if len(files) < 5:
            review.append({"product": name, "reason": f"Only {len(files)} source photos"})

    report = {
        "source": "assets/catalog/catalog.json",
        "products": len(products),
        "validImages": count["photos"],
        "distinctFilePaths": len(checked_paths),
        "identicalOrNearDuplicateErrors": len(errors),
        "manualReviewFlags": len(review),
        "errors": errors,
        "review": review,
        "note": "Image hashes flag only suspected duplicates, not product identity. Do not replace real views with stock images.",
    }
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k not in ("errors", "review")},
                     ensure_ascii=False, indent=2))
    for item in errors[:35]:
        print("ERROR", item)
    for item in review[:20]:
        print("REVIEW", item)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(audit())
