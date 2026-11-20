"""Conservative NEOLINE catalog promo-banner guard.

A user's screenshot showed a blue "Бесплатный самовывоз день в день"
shipping advertisement as the third photograph of Power Cord Hybrid.
These banners are not product photos and must never be re-imported.

No OCR is used. We reject manually confirmed files, explicitly named
advertising media, and unambiguously wide saturated banner artwork.
Ambiguous images remain untouched for human review.
"""
from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps

# Specifically confirmed by the NEOLINE user on 2026-11-20.
CONFIRMED_BAD_REFERENCES = {
    "951833046070-3.webp",
}
PROMO_TERMS = re.compile(
    r"(?:самовывоз|бесплатн.{0,20}(?:доставк|самовывоз)|"
    r"баннер|банер|скидк|распродаж|получи\s+подарок|"
    r"free[_-]?pickup|same[_-]?day|free[_-]?delivery|"
    r"shipping[_-]?banner|promo[_-]?banner|delivery[_-]?banner|"
    r"reklama|advert[_-]?banner)",
    re.I,
)


def banned_reference(ref: str) -> bool:
    """Exact manually confirmed files, not all third photos."""
    return Path(str(ref)).name in CONFIRMED_BAD_REFERENCES


def promotional_url(url: str) -> bool:
    """Reject URLs with explicit marketing terms, not URLs for a model photo."""
    try:
        path = unquote(urlsplit(url).path).replace("-", "_").replace("%20", " ")
        return bool(PROMO_TERMS.search(path))
    except (TypeError, ValueError):
        return False


def banner_diagnosis(image: Image.Image) -> tuple[str | None, dict]:
    """Check original pixels BEFORE transparent-background conversion.

    Very wide colorful artwork is strongly associated with full-width
    promotional strips. White-background elongated cables remain untouched.
    """
    image = ImageOps.exif_transpose(image)
    width, height = image.size
    aspect = round(width / max(height, 1), 3)
    stats = {"width": width, "height": height, "ratio": aspect}
    if width < 180 or height < 100:
        return None, stats
    if aspect < 2.22:
        return None, stats
    # Sample actual banner artwork; requiring large, colorful area prevents
    # rejecting legitimate long cables on a white/transparent background.
    base = Image.new("RGBA", image.size, (255, 255, 255, 255))
    base.alpha_composite(image.convert("RGBA"))
    grid = base.convert("RGB")
    grid.thumbnail((180, 70), Image.Resampling.BILINEAR)
    rgb = list(grid.getdata())
    if not rgb:
        return None, stats
    saturated = 0
    white = 0
    for r, g, b in rgb:
        v = max(r, g, b)
        low = min(r, g, b)
        chroma = (v - low) / max(v, 1)
        if chroma >= 0.36 and v >= 55 and low <= 185:
            saturated += 1
        if min(r, g, b) > 228 and max(r, g, b) - min(r, g, b) < 23:
            white += 1
    stats["saturated_fraction"] = round(saturated / len(rgb), 3)
    stats["white_fraction"] = round(white / len(rgb), 3)
    if stats["saturated_fraction"] >= 0.58 and stats["white_fraction"] <= 0.32:
        return "wide saturated promotional graphic", stats
    return None, stats


def classify_file(path: Path) -> tuple[str | None, dict]:
    if banned_reference(str(path)):
        return "user-confirmed promotional banner", {"reference": path.name}
    with Image.open(path) as img:
        return banner_diagnosis(img)
