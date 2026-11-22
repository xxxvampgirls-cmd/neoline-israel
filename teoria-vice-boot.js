/* NEOLINE · original Vice Mode cinematic system-start overlay.
   Visual only; lets AY audio wake on a tap if autoplay is restricted. */
(()=>{
"use strict";
if(window.__neolineViceBoot)return;
window.__neolineViceBoot=true;
const root=document.documentElement;
const language=()=>String(root.lang||"ru").split("-")[0];
const copy={
 ru:{kicker:"ВОСЬМИБИТНЫЙ ГОРОД • 1988",deck:"Система готовится к поездке",loading:"ЗАГРУЗКА ГОРОДА · AY-3-8912",ready:"СИСТЕМА ЗАПУЩЕНА",start:"♫ НАЖМИ, ЧТОБЫ ВКЛЮЧИТЬ МУЗЫКУ",dismiss:"Продолжить без звука"},
 en:{kicker:"8-BIT CITY • 1988",deck:"Preparing your next drive",loading:"LOADING CITY · AY-3-8912",ready:"SYSTEM ONLINE",start:"♫ TAP TO START MUSIC",dismiss:"Continue without audio"},
 he:{kicker:"עיר 8 ביט • 1988",deck:"מתכוננים לנסיעה",loading:"טעינת העיר · AY-3-8912",ready:"המערכת מוכנה",start:"♫ לחצו להפעלת מוזיקה",dismiss:"להמשיך בלי שמע"},
 ar:{kicker:"مدينة 8 بت • 1988",deck:"الاستعداد للقيادة",loading:"تحميل المدينة · AY-3-8912",ready:"النظام جاهز",start:"♫ اضغط لتشغيل الموسيقى",dismiss:"المتابعة بلا صوت"}
};
const t=()=>copy[language()]||copy.ru;
const tapeCopy={
 ru:{stages:["МОТОР КАССЕТЫ · PLAY ▶","ПИЛОТ-СИГНАЛ","ПАУЗА · МЕЖДУ БЛОКАМИ","СИНХРОНИЗАЦИЯ БЛОКА","ЧТЕНИЕ ДАННЫХ ZX","ПАУЗА · ЗАПИСЬ БЛОКА","ЗАГРУЗКА ГОРОДА","ПАУЗА · СЛЕДУЮЩИЙ БЛОК","ДАННЫЕ ZX · ФИНАЛ","ПРОВЕРКА ДАННЫХ"],skip:"ПРОПУСТИТЬ ►",tap:"КОСНИСЬ ЭКРАНА ДЛЯ ЗВУКА",block:"БЛОК"},
 en:{stages:["TAPE MOTOR · PLAY ▶","PILOT TONE","PAUSE · BETWEEN BLOCKS","SYNCING BLOCK","READING ZX DATA","PAUSE · NEXT BLOCK","LOADING CITY","PAUSE · FINAL BLOCK","ZX DATA · FINAL","VERIFYING CHECKSUM"],skip:"SKIP ►",tap:"TAP FOR TAPE AUDIO",block:"BLOCK"},
 he:{stages:["מנוע הקלטת · PLAY ▶","אות פתיחה","הפסקה · בין בלוקים","סנכרון בלוק","קריאת נתונים","הפסקה · בלוק הבא","טעינת העיר","הפסקה · סיום","נתונים · בלוק סופי","בדיקת נתונים"],skip:"דלג ►",tap:"געו במסך לשמע",block:"בלוק"},
 ar:{stages:["محرك الشريط · PLAY ▶","نغمة البداية","توقف · بين الكتل","مزامنة الكتلة","قراءة البيانات","توقف · الكتلة التالية","تحميل المدينة","توقف · الكتلة الأخيرة","البيانات الأخيرة","التحقق من البيانات"],skip:"تخطي ►",tap:"المس الشاشة للصوت",block:"الكتلة"}
};
const words=()=>tapeCopy[language()]||tapeCopy.ru;
// The only timing authority is the same ZX ROM pulse table as the audio
// worklet. The complete first header pilot, sync and bytes are uncut.
const ZX_CLOCK=3500000;
const HEADER_BYTES=[0,3,78,69,79,76,73,78,69,32,32,32,0,192,0,0,0,0];
HEADER_BYTES.push(HEADER_BYTES.reduce((sum,byte)=>sum^byte,0));
const PILOT_MS=8063*2168*1000/ZX_CLOCK;
const HEADER_MS=(667+735+HEADER_BYTES.reduce((total,byte)=>{
 for(let bit=7;bit>=0;bit--)total+=(byte&(1<<bit))?3420:1710;
 return total;
},0))*1000/ZX_CLOCK;
const INTERBLOCK_MS=1000; // genuine between-block silence, never before sync
const DATA_PILOT_MS=3223*2168*1000/ZX_CLOCK;
const DATA_SYNC_MS=(667+735)*1000/ZX_CLOCK;
// Skip the first second of the intro; leave all later stages unchanged.
const START_TRIM_MS=1000;
const OPEN_MS=PILOT_MS+HEADER_MS+INTERBLOCK_MS+DATA_PILOT_MS+DATA_SYNC_MS-START_TRIM_MS;
const FULL_MS=3800,RELOAD_MS=3200,READY_PAUSE_MS=1700;
let stageIndex=0,currentDuration=OPEN_MS+FULL_MS,dataDuration=FULL_MS;
let timelineStarted=false,phaseDriven=false,pendingFallback=0;
const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||false;
const overlay=document.createElement("div");
overlay.className="vice-boot-overlay";
overlay.setAttribute("aria-hidden","true");
overlay.innerHTML=[
 '<img class="vice-boot-art vice-boot-art--ink" src="./assets/teoria/vice-boot-sunset-city.svg?v=20261122-approved-neon-art-v1" alt="" aria-hidden="true" decoding="async">',
 '<img class="vice-boot-art vice-boot-art--color" src="./assets/teoria/vice-boot-sunset-city.svg?v=20261122-approved-neon-art-v1" alt="" aria-hidden="true" decoding="async">',
 '<div class="vice-boot-grain"></div>',
 '<div class="vice-boot-tape-border" aria-hidden="true"></div>',
 '<div class="vice-boot-tape-screen" aria-hidden="true"></div>',
 '<div class="vice-boot-topline"><span><b>NEOLINE</b> // ARCADE SYSTEM</span><span>128K · AY-3-8912</span></div>',
 '<div class="vice-boot-body">',
 '<div class="vice-boot-icon" aria-hidden="true"><svg class="vice-boot-cassette" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 101" role="presentation" focusable="false"><defs><linearGradient id="neolineTapeBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f8c5d7"/><stop offset=".25" stop-color="#ff9cc9"/><stop offset=".65" stop-color="#c26fa9"/><stop offset="1" stop-color="#7a438d"/></linearGradient><linearGradient id="neolineTapeLabel" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe6ed"/><stop offset="1" stop-color="#f6a5cd"/></linearGradient></defs><path d="M14 9H140Q147 9 147 17V86Q147 94 139 94H15Q7 94 7 86V17Q7 9 14 9Z" fill="url(#neolineTapeBody)" stroke="#fff0f3" stroke-width="2"/><path d="M17 16H137V74H17Z" fill="#211638" stroke="#efb7d5" stroke-width="1.5"/><path d="M23 19H131V38H23Z" fill="url(#neolineTapeLabel)"/><text x="29" y="31.5" fill="#5e2459" font-family="Arial, sans-serif" font-weight="900" font-size="10" letter-spacing="1">ZX SPECTRUM</text><text x="129" y="31.5" fill="#872d68" font-family="Arial, sans-serif" text-anchor="end" font-weight="900" font-size="9">128K</text><path d="M23 42H131V72H23Z" fill="#130f2b" stroke="#ffc6e6" stroke-width=".7"/><path d="M39 56H115" stroke="#c05a98" stroke-width="2.6"/><circle cx="49" cy="56" r="13.5" fill="#e5b9d4" stroke="#fff5f4" stroke-width="1.3"/><circle cx="105" cy="56" r="13.5" fill="#e5b9d4" stroke="#fff5f4" stroke-width="1.3"/><g class="vice-boot-reel vice-boot-reel--left" fill="#74356c"><path d="M46 45h6v7h-6zM40 57l4-4 5 5-5 4zM50 60l6-5 4 4-6 6z"/></g><g class="vice-boot-reel vice-boot-reel--right" fill="#74356c"><path d="M102 45h6v7h-6zM96 57l4-4 5 5-5 4zM106 60l6-5 4 4-6 6z"/></g><circle cx="49" cy="56" r="3.2" fill="#17102f"/><circle cx="105" cy="56" r="3.2" fill="#17102f"/><path d="M40 79H114L123 90H31Z" fill="#532a67" stroke="#f6c0dd" stroke-width="1.3"/><path d="M59 79L62 85H92L95 79" stroke="#fae5e7" fill="none" stroke-width="1.2"/><circle cx="18" cy="84" r="2.6" fill="#d4ecf0"/><circle cx="136" cy="84" r="2.6" fill="#d4ecf0"/></svg></div>',
 '<div class="vice-boot-kicker"></div>',
 '<div class="vice-boot-title"><span>VICE</span> <em>MODE</em></div>',
 '<p class="vice-boot-deck"></p>',
 '<div class="vice-boot-meter"><span></span></div>',
 '<div class="vice-boot-status" role="presentation"></div>',
 '<div class="vice-boot-tape-info" aria-hidden="true"><span class="vice-boot-tape-file">LOAD "NEOLINE_VICE"</span><span class="vice-boot-tape-block"></span><span class="vice-boot-tape-bytes">00000 / 49152</span><span class="vice-boot-tape-touch" hidden></span></div>',
 '</div>',
 '<button type="button" class="vice-boot-tape-skip"></button>',
 '<div class="vice-boot-bottomline"><span>NEON CITY  //  ZX 128K</span><span>EST. <b>1988</b></span></div>',
 // Classic first 4.994s: only clean white screen, loading border and LOAD.
 '<div class="vice-boot-pilot" aria-hidden="true"><div class="vice-boot-pilot__border"></div><div class="vice-boot-pilot__line"><span class="vice-boot-pilot__load">LOAD</span><span class="vice-boot-pilot__cursor"></span></div></div>'
].join("");
document.body.append(overlay);
const kicker=overlay.querySelector(".vice-boot-kicker");
const deck=overlay.querySelector(".vice-boot-deck");
const status=overlay.querySelector(".vice-boot-status");
const bytes=overlay.querySelector(".vice-boot-tape-bytes");
const blocks=overlay.querySelector(".vice-boot-tape-block");
const skip=overlay.querySelector(".vice-boot-tape-skip");
const touch=overlay.querySelector(".vice-boot-tape-touch");
const wake=document.createElement("div");
wake.className="vice-audio-wake";
wake.setAttribute("role","group");
wake.innerHTML='<button type="button" class="vice-audio-wake-start"></button><button type="button" class="vice-audio-wake-dismiss" aria-label="Dismiss" title="Dismiss">×</button>';
document.body.append(wake);
const startButton=wake.querySelector(".vice-audio-wake-start");
const dismissButton=wake.querySelector(".vice-audio-wake-dismiss");
let entering=false,shown=false,dismissed=false,shortTimer=0,clearTimer=0,lastStatus=null;
let stageTimers=[],meterTimer=0,bootStartedAt=0;
let prevOn=root.dataset.viceTheme==="on";
const isOn=()=>root.dataset.viceTheme==="on";
function translate(){
 const x=t(),w=words();
 kicker.textContent=x.kicker;
 deck.textContent=x.deck;
 status.textContent=entering?w.stages[stageIndex]:(shown?x.ready:x.loading);
 blocks.textContent=w.block+" "+(stageIndex>=6?"02":"01")+" / 02";
 skip.textContent=w.skip;
 touch.textContent=w.tap;
 startButton.textContent=x.start;
 dismissButton.setAttribute("aria-label",x.dismiss);
 dismissButton.title=x.dismiss;
}
function hideWake(){wake.classList.remove("is-visible")}
function updateTapeHint(){
 const info=window.neolineGetAYAudioState?.()||lastStatus;
 touch.hidden=!entering||!info?.sfxOn||!info?.blocked;
}
function refreshWake(){
 if(shown||!isOn()||dismissed){hideWake();return}
 const info=window.neolineGetAYAudioState?.()||lastStatus;
 if(!info||!info.musicOn||info.error||!info.blocked){hideWake();return}
 wake.classList.add("is-visible");
}
function clearStages(){
 for(const tid of stageTimers)clearTimeout(tid);
 stageTimers=[];clearInterval(meterTimer);meterTimer=0;
 clearTimeout(pendingFallback);pendingFallback=0;
}
function onTapePhase(phase){
 if(!entering||!isOn())return;
 phaseDriven=true;
 overlay.dataset.tapePhase=phase;
 if(phase==="pilot-header")startTimeline();
 if(phase==="data"||phase==="data-pause"||phase==="data-end"){
  if(!timelineStarted)startTimeline();
  overlay.classList.remove("is-pilot");
  overlay.classList.add("is-data");
 }
}
window.addEventListener("neoline:tape-phase",e=>onTapePhase(e.detail?.phase));
function startTimeline(){
 if(timelineStarted||!entering)return;
 timelineStarted=true;
 clearTimeout(pendingFallback);pendingFallback=0;
 bootStartedAt=performance.now();
 const schedule=[
  [.08,1],[.22,2],[.265,3],[.32,4],[.56,5],
  [.615,6],[.75,7],[.78,8],[.90,9]
 ];
 // These later visual stages begin only AFTER both genuine ROM pilot blocks.
 for(const [fraction,index] of schedule){
  stageTimers.push(setTimeout(()=>{
   if(!entering)return;
   stageIndex=index;translate();
  },OPEN_MS+Math.round(dataDuration*fraction)));
 }
 stageTimers.push(setTimeout(()=>{
  if(!entering)return;
  overlay.classList.remove("is-pilot");
  overlay.classList.add("is-data");
 },OPEN_MS));
 if(!reduce){
  meterTimer=setInterval(()=>{
   if(!entering)return;
   const fraction=Math.max(0,Math.min(1,
      (performance.now()-bootStartedAt-OPEN_MS)/dataDuration));
   const marks=[[0,0],[.08,.04],[.22,.24],[.265,.24],
    [.32,.32],[.56,.62],[.615,.62],[.75,.80],[.78,.80],[.92,1],[1,1]];
   let progress=1;
   for(let i=1;i<marks.length;i++){
    if(fraction<=marks[i][0]){
     const [t0,p0]=marks[i-1],[t1,p1]=marks[i];
     progress=p0+(p1-p0)*(fraction-t0)/(t1-t0);break;
    }
   }
   bytes.textContent=String(Math.floor(49152*progress)).padStart(5,"0")+" / 49152";
  },160);
  stageTimers.push(setTimeout(()=>{if(entering)skip.hidden=false},OPEN_MS+1200));
 }
 shortTimer=setTimeout(finish,currentDuration);
}
function finish(){
 if(!entering)return;
 clearTimeout(shortTimer);clearStages();
 entering=false;
 window.neolineCassetteLoading?.("hold");
 touch.hidden=true;
 overlay.classList.remove("is-pilot","is-data");
 overlay.classList.add("is-ready");
 status.textContent=t().ready;
 skip.hidden=true;
 bytes.textContent="49152 / 49152";
 clearTimeout(clearTimer);
 clearTimer=setTimeout(()=>{
  overlay.classList.remove("is-active","is-ready","is-first-paint");
  overlay.setAttribute("aria-hidden","true");
  shown=false;
  window.neolineCassetteLoading?.(false);
  refreshWake();
 },reduce?60:READY_PAUSE_MS);
}
function begin(initial=false){
 if(document.hidden)return;
 clearTimeout(shortTimer);clearTimeout(clearTimer);clearStages();
 hideWake();
 entering=true;shown=true;stageIndex=0;
 timelineStarted=false;phaseDriven=false;
 dataDuration=reduce?240:(initial?RELOAD_MS:FULL_MS);
 currentDuration=reduce?240:OPEN_MS+dataDuration;
 overlay.style.setProperty("--vice-boot-time",dataDuration+"ms");
 overlay.setAttribute("aria-hidden","false");
 skip.hidden=true;
 bytes.textContent="00000 / 49152";
 overlay.dataset.tapePhase="pilot-header";
 translate();
 overlay.classList.remove("is-active","is-ready","is-pilot","is-data","is-first-paint");
 void overlay.offsetHeight;
 // The HTML head paints the white LOAD screen before any deferred JavaScript.
 // Hand over to the real loader without ever exposing the game beneath it.
 const hasFirstPaint=root.dataset.viceBootPending==="1";
 if(hasFirstPaint)overlay.classList.add("is-first-paint");
 overlay.classList.add("is-active");
 if(!reduce)overlay.classList.add("is-pilot");
 if(hasFirstPaint)root.removeAttribute("data-vice-boot-pending");
 // The worklet tells the screen when the first sound REALLY starts.
 // For disabled/unavailable sound we retain a deterministic visual fallback.
 if(!reduce)window.neolineCassetteLoading?.(true,currentDuration);
 const info=window.neolineGetAYAudioState?.()||{};
 if(reduce){
  startTimeline();
 }else if(!info.sfxOn||info.error||typeof window.neolineCassetteLoading!=="function"){
  startTimeline();
 }else{
  pendingFallback=setTimeout(()=>{
   if(!entering||timelineStarted)return;
   const state=window.neolineGetAYAudioState?.()||{};
   // Never run through the pilot silently while Android blocks playback;
   // touching the white LOAD screen can unlock the worklet.
   if(state.blocked&&!state.error)return;
   startTimeline();
  },1800);
 }
}

function cancel(){
 clearTimeout(shortTimer);clearTimeout(clearTimer);clearStages();
 window.neolineCassetteLoading?.(false);
 touch.hidden=true;
 entering=false;shown=false;dismissed=false;timelineStarted=false;phaseDriven=false;
 overlay.setAttribute("aria-hidden","true");
 overlay.classList.remove("is-active","is-ready","is-pilot","is-data","is-first-paint");
 delete overlay.dataset.tapePhase;
 hideWake();
}
function switchTheme(enabled){
 if(enabled&&!prevOn){dismissed=false;begin(false)}
 else if(!enabled&&prevOn){cancel();root.removeAttribute("data-vice-boot-pending")}
 prevOn=enabled;
}
startButton.addEventListener("click",()=>{
 dismissed=true;hideWake();
 if(typeof window.neolineStartAYAudio==="function"){
  void window.neolineStartAYAudio().then(ok=>{
   if(!ok&&isOn()&&window.neolineGetAYAudioState?.().blocked){
    dismissed=false;refreshWake();
   }
  }).catch(()=>{dismissed=false;refreshWake()});
 }
});
dismissButton.addEventListener("click",()=>{dismissed=true;hideWake()});
skip.addEventListener("click",finish);
// Gesture unlock: the white ROM screen stays visually pure (LOAD + cursor).
// A tap starts audio on browsers that disallow automatic playback.
overlay.addEventListener("pointerdown",()=>{
 if(!entering||!isOn())return;
 if(window.neolineGetAYAudioState?.().blocked)
  void window.neolineStartAYAudio?.().catch(()=>{});
});
// Full navigation and Android's back/forward cache must keep the first
// visible paint covered, even when the game was already loaded previously.
window.addEventListener("pagehide",()=>{
 if(isOn())root.dataset.viceBootPending="1";
});
window.addEventListener("pageshow",event=>{
 if(event.persisted&&isOn()){
  root.dataset.viceBootPending="1";
  begin(true);
 }
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden&&entering)cancel();
 else if(!document.hidden&&isOn()&&root.dataset.viceBootPending==="1"&&!entering)
  begin(true);
});
window.addEventListener("neoline:vice-theme",e=>switchTheme(!!e.detail?.enabled));
window.addEventListener("neoline:ay-status",e=>{
 lastStatus=e.detail||null;
 updateTapeHint();
 refreshWake();
});
new MutationObserver(translate).observe(root,{attributes:true,attributeFilter:["lang"]});
translate();
if(prevOn)begin(true);
else root.removeAttribute("data-vice-boot-pending");
})();