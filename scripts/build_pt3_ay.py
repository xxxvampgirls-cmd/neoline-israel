#!/usr/bin/env python3
"""Lossless PT3 -> AY 50 Hz register compilation. MIT PT3 decoder in tools/pt3/."""
import pathlib, subprocess, tempfile, zlib, base64, hashlib, json
ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE=ROOT/"assets/teoria/pt3-src"
OUTPUT=ROOT/"assets/teoria/ay"
PLAYER=ROOT/"tools/pt3/pt3convert"
TRACKS={
"sonya":("Sonya VTX","55683ff1"),
"mary_jane":("Mary Jane","86293df4"),
"x_files":("X-Files","7e082adc"),
"zoolook":("Zoolook","c7c38f95"),
"downtown":("Downtown","0c2c4da1"),
"behind_the_walls":("Behind The Walls","0ad12690"),
"magnetic_fields":("Magnetic Fields","5bd97a60"),
}
def main():
 OUTPUT.mkdir(parents=True,exist_ok=True)
 manifest={"version":1,"format":"AY-3-8912 14-register frames","frameRate":50,
           "clockHz":1773400,"menu":"sonya",
           "games":[k for k in TRACKS if k!="sonya"],"tracks":{}}
 with tempfile.TemporaryDirectory() as tmp:
  for key,(name,digest_prefix) in TRACKS.items():
   src=SOURCE/(key+".z64")
   b=zlib.decompress(base64.b64decode(src.read_text().strip(),validate=True))
   digest=hashlib.sha256(b).hexdigest()
   assert digest.startswith(digest_prefix),(key,digest,digest_prefix)
   assert b.startswith(b"ProTracker 3.") and 201<=len(b)<=65536,key
   inp=pathlib.Path(tmp)/(key+".pt3");inp.write_bytes(b)
   out=OUTPUT/(key+".ay14")
   run=subprocess.run([str(PLAYER),str(inp),str(out)],check=True,timeout=20,
                      text=True,capture_output=True)
   count=out.stat().st_size//14
   assert 250<count<=50*240 and out.stat().st_size==count*14,key
   manifest["tracks"][key]={"name":name,"url":"./assets/teoria/ay/"+key+".ay14",
     "frames":count,"seconds":round(count/50,2),"source":key+".pt3",
     "sourceSha256":digest}
   print(key,count,run.stderr.strip())
 (OUTPUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
if __name__=="__main__":main()
