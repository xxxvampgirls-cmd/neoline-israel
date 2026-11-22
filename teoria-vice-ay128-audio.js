/* NEOLINE Theory · original Ocean-era AY-3-8912-inspired audio.
   Three square-wave music voices, shared noise percussion and short PSG effects.
   All melodies/effects are original, generated locally by Web Audio. No downloads.
   Only enabled in optional Vice theme; game/exam logic is never touched. */
(() => {
 "use strict";
 if (window.__neolineViceAudio) return;
 window.__neolineViceAudio = true;
 const root = document.documentElement;
 const AUDIO = window.AudioContext || window.webkitAudioContext;
 const KEY_MUSIC = "neoline.vice.ay128.music.v1";
 const KEY_SFX = "neoline.vice.ay128.sfx.v1";
 const isVice = () => root.dataset.viceTheme === "on";
 const byId = id => document.getElementById(id);
 function stored(key, fallback) {
  try { const x = localStorage.getItem(key); return x === null ? fallback : x !== "0"; }
  catch (_) { return fallback; }
 }
 function save(key, value) {
  try { localStorage.setItem(key, value ? "1" : "0"); } catch (_) {}
 }
 let musicOn = stored(KEY_MUSIC, true), sfxOn = stored(KEY_SFX, true);
 let ctx = null, master = null, musicBus = null, sfxBus = null, noiseBuffer = null;
 let timer = 0, sequence = 0, nextStep = 0, scene = "menu", unlocked = false;
 let lastDone = -1, lastHover = 0, lastClick = 0, lastTheme = isVice();
 const AY_CLOCK = 1773400;
 const semitones = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
 const copy = {
  ru:{music:"Музыка",effects:"Эффекты",on:"вкл.",off:"выкл.",tap:"Коснись, чтобы запустить звук",chip:"AY • 128K",unavailable:"Браузер не поддерживает звук"},
  en:{music:"Music",effects:"Effects",on:"on",off:"off",tap:"Tap to enable audio",chip:"AY • 128K",unavailable:"Audio not supported"},
  he:{music:"מוזיקה",effects:"אפקטים",on:"פעיל",off:"כבוי",tap:"גע להפעלת שמע",chip:"AY • 128K",unavailable:"אין תמיכה בשמע"},
  ar:{music:"موسيقى",effects:"مؤثرات",on:"تشغيل",off:"إيقاف",tap:"المس لتفعيل الصوت",chip:"AY • 128K",unavailable:"الصوت غير مدعوم"}
 };
 const labels = () => copy[(root.lang || "ru").split("-")[0]] || copy.ru;
 const CHORDS = [
  ["A4","C5","E5"],["F4","A4","C5"],["C5","E5","G5"],["G4","B4","D5"],
  ["E4","G4","B4"],["A4","C5","E5"],["F4","A4","D5"],["E4","G#4","B4"]
 ];
 const ROOTS = ["A2","F2","C3","G2","E2","A2","D3","E2"];
 const MELODY = [
  "E5 - G5 A5 C6 - B5 A5",
  "G5 E5 F5 - A5 - C6 -",
  "G5 E5 C5 D5 E5 - G5 E5",
  "D5 G5 B5 - A5 G5 E5 D5",
  "B4 E5 G5 B5 D6 - B5 G5",
  "A5 C6 E6 - D6 C6 A5 E5",
  "F5 A5 D6 C6 A5 F5 E5 D5",
  "E5 G#5 B5 D6 B5 G#5 E5 -"
 ].map(bar => bar.split(" "));
 const CHASE_MELODY = [
  "A5 C6 E6 A5 G5 E5 C6 B5",
  "A5 F5 C6 A5 G5 F5 E5 C5",
  "G5 E5 G5 C6 D6 E6 D6 C6",
  "B5 D6 G5 B5 A5 G5 F#5 D5",
  "G5 B5 E6 D6 B5 G5 E5 B4",
  "A5 C6 E6 C6 B5 A5 G5 E5",
  "F5 A5 D6 A5 C6 A5 F5 D5",
  "E5 G#5 B5 E6 D6 B5 G#5 E5"
 ].map(bar => bar.split(" "));
 // The individual Ocean-era scores are loaded before this player.
 // A fallback melody keeps playback safe if an old cached page omitted them.
 const AY_MODES=window.NEOLINE_AY_TRACKS||{};
 const TRACKS={
  menu:{bpm:116,roots:ROOTS,chords:CHORDS,melody:MELODY,arp:[0,1,2,1,0,2,1,2],beat:"sunset"},
  ...AY_MODES,
  result:{bpm:125,roots:ROOTS,chords:CHORDS,melody:MELODY,arp:[0,2,1,2,0,1,2,1],beat:"final"}
 };
 let currentMode=null;
 const isQuizScene=()=>!["menu","result","fail"].includes(scene);

 const noiseBits = new Float32Array(8192);
 let rng = 0x5EED;
 for (let i=0;i<noiseBits.length;i++) {
  const feedback = ((rng>>0)^(rng>>2)^(rng>>3)^(rng>>5)) & 1;
  rng = (rng>>1)|(feedback<<15);
  noiseBits[i] = (rng & 1) ? 1 : -1;
 }
 function initAudio() {
  if (!AUDIO) return false;
  if (ctx) return true;
  try {
   ctx = new AUDIO();
   master = ctx.createGain();
   master.gain.value = 0.64;
   const limiter = ctx.createDynamicsCompressor();
   limiter.threshold.value = -17;
   limiter.knee.value = 18;
   limiter.ratio.value = 6;
   limiter.attack.value = 0.003;
   limiter.release.value = 0.16;
   master.connect(limiter);
   limiter.connect(ctx.destination);
   musicBus = ctx.createGain();
   sfxBus = ctx.createGain();
   musicBus.gain.value = 0;
   sfxBus.gain.value = 0.42;
   musicBus.connect(master);
   sfxBus.connect(master);
   noiseBuffer = ctx.createBuffer(1, noiseBits.length, ctx.sampleRate);
   noiseBuffer.copyToChannel(noiseBits, 0);
   return true;
  } catch (_) { ctx = null; return false; }
 }
 function freq(note) {
  if (typeof note === "number") return note;
  const m = /^([A-G])([#b]?)([0-8])$/.exec(note || "");
  if (!m) return 0;
  const index = (Number(m[3])+1)*12+semitones[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0);
  return 440*Math.pow(2,(index-69)/12);
 }
 function ayPitch(note) {
  const f = freq(note);
  if (!f) return 0;
  const divider = Math.max(1,Math.round(AY_CLOCK/(16*f)));
  return AY_CLOCK/(16*divider);
 }
 function tone(note, duration, when, loudness, bus, slideTo) {
  if (!ctx || !bus) return;
  const f = ayPitch(note);
  if (!f) return;
  const start = Math.max(when,ctx.currentTime+0.001);
  const length = Math.max(0.025,duration);
  const end = start + length;
  const osc = ctx.createOscillator(), amp = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(f,start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(50,ayPitch(slideTo) || slideTo),end-0.01);
  amp.gain.setValueAtTime(0.0001,start);
  amp.gain.linearRampToValueAtTime(Math.max(0.0001,loudness),start+0.004);
  amp.gain.setValueAtTime(Math.max(0.0001,loudness*0.81),Math.max(start+0.006,end-0.045));
  amp.gain.exponentialRampToValueAtTime(0.0001,end);
  osc.connect(amp);amp.connect(bus);
  osc.start(start);osc.stop(end+0.01);
  osc.onended = () => { try { osc.disconnect();amp.disconnect(); } catch (_) {} };
 }
 function noise(duration,when,loudness,kind) {
  if (!ctx || !noiseBuffer) return;
  const t = Math.max(when,ctx.currentTime+0.001);
  const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), amp = ctx.createGain();
  source.buffer = noiseBuffer;
  filter.type = kind === "hat" ? "highpass" : kind === "kick" ? "lowpass" : "bandpass";
  filter.frequency.value = kind === "hat" ? 4400 : kind === "kick" ? 340 : 1050;
  if (kind === "snare") filter.Q.value=0.65;
  const d = Math.min(0.23,Math.max(0.015,duration));
  amp.gain.setValueAtTime(Math.max(0.0001,loudness),t);
  amp.gain.exponentialRampToValueAtTime(0.0001,t+d);
  source.connect(filter);filter.connect(amp);amp.connect(kind==="hat"||kind==="kick"||kind==="snare" ? musicBus : sfxBus);
  source.start(t);source.stop(t+d+0.002);
  source.onended=()=>{try{source.disconnect();filter.disconnect();amp.disconnect()}catch(_){}};
 }
 function setBus(level,duration=0.06) {
  if (!ctx || !musicBus) return;
  const t=ctx.currentTime;
  musicBus.gain.cancelScheduledValues(t);
  musicBus.gain.setTargetAtTime(level,t,Math.max(0.008,duration));
 }
 function stopMusic() {
  if(timer) clearInterval(timer);
  timer=0;
  sequence++;
  setBus(0,0.025);
 }
 function guessScene() {
  if (byId("gameOver") && !byId("gameOver").hidden) return "fail";
  if (byId("gameResult") && !byId("gameResult").hidden) return "result";
  if (byId("gamePlaying") && !byId("gamePlaying").hidden) return TRACKS[currentMode] ? currentMode : "menu";
  return "menu";
 }
 function playStep(at) {
  const track=TRACKS[scene]||TRACKS.menu;
  const stepLen=60/track.bpm/4;
  const step=sequence%128,bar=Math.floor(step/16),pos=step%16;
  const melody=track.melody[bar],beat=track.beat;
  // Distinct melodies, basslines, rhythms and arpeggios for all six modes.
  if((pos&1)===0){
   const note=melody[pos/2];
   if(note && note!=="-" && note!=="."){
    let length=2;
    for(let j=pos/2+1;j<8&&melody[j]==="-";j++)length+=2;
    tone(note,Math.min(stepLen*length*.89,1.0),at,beat==="pulse"?.24:beat==="rush"?.30:.26,musicBus);
   }
   const bass=pos===4||pos===12?track.chords[bar][2]:track.roots[bar];
   const bassTone=bass===track.roots[bar]?bass:bass.replace(/([0-8])$/,(_,oct)=>String(Math.max(1,Number(oct)-1)));
   const duration=beat==="pulse"?(pos===0||pos===8?2.4:1.0):beat==="rush"?1.45:pos===0||pos===8?3:1.45;
   tone(bassTone,stepLen*duration,at,beat==="rush"?.18:.155,musicBus);
  }
  const chord=track.chords[bar];
  const arp=chord[track.arp[pos%8]];
  if(beat!=="pulse"||pos%2===0)
   tone(arp,stepLen*(beat==="slow"?.91:.74),at,beat==="pulse"?.043:beat==="slow"?.047:beat==="rush"?.079:.061,musicBus);
  if(beat==="rush"){
   if(pos%4===0)noise(.065,at,.135,"kick");
   if(pos===4||pos===12)noise(.085,at,.14,"snare");
   if(pos%2===0)noise(.024,at,.052,"hat");
  }else if(beat==="pulse"||beat==="slow"){
   if(pos===0||pos===8)noise(.075,at,.077,"kick");
   if(pos===12)noise(.085,at,.065,"snare");
   if(beat==="pulse"&&pos%4===2)noise(.016,at,.024,"hat");
  }else if(beat==="bouncy"||beat==="swing"){
   if(pos===0||pos===8||pos===10)noise(.06,at,.10,"kick");
   if(pos===4||pos===12)noise(.067,at,.084,"snare");
   if(pos%4===2)noise(.023,at,.031,"hat");
  }else{
   if(pos%4===0)noise(.068,at,.115,"kick");
   if(pos===4||pos===12)noise(.081,at,.107,"snare");
   if(pos%2===0)noise(.025,at,.039,"hat");
  }
 }
 function tick() {
  if(!ctx || ctx.state!=="running" || document.hidden || !musicOn || !isVice() || scene==="fail") return;
  if(nextStep<ctx.currentTime-0.05) nextStep=ctx.currentTime+0.015;
  let safety=0;
  while(nextStep<ctx.currentTime+0.17 && safety++<8) {
   playStep(nextStep);
   nextStep+=60/(TRACKS[scene]?.bpm||116)/4;
   sequence++;
  }
 }
 function startMusic(force=false) {
  if(!ctx || ctx.state!=="running" || !unlocked || !musicOn || !isVice() || document.hidden || scene==="fail"){
   stopMusic();return;
  }
  if(timer && !force) return;
  stopMusic();
  sequence=0;nextStep=ctx.currentTime+0.035;
  setBus(byId("gameGiftDialog")?.open ? .095 : isQuizScene() ? .22 : .185,0.055);
  timer=setInterval(tick,42);
  tick();
 }
 function changeScene(next) {
  if(next===scene) return;
  scene=next;
  if(scene==="fail") stopMusic();
  else startMusic(true);
 }
 async function unlock() {
  if (!isVice() || !AUDIO || !initAudio()) return false;
  try {
   if (ctx.state !== "running") await ctx.resume();
   unlocked = ctx.state==="running";
   if(unlocked) { if(!timer && musicOn) startMusic(); updateControls(); }
   return unlocked;
  } catch(_) { return false; }
 }
 function fx(name) {
  if(!isVice() || !sfxOn || !ctx || ctx.state!=="running" || document.hidden) return;
  const t=ctx.currentTime+0.009;
  const p=(note,offset,dur,level,slide)=>tone(note,dur,t+offset,level,sfxBus,slide);
  switch(name) {
   case "ui": p("A5",0,.052,.18);p("E6",.043,.045,.13);break;
   case "back": p("E5",0,.055,.18);p("C5",.055,.09,.14);break;
   case "slide": p("C6",0,.045,.11);p("G5",.048,.055,.1);break;
   case "enable": p("A4",0,.11,.25);p("E5",.095,.12,.27);p("A5",.20,.18,.32);p("C6",.32,.25,.2);break;
   case "start": p("A4",0,.075,.3);p("C5",.095,.08,.26);p("E5",.19,.09,.26);p("A5",.31,.18,.35);break;
   case "question": p("E5",0,.055,.15);p("A5",.058,.072,.13);break;
   case "confirm": p("C5",0,.07,.19);p("G5",.09,.11,.17);break;
   case "correct": p("C5",0,.09,.25);p("E5",.09,.1,.27);p("G5",.18,.11,.28);p("C6",.285,.23,.31);break;
   case "wrong": p("B4",0,.115,.24,"F4");p("G4",.12,.16,.25,"C4");noise(.075,t+.05,.16,"fx");break;
   case "hint": p("D6",0,.078,.17,"A5");p("F5",.10,.19,.2,"C5");break;
   case "xp": p("G5",0,.06,.19);p("C6",.075,.13,.22);break;
   case "open": p("F5",0,.07,.16);p("A5",.09,.10,.22);break;
   case "shake": p("A3",0,.075,.1,"E3");break;
   case "burst": noise(.19,t,.25,"fx");p("C5",.025,.17,.23,"C6");p("G5",.11,.2,.2,"D6");break;
   case "reveal": p("C6",0,.075,.17);p("E6",.08,.1,.21);p("G6",.18,.25,.27);break;
   case "countdown": p("A5",0,.065,.17);break;
   case "finale": noise(.21,t,.24,"fx");["A5","C6","E6","A6","C7"].forEach((n,i)=>p(n,i*.095,.16,.2));break;
   case "finish": p("E5",0,.1,.18);p("A5",.10,.15,.22);p("C6",.28,.28,.21);break;
   case "exam-fail": p("E5",0,.16,.23);p("C5",.18,.21,.24);p("A4",.42,.37,.23);break;
   case "victory":
    ["C5","E5","G5","C6","E6","G6","C7"].forEach((n,i)=>p(n,i*.112,i===6?.46:.13,.23+(i*.013)));
    break;
   case "wasted":
    p("E5",0,.25,.26,"B4");p("C5",.29,.26,.28,"G4");p("F4",.6,.34,.32,"B3");
    p("E3",.95,.75,.22,"A2");noise(.13,t+.05,.17,"fx");break;
   default:break;
  }
 }
 // One shared compact audio control in the sticky game header, replacing the bag.
 // Remains accessible while answering questions and never changes the bottom navigation.
 const bars=[];
 function makeBar(host) {
  if(!host) return;
  const wrap=document.createElement("div");
  wrap.className="vice-ay-controls";
  wrap.setAttribute("role","group");
  wrap.setAttribute("aria-label","ZX Spectrum 128K audio");
  const music=document.createElement("button");
  const sound=document.createElement("button");
  for(const [button,kind,icon] of [[music,"music","♫"],[sound,"sfx","◖"]]){
   button.type="button";
   button.className="vice-ay-button";
   button.dataset.audio=kind;
   const sign=document.createElement("span");
   sign.className="vice-ay-icon";sign.setAttribute("aria-hidden","true");
   sign.innerHTML=kind==="music"
    ?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V5l11-2v12"/><circle cx="6.2" cy="18.2" r="3.2"/><circle cx="17.2" cy="16.2" r="3.2"/></svg>'
    :'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12"/></svg>';
   const title=document.createElement("span");
   title.className="vice-ay-label";
   button.append(sign,title);
   button.addEventListener("click",()=>{
    if(kind==="music") { musicOn=!musicOn;save(KEY_MUSIC,musicOn); }
    else { sfxOn=!sfxOn;save(KEY_SFX,sfxOn); }
    updateControls();
    if(isVice()) {
     if(kind==="music") {
      if(musicOn) { void unlock().then(()=>startMusic(true)); }
      else stopMusic();
     } else if(sfxOn) {
      void unlock().then(()=>fx("ui"));
     }
    }
   });
   wrap.append(button);
  }
  const state=document.createElement("span");
  state.className="vice-ay-state";
  state.setAttribute("aria-live","polite");
  wrap.append(state);
  host.append(wrap);
  bars.push({wrap,music,sound,state});
 }
 makeBar(document.querySelector(".neoline-site-header__actions"));
 // Active quizzes deliberately hide the main header: these synchronized
 // switches stay visible within the question card in ALL practice modes.
 makeBar(document.querySelector("#gamePlaying .question-eyebrow"));
 makeBar(document.querySelector("#gameResult"));
 makeBar(document.querySelector("#gameOver .gameover-card"));
 function updateControls() {
  const t=labels();
  for(const bar of bars) {
   for(const [button,kind,on,label] of [[bar.music,"music",musicOn,t.music],[bar.sound,"sfx",sfxOn,t.effects]]) {
    button.setAttribute("aria-pressed",String(on));
    button.setAttribute("aria-label",label+" — "+(on?t.on:t.off));
    button.title=label+" — "+(on?t.on:t.off);
    button.querySelector(".vice-ay-label").textContent=label;
    button.classList.toggle("is-off",!on);
    button.disabled=!AUDIO;
   }
   bar.state.textContent=!AUDIO?t.unavailable : (musicOn&&ctx?.state!=="running" ? t.tap : t.chip);
  }
 }
 // Browser autoplay: sound only starts after a real pointer/key gesture.
 document.addEventListener("pointerdown",e=>{
  if(!isVice() || !e.target.closest("button,a,select,[role='button']")) return;
  void unlock();
 },{capture:true,passive:true});
 document.addEventListener("keydown",e=>{
  if((e.key==="Enter"||e.key===" ") && isVice() && e.target.closest("button,a,select")) void unlock();
 },{capture:true});
 document.addEventListener("click",e=>{
  if(!isVice()) return;
  const b=e.target.closest("button,a,[role='button']");
  if(!b || b.closest(".vice-ay-controls") || b.matches("[data-vice-theme-toggle]") || b.matches(".answer") || b.matches("[data-mode]"))return;
  const now=performance.now();
  if(now-lastClick<53)return;
  lastClick=now;
  if(b.matches(".theory-promo-dot,.vice-cinema-arrow")) fx("slide");
  else if(b.matches("#exitQuiz,#dock4Modes,#backToModes,#gameOverModes,#gameOverClose"))fx("back");
  else if(b.matches("[data-gift-preview]"))fx("open");
  else fx("ui");
 },{capture:true});
 // Quiet rollover clicks for pointer devices only; no synth spam on touch.
 document.addEventListener("pointerover",e=>{
  if(!isVice() || e.pointerType!=="mouse" || !sfxOn)return;
  const b=e.target.closest("button");
  if(!b || b.contains(e.relatedTarget) || performance.now()-lastHover<110)return;
  lastHover=performance.now();
  if(!b.disabled) fx("ui");
 },{passive:true});
 window.addEventListener("neoline:vice-theme",e=>{
  const on=!!e.detail?.enabled;
  updateControls();
  if(on && !lastTheme) {
   scene=guessScene();
   // For direct button activation this event executes in a user gesture.
   void unlock().then(ok=>{if(ok){fx("enable");startMusic(true)}});
  }
  if(!on) stopMusic();
  lastTheme=on;
 });
 window.addEventListener("neoline:theory-quiz",e=>{
  if(!isVice())return;
  const d=e.detail||{};
  if(d.mode && TRACKS[d.mode]) currentMode=d.mode;
  const wasScene=scene;
  changeScene(guessScene());
  if(isQuizScene()&&wasScene!==scene) {lastDone=0;fx("start");return}
  if(isQuizScene() && !d.answered && Number.isFinite(d.done) && d.done>lastDone) {
   if(lastDone>=0) fx("question");
   lastDone=d.done;
  }
 });
 window.addEventListener("neoline:theory-answer",e=>{
  if(!isVice())return;
  // A mock exam must never reveal whether an answer is correct before results.
  fx(e.detail?.mode==="exam"?"confirm":e.detail?.correct?"correct":"wrong");
 });
 window.addEventListener("neoline:theory-hint",()=>{if(isVice())fx("hint")});
 window.addEventListener("neoline:theory-finish",e=>{
  if(!isVice())return;
  changeScene(e.detail?.gameOver?"fail":"result");
  const d=e.detail||{};
  if(d.gameOver)fx("wasted");
  else if(d.mode==="exam")fx(d.correct>=26?"victory":"exam-fail");
  else fx(d.total>0 && d.correct/d.total>=.8?"victory":"finish");
 });
 const gift=byId("gameGiftReveal");
 const dialog=byId("gameGiftDialog");
 if(gift) {
  new MutationObserver(()=>{
   if(!isVice()||!dialog?.open)return;
   const phase=gift.dataset.phase;
   if(phase==="shake")fx("shake");
   else if(phase==="burst")fx("burst");
   else if(phase==="revealed")fx("reveal");
  }).observe(gift,{attributes:true,attributeFilter:["data-phase"]});
 }
 const firework=byId("gameGiftScreenBurst");
 if(firework){
  let hadRing=false;
  new MutationObserver(()=>{
   const hasRing=!!firework.querySelector(".gift-burst-ring");
   if(!hadRing && hasRing && dialog?.open)fx("finale");
   hadRing=hasRing;
  }).observe(firework,{childList:true});
 }
 const clock=byId("timer");
 if(clock) {
  let lastSecond=null;
  new MutationObserver(()=>{
   if(!isVice() || scene!=="exam" || byId("timerBox")?.hidden)return;
   const m=/^(\d\d):(\d\d)$/.exec(clock.textContent.trim());
   if(!m)return;
   const sec=+m[1]*60 + +m[2];
   if(sec>0 && sec<=10 && sec!==lastSecond)fx("countdown");
   lastSecond=sec;
  }).observe(clock,{childList:true,characterData:true,subtree:true});
 }
 if(dialog){
  new MutationObserver(()=>{
   if(ctx&&musicOn&&isVice()&&ctx.state==="running"&&scene!=="fail")
    setBus(dialog.open?.085:isQuizScene()?.22:.185);
  }).observe(dialog,{attributes:true,attributeFilter:["open"]});
 }
 document.addEventListener("visibilitychange",()=>{
  if(!ctx)return;
  if(document.hidden){
   stopMusic();
   if(ctx.state==="running") void ctx.suspend().catch(()=>{});
  } else if(isVice()&&unlocked) {
   void ctx.resume().then(()=>{changeScene(guessScene());startMusic(true);updateControls()}).catch(()=>{});
  }
 });
 window.addEventListener("pagehide",()=>{
  stopMusic();
  if(ctx&&ctx.state==="running")void ctx.suspend().catch(()=>{});
 });
 window.addEventListener("pageshow",()=>{
  if(isVice()&&ctx&&unlocked&&!document.hidden)
   void ctx.resume().then(()=>{changeScene(guessScene());startMusic(true)}).catch(()=>{});
 });
 window.addEventListener("storage",e=>{
  if(e.key!==KEY_MUSIC && e.key!==KEY_SFX)return;
  musicOn=stored(KEY_MUSIC,true);sfxOn=stored(KEY_SFX,true);
  updateControls();
  if(!musicOn)stopMusic();
  else if(isVice()&&unlocked)startMusic(true);
 });
 new MutationObserver(updateControls).observe(root,{attributes:true,attributeFilter:["lang"]});
 updateControls();
})();