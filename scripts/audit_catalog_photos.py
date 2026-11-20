#!/usr/bin/env python3
"""Audit published NEOLINE gallery references: source photos only, no stock fillers."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from PIL import UnidentifiedImageError

from catalog_photo_quality import duplicate_kind, photo_signature

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "assets/catalog/catalog.json"
OUT = ROOT / "assets/catalog/gallery-quality.json"


def audit() -> int:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    products = data.get("products") or []
    errors: list[str] = []
    review: list[dict] = []
    counters = Counter()
    checked_paths: set[str] = set()
    seen_sha: dict[str, str] = {}
    signatures = {}

    for product in products:
        name = str(product.get("name", "Unknown"))
        files = product.get("images") or []
        if len(files) > 6:
            errors.append(f"{name}: more than 6 image references ({len(files)})")
        if not files:
            review.append({"product": name, "reason": "No verified photo"})
        known = []
        for relative in files:
            if not isinstance(relative, str) or not relative.startswith("./assets/catalog/images/"):
                errors.append(f"{name}: invalid source image path {relative!r}")
                continue
            path = (ROOT / relative).resolve()
            if not path.is_relative_to(ROOT / "assets/catalog/images"):
                errors.append(f"{name}: traversal path {relative!r}")
                continue
            if not path.is_file():
                errors.append(f"{name}: missing source photo {relative}")
                continue
            try:
                signature = signatures.setdefault(relative, photo_signature(path))
            except (OSError, ValueError, UnidentifiedImageError) as error:
                errors.append(f"{name}: broken/too-small source photo {relative}: {error}")
                continue
            counters["validImages"] += 1
            checked_paths.add(relative)
            # Reused photo under another path should be flagged for manual cleanup.
            previous = seen_sha.get(signature.sha)
            if previous and previous != relative:
                review.append({"product": name, "reason": "Shared photo file data across products",
                               "image_a": previous, "image_b": relative})
            else:
                seen_sha[signature.sha] = relative
            for first_path, first in known:
                kind, metric = duplicate_kind(first, signature)
                if kind in ("identical", "perceptual"):
                    errors.append(f"{name}: repeated photo {first_path} and {relative} ({kind}: {metric})")
                elif kind == "similar":
                    review.append({"product": name, "reason": "Similar photo angles; keep until reviewed",
                                   "image_a": first_path, "image_b": relative, "metric": metric})
            known.append((relative, signature))
        if len(files) < 5:
            review.append({"product": name, "reason": f"Fewer than 5 authentic photos ({len(files)})"})

    report = {
        "source": "assets/catalog/catalog.json",
        "products": len(products),
        "validImages": counters["validImages"],
        "distinctPaths": len(checked_paths),
        "confirmedDuplicatesOrBroken": len(errors),
        "manualReviewFlags": len(review),
        "errors": errors,
        "review": review,
        "note": "Perceptual matching requires both hash and low RGB difference, so distinct angles are retained.",
    }
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(json.dumps({k:v for k,v in report.items() if k not in ("errors","review")},
                     ensure_ascii=False, indent=2))
    for item in errors[:25]:
        print("ERROR",item)
    for item in review[:15]:
        print("REVIEW",item)
    return 1 if errors else 0


if __name__=="__main__":
    raise SystemExit(audit())
