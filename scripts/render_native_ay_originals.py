#!/usr/bin/env python3
"""Render untouched native ZX tracker files to 50-Hz AY register snapshots.
This is a playback cache, NOT conversion to PT3 and NOT a new arrangement.
ZXTune's native tracker/Z80 decoders generate PSG write logs; we preserve
R0..R13 commands and the envelope retrigger state for our existing AY core.
Always keep the original .ay/.asc/.stc/.sqt/.stp/.pt2 files in the repo.
"""
from __future__ import annotations
import argparse
import json
import pathlib
import re
import subprocess
import tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCES=ROOT/"assets/teoria/originals"
TARGET=ROOT/"assets/teoria/ay-originals"
MAX_FRAMES=50*600

def key_of(filename: str) -> str:
    return "orig_"+re.sub(r"[^a-z0-9]+","_",filename.lower()).strip("_")

def psg_to_ay14(data: bytes) -> bytes:
    if len(data)<17 or data[:4]!=b"PSG\x1a":
        raise ValueError("No classic PSG\\x1a register stream header")
    registers=bytearray(14)
    registers[7]=0x3f
    frames=bytearray()
    r13_dirty=False
    def frame():
        nonlocal r13_dirty
        if len(frames)>=MAX_FRAMES*14:
            raise ValueError("PSG over ten-minute safety bound")
        row=bytearray(registers)
        if not r13_dirty:row[13]=0xff
        frames.extend(row)
        r13_dirty=False
    i=16
    ended=False
    while i<len(data):
        code=data[i];i+=1
        if code==0xff:
            frame()
        elif code==0xfe:
            if i>=len(data):raise ValueError("truncated PSG delay")
            ticks=data[i] or 256;i+=1
            for _ in range(ticks):frame()
        elif code==0xfd:
            ended=True;break
        else:
            if i>=len(data):raise ValueError("truncated PSG register")
            value=data[i];i+=1
            if code<=13:
                registers[code]=value
                if code==13:r13_dirty=True
    if not ended:frame()
    if len(frames)<14*50*3:raise ValueError("PSG shorter than three seconds")
    if not any(frames[i+8] or frames[i+9] or frames[i+10] for i in range(0,len(frames),14)):
        raise ValueError("All volume channels silent")
    return bytes(frames)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--zxtune",default="zxtune123")
    args=ap.parse_args()
    input_manifest=json.loads((SOURCES/"manifest.json").read_text(encoding="utf-8"))
    TARGET.mkdir(parents=True,exist_ok=True)
    tracks={}
    failures={}
    with tempfile.TemporaryDirectory() as temp:
        for song in input_manifest["files"]:
            filename=song["name"]
            # A TurboSound 2 x AY module cannot be stored in one 14-register
            # stream. Until 2-chip emulation is built, don't silently flatten it.
            if "2xAY" in filename:
                failures[filename]="Two AY chips (6 channels) need a dual-chip player"
                continue
            src=SOURCES/filename
            if not src.is_file():
                failures[filename]="Original source not found";continue
            identifier=key_of(filename)
            work=pathlib.Path(temp)/identifier;work.mkdir()
            outfile=work/"music.psg"
            cmd=[args.zxtune,"--convert","mode=psg,filename=music.psg",str(src.resolve())]
            try:
                run=subprocess.run(cmd,cwd=work,text=True,stdout=subprocess.PIPE,
                                   stderr=subprocess.STDOUT,timeout=90)
                candidates=list(work.rglob("*.psg"))
                if run.returncode or not candidates:
                    raise RuntimeError("ZXTune output: "+run.stdout[-350:])
                data=psg_to_ay14(candidates[0].read_bytes())
                target=TARGET/(identifier+".ay14")
                target.write_bytes(data)
                tracks[identifier]={
                    "id":identifier,"name":filename.rsplit(".",1)[0].replace("_"," "),
                    "file":filename,"url":"./assets/teoria/ay-originals/"+identifier+".ay14",
                    "frames":len(data)//14,"seconds":round(len(data)/14/50,2),
                    "originalFormat":song["format"]
                }
                print("OK",filename,len(data)//14,"frames",flush=True)
            except Exception as exc:
                failures[filename]=str(exc)[:250]
                print("SKIP",filename,failures[filename],flush=True)
    manifest={"version":1,"format":"AY-3-8912 14-register 50Hz playback cache",
      "note":"Tracks are not converted to PT3; originals remain intact.",
      "clockHz":1773400,"frameRate":50,
      "tracks":tracks,"failures":failures}
    (TARGET/"manifest.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    if not tracks:raise RuntimeError("No original tracks decoded; do not publish an empty playlist")
    print("Successfully decoded",len(tracks),"; failed/skipped",len(failures))

if __name__=="__main__":main()
