#!/usr/bin/env python3
"""Rebuild NEOLINE Theory CSS/JS bundles without altering original source order.
Called by GitHub Actions whenever an original game style/script changes.
Original source files remain in the repository for review and rollback.
"""
from __future__ import annotations

import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
PAGE = ROOT / "teoria.html"

CSS = """
teoria.css
teoria-dashboard.css
nav-current.css
site-header.css
teoria-redesign.css
teoria-gifts.css
teoria-gift-reveal.css
teoria-gift-blue.css
teoria-gift-depth.css
teoria-gift-storyboard.css
teoria-gift-stars-blue-glow.css
teoria-gift-firework-fast.css
teoria-v2.css
teoria-compact-v3.css
teoria-reference-art.css
teoria-medal-ecg.css
teoria-licence-dialog.css
teoria-sign-studio.css
teoria-game-dock4-road9.css
teoria-ar.css
teoria-gameover-ice.css
teoria-progress-centered.css
teoria-photo-soft-fade.css
teoria-daily.css
teoria-hero-promo.css
teoria-question-unfold.css
teoria-progress-compact.css
nav-unified-size.css
teoria-gta6-style.css
teoria-vice-cinematic.css
teoria-vice-reference-match.css
teoria-vice-final-polish.css
teoria-vice-live-reference.css
teoria-vice-radar-wasted.css
teoria-vice-ay128-audio.css
teoria-vice-neon-route-slide.css
teoria-slide-frame-air.css
teoria-vice-boot.css
teoria-vice-sunset-boulevard.css
teoria-vice-soundtrack.css
""".split()

JS = """
teoria-ar.js
teoria-dashboard.js
teoria.js
teoria-v2.js
teoria-gifts.js
teoria-gift-reveal.js
teoria-licence-dialog.js
teoria-game-dock4-road9.js
teoria-ar-ui.js
nav-current.js
site-header.js
teoria-hero-promo.js
teoria-gta6-style.js
teoria-vice-cinematic.js
teoria-vice-radar-wasted.js
teoria-pt3-decoder.js
teoria-vice-ay128-psg.js
teoria-vice-soundtrack.js
teoria-vice-boot.js
""".split()


def bundle(kind: str, batch: list[str], index: int, total: int) -> str:
    path = ROOT / f"teoria-optimized-{index:02d}.{kind}"
    parts = [f"/* NEOLINE auto-bundle {kind.upper()} {index}/{total}; exact original order. Do not edit. */\n"]
    for filename in batch:
        file = ROOT / filename
        if not file.is_file():
            raise FileNotFoundError(f"Missing original {filename}")
        content = file.read_text(encoding="utf-8")
        if kind == "css" and (index != 1 or filename != "teoria.css"):
            if re.search(r"^\s*@(import|charset|namespace)\b", content, flags=re.M):
                raise ValueError(f"Cannot merge CSS late @import/charset from {filename}")
        if kind == "js":
            # Every source has its own IIFE; keep each execution boundary.
            parts.append(f"\n/* SOURCE: {filename} */\n;\n{content}\n;\n")
        else:
            parts.append(f"\n/* SOURCE: {filename} */\n{content}\n")
    output = "".join(parts)
    path.write_text(output, encoding="utf-8")
    fingerprint = hashlib.sha256(output.encode("utf-8")).hexdigest()[:12]
    return fingerprint


def update_version(html: str, kind: str, index: int, digest: str) -> str:
    basename = f"teoria-optimized-{index:02d}.{kind}"
    # Preserve the link position, so CSS cascade and JS execution order stay intact.
    pattern = rf'((?:href|src)="\./{re.escape(basename)}\?v=)[^"]+'
    updated, count = re.subn(pattern, lambda m: m.group(1) + digest, html)
    if count != 1:
        raise ValueError(f"Expected exactly one active reference to {basename}; got {count}")
    return updated


def main() -> None:
    assert len(CSS) == 40 and len(JS) == 19
    html = PAGE.read_text(encoding="utf-8")
    css_chunks = [CSS[n:n + 10] for n in range(0, len(CSS), 10)]
    js_chunks = [JS[n:n + 10] for n in range(0, len(JS), 10)]
    for kind, chunks in [("css", css_chunks), ("js", js_chunks)]:
        for i, names in enumerate(chunks, 1):
            digest = bundle(kind, names, i, len(chunks))
            html = update_version(html, kind, i, digest)
            print(f"{kind} bundle {i}: {len(names)} original files, hash {digest}")
    PAGE.write_text(html, encoding="utf-8")
    print("Ready: 40 stylesheets → 4; 19 scripts → 2; original sources unchanged.")


if __name__ == "__main__":
    main()
