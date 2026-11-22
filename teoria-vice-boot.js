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
const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||false;
const overlay=document.createElement("div");
overlay.className="vice-boot-overlay";
overlay.setAttribute("aria-hidden","true");
overlay.innerHTML=[
 '<img class="vice-boot-art" src="./assets/teoria/vice-boot-sunset-city.svg?v=20261122-approved-neon-art-v1" alt="" aria-hidden="true" decoding="async">',
 '<div class="vice-boot-grain"></div>',
 '<div class="vice-boot-topline"><span><b>NEOLINE</b> // ARCADE SYSTEM</span><span>128K · AY-3-8912</span></div>',
 '<div class="vice-boot-body">',
 '<div class="vice-boot-icon" aria-hidden="true"><svg class="vice-boot-cassette" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 101" role="presentation" focusable="false"><defs><linearGradient id="neolineTapeBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f8c5d7"/><stop offset=".25" stop-color="#ff9cc9"/><stop offset=".65" stop-color="#c26fa9"/><stop offset="1" stop-color="#7a438d"/></linearGradient><linearGradient id="neolineTapeLabel" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe6ed"/><stop offset="1" stop-color="#f6a5cd"/></linearGradient></defs><path d="M14 9H140Q147 9 147 17V86Q147 94 139 94H15Q7 94 7 86V17Q7 9 14 9Z" fill="url(#neolineTapeBody)" stroke="#fff0f3" stroke-width="2"/><path d="M17 16H137V74H17Z" fill="#211638" stroke="#efb7d5" stroke-width="1.5"/><path d="M23 19H131V38H23Z" fill="url(#neolineTapeLabel)"/><text x="29" y="31.5" fill="#5e2459" font-family="Arial, sans-serif" font-weight="900" font-size="10" letter-spacing="1">ZX SPECTRUM</text><text x="129" y="31.5" fill="#872d68" font-family="Arial, sans-serif" text-anchor="end" font-weight="900" font-size="9">128K</text><path d="M23 42H131V72H23Z" fill="#130f2b" stroke="#ffc6e6" stroke-width=".7"/><path d="M39 56H115" stroke="#c05a98" stroke-width="2.6"/><circle cx="49" cy="56" r="13.5" fill="#e5b9d4" stroke="#fff5f4" stroke-width="1.3"/><circle cx="105" cy="56" r="13.5" fill="#e5b9d4" stroke="#fff5f4" stroke-width="1.3"/><g class="vice-boot-reel vice-boot-reel--left" fill="#74356c"><path d="M46 45h6v7h-6zM40 57l4-4 5 5-5 4zM50 60l6-5 4 4-6 6z"/></g><g class="vice-boot-reel vice-boot-reel--right" fill="#74356c"><path d="M102 45h6v7h-6zM96 57l4-4 5 5-5 4zM106 60l6-5 4 4-6 6z"/></g><circle cx="49" cy="56" r="3.2" fill="#17102f"/><circle cx="105" cy="56" r="3.2" fill="#17102f"/><path d="M40 79H114L123 90H31Z" fill="#532a67" stroke="#f6c0dd" stroke-width="1.3"/><path d="M59 79L62 85H92L95 79" stroke="#fae5e7" fill="none" stroke-width="1.2"/><circle cx="18" cy="84" r="2.6" fill="#d4ecf0"/><circle cx="136" cy="84" r="2.6" fill="#d4ecf0"/></svg></div>',
 '<div class="vice-boot-kicker"></div>',
 '<div class="vice-boot-title"><span>VICE</span> <em>MODE</em></div>',
 '<p class="vice-boot-deck"></p>',
 '<div class="vice-boot-meter"><span></span></div>',
 '<div class="vice-boot-status" role="presentation"></div>',
 '</div>',
 '<div class="vice-boot-bottomline"><span>NEON CITY  //  ZX 128K</span><span>EST. <b>1988</b></span></div>'
].join("");
document.body.append(overlay);
const kicker=overlay.querySelector(".vice-boot-kicker");
const deck=overlay.querySelector(".vice-boot-deck");
const status=overlay.querySelector(".vice-boot-status");
const wake=document.createElement("div");
wake.className="vice-audio-wake";
wake.setAttribute("role","group");
wake.innerHTML='<button type="button" class="vice-audio-wake-start"></button><button type="button" class="vice-audio-wake-dismiss" aria-label="Dismiss" title="Dismiss">×</button>';
document.body.append(wake);
const startButton=wake.querySelector(".vice-audio-wake-start");
const dismissButton=wake.querySelector(".vice-audio-wake-dismiss");
let entering=false,shown=false,dismissed=false,shortTimer=0,clearTimer=0,lastStatus=null;
let prevOn=root.dataset.viceTheme==="on";
const isOn=()=>root.dataset.viceTheme==="on";
function translate(){
 const x=t();
 kicker.textContent=x.kicker;
 deck.textContent=x.deck;
 status.textContent=x.loading;
 startButton.textContent=x.start;
 dismissButton.setAttribute("aria-label",x.dismiss);
 dismissButton.title=x.dismiss;
}
function hideWake(){wake.classList.remove("is-visible")}
function refreshWake(){
 if(shown||!isOn()||dismissed){hideWake();return}
 const info=window.neolineGetAYAudioState?.()||lastStatus;
 if(!info||!info.musicOn||info.error||!info.blocked){hideWake();return}
 wake.classList.add("is-visible");
}
function finish(){
 if(!entering)return;
 entering=false;
 overlay.classList.add("is-ready");
 status.textContent=t().ready;
 clearTimeout(clearTimer);
 clearTimer=setTimeout(()=>{
  overlay.classList.remove("is-active","is-ready");
  shown=false;
  refreshWake();
 },reduce?40:260);
}
function begin(initial=false){
 if(document.hidden)return;
 clearTimeout(shortTimer);clearTimeout(clearTimer);
 hideWake();
 entering=true;shown=true;
 translate();
 overlay.classList.remove("is-active","is-ready");
 void overlay.offsetHeight;
 overlay.classList.add("is-active");
 shortTimer=setTimeout(finish,reduce?210:initial?1180:1510);
}
function cancel(){
 clearTimeout(shortTimer);clearTimeout(clearTimer);
 entering=false;shown=false;dismissed=false;
 overlay.classList.remove("is-active","is-ready");
 hideWake();
}
function switchTheme(enabled){
 if(enabled&&!prevOn){dismissed=false;begin(false)}
 else if(!enabled&&prevOn)cancel();
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
window.addEventListener("neoline:vice-theme",e=>switchTheme(!!e.detail?.enabled));
window.addEventListener("neoline:ay-status",e=>{
 lastStatus=e.detail||null;
 refreshWake();
});
new MutationObserver(translate).observe(root,{attributes:true,attributeFilter:["lang"]});
translate();
if(prevOn)begin(true);
})();