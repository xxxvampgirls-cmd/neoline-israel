"""Conservative image similarity for NEOLINE product galleries.

White/transparent backgrounds can make naive whole-image dHash report unrelated
product angles as identical. Compare actual rendered RGB appearance as well.
"""
from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

SIZE = 128


@dataclass(frozen=True)
class Photo:
    sha: str
    dhash: int
    pixels: bytes
    width: int
    height: int


def _compose(path: Path) -> tuple[Image.Image, int, int]:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        image.load()
        width, height = image.size
        if width < 180 or height < 140:
            raise ValueError(f"image is too small for a product gallery: {width}x{height}")
        rgba = image.convert("RGBA")
        alpha = rgba.getchannel("A")
        had_alpha = alpha.getextrema()[0] < 250
        base = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        base.alpha_composite(rgba)
        rgb = base.convert("RGB")
        if had_alpha:
            box = alpha.point(lambda x: 255 if x > 20 else 0).getbbox()
        else:
            delta = ImageChops.difference(rgb, Image.new("RGB", rgb.size, "white"))
            box = delta.convert("L").point(lambda x: 255 if x > 22 else 0).getbbox()
        if box:
            x0, y0, x1, y1 = box
            if (x1 - x0) * (y1 - y0) > width * height * .02:
                margin = max(6, round(min(width, height) * .025))
                rgb = rgb.crop((max(0, x0-margin), max(0, y0-margin),
                                min(width, x1+margin), min(height, y1+margin)))
        return rgb, width, height


def _dhash(image: Image.Image) -> int:
    gray = image.convert("L").resize((9, 8), Image.Resampling.LANCZOS)
    px = list(gray.getdata())
    value = 0
    for y in range(8):
        for x in range(8):
            value = (value << 1) | int(px[y*9+x] > px[y*9+x+1])
    return value


def photo_signature(path: Path) -> Photo:
    sha = hashlib.sha256(path.read_bytes()).hexdigest()
    rgb, width, height = _compose(path)
    rgb.thumbnail((SIZE, SIZE), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (SIZE, SIZE), "white")
    canvas.paste(rgb, ((SIZE-rgb.width)//2,(SIZE-rgb.height)//2))
    return Photo(sha=sha,dhash=_dhash(canvas),pixels=canvas.tobytes(),
                 width=width,height=height)


def duplicate_kind(one: Photo, two: Photo) -> tuple[str, float]:
    if one.sha == two.sha:
        return "identical", 0.
    distance = (one.dhash ^ two.dhash).bit_count()
    if distance > 7:
        return "distinct", float(distance)
    # A tiny hash distance alone is never grounds to delete a different view.
    diff = sum(abs(a-b) for a,b in zip(one.pixels,two.pixels)) / len(one.pixels)
    if distance <= 4 and diff <= 11.0:
        return "perceptual", round(diff, 2)
    return "similar", round(diff, 2)
