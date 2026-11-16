#!/usr/bin/env python3
"""Create true transparent PNGs from original NEOLINE product photos.

No AI redraw: only pixels from the original image are retained. The background
mask is applied ONLY if a photo has a near-white background across its edges.
Images without an obvious white background are skipped rather than damaged.
"""
from __future__ import annotations
import io
import json
from pathlib import Path
import sys
from urllib.parse import urlparse

import cv2
import numpy as np
import requests
from PIL import Image, ImageOps, UnidentifiedImageError

PHOTOS = {
  "1": [
    "https://neoline.ru/upload/iblock/33a/zyf5s1j6fgp8a3prqvn0ttov631sq405/%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5_2024-12-16_122806231.png",
    "https://api.technodom.kz/f3/api/v1/images/800/800/289027_4.jpg"
  ],
  "2": [
    "https://cdn.vseinstrumenti.ru/images/goods/oborudovanie-dlya-avtoservisa-i-garazha/avtoaksessuary/13050101/1000x1000/159630689.jpg",
    "https://object.pscloud.io/cms/cms/Photo/img_0_427_262_0_1_dYkFnH.webp",
    "https://neoline.ru/upload/medialibrary/689/cr0q2twe3153h33sgnh75ko2rwxwmfgu/004_Wi-Fi_Flash-2k.jpg"
  ],
  "3": [
    "https://asset.openshop.uz/uploads/products/photos/202506/PFAaXfmxx0BNoFwWySHCvX1EG5JKq1QH.png",
    "https://neoline.ru/upload/iblock/b1b/r2vwocxdqsua6u0m0oefckdmp0wnxz89/013.jpg"
  ],
  "4": [
    "https://castore.uz/upload/iblock/4d0/x0ya56x9jmgus4wfg54z3892m36emf4v/videoregistrator-neoline-easydrive-2k-wi-fi-dual-1.jpg",
    "https://neoline.ru/upload/medialibrary/6ae/54l95tybosr8801542sar8qtjcx1ogs1/013_%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0.jpg",
    "https://neoline.ru/upload/medialibrary/6c6/gcpvf3aqp7jw564sl9ld03q3ax0t7qi2/007_%D0%90%D1%81%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BD%D1%82-%D0%BF%D0%B0%D1%80%D0%BA%D0%BE%D0%B2%D0%BA%D0%B8_Easydrive-2K-Dual.jpg"
  ],
  "5": [
    "https://audiohead.ru/upload/iblock/aa2/2pi1vc865undgluyx4mwgzgovzzhk05a/neoline_argus_4k_3288405_2.jpg",
    "https://www.prekesvisiems.lt/images/uploader/ne/1188x1188.g/neoline-argus-4k-3-1.png?v=1727885369"
  ],
  "6": [
    "https://neoline.ru/upload/iblock/18e/inssnto8g0d3gybtezvvy1hbmmj1vjje/016.jpg",
    "https://cdn1.technopark.ru/technopark/photos_resized/product/1000_1000/769957/5_769957.jpg"
  ],
  "7": [
    "https://neoline.ru/upload/iblock/da2/nrtlbv473vk4nrmsit0x2t3qbjv2jx35/SmartWay.jpg",
    "https://neoline.ru/upload/iblock/c6f/kgydmlt250snwdpq882f5rdhswp9lj7w/Smartway8.jpg"
  ],
  "8": [
    "https://neoline.ru/upload/medialibrary/08b/b3mhp2ticqj9w5pr56ae01htbh9if4tc/%D0%9A%D0%BE%D0%BF%D0%B8%D1%8F%20000%20%28%D0%B2%29.jpg"
  ]
}
OUT = Path("assets/transparent")
MAX_BYTES = 12_000_000
S = requests.Session()
S.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; NEOLINE-Showroom/1.0; product-photo-processing)",
    "Accept": "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
})


def fetch_image(url: str) -> Image.Image:
    assert urlparse(url).scheme == "https"
    with S.get(url, timeout=(10, 25), stream=True, allow_redirects=True) as response:
        response.raise_for_status()
        buf = io.BytesIO()
        for part in response.iter_content(65536):
            buf.write(part)
            if buf.tell() > MAX_BYTES:
                raise ValueError("Photo exceeds maximum permitted size")
        img = Image.open(io.BytesIO(buf.getvalue()))
        img.load()
        if img.width < 250 or img.height < 200 or img.width * img.height > 16_000_000:
            raise ValueError(f"Unexpected photo dimensions: {img.size}")
        return ImageOps.exif_transpose(img).convert("RGB")


def remove_near_white_background(source: Image.Image) -> Image.Image | None:
    """Flood-fill only near-white pixels touching the outer image edge."""
    if max(source.size) > 1800:
        source.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
    rgb = np.asarray(source, dtype=np.uint8)
    h, w = rgb.shape[:2]
    strip = max(2, min(h, w) // 90)
    edge = np.concatenate((rgb[:strip,:,:].reshape(-1,3),
                           rgb[-strip:,:,:].reshape(-1,3),
                           rgb[:,:strip,:].reshape(-1,3),
                           rgb[:,-strip:,:].reshape(-1,3)), axis=0)
    bright = (edge.min(axis=1) >= 230) & ((edge.max(axis=1).astype(int) - edge.min(axis=1).astype(int)) < 20)
    if np.mean(bright) < 0.63:
        return None

    base_color = np.median(edge[bright].astype(np.float32), axis=0)
    delta = np.max(np.abs(rgb.astype(np.float32) - base_color), axis=2)
    light = np.min(rgb, axis=2) >= 216
    mask = (light & (delta < 38)).astype(np.uint8)
    n, labels = cv2.connectedComponents(mask, connectivity=8)
    rim = np.concatenate((labels[0],labels[-1],labels[:,0],labels[:,-1]))
    indexes = np.bincount(rim[rim>0], minlength=n)
    bg_labels = np.flatnonzero(indexes>max(100,0.005*(2*w+2*h)))
    if not len(bg_labels):
        return None
    bg = np.isin(labels,bg_labels).astype(np.uint8)
    coverage=float(bg.mean())
    if coverage < 0.17 or coverage > 0.965:
        return None

    alpha = (1-bg)*255
    # Subpixel matte at the silhouette boundary.
    alpha = cv2.GaussianBlur(alpha.astype(np.uint8),(3,3),0.55)
    rgba = np.dstack((rgb, alpha))
    image = Image.fromarray(rgba,"RGBA")
    bounds = Image.fromarray(alpha).getbbox()
    if not bounds:
        return None
    x0,y0,x1,y1 = bounds
    padx = max(12,int((x1-x0)*0.07)); pady = max(12,int((y1-y0)*0.07))
    return image.crop((max(0,x0-padx),max(0,y0-pady),
                       min(w,x1+padx),min(h,y1+pady)))


def main() -> int:
    OUT.mkdir(parents=True,exist_ok=True)
    manifest={"version":1,"models":{}}
    successes=0
    for model_id, options in PHOTOS.items():
        dest=OUT/f"neoline-{int(model_id):02d}.png"
        for url in options:
            try:
                src=fetch_image(url)
                output=remove_near_white_background(src)
                if output is None:
                    print(f"SKIP model {model_id}: source has no clean white background {url[:75]}")
                    continue
                output.save(dest,format="PNG",optimize=True)
                manifest["models"][model_id]={"path":f"./assets/transparent/{dest.name}","source":url}
                successes+=1
                print(f"OK model {model_id}: {dest}, image {output.size}")
                break
            except (requests.RequestException,UnidentifiedImageError,ValueError,OSError) as exc:
                print(f"WARN model {model_id}: {type(exc).__name__}: {str(exc)[:145]}")
        else:
            print(f"NO ASSET model {model_id}: retaining the original photo URLs")
    if successes:
        (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Created transparent assets: {successes}/{len(PHOTOS)}")
    return 0 if successes else 1


if __name__ == "__main__":
    sys.exit(main())
