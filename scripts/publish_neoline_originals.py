#!/usr/bin/env python3
"""Publish raw, unmodified ZX Spectrum tracker files from uploaded new.zip.
No conversion to PT3/MP3/MIDI. Original AY/STC/SQT/ASC/PT2/STP file bytes
are extracted verbatim so ZXTune can emulate native tracker formats.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, BadZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/teoria/source/new.zip"
DEST = ROOT / "assets/teoria/originals"
ALLOWED_ARCHIVES = {
    "eb9e6a012483eb91d4ad158f58fb4fb8b39bf616899c6616a788df24e106e532",
    "a66a0ff2689426745e0496204d4679bc613d0c800d5c0088f1f3083cdb851e05",
}
NAMES = (
 "Ghostbusters_2.ay", "Jurassic_Park.asc", "LyraII3.stc",
 "LyraII4.stc", "Navy_Seals.ay", "PARADISE.stc",
 "Shock3.stc", "Shock6.stc", "the_neverending_story.stc",
 "Tim_Follin.sqt", "VOYAGE.asc", "4x4_puzzle_Hi_.pt2",
 "63a_tdm-TDMSchivaPart2.sqt", "Batman_The_Movie.ay",
 "Cover_of_Hung_Up_by_Madonna_2xAY_ACB_.sqt",
 "dado_s_twin_peaks.stp", "Electric_city.sqt", "Galactic.pt2",
 "GALAXY2.asc",
)
EXTRAS = {"Robocop.pt3", "38_-_Axel_Force_Remix.pt3", "Batman_The_Movie_3.ay"}

def main():
    if not SOURCE.is_file():
        raise SystemExit("Upload the user-provided archive to assets/teoria/source/new.zip first")
    archive = SOURCE.read_bytes()
    if not (1000 < len(archive) < 2_000_000):
        raise ValueError("Archive size is implausible")
    digest = hashlib.sha256(archive).hexdigest()
    if digest not in ALLOWED_ARCHIVES:
        raise ValueError(f"Archive does not match the supplied original: {digest}")
    DEST.mkdir(parents=True, exist_ok=True)
    manifest = {"format": "Native ZX Spectrum music, not converted", "originalZipSha256": digest, "files": []}
    try:
        with ZipFile(SOURCE) as zipfile:
            filenames = zipfile.namelist()
            if len(filenames) != len(set(filenames)):
                raise ValueError("Duplicate ZIP members")
            if not set(NAMES).issubset(filenames) or set(filenames) - set(NAMES) - EXTRAS:
                raise ValueError("Archive does not contain the 19 expected original tracker files")
            for name in NAMES:
                info = zipfile.getinfo(name)
                if info.is_dir() or info.file_size > 100000:
                    raise ValueError(f"Bad module entry: {name}")
                data = zipfile.read(name)
                if not data or len(data) != info.file_size:
                    raise ValueError(f"Empty or truncated file: {name}")
                # ZIP contents are only written for whitelisted literal basenames.
                target = DEST / name
                target.write_bytes(data)
                manifest["files"].append({
                    "name": name,
                    "format": target.suffix[1:].upper(),
                    "bytes": len(data),
                    "sha256": hashlib.sha256(data).hexdigest(),
                    "url": "./assets/teoria/originals/" + name,
                })
    except BadZipFile as exc:
        raise ValueError("Invalid original ZIP archive") from exc
    (DEST / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False)+"\n",encoding="utf-8")
    print(f"Published {len(NAMES)} original ZX tunes without conversion. Source SHA256: {digest}")

if __name__ == "__main__":
    main()
