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
const MENU={
 bpm:116,
 roots:"A2 F2 C3 G2 E2 A2 D3 E2".split(" "),
 chords:[
 ["A4","C5","E5"],["F4","A4","C5"],["C5","E5","G5"],["G4","B4","D5"],
 ["E4","G4","B4"],["A4","C5","E5"],["F4","A4","D5"],["E4","G#4","B4"]
 ],
 melody:[
 "E5 - G5 A5 C6 - B5 A5","G5 E5 F5 - A5 - C6 -",
 "G5 E5 C5 D5 E5 - G5 E5","D5 G5 B5 - A5 G5 E5 D5",
 "B4 E5 G5 B5 D6 - B5 G5","A5 C6 E6 - D6 C6 A5 E5",
 "F5 A5 D6 C6 A5 F5 E5 D5","E5 G#5 B5 D6 B5 G#5 E5 -"
 ].map(x=>x.split(" ")),
 arp:[0,1,2,1,0,2,1,2], beat:"sunset"
};
const RESULT={...MENU,bpm:125,arp:[0,2,1,2,0,1,2,1],beat:"final"};
const TRACKS={menu:MENU,...window.NEOLINE_AY_TRACKS,result:RESULT};
const compiled=new Map();
// For each 1/50-second frame, write the REAL PSG tone periods,
// mixer gate, noise period, and one 4-bit volume per channel.
function compileSong(track){
 const secs=32*60/track.bpm, frameCount=Math.round(secs*FPS);
 const bytes=new Uint8Array(frameCount*14);
 const leadSteps=[],leadAttacks=[];
 let active="-",attack=0;
 for(let step=0;step<128;step++){
  if(step%2===0){
   const token=track.melody[(step/16)|0][(step%16)/2];
   if(token!=="-"){active=token;attack=step}
  }
  leadSteps[step]=active;leadAttacks[step]=attack;
 }
 let previousStep=-1;
 for(let f=0;f<frameCount;f++){
  const t=f/FPS,unit=t*track.bpm*4/60,step=Math.min(127,Math.floor(unit+1e-8));
  const bar=(step/16)|0,pos=step%16,slot=step%8,beat=track.beat;
  const off=f*14;
  const period=(ch,value)=>{const p=notePeriod(value);bytes[off+ch*2]=p&255;bytes[off+ch*2+1]=(p>>8)&15};
  let lead=leadSteps[step];
  if(lead==="-")lead=null;
  const leadAge=unit-leadAttacks[step];
  period(0,lead);
  let leadVolume=lead?Math.max(8,14-Math.floor(leadAge/2.0)):0;
  if(leadAge<.18)leadVolume=15;
  if(leadAge>12)leadVolume=7;
  // Channel B: bass pulses, one-voice only.
  const chord=track.chords[bar];
  const lower=chord[2].replace(/([0-8])$/,(_,o)=>String(Math.max(1,Number(o)-2)));
  const bassNote=(pos===4||pos===12)?lower:track.roots[bar];
  period(1,bassNote);
  const bassAge=unit-(step-(step%2));
  let bassVolume=(beat==="rush"?12:10);
  if(bassAge>1.5)bassVolume=5;
  else if(bassAge<.20)bassVolume=Math.min(15,bassVolume+2);
  const arpIndex=track.arp[pos%8]||0,arpNote=chord[arpIndex];
  period(2,arpNote);
  let arpVolume=beat==="pulse"?6:beat==="rush"?9:beat==="slow"?6:8;
  if(unit-step>.7)arpVolume=Math.max(2,arpVolume-2);
  // Noise generator is SHARED. Steal channel C for 20–60 ms at drum hits.
  // No more than 3 AY channels sound simultaneously.
  const stepElapsed=t-(step*60/track.bpm/4);
  let kick=false,snare=false,hat=false;
  if(beat==="rush"){
   kick=pos%4===0;snare=pos===4||pos===12;hat=pos%2===0;
  }else if(beat==="pulse"||beat==="slow"){
   kick=pos===0||pos===8;snare=pos===12;hat=beat==="pulse"&&pos%4===2;
  }else if(beat==="bouncy"||beat==="swing"){
   kick=pos===0||pos===8||pos===10;snare=pos===4||pos===12;hat=pos%4===2;
  }else{
   kick=pos%4===0;snare=pos===4||pos===12;hat=pos%2===0;
  }
  let mixer=0x38,noiseP=1;
  if(stepElapsed<.050 && (snare||kick||hat)){
   mixer=0x1c; // tone A + B enabled; C noise only
   noiseP=snare?13:kick?24:3;
   arpVolume=snare?12:kick?11:5;
   if(stepElapsed>.028)arpVolume=Math.max(2,arpVolume-4);
  }
  bytes[off+6]=noiseP;
  bytes[off+7]=mixer;
  bytes[off+8]=leadVolume;
  bytes[off+9]=bassVolume;
  bytes[off+10]=arpVolume;
  bytes[off+11]=0;bytes[off+12]=0;
  bytes[off+13]=255; // skip envelope retrigger unless explicitly set
  previousStep=step;
 }
 return bytes;
}
function getSong(key){
 if(!TRACKS[key])key="menu";
 if(!compiled.has(key))compiled.set(key,compileSong(TRACKS[key]));
 return compiled.get(key);
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
  return currentMode&&TRACKS[currentMode]?currentMode:"route";
 return "menu";
}
const msg=data=>{if(node)node.port.postMessage(data)};
function stateToChip(){
 msg({type:"switch",music:musicOn&&isVice()&&!document.hidden&&scene!=="fail",
  effects:sfxOn&&isVice()&&!document.hidden});
}
function loadScene(force=false){
 if(!node)return;
 if(scene==="fail"){
  msg({type:"clearSong"});
  loadedScene="fail";stateToChip();return;
 }
 if(!force&&loadedScene===scene){stateToChip();return;}
 loadedScene=scene;
 msg({type:"song",frames:getSong(scene)});
 stateToChip();
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
    ctx.audioWorklet.addModule("./teoria-ay8912-worklet.js?v=20261122-real-ay8912-v2")
   ]).then(()=>{
    node=new AudioWorkletNode(ctx,"neoline-ay8912",{
     numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]
    });
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
 if(!enabled)stateToChip();else{syncScene();stateToChip()}
 lastTheme=enabled;updateControls();
});
window.addEventListener("neoline:theory-quiz",e=>{
 const d=e.detail||{};
 if(d.mode&&TRACKS[d.mode])currentMode=d.mode;
 const previous=scene;syncScene();
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