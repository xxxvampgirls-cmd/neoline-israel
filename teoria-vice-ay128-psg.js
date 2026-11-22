/* NEOLINE Theory GTA VI Style — register-controlled AY-3-8912 audio.
   Music: 50 Hz R0–R13 PSG register frames. Effects steal channel C,
   using the same 3-tone + shared-noise virtual chip. NO MP3/MIDI playback.
   Original notes, no copyrighted Ocean or Rockstar recordings. */
(()=>{
"use strict";
if(window.__neolineViceAudio)return;
window.__neolineViceAudio=true;
const root=document.documentElement;
const Ctx=window.AudioContext||window.webkitAudioContext;
const KEY_MUSIC="neoline.vice.ay128.music.v1", KEY_SFX="neoline.vice.ay128.sfx.v1";
const byId=id=>document.getElementById(id);
const isVice=()=>root.dataset.viceTheme==="on";
const giftDialog=byId("gameGiftDialog");
const giftOpen=()=>!!giftDialog?.open;
const audioAllowed=()=>isVice()||giftOpen();
const getSaved=(key,defaultValue)=>{try{const s=localStorage.getItem(key);return s===null?defaultValue:s!=="0"}catch(_){return defaultValue}};
const save=(key,on)=>{try{localStorage.setItem(key,on?"1":"0")}catch(_){}};
let musicOn=getSaved(KEY_MUSIC,true),sfxOn=getSaved(KEY_SFX,true);
let ctx=null,node=null,boot=null,audioError=false;
let tapeLoading=false,tapeHolding=false,tapeDurationMs=5600;
let scene="menu",currentMode=null,loadedScene=null;
let lastDone=-1,lastHover=0,lastClick=0,lastTheme=isVice();
const CLOCK=1773400,FPS=50;
const names={
 ru:{music:"Музыка",effects:"Эффекты",on:"вкл.",off:"выкл.",tap:"Нажмите, чтобы включить звук",unavailable:"AY недоступен"},
 en:{music:"Music",effects:"Effects",on:"on",off:"off",tap:"Tap to enable AY",unavailable:"AY not available"},
 he:{music:"מוזיקה",effects:"אפקטים",on:"פעיל",off:"כבוי",tap:"לחץ להפעלת צליל",unavailable:"AY לא זמין"},
 ar:{music:"موسيقى",effects:"مؤثرات",on:"تشغيل",off:"إيقاف",tap:"اضغط لتشغيل الصوت",unavailable:"AY غير متاح"}
};
const labels=()=>names[(root.lang||"ru").split("-")[0]]||names.ru;
const semitones={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function notePeriod(note){
 if(!note||note==="-")return 0;
 if(typeof note==="number")return Math.max(1,Math.min(4095,Math.round(note)));
 const m=/^([A-G])([#b]?)([0-8])$/.exec(note);
 if(!m)return 0;
 const midi=(+m[3]+1)*12+semitones[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0);
 const hz=440*Math.pow(2,(midi-69)/12);
 return Math.min(4095,Math.max(1,Math.round(CLOCK/(16*hz))));
}
// Tracker originals replay through an AY register stream, never synthesized.
const GAME_MODES=new Set(["route","signs","exam","mistakes","marathon","daily"]);
const BASE_GAME_IDS=["mary_jane","x_files","zoolook","downtown","behind_the_walls","magnetic_fields","robocop","axel_force_remix"];
let GAME_IDS=BASE_GAME_IDS.slice();
const PLAYER_TRACKS=[
 {id:"sonya",name:"Sonya VTX",kind:"intro"},
 {id:"mary_jane",name:"Mary Jane",kind:"game"},
 {id:"x_files",name:"X-Files",kind:"game"},
 {id:"zoolook",name:"Zoolook",kind:"game"},
 {id:"downtown",name:"Downtown",kind:"game"},
 {id:"behind_the_walls",name:"Behind The Walls",kind:"game"},
 {id:"magnetic_fields",name:"Magnetic Fields",kind:"game"},
 {id:"robocop",name:"RoboCop",kind:"game"},
 {id:"axel_force_remix",name:"Axel Force Remix",kind:"game"}
];
let preview=null,previewSerial=0;
let originalPlayerOpen=false;
const SHUFFLE_KEY="neoline.vice.ay-originals.shuffle.v3";
let manifestPromise=null,requestSerial=0,selectedGameSong=null,activeSong=null;
const songBuffers=new Map();
const songLoads=new Map(); // Deduplicate PT3 warm-up vs first visible scene
let shuffled;
try{shuffled=JSON.parse(localStorage.getItem(SHUFFLE_KEY)||"null")}catch(_){}
if(!shuffled||!Array.isArray(shuffled.bag)||
   shuffled.bag.some(id=>!BASE_GAME_IDS.includes(id)&&!/^orig_[a-z0-9_]+$/.test(id))||
   new Set(shuffled.bag).size!==shuffled.bag.length){
 let oldLast=null;
 try{oldLast=JSON.parse(localStorage.getItem("neoline.vice.pt3.shuffle.v1")||"null")?.last}catch(_){}
 shuffled={bag:[],last:GAME_IDS.includes(oldLast)?oldLast:null};
}
// Keep previously unplayed originals aside until the server confirms
// their actual chip register files. Never enqueue a missing track.
let savedOriginalBag=shuffled.bag.filter(id=>!BASE_GAME_IDS.includes(id));
shuffled.bag=shuffled.bag.filter(id=>BASE_GAME_IDS.includes(id));
const rand=max=>{
 if(max<=1)return 0;
 const a=new Uint32Array(1);
 if(window.crypto?.getRandomValues){window.crypto.getRandomValues(a);return a[0]%max}
 return Math.floor(Math.random()*max);
};
function nextGameTrack(){
 if(!shuffled.bag.length){
  shuffled.bag=GAME_IDS.slice();
  for(let i=shuffled.bag.length-1;i>0;i--){
   const j=rand(i+1);
   [shuffled.bag[i],shuffled.bag[j]]=[shuffled.bag[j],shuffled.bag[i]];
  }
  if(shuffled.bag[0]===shuffled.last&&shuffled.bag.length>1)
   [shuffled.bag[0],shuffled.bag[1]]=[shuffled.bag[1],shuffled.bag[0]];
 }
 const id=shuffled.bag.shift();shuffled.last=id;
 try{localStorage.setItem(SHUFFLE_KEY,JSON.stringify(shuffled))}catch(_){}
 return id;
}
// Lossless tracker loader. Decompress the user's original PT3 module
// and run its original note/sample/ornament commands through a PT3 player.
// Then deliver 14 AY registers x 50 Hz to the existing AY chip emulator.
// No synthesized melody, MIDI, MP3, samples or changes to the PT3 arrangement.
async function pt3Bytes(id){
 if(songBuffers.has(id))return songBuffers.get(id);
 if(!songLoads.has(id)){
  const promise=decodePT3Original(id).finally(()=>songLoads.delete(id));
  songLoads.set(id,promise);
 }
 return songLoads.get(id);
}
async function decodePT3Original(id){
 if(!["sonya",...GAME_IDS].includes(id))throw Error("Unrecognized PT3 soundtrack "+id);
 if(!window.NEOLINE_PT3)throw Error("PT3 decoder unavailable");
 if(typeof DecompressionStream!=="function")throw Error("Browser cannot decode lossless PT3 archive");
 const file="./assets/teoria/pt3-src/"+id+".z64";
 const response=await fetch(file,{cache:"force-cache"});
 if(!response.ok)throw Error("Original PT3 "+id+" HTTP "+response.status);
 const text=(await response.text()).trim();
 if(text.length<100||text.length>90000||!/^[A-Za-z0-9+/=\s]+$/.test(text))
  throw Error("Invalid PT3 compressed source "+id);
 const base64=text.replace(/\s/g,"");
 const decoded=atob(base64);
 const zipped=new Uint8Array(decoded.length);
 for(let i=0;i<decoded.length;i++)zipped[i]=decoded.charCodeAt(i);
 const decompressed=new Blob([zipped]).stream().pipeThrough(new DecompressionStream("deflate"));
 const raw=new Uint8Array(await new Response(decompressed).arrayBuffer());
 if(raw.length<201||raw.length>65536||
    String.fromCharCode(...raw.subarray(0,13))!=="ProTracker 3.")
  throw Error("Invalid ProTracker module "+id);
 const pt3=window.NEOLINE_PT3;
 const instance=pt3.pt3_setup_music(raw);
 if(!instance)throw Error("PT3 engine rejected "+id);
 const result=new Uint8Array(14*50*600);
 let count=0;
 try {
  while(count<50*600&&!instance.looped){
   pt3.pt3_play_tick(instance);
   const r=pt3.pt3_get_regs(instance);
   if(!r||r.length<14)throw Error("Corrupt PT3 registers "+id);
   result.set(r.subarray(0,14),count*14);
   count++;
  }
 }catch(error){throw new Error("PT3 tracker decoding failed for "+id+": "+error.message)}
 if(count<50*3||!instance.looped)throw Error("Invalid or nonlooping original PT3 "+id);
 const frames=result.slice(0,count*14);
 songBuffers.set(id,frames);
 return frames;
}
// Faithful tracker files are untouched. Native ZXTune playback logs are
// cached as chip-register frames, not new PT3 arrangements.
const nativeById=new Map(),nativeByFile=new Map();
let nativeLoad=null;
function primeNativeAY(){
 if(nativeLoad)return nativeLoad;
 nativeLoad=fetch("./assets/teoria/ay-originals/manifest.json?v=20261122-native-v1",
  {cache:"no-store"})
 .then(r=>{if(!r.ok)throw Error("Native AY not published (HTTP "+r.status+")");return r.json()})
 .then(m=>{
  if(m.frameRate!==50||m.clockHz!==1773400||!m.tracks)throw Error("Invalid AY manifest");
  for(const [id,entry] of Object.entries(m.tracks)){
   if(!/^orig_[a-z0-9_]+$/.test(id)||!entry||typeof entry.file!=="string"||
      entry.url!=="./assets/teoria/ay-originals/"+id+".ay14"||
      !Number.isInteger(entry.frames)||entry.frames<150||entry.frames>30000)continue;
   nativeById.set(id,entry);nativeByFile.set(entry.file,id);
   if(!PLAYER_TRACKS.some(t=>t.id===id))
    PLAYER_TRACKS.push({id,name:entry.name||entry.file,kind:"original",file:entry.file});
  }
  if(nativeById.size){
   GAME_IDS=[...BASE_GAME_IDS,...nativeById.keys()];
   const oldPool=shuffled.pool||"";
   const pool=GAME_IDS.join("|");
   const validSaved=savedOriginalBag.filter(id=>nativeById.has(id));
   if(oldPool===pool){
    shuffled.bag=[...shuffled.bag,...validSaved];
   }else{
    const missing=GAME_IDS.filter(id=>id!==shuffled.last&&
      !shuffled.bag.includes(id)&&!validSaved.includes(id));
    shuffled.bag=[...shuffled.bag,...validSaved,...missing];
    for(let i=shuffled.bag.length-1;i>0;i--){
     const j=rand(i+1);
     [shuffled.bag[i],shuffled.bag[j]]=[shuffled.bag[j],shuffled.bag[i]];
    }
    if(shuffled.bag[0]===shuffled.last&&shuffled.bag.length>1)
     [shuffled.bag[0],shuffled.bag[1]]=[shuffled.bag[1],shuffled.bag[0]];
   }
   shuffled.pool=pool;savedOriginalBag=[];
   try{localStorage.setItem(SHUFFLE_KEY,JSON.stringify(shuffled))}catch(_){}
  }
  window.dispatchEvent(new CustomEvent("neoline:ay-originals-ready",
   {detail:{files:[...nativeByFile.keys()],total:nativeById.size}}));
  return m;
 }).catch(e=>{console.warn("Native AY cache not ready:",e.message||e);return null});
 return nativeLoad;
}
async function songBytes(id){
 if(!nativeById.has(id))return pt3Bytes(id);
 if(songBuffers.has(id))return songBuffers.get(id);
 if(songLoads.has(id))return songLoads.get(id);
 const entry=nativeById.get(id);
 const promise=fetch(entry.url,{cache:"force-cache"}).then(async r=>{
  if(!r.ok)throw Error("AY playback file HTTP "+r.status+": "+id);
  const frames=new Uint8Array(await r.arrayBuffer());
  if(frames.length!==entry.frames*14||frames.length<14*150)
   throw Error("AY playback data corrupted: "+id);
  songBuffers.set(id,frames);return frames;
 }).finally(()=>songLoads.delete(id));
 songLoads.set(id,promise);
 return promise;
}

async function loadScene(force=false){
 if(!node||preview)return;
 const token=++requestSerial,requested=scene;
 if(requested==="fail"){msg({type:"clearSong"});loadedScene="fail";activeSong=null;stateToChip();return}
 const id=requested==="menu"?"sonya":requested==="result"?(selectedGameSong||"sonya"):
          selectedGameSong||nextGameTrack();
 if(GAME_MODES.has(requested))selectedGameSong=id;
 if(!force&&loadedScene===requested&&activeSong===id){stateToChip();return}
 try{
  const frames=await songBytes(id);
  if(token!==requestSerial||!node||!isVice()||scene!==requested)return;
  loadedScene=requested;activeSong=id;
  msg({type:"song",frames});stateToChip();updateControls();
 }catch(err){
  if(token!==requestSerial)return;
  console.warn("NEOLINE game soundtrack failed",id,err);
  if(nativeById.has(id)&&GAME_MODES.has(requested)){
   const bad=nativeById.get(id);
   nativeById.delete(id);if(bad)nativeByFile.delete(bad.file);
   GAME_IDS=GAME_IDS.filter(x=>x!==id);
   shuffled.bag=shuffled.bag.filter(x=>x!==id);
   selectedGameSong=nextGameTrack();void loadScene(true);return;
  }
  msg({type:"clearSong"});loadedScene=null;activeSong=null;stateToChip();updateControls();
 }
}
// SFX sequences are also AY register values, not synthesized outside the chip.
// Note + length in 20ms frames + loudness (0..15) + noise period (0=no noise).
const FX={
 ui:[["G5",2,12],["D6",2,9]],back:[["E5",3,11],["C5",4,9]],
 slide:[["C6",2,10],["G5",2,8]],enable:[["A4",4,12],["E5",4,13],["A5",5,14],["C6",7,9]],
 start:[["A4",4,12],["C5",4,12],["E5",4,12],["A5",9,14]],
 question:[["E5",3,10],["A5",4,9]],
 confirm:[["C5",4,9],["G5",5,9]],
 correct:[["C5",4,11],["E5",5,12],["G5",5,13],["C6",11,15]],
 wrong:[["B4",5,12],["F4",7,13],["NOISE",4,11,11]],
 hint:[["D6",5,11],["A5",4,10],["F5",6,10]],
 xp:[["G5",3,11],["C6",7,12]],
 open:[["F5",3,10],["A5",6,11]],
 // 8-bit gift score: escalating box rattle, lid, glittering stars and finale.
 "gift-rise":[["E3",6,11,22],["A3",5,11,16]],
 "gift-rattle-1":[["NOISE",2,9,11],["A3",2,10,19]],
 "gift-rattle-2":[["NOISE",2,11,7],["B3",2,12,15]],
 "gift-rattle-3":[["NOISE",2,14,4],["C4",2,14,12]],
 "gift-burst":[["NOISE",6,15,3],["C4",4,15,10],["G4",5,15,8],["C5",7,15]],
 "gift-star-1":[["C6",3,14],["E6",3,15],["A6",6,14]],
 "gift-star-2":[["E6",3,13],["G6",4,15],["C7",6,14]],
 "gift-star-3":[["G5",3,12],["C6",3,14],["E6",5,15]],
 "gift-reward":[["C5",3,14],["E5",4,15],["G5",4,15],["C6",7,15]],
 "gift-finale":[["NOISE",5,15,4],["G4",4,15],["C5",4,15],
                ["E5",4,15],["G5",5,15],["C6",5,15],["E6",7,15]],
 "gift-finale-stars":[["C7",3,15],["G6",4,15],["E6",4,14],["C7",8,15]],
 countdown:[["A5",3,10]],
 finale:[["NOISE",5,12,7],["A5",5,11],["C6",5,12],["E6",5,12],["A6",10,14]],
 victory:[["C5",5,12],["E5",5,13],["G5",6,13],["C6",6,14],["E6",8,14],["G6",11,15]],
 finish:[["E5",5,11],["A5",7,12],["C6",12,13]],
 "exam-fail":[["E5",8,12],["C5",9,12],["A4",17,12]],
 wasted:[["E5",11,12],["B4",13,11],["G4",16,12],["NOISE",10,11,17],["E3",30,10]]
};
const fxCache=new Map();
function compileFx(name){
 if(fxCache.has(name))return fxCache.get(name);
 const segments=FX[name]||FX.ui;
 const total=segments.reduce((sum,s)=>sum+s[1],0);
 const data=new Uint8Array(total*5);
 let frame=0;
 for(const [name,length,volume,noisep=0] of segments){
  const note=name==="NOISE"?0:notePeriod(name);
  for(let i=0;i<length;i++){
   const j=(frame++)*5;
   data[j]=note&255;data[j+1]=(note>>8)&15;
   data[j+2]=Math.max(0,Math.min(15,Math.round(volume*(1-.40*i/length))));
   data[j+3]=noisep||1;
   data[j+4]=name==="NOISE"?2:noisep?3:1;
  }
 }
 fxCache.set(name,data);
 return data;
}
function guessScene(){
 if(byId("gameOver")&&!byId("gameOver").hidden)return "fail";
 if(byId("gameResult")&&!byId("gameResult").hidden)return "result";
 if(byId("gamePlaying")&&!byId("gamePlaying").hidden)
  return currentMode&&GAME_MODES.has(currentMode)?currentMode:"route";
 return "menu";
}
const msg=data=>{if(node)node.port.postMessage(data)};
function stateToChip(){
 const inGift=giftOpen();
 const cassette=tapeLoading&&!tapeHolding&&isVice()&&sfxOn&&!document.hidden&&!originalPlayerOpen;
 msg({type:"switch",
  music:musicOn&&isVice()&&!tapeLoading&&!document.hidden&&!originalPlayerOpen&&(preview?!preview.paused:scene!=="fail"),
  effects:sfxOn&&audioAllowed()&&!tapeLoading&&!document.hidden&&!originalPlayerOpen,
  gameplay:GAME_MODES.has(scene),gift:inGift,
  tape:cassette,tapeDurationMs
 });
 reportAudio();
}
function syncScene(){
 const next=guessScene();
 if(scene!==next){
  if(preview)stopPreview(false);
  scene=next;loadScene(true);
 }
}
// Browser sound policy: decode and initialize the PSG early. Try autoplay,
// but do not wait for a blocked ctx.resume() promise: on mobile it may remain
// pending until an actual user gesture. The very first tap resumes the chip.
function audioSnapshot(){
 return {
  playing:!!(ctx&&ctx.state==="running"&&node&&musicOn&&isVice()&&!document.hidden&&(!preview||!preview.paused)),
  ready:!!node,
  blocked:!!(ctx&&ctx.state!=="running"&&isVice()&&musicOn),
  musicOn,sfxOn,error:audioError
 };
}
function reportAudio(){
 window.dispatchEvent(new CustomEvent("neoline:ay-status",{detail:audioSnapshot()}));
}
window.neolineGetAYAudioState=audioSnapshot;
function prepareAudio(forceGift=false){
 if(!(audioAllowed()||forceGift)||!Ctx||audioError)return null;
 if(boot)return boot;
 try{
  ctx=new Ctx({latencyHint:"interactive"});
  ctx.addEventListener("statechange",()=>{updateControls();reportAudio()});
  boot=ctx.audioWorklet.addModule("./teoria-ay8912-worklet.js?v=20261122-spectrum-tape-pauses-v9")
   .then(()=>{
    node=new AudioWorkletNode(ctx,"neoline-ay8912",{
     numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]
    });
    node.port.onmessage=event=>{
     const m=event.data||{};
     if(m.type==="song-progress"){
      if(preview&&!preview.loading){
       preview.frame=Math.max(0,Math.min(preview.frames,m.frame||0));
       notifyPreview();
      }
      return;
     }
     if(m.type!=="song-loop"||!isVice()||!musicOn)return;
     if(preview){
      if(!preview.paused&&!preview.loading)void shiftPreview(1);
      return;
     }
     if(!GAME_MODES.has(scene))return;
     selectedGameSong=nextGameTrack();
     void loadScene(true);
    };
    const master=ctx.createGain();
    master.gain.value=.88;
    node.connect(master);master.connect(ctx.destination);
    scene=guessScene();
    if(isVice())void loadScene(true);
    stateToChip();
    updateControls();reportAudio();
    return true;
   }).catch(error=>{
    audioError=true;console.warn("NEOLINE AY8912 startup:",error);
    updateControls();reportAudio();return false;
   });
  // Decode the original lobby tracker ahead of time, without starting sound.
  // A user gesture can then resume already-prepared chip audio immediately.
  if(isVice())void pt3Bytes("sonya").catch(err=>console.warn("NEOLINE Sonya PT3 preload:",err));
  void primeNativeAY();
  return boot;
 }catch(error){
  audioError=true;console.warn("NEOLINE AY8912 setup:",error);
  updateControls();reportAudio();return null;
 }
}
function requestResume(){
 if(!ctx||ctx.state==="running")return;
 try{
  // Must be invoked synchronously inside pointerdown/click to retain
  // browser's transient user activation on Chrome/Safari/Android.
  void ctx.resume().then(()=>{
   if(audioAllowed()){stateToChip();updateControls();reportAudio()}
  }).catch(err=>console.warn("NEOLINE audio blocked by browser:",err));
 }catch(error){console.warn("NEOLINE audio gesture:",error)}
}
async function unlock(forceGift=false){
 if(!(audioAllowed()||forceGift)||!Ctx||audioError)return false;
 const ready=prepareAudio(forceGift);
 if(!ready)return false;
 requestResume(); // Called BEFORE first await, while gesture is active.
 const prepared=await ready;
 if(!prepared)return false;
 updateControls();reportAudio();
 return ctx?.state==="running";
}
window.neolineStartAYAudio=unlock;
// Tell the existing three-channel AY engine when the simulated ULA/EAR
// cassette takes over. The original PT3 music waits, untouched, until loaded.
window.neolineCassetteLoading=(enabled,durationMs)=>{
 if(enabled&&!isVice())return false;
 tapeLoading=!!enabled;
 tapeHolding=enabled==="hold";
 if(Number.isFinite(durationMs))tapeDurationMs=Math.max(300,Math.min(15000,durationMs));
 if(tapeLoading&&!tapeHolding&&sfxOn){
  const ready=prepareAudio();
  requestResume(); // synchronous: caller is usually the user's click
  if(ready)void ready.then(ok=>{if(ok)stateToChip()}).catch(()=>{});
 }
 stateToChip();
 return tapeLoading;
};
// One player and one physical AY emulation: previews replace the current
// register stream, never create a second AudioContext or synth.
function previewState(){
 return {
  id:preview?.id||null,
  loading:!!preview?.loading,
  paused:!!preview?.paused,
  frame:preview?.frame||0,
  frames:preview?.frames||0,
  error:preview?.error||null,
  musicOn,
  ready:!!node,
  blocked:!!ctx&&ctx.state!=="running",
  enabled:isVice()
 };
}
function notifyPreview(){
 window.dispatchEvent(new CustomEvent("neoline:ay-player",{detail:previewState()}));
}
function stopPreview(restore=true){
 if(!preview)return;
 preview=null;previewSerial++;requestSerial++;
 if(restore&&isVice()&&node)void loadScene(true);
 else if(node){msg({type:"clearSong"});stateToChip()}
 notifyPreview();
}
async function playPreview(id){
 if(!isVice()||!PLAYER_TRACKS.some(track=>track.id===id))return false;
 if(preview?.id===id&&!preview.loading){
  if(preview.paused||!musicOn){
   if(!musicOn){musicOn=true;save(KEY_MUSIC,true);updateControls()}
   preview.paused=false;stateToChip();requestResume();notifyPreview();
  }else{preview.paused=true;stateToChip();notifyPreview()}
  return true;
 }
 const token=++previewSerial;
 preview={id,loading:true,paused:false,frame:0,frames:0,error:null};
 requestSerial++; // cancel any queued background soundtrack
 if(!musicOn){musicOn=true;save(KEY_MUSIC,true);updateControls()}
 notifyPreview();
 // unlock invokes resume() synchronously during the originating click.
 const initialized=unlock();
 try{
  await initialized;
  if(token!==previewSerial||preview?.id!==id)return false;
  if(!node)throw Error("AY-3-8912 audio unavailable");
  const frames=await songBytes(id);
  if(token!==previewSerial||preview?.id!==id||!isVice())return false;
  preview.frames=frames.length/14;preview.frame=0;preview.loading=false;
  msg({type:"song",frames});
  stateToChip();notifyPreview();
  return true;
 }catch(error){
  if(token!==previewSerial||preview?.id!==id)return false;
  preview.loading=false;preview.paused=true;
  preview.error=String(error.message||error);
  console.warn("NEOLINE AY library:",id,error);
  msg({type:"clearSong"});stateToChip();notifyPreview();
  return false;
 }
}
function shiftPreview(offset){
 const idx=preview?PLAYER_TRACKS.findIndex(t=>t.id===preview.id):-1;
 const at=(idx+offset+PLAYER_TRACKS.length)%PLAYER_TRACKS.length;
 return playPreview(PLAYER_TRACKS[at].id);
}
function seekPreview(sec){
 if(!preview||preview.loading||!preview.frames)return false;
 const f=Math.max(0,Math.min(preview.frames-1,Math.floor(Number(sec)*50)||0));
 preview.frame=f;
 msg({type:"seek",frame:f});notifyPreview();
 return true;
}
window.neolineAYPlayer={
 tracks:PLAYER_TRACKS,
 originalReady:file=>nativeByFile.has(file),
 playOriginal:file=>{
  const id=nativeByFile.get(file);return id?playPreview(id):Promise.resolve(false);
 },
 originalCount:()=>nativeById.size,
 suspendForOriginalPlayer(open){
  originalPlayerOpen=!!open;
  stateToChip();
  return originalPlayerOpen;
 },
 play:playPreview,
 next:()=>shiftPreview(1),
 previous:()=>shiftPreview(-1),
 toggle:()=>{
  if(!preview)return playPreview("sonya");
  return playPreview(preview.id);
 },
 stop:()=>stopPreview(true),
 seek:seekPreview,
 state:previewState
};

function playFx(name){
 if(tapeLoading||!audioAllowed()||!sfxOn||!node||ctx?.state!=="running"||document.hidden)return false;
 msg({type:"fx",frames:compileFx(name)});
 return true;
}
const bars=[];
function makeBar(host){
 if(!host)return;
 const wrap=document.createElement("div");
 wrap.className="vice-ay-controls";wrap.setAttribute("role","group");
 wrap.setAttribute("aria-label","ZX Spectrum AY-3-8912 sound");
 const music=document.createElement("button"),sound=document.createElement("button");
 for(const [button,kind] of [[music,"music"],[sound,"sfx"]]){
  button.type="button";button.className="vice-ay-button";button.dataset.audio=kind;
  const icon=document.createElement("span");icon.className="vice-ay-icon";
  icon.setAttribute("aria-hidden","true");
  icon.innerHTML=kind==="music"
    ?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V5l11-2v12"/><circle cx="6.2" cy="18.2" r="3.2"/><circle cx="17.2" cy="16.2" r="3.2"/></svg>'
    :'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12"/></svg>';
  const label=document.createElement("span");label.className="vice-ay-label";
  button.append(icon,label);
  button.addEventListener("click",()=>{
   if(kind==="music"){musicOn=!musicOn;save(KEY_MUSIC,musicOn)}
   else{sfxOn=!sfxOn;save(KEY_SFX,sfxOn)}
   stateToChip();updateControls();notifyPreview();
   if(isVice()&&(musicOn||sfxOn))void unlock().then(ok=>{if(ok&&kind==="sfx"&&sfxOn)playFx("ui")});
  });
  wrap.append(button);
 }
 const status=document.createElement("span");
 status.className="vice-ay-state";status.setAttribute("aria-live","polite");
 wrap.append(status);host.append(wrap);bars.push({music,sound,status});
}
makeBar(document.querySelector(".neoline-site-header__actions"));
makeBar(document.querySelector("#gamePlaying .question-eyebrow"));
makeBar(byId("gameResult"));
makeBar(document.querySelector("#gameOver .gameover-card"));
function updateControls(){
 const t=labels();
 for(const bar of bars){
  for(const [button,on,label] of [[bar.music,musicOn,t.music],[bar.sound,sfxOn,t.effects]]){
   button.setAttribute("aria-pressed",String(on));
   button.setAttribute("aria-label",label+" — "+(on?t.on:t.off));
   button.title=label+" — "+(on?t.on:t.off);
   button.querySelector(".vice-ay-label").textContent=label;
   button.classList.toggle("is-off",!on);
   button.disabled=!Ctx||audioError;
  }
  bar.status.textContent=audioError||!Ctx?t.unavailable:node&&ctx?.state==="running"?"AY-3-8912 · 3CH":t.tap;
 }
}
// Audio unlock on the first actual tap, including a gift in normal NEOLINE mode.
document.addEventListener("pointerdown",e=>{
 const giftGesture=!!e.target?.closest?.("[data-gift-preview],#gameGiftRevealReplay");
 if((isVice()||giftGesture)&&ctx?.state!=="running")void unlock(giftGesture);
},{capture:true,passive:true});
document.addEventListener("keydown",e=>{
 const giftGesture=!!e.target?.closest?.("[data-gift-preview],#gameGiftRevealReplay");
 if((isVice()||giftGesture)&&!e.repeat&&
    !["Shift","Control","Alt","Meta"].includes(e.key)&&ctx?.state!=="running")void unlock(giftGesture);
},{capture:true});
document.addEventListener("click",e=>{
 if(!isVice())return;
 const b=e.target.closest("button,a,[role='button']");
 if(!b||b.closest(".vice-ay-controls,.vice-soundtrack")||b.matches("[data-vice-theme-toggle],.answer,[data-mode]"))return;
 const now=performance.now();if(now-lastClick<55)return;lastClick=now;
 if(b.matches(".theory-promo-dot,.vice-cinema-arrow"))playFx("slide");
 else if(b.matches("#exitQuiz,#dock4Modes,#backToModes,#gameOverModes,#gameOverClose"))playFx("back");
 else if(b.matches("[data-gift-preview]"))playFx("open");
 else playFx("ui");
},{capture:true});
document.addEventListener("pointerover",e=>{
 if(!isVice()||e.pointerType!=="mouse"||!sfxOn)return;
 const b=e.target.closest("button");
 if(!b||b.closest(".vice-soundtrack")||b.contains(e.relatedTarget)||performance.now()-lastHover<125)return;
 lastHover=performance.now();if(!b.disabled)playFx("ui");
},{passive:true});
window.addEventListener("neoline:vice-theme",e=>{
 const enabled=!!e.detail?.enabled;
 if(enabled&&!lastTheme){
  scene=guessScene();
  void unlock().then(ok=>{if(ok)playFx("enable")});
 }
 if(!enabled){
  tapeLoading=false;
  if(preview)stopPreview(false);
  requestSerial++;stateToChip();
 }else{syncScene();loadScene(true);stateToChip()}
 lastTheme=enabled;updateControls();
});
window.addEventListener("neoline:theory-quiz",e=>{
 if(preview)stopPreview(false);
 const d=e.detail||{};
 if(d.mode&&GAME_MODES.has(d.mode))currentMode=d.mode;
 const previous=scene;
  const next=guessScene();
  if(next!==previous&&GAME_MODES.has(next))selectedGameSong=nextGameTrack();
  syncScene();
 if(!isVice())return;
 if(previous!==scene){lastDone=0;playFx("start");return;}
 if(scene!=="menu"&&scene!=="result"&&scene!=="fail"&&!d.answered&&Number.isFinite(d.done)&&d.done>lastDone){
  if(lastDone>=0)playFx("question");lastDone=d.done;
 }
});
window.addEventListener("neoline:theory-answer",e=>{
 if(isVice())playFx(e.detail?.mode==="exam"?"confirm":e.detail?.correct?"correct":"wrong");
});
window.addEventListener("neoline:theory-hint",()=>{if(isVice())playFx("hint")});
window.addEventListener("neoline:theory-finish",e=>{
 syncScene();
 if(!isVice())return;
 const d=e.detail||{};
 if(d.gameOver)playFx("wasted");
 else if(d.mode==="exam")playFx(d.correct>=26?"victory":"exam-fail");
 else playFx(d.total>0&&d.correct/d.total>=.8?"victory":"finish");
});
// Synchronize AY channel C to exact phases of the existing three-round gift.
// Repeated rattles accelerate over 2350ms; each star gets a distinct chime.
const giftTimers=[];
let giftSerial=0;
function clearGiftSounds(clearVoice=false){
 giftSerial++;
 for(const timer of giftTimers)clearTimeout(timer);
 giftTimers.length=0;
 if(clearVoice)msg({type:"clearFx"});
}
function scheduleGiftFx(name,delay,serial){
 giftTimers.push(setTimeout(()=>{
  if(serial===giftSerial&&giftOpen()&&!document.hidden)playFx(name);
 },delay));
}
window.addEventListener("neoline:gift-audio",e=>{
 const cue=e.detail?.cue;
 if(cue==="stop"){
  clearGiftSounds(true);stateToChip();
  return;
 }
 if(!giftOpen()||document.hidden)return;
 // Pointerdown has already requested browser audio permission.
 if(!node)void unlock(true);
 if(cue==="shake"){
  clearGiftSounds(true);stateToChip();
  const serial=giftSerial;
  playFx("gift-rise");
  for(let i=0;i<15;i++){
   const ms=Math.round(2250*(1-Math.pow(1-i/15,1.9)));
   const name=i<4?"gift-rattle-1":i<9?"gift-rattle-2":"gift-rattle-3";
   scheduleGiftFx(name,90+ms,serial);
  }
 }else if(cue==="burst"){
  clearGiftSounds(true);
  const serial=giftSerial;
  playFx("gift-burst");
  scheduleGiftFx("gift-star-1",205,serial);
  scheduleGiftFx("gift-star-2",423,serial);
 }else if(cue==="revealed"){
  clearGiftSounds(false);
  const serial=giftSerial;
  playFx("gift-reward");
  scheduleGiftFx("gift-star-3",225,serial);
 }else if(cue==="finale"){
  clearGiftSounds(true);
  const serial=giftSerial;
  playFx("gift-finale");
  scheduleGiftFx("gift-finale-stars",585,serial);
 }
});
giftDialog?.addEventListener("close",()=>{
 clearGiftSounds(true);stateToChip();
});
const clock=byId("timer");
if(clock){
 let lastSec=null;
 new MutationObserver(()=>{
  if(!isVice()||scene!=="exam"||byId("timerBox")?.hidden)return;
  const match=/^(\d\d):(\d\d)$/.exec(clock.textContent.trim());
  if(!match)return;
  const sec=+match[1]*60+(+match[2]);
  if(sec>0&&sec<=10&&sec!==lastSec)playFx("countdown");
  lastSec=sec;
 }).observe(clock,{childList:true,characterData:true,subtree:true});
}
for(const id of ["gamePlaying","gameResult","gameOver"]){
 const panel=byId(id);
 if(panel)new MutationObserver(()=>{if(isVice())syncScene()}).observe(panel,{attributes:true,attributeFilter:["hidden"]});
}
document.addEventListener("visibilitychange",()=>{
 if(!ctx)return;
 if(document.hidden){
  clearGiftSounds(true);
  stateToChip();void ctx.suspend().catch(()=>{});
 }else if(isVice()){
  void ctx.resume().then(()=>{syncScene();stateToChip()}).catch(()=>{});
 }
});
window.addEventListener("pagehide",()=>{stateToChip();if(ctx)void ctx.suspend().catch(()=>{})});
window.addEventListener("pageshow",()=>{if(ctx&&isVice()&&!document.hidden)void ctx.resume().then(()=>{syncScene();stateToChip()}).catch(()=>{})});
window.addEventListener("storage",e=>{
 if(e.key!==KEY_MUSIC&&e.key!==KEY_SFX)return;
 musicOn=getSaved(KEY_MUSIC,true);sfxOn=getSaved(KEY_SFX,true);
 stateToChip();updateControls();notifyPreview();
});
new MutationObserver(updateControls).observe(root,{attributes:true,attributeFilter:["lang"]});
updateControls();
void primeNativeAY();
// On reload in saved GTA mode, prepare the entire sound engine right away.
// Browsers that permit autoplay will play immediately; others can start it
// with the first tap anywhere or the prominent sound start button.
if(isVice()&&musicOn&&Ctx){
 prepareAudio();
 requestResume();
}
})();