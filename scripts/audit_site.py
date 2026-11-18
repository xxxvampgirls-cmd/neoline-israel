#!/usr/bin/env python3
"""Static NEOLINE deployment integrity audit. No network or extra packages."""
from __future__ import annotations

import collections
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "news.html", "hot.html", "delivery.html", "teoria.html")
ASSET_DIRS = ("assets/catalog/images", "assets/news/images", "assets/transparent")
errors: list[str] = []
warnings: list[str] = []


def verify(value: bool, message: str) -> None:
    if not value:
        errors.append(message)


def local_resource(raw: str) -> Path | None:
    raw = raw.strip()
    if not raw or raw.startswith(("#", "data:", "javascript:", "blob:", "//")):
        return None
    parsed = urlparse(raw)
    if parsed.scheme or parsed.netloc:
        return None
    candidate = unquote(parsed.path).lstrip("/")
    if not candidate or candidate == ".":
        return None
    path = Path(candidate)
    if ".." in path.parts:
        errors.append("Unsafe path: " + raw)
        return None
    return ROOT / path


class References(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.resources: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in ("script", "img", "link", "source"):
            return
        values = dict(attrs)
        key = "src" if tag in ("script", "img", "source") else "href"
        value = values.get(key)
        if value:
            self.resources.append(value)


def deep_strings(value: object):
    if isinstance(value, dict):
        for obj in value.values():
            yield from deep_strings(obj)
    elif isinstance(value, list):
        for obj in value:
            yield from deep_strings(obj)
    elif isinstance(value, str):
        yield value


def check_pages() -> None:
    for page in PAGES:
        file = ROOT / page
        verify(file.is_file(), "Missing page: " + page)
        if not file.is_file():
            continue
        html = file.read_text("utf-8")
        parsed = References()
        parsed.feed(html)
        for raw in parsed.resources:
            path = local_resource(raw)
            if path is not None and not path.is_file():
                errors.append(f"{page}: missing static asset {raw}")
        verify('site-header.css' in html and 'site-header.js' in html,
               page + ": shared header assets not linked")
        verify('assets/flag-israel.svg' in html,
               page + ": corrected Israel flag icon not referenced")
        verify('neoline-site-header__cart' in html,
               page + ": compact shopping-bag control missing")
        verify('neoline-site-header__flags' in html,
               page + ": header language switcher missing")
        verify('M18 7.6 23.4 16.4' not in html,
               page + ": old malformed six-point star found")
        verify('← На главную' not in html.split("</header>")[0],
               page + ": obsolete header back link reappeared")
        dock = re.search(r'<nav class="(?:mobile-nav|news-bottom|theory-bottom|delivery-nav)"[\s\S]*?</nav>', html)
        verify(dock is not None, page + ": bottom navigation missing")
        if dock:
            items = len(re.findall(r'<(?:a|button)\b', dock.group()))
            verify(items == 5, f"{page}: expected 5 bottom tabs, got {items}")


def check_json_assets() -> None:
    for name in ("assets/catalog/catalog.json", "assets/news/news.json",
                 "assets/transparent/manifest.json"):
        path = ROOT / name
        verify(path.is_file(), "Missing data file: " + name)
        if not path.is_file():
            continue
        try:
            payload = json.loads(path.read_text("utf-8"))
        except (ValueError, OSError) as exc:
            errors.append(f"{name}: JSON is invalid ({exc})")
            continue
        for value in deep_strings(payload):
            if "assets/" not in value:
                continue
            idx = value.find("assets/")
            ref = value[idx:]
            if not re.match(r"assets/[\w./-]+\.(?:webp|png|jpe?g|svg)(?:[?#].*)?$", ref, re.I):
                continue
            image = local_resource(ref)
            if image is not None and not image.is_file():
                errors.append(f"{name}: missing referenced image {ref}")


def report_assets() -> None:
    by_hash: dict[str, list[Path]] = collections.defaultdict(list)
    total = 0
    count = 0
    for folder in ASSET_DIRS:
        for file in (ROOT / folder).glob("*"):
            if not file.is_file() or file.suffix.lower() not in (".png", ".webp", ".jpg", ".jpeg"):
                continue
            count += 1
            total += file.stat().st_size
            by_hash[hashlib.sha256(file.read_bytes()).hexdigest()].append(file)
    doubles = [paths for paths in by_hash.values() if len(paths) > 1]
    potential = sum(sum(file.stat().st_size for file in paths[1:]) for paths in doubles)
    print(f"Assets: {count} image files, {total / 1048576:.2f} MiB; "
          f"{len(doubles)} groups of identical bytes, {potential / 1024:.0f} KiB potential.")
    print("Identical files are NOT automatically deleted: their paths are used by manifests.")


def main() -> int:
    check_pages()
    check_json_assets()
    flag = ROOT / "assets/flag-israel.svg"
    if flag.is_file():
        svg = flag.read_text("utf-8")
        verify('M18 7.1 23 15.8H13z' in svg and 'M13 9.1h10L18 17z' in svg,
               "Correct six-pointed Star of David is missing from vector flag")
    else:
        errors.append("Missing corrected Israel flag SVG")
    report_assets()
    print("Checked pages:", ", ".join(PAGES))
    for warning in warnings:
        print("WARN:", warning)
    for error in errors:
        print("ERROR:", error)
    if errors:
        print("FAIL:", len(errors), "errors")
        return 1
    print("PASS: page navigation, shared header, local assets and JSON references")
    return 0


if __name__ == "__main__":
    sys.exit(main())
