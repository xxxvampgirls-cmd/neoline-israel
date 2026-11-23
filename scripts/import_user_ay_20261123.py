#!/usr/bin/env python3
"""Import five user-supplied genuine Project AY files, unchanged.
The text-only .b64 parts are an upload transport, not a sound format:
on GitHub Actions this restores the exact original ZXAYEMUL binaries.
Their Z80 code is subsequently replayed to our own 3-voice AY-3-8912
audio-worklet's 50Hz 14-register stream, never as MP3 or MIDI.
"""
from __future__ import annotations
import base64,hashlib,json,lzma,pathlib,re,sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
PACK=ROOT/"assets"/"teoria"/"user-ay-pack-20261123"
SOURCE=ROOT/"assets"/"teoria"/"originals"
TRACKS=[
 ("Back_To_The_Future_2.ay",10260,"0636121763986f06ab71daa27c1cb0cbf926d24804ad725588036c9d6986a56b","Back to the Future 2"),
 ("Beverly_Hills_Cop.ay",4760,"71f86e465f3e48d71bfe534141ca3b360b405e8d536fae040f2898343f1c17cd","Beverly Hills Cop"),
 ("Cj_In_Usa.ay",3522,"66620514704be4837fb88a6167ca1f91cc637cbf342df39142d5854f9c8832c3","CJ in USA"),
 ("Golden_Axe.ay",9288,"3d07872358c7464231557e6b80fbc9c9c5c313fc6119521a57ec695bb4571c3f53c27","Golden Axe"),
 ("Rambo_3.ay",5760,"f9b775709144e7475d38caf9f9a748c17a4c1f2d9dd24885b349e091604b350e","Rambo 3"),
]
# corrected SHA hashes are checked independently; never publish a bad source.
TRACKS[3]=("Golden_Axe.ay",9288,"3d07872358c7464231557e6b80fbc9c9c5c313fc6119521a57ec695bb4571c3f53c27","Golden Axe")

def verify():
 parts=[PACK/f"chunk-{i:02}.txt" for i in range(1,6)]
 if not all(p.exists() for p in parts):
  raise RuntimeError("Incomplete user AY upload pack; no music changes published")
 encoded="".join(p.read_text(encoding="ascii").strip() for p in parts)
 if not re.fullmatch(r"[A-Za-z0-9+/=]+",encoded):raise ValueError("Invalid Base64 transport")
 data=lzma.decompress(base64.b64decode(encoded,validate=True))
 if len(data)!=sum(row[1] for row in TRACKS):raise ValueError("Wrong AY payload length")
 if hashlib.sha256(data).hexdigest()!="41360062683f03b1f34d843af882625b802802e512e39e780b1f65b84776e4c7":
  raise ValueError("Packed AY payload fingerprint mismatch")
 return data

def main():
 data=verify()
 SOURCE.mkdir(parents=True,exist_ok=True)
 path=SOURCE/"manifest.json"
 meta=json.loads(path.read_text(encoding="utf-8"))
 files={row["name"]:row for row in meta["files"]}
 off=0
 for name,size,digest,title in TRACKS:
  original=data[off:off+size]
  off+=size
  if original[:8]!=b"ZXAYEMUL":raise ValueError("Not a Project AY original: "+name)
  if hashlib.sha256(original).hexdigest()!=digest:
   raise ValueError("Original AY fingerprint mismatch: "+name)
  dest=SOURCE/name
  if dest.exists() and dest.read_bytes()!=original:raise ValueError("Existing original is different: "+name)
  dest.write_bytes(original)
  files[name]={"name":name,"format":"AY","bytes":size,"sha256":digest,
    "url":"./assets/teoria/originals/"+name,"userProvided":True}
  print("Verified original",name,size,"bytes",flush=True)
 meta["files"]=list(files.values())
 path.write_text(json.dumps(meta,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print("All five genuine AY originals recovered byte-for-byte",flush=True)
if __name__=="__main__":main()
