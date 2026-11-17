#!/usr/bin/env python3
"""Optional, budget-limited photorealistic editorial thumbnails for NEOLINE Israel.

Requires OPENAI_API_KEY in the scheduled runner. Uses original illustrative
imagery, never a claimed real photograph of a news event.
"""
from __future__ import annotations
import base64
import io
import os
import re
from pathlib import Path
import requests

SCENES={
 "accidents":"An Israeli highway at twilight with a generic stopped car, reflective warning triangle and distant blurred emergency lights. No crash victims, no identifiable people.",
 "speed":"A realistic speed monitoring camera beside a modern Israeli highway, cars in the distance, cinematic low angle.",
 "laws":"A realistic close-up of a driver's hands near a steering wheel, an out-of-focus road sign, urban Israel through the windshield; evoke updated road rules.",
 "roads":"A sweeping aerial view of an Israeli expressway, construction cones or traffic, modern overpasses, natural desert-to-city landscape.",
 "cars":"A dramatic premium automotive editorial photo of a contemporary unbranded car on a clean Israeli coastal road, realistic studio-quality reflections.",
}
API="https://api.openai.com/v1/images/generations"
MAX_WEBP_BYTES=65000

def generate_thumbnail(item:dict,dest:Path)->bool:
    key=os.environ.get("OPENAI_API_KEY","").strip()
    if not key:
        return False
    kind=item.get("category","cars")
    scene=SCENES.get(kind,SCENES["cars"])
    headline=re.sub(r"\s+"," ",str(item.get("titleOriginal","")))[:155]
    prompt=(
        "Create an extremely photorealistic professional automotive news "
        "thumbnail in the style of high-end YouTube car journalism, not a drawing. "
        "Cinematic documentary photography, natural Israeli daylight or moody "
        "blue hour, rich navy and NEOLINE blue accents, elegant contrast, "
        "compelling subject occupying the frame, realistic textures and depth, "
        "wide 16:9 composition with open space for a website headline added later. "
        "This is an ORIGINAL FICTIONAL EDITORIAL VISUALIZATION, not evidence "
        "or a reconstruction of a particular news event. Do not depict identifiable "
        "individuals or real accident victims. No words, letters, numbers, "
        "watermarks, logos, UI overlays, fake badges, or legible license plates. "
        "No cartoon, vector art, 3D toy, clipart or painting. "
        f"Scene: {scene} "
        f"Optional contextual topic only, do not assert or recreate specifics: {headline}."
    )
    try:
        r=requests.post(API,headers={
            "Authorization":"Bearer "+key,
            "Content-Type":"application/json",
        },json={
            "model":os.getenv("NEOLINE_IMAGE_MODEL","gpt-image-1-mini"),
            "prompt":prompt,
            "size":"1536x1024",
            "quality":"low",
            "n":1,
        },timeout=(15,120))
        r.raise_for_status()
        raw=r.json()["data"][0]["b64_json"]
        from PIL import Image,ImageOps
        with Image.open(io.BytesIO(base64.b64decode(raw))) as img:
            img=ImageOps.fit(img.convert("RGB"),(640,360),method=Image.Resampling.LANCZOS,centering=(.5,.5))
            for size in [(640,360),(576,324),(512,288)]:
                if img.size!=size:
                    img=img.resize(size,Image.Resampling.LANCZOS)
                for quality in (70,60,50,40):
                    buf=io.BytesIO()
                    img.save(buf,format="WEBP",quality=quality,method=6)
                    data=buf.getvalue()
                    if len(data)<=MAX_WEBP_BYTES:
                        dest.parent.mkdir(parents=True,exist_ok=True)
                        dest.write_bytes(data)
                        print(f"AI PHOTO {dest.name}: {len(data)//1024} KiB",flush=True)
                        return True
        print(f"WARN thumbnail too large: {dest.name}",flush=True)
    except (requests.RequestException,ValueError,KeyError,TypeError,ImportError,OSError) as exc:
        print(f"WARN AI thumbnail skipped for {dest.name}: {type(exc).__name__} {str(exc)[:140]}",flush=True)
    return False
