"""Conservative NEOLINE catalog promo-banner guard.

A user's screenshot showed a blue "Бесплатный самовывоз день в день"
shipping advertisement as the third photograph of Power Cord Hybrid.
These banners are not product photos and must never be re-imported.

No OCR is used. We reject manually confirmed files, explicitly named
advertising media, and unambiguously wide saturated banner artwork.
Ambiguous images remain untouched for human review.
"""
from __future__ import annotations

import hashlib
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps

# Git blob SHA-1 of the actual ad bytes seen in the user's screenshot.
# Do not blacklist a file *number*: if a third real photograph is later
# added to Power Cord Hybrid, it must remain visible.
CONFIRMED_BAD_BLOB_IDS = {
    "4e7c915a04ec4ac931d9d01abe207691357f8774",
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
    """Recognize the real advertising file by its bytes, not by image slot."""
    path = Path(str(ref))
    if not path.is_file():
        return False
    try:
        data = path.read_bytes()
    except OSError:
        return False
    # Git's SHA identifies the actual, original picture content.
    data_hash = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\\0" + data).hexdigest()
    return data_hash in CONFIRMED_BAD_BLOB_IDS


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
