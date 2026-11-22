/* NEOLINE / Circular radar + cinematic failure; visual-only enhancement.
   Quiz events remain the single source of progress, XP and remaining hearts. */
(()=>{
 "use strict";
 const root=document.documentElement;
 const progress=document.getElementById("dock4Progress");
 const overlay=document.getElementById("gameOver");
 const title=document.getElementById("gameOverTitle");
 if(!progress||!overlay||!title)return;
 const quizHeader=document.querySelector("#gamePlaying .quiz-hud");
 const backButton=document.getElementById("exitQuiz");
 const modeTitle=document.createElement("span");
 modeTitle.className="vice-hud-title";
 const modeNames={
  ru:{route:"Поездка по городу",signs:"Охота за знаками",exam:"Экзамен",mistakes:"Исправь ошибки",marathon:"Путь по всем билетам",daily:"Задание дня"},
  en:{route:"City drive",signs:"Road signs",exam:"Driving exam",mistakes:"Review mistakes",marathon:"All tickets",daily:"Daily challenge"},
  he:{route:"נסיעה בעיר",signs:"תמרורים",exam:"מבחן",mistakes:"תיקון טעויות",marathon:"כל השאלות",daily:"אתגר יומי"},
  ar:{route:"قيادة في المدينة",signs:"إشارات المرور",exam:"الامتحان",mistakes:"راجع الأخطاء",marathon:"كل الأسئلة",daily:"تحدي اليوم"}
 };
 let currentMode="route";
 const updateTitle=()=>{const lang=(root.lang||"ru").split("-")[0],d=modeNames[lang]||modeNames.ru;modeTitle.textContent=d[currentMode]||d.route};
 if(quizHeader&&backButton){backButton.insertAdjacentElement("afterend",modeTitle);updateTitle()}

 // Exam countdown continues to be controlled by the existing game engine.
 // Its original DOM remains in the hidden top HUD; this is display-only.
 const clockBox=document.getElementById("timerBox");
 const clockText=document.getElementById("timer");
 const questionEye=document.querySelector("#gamePlaying .question-eyebrow");
 const clockMirror=document.createElement("span");
 clockMirror.className="vice-quiz-timer";
 clockMirror.hidden=true;
 clockMirror.setAttribute("aria-live","off");
 if(questionEye&&clockBox&&clockText){
  const id=document.getElementById("questionId");
  if(id&&id.parentElement===questionEye)questionEye.insertBefore(clockMirror,id);
  else questionEye.append(clockMirror);
  const syncClock=()=>{
   clockMirror.hidden=clockBox.hidden;
   clockMirror.textContent="◷ "+clockText.textContent.trim();
  };
  new MutationObserver(syncClock).observe(clockBox,{attributes:true,attributeFilter:["hidden"]});
  new MutationObserver(syncClock).observe(clockText,{childList:true,subtree:true,characterData:true});
  syncClock();
 }


 // A real vector route with a moving location marker. It is intentionally
 // aria-hidden because the parent progressbar already announces done / total.
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.classList.add("vice-radar-map");
 svg.setAttribute("viewBox","0 0 100 100");
 svg.setAttribute("aria-hidden","true");
 svg.setAttribute("focusable","false");
 svg.innerHTML=`
  <defs>
   <clipPath id="viceRadarClip"><circle cx="50" cy="50" r="48"/></clipPath>
   <radialGradient id="viceRadarSea"><stop stop-color="#294f61"/><stop offset="1" stop-color="#152237"/></radialGradient>
   <linearGradient id="viceRadarBlue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b0fff3"/><stop offset=".6" stop-color="#52e8ff"/><stop offset="1" stop-color="#83adff"/></linearGradient>
   <filter id="viceRadarGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8"/></filter>
  </defs>
  <g clip-path="url(#viceRadarClip)">
   <circle cx="50" cy="50" r="50" fill="url(#viceRadarSea)"/>
   <g fill="none" stroke="#a3b0bb" stroke-opacity=".26" stroke-width="3.2" stroke-linecap="round">
    <path d="M-10 20 110 39M-5 79 105 65M8-5 31 109M66-5 82 107"/>
    <path d="M0 44 Q35 53 68 25 T108 6M2 94 Q48 88 58 107"/>
   </g>
   <g fill="none" stroke="#7f98a6" stroke-opacity=".2" stroke-width="1.4">
    <path d="M10 0V100M42 0V100M74 0V100M0 17H100M0 49H100M0 82H100"/>
   </g>
   <g fill="#406273" fill-opacity=".62" stroke="#93a6ad" stroke-opacity=".26" stroke-width=".6">
    <rect x="14" y="5" width="13" height="13" rx="2"/>
    <rect x="46" y="9" width="20" height="12" rx="2"/>
    <rect x="78" y="44" width="15" height="14" rx="2"/>
    <rect x="7" y="54" width="15" height="12" rx="2"/>
    <rect x="38" y="72" width="15" height="16" rx="2"/>
   </g>
   <path id="viceRadarRoute" d="M14 74 Q22 70 27 61 L40 59 Q47 57 47 46 L60 37 Q67 31 79 25" fill="none" stroke="#9a6fbc" stroke-opacity=".6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
   <path id="viceRadarFill" d="M14 74 Q22 70 27 61 L40 59 Q47 57 47 46 L60 37 Q67 31 79 25" fill="none" stroke="url(#viceRadarBlue)" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#viceRadarGlow)"/>
   <circle cx="79" cy="25" r="5.8" fill="#172a42" stroke="#98f6ff" stroke-width="2.2"/>
   <circle cx="79" cy="25" r="1.9" fill="#fffbe9"/>
   <g id="viceRadarMarker" transform="translate(14 74)">
    <circle r="7" fill="#60faff" opacity=".24"/>
    <circle r="4.1" fill="#54dcff" stroke="#f7fbff" stroke-width="1.7"/>
    <circle r="1.35" fill="#fff"/>
   </g>
  </g>`;
 progress.insertBefore(svg,progress.firstChild);
 const path=svg.querySelector("#viceRadarRoute");
 const fill=svg.querySelector("#viceRadarFill");
 const marker=svg.querySelector("#viceRadarMarker");
 const length=path.getTotalLength();
 fill.style.strokeDasharray=length+" "+length;
 let currentRatio=-1;
 function paintRoute(done,total){
  const n=Math.max(1,Number(total)||1);
  const ratio=Math.max(0,Math.min(1,(Number(done)||0)/n));
  if(ratio===currentRatio)return;
  currentRatio=ratio;
  fill.style.strokeDashoffset=String(length*(1-ratio));
  const point=path.getPointAtLength(length*ratio);
  marker.setAttribute("transform","translate("+point.x.toFixed(2)+" "+point.y.toFixed(2)+")");
  svg.dataset.progress=Math.round(ratio*100);
 }
 window.addEventListener("neoline:theory-quiz",e=>{
  const d=e.detail||{};
  if(d.mode){currentMode=d.mode;updateTitle()}
  paintRoute(d.done,d.total);
 });
 const initial=(document.getElementById("dock4Count")?.textContent||"0/10").split("/");
 paintRoute(initial[0],initial[1]);

 const headings={ru:"ПОТРАЧЕНО",en:"WASTED",he:"נגמר המשחק",ar:"انتهت المحاولات"};
 const label=()=>headings[(root.lang||"ru").split("-")[0]]||headings.ru;
 function syncWasted(){
  const neon=root.dataset.viceTheme==="on";
  const gameOverVisible=!overlay.hidden;
  title.textContent=neon?label():"GAME OVER";
  overlay.classList.toggle("vice-wasted",neon&&gameOverVisible);
 }
 new MutationObserver(syncWasted).observe(overlay,{attributes:true,attributeFilter:["hidden"]});
 new MutationObserver(()=>{updateTitle();syncWasted()}).observe(root,{attributes:true,attributeFilter:["lang","data-vice-theme"]});
 window.addEventListener("neoline:vice-theme",syncWasted);
 window.addEventListener("neoline:theory-finish",syncWasted);
 syncWasted();
})();
