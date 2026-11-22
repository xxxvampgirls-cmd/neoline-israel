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
const getSaved=(key,defaultValue)=>{try{const s=localStorage.getItem(key);return s===null?defaultValue:s!=="0"}catch(_){return defaultValue}};
const save=(key,on)=>{try{localStorage.setItem(key,on?"1":"0")}catch(_){}};
let musicOn=getSaved(KEY_MUSIC,true),sfxOn=getSaved(KEY_SFX,true);
let ctx=null,node=null,boot=null,audioError=false;
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
const GAME_IDS=["mary_jane","x_files","zoolook","downtown","behind_the_walls","magnetic_fields"];
const SHUFFLE_KEY="neoline.vice.pt3.shuffle.v1";
let manifestPromise=null,requestSerial=0,selectedGameSong=null,activeSong=null;
const songBuffers=new Map();
let shuffled;
try{shuffled=JSON.parse(localStorage.getItem(SHUFFLE_KEY)||"null")}catch(_){}
if(!shuffled||!Array.isArray(shuffled.bag)||shuffled.bag.some(id=>!GAME_IDS.includes(id)))
 shuffled={bag:[],last:null};
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
async function loadScene(force=false){
 if(!node)return;
 const token=++requestSerial,requested=scene;
 if(requested==="fail"){msg({type:"clearSong"});loadedScene="fail";activeSong=null;stateToChip();return}
 const id=requested==="menu"?"sonya":requested==="result"?(selectedGameSong||"sonya"):
          selectedGameSong||nextGameTrack();
 if(GAME_MODES.has(requested))selectedGameSong=id;
 if(!force&&loadedScene===requested&&activeSong===id){stateToChip();return}
 try{
  const frames=await pt3Bytes(id);
  if(token!==requestSerial||!node||!isVice()||scene!==requested)return;
  loadedScene=requested;activeSong=id;
  msg({type:"song",frames});stateToChip();updateControls();
 }catch(err){
  if(token!==requestSerial)return;
  console.warn("NEOLINE original PT3 unavailable",id,err);
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
 shake:[["A3",2,9,15]],burst:[["NOISE",7,14,6],["C5",5,12],["G5",7,12]],
 reveal:[["C6",4,11],["E6",5,13],["G6",14,14]],
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
   data[j+2]=Math.max(0,Math.min(15,Math.round(volume*(1-.60*i/length))));
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
 msg({type:"switch",music:musicOn&&isVice()&&!document.hidden&&scene!=="fail",
  effects:sfxOn&&isVice()&&!document.hidden});
}
function syncScene(){
 const next=guessScene();
 if(scene!==next){scene=next;loadScene(true)}
}
async function unlock(){
 if(!isVice()||!Ctx||audioError)return false;
 try{
  if(!ctx){
   ctx=new Ctx({latencyHint:"interactive"});
   // Resume within the genuine gesture before waiting for addModule.
   const resumed=ctx.resume();
   boot=Promise.all([
    resumed,
    ctx.audioWorklet.addModule("./teoria-ay8912-worklet.js?v=20261122-pt3-loop-v3")
   ]).then(()=>{
    node=new AudioWorkletNode(ctx,"neoline-ay8912",{
     numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]
    });
    node.port.onmessage=event=>{
      if(event.data?.type!=="song-loop"||!isVice()||!musicOn||!GAME_MODES.has(scene))return;
      selectedGameSong=nextGameTrack();loadScene(true);
     };
     const master=ctx.createGain();
    master.gain.value=.80;
    node.connect(master);master.connect(ctx.destination);
    scene=guessScene();
    loadScene(true);
    updateControls();
    return true;
   }).catch(error=>{
    audioError=true;console.warn("NEOLINE AY8912 startup:",error);
    updateControls();return false;
   });
  }else if(ctx.state!=="running")await ctx.resume();
  const started=await boot;
  if(started&&ctx.state!=="running")await ctx.resume();
  stateToChip();updateControls();
  return Boolean(started&&ctx.state==="running");
 }catch(error){audioError=true;console.warn("NEOLINE AY8912:",error);updateControls();return false}
}
function playFx(name){
 if(!isVice()||!sfxOn||!node||ctx?.state!=="running"||document.hidden)return;
 msg({type:"fx",frames:compileFx(name)});
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
   stateToChip();updateControls();
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
  bar.status.textContent=audioError||!Ctx?t.unavailable:node?"AY-3-8912 · 3CH":t.tap;
 }
}
document.addEventListener("pointerdown",e=>{
 if(isVice()&&e.target.closest("button,a,select,[role='button']"))void unlock();
},{capture:true,passive:true});
document.addEventListener("keydown",e=>{
 if(isVice()&&(e.key===" "||e.key==="Enter")&&e.target.closest("button,a,select"))void unlock();
},{capture:true});
document.addEventListener("click",e=>{
 if(!isVice())return;
 const b=e.target.closest("button,a,[role='button']");
 if(!b||b.closest(".vice-ay-controls")||b.matches("[data-vice-theme-toggle],.answer,[data-mode]"))return;
 const now=performance.now();if(now-lastClick<55)return;lastClick=now;
 if(b.matches(".theory-promo-dot,.vice-cinema-arrow"))playFx("slide");
 else if(b.matches("#exitQuiz,#dock4Modes,#backToModes,#gameOverModes,#gameOverClose"))playFx("back");
 else if(b.matches("[data-gift-preview]"))playFx("open");
 else playFx("ui");
},{capture:true});
document.addEventListener("pointerover",e=>{
 if(!isVice()||e.pointerType!=="mouse"||!sfxOn)return;
 const b=e.target.closest("button");
 if(!b||b.contains(e.relatedTarget)||performance.now()-lastHover<125)return;
 lastHover=performance.now();if(!b.disabled)playFx("ui");
},{passive:true});
window.addEventListener("neoline:vice-theme",e=>{
 const enabled=!!e.detail?.enabled;
 if(enabled&&!lastTheme){
  scene=guessScene();
  void unlock().then(ok=>{if(ok)playFx("enable")});
 }
 if(!enabled){requestSerial++;stateToChip()}else{syncScene();loadScene(true);stateToChip()}
 lastTheme=enabled;updateControls();
});
window.addEventListener("neoline:theory-quiz",e=>{
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
const gift=byId("gameGiftReveal"),dialog=byId("gameGiftDialog");
if(gift&&dialog){
 new MutationObserver(()=>{
  if(!isVice()||!dialog.open)return;
  const phase=gift.dataset.phase;
  if(phase==="shake")playFx("shake");
  else if(phase==="burst")playFx("burst");
  else if(phase==="revealed")playFx("reveal");
 }).observe(gift,{attributes:true,attributeFilter:["data-phase"]});
}
const burst=byId("gameGiftScreenBurst");
if(burst){
 let hadRing=false;
 new MutationObserver(()=>{
  const ring=!!burst.querySelector(".gift-burst-ring");
  if(!hadRing&&ring&&dialog?.open)playFx("finale");
  hadRing=ring;
 }).observe(burst,{childList:true});
}
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
 stateToChip();updateControls();
});
new MutationObserver(updateControls).observe(root,{attributes:true,attributeFilter:["lang"]});
updateControls();
})();