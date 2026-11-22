/* NEOLINE exam clock — binds visual feedback to the EXISTING 40-minute
 * exam timer. Never starts a second countdown and never changes quiz state. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const heart=$("dock4Hearts");
const timer=$("timer");
const box=$("timerBox");
const playing=$("gamePlaying");
const root=document.documentElement;
if(!heart||!timer||!box||!playing)return;

const dialMarkup='<span class="vice-exam-clock" aria-hidden="true">'+
 '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">'+
 '<circle cx="16" cy="17" r="10.25" fill="none" stroke="currentColor" stroke-width="2"/>'+
 '<path d="M13 3h6M16 3v3M24 8l2-2" fill="none" stroke="#ffe6ad" stroke-width="2.2" stroke-linecap="round"/>'+
 '<path d="M16 11v6l4.7 3" fill="none" stroke="#ffe2a6" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>'+
 '<path class="vice-exam-sweep" d="M16 17V9" fill="none" stroke="#79f5ff" stroke-width="1.5" stroke-linecap="round"/>'+
 '<circle cx="16" cy="17" r="1.65" fill="#fff3d1"/>'+
 '</svg></span>';
const titles={
 ru:"Осталось времени экзамена",
 en:"Exam time remaining",
 he:"הזמן שנותר למבחן",
 ar:"الوقت المتبقي للامتحان"
};
const language=()=>String(root.lang||"ru").split("-")[0];
const clockChip=()=>document.querySelector("#gamePlaying .vice-quiz-timer");

function render(){
 const inner=heart.querySelector(":scope > span");
 if(!inner)return;
 const isExam=heart.dataset.exam==="true";
 const inGame=!playing.hidden&&!document.body.classList.contains("game-over-open");
 const neon=root.dataset.viceTheme==="on";
 const active=neon&&isExam&&inGame&&!box.hidden;
 const chip=clockChip();

 if(!active){
  if(inner.querySelector(".vice-exam-clock")&&isExam)inner.textContent="⏱";
  if(chip){chip.classList.remove("is-live");delete chip.dataset.timeLevel;}
  delete heart.dataset.timeLevel;
  return;
 }
 const m=String(timer.textContent||"").trim().match(/^(\d{1,3}):([0-5]\d)$/);
 if(!m)return;
 const remaining=Number(m[1])*60+Number(m[2]);
 const portion=Math.max(0,Math.min(1,remaining/(40*60)));
 const level=remaining<=60?"critical":remaining<=300?"warning":"normal";
 if(!inner.querySelector(".vice-exam-clock"))inner.innerHTML=dialMarkup;
 heart.style.setProperty("--vice-clock-angle",(portion*360).toFixed(2)+"deg");
 heart.style.setProperty("--vice-clock-hand",((60-Number(m[2]))%60*6)+"deg");
 heart.dataset.timeLevel=level;
 const label=(titles[language()]||titles.ru)+": "+timer.textContent.trim();
 heart.setAttribute("aria-label",label);
 heart.title=label;
 if(chip){
  chip.classList.toggle("is-live",!chip.hidden);
  chip.dataset.timeLevel=level;
  chip.title=label;
 }
}
let queued=false;
function schedule(){
 if(queued)return;
 queued=true;
 queueMicrotask(()=>{queued=false;render()});
}
// Watch the authoritative countdown. No setInterval is used here.
new MutationObserver(schedule).observe(timer,{characterData:true,childList:true,subtree:true});
new MutationObserver(schedule).observe(box,{attributes:true,attributeFilter:["hidden"]});
new MutationObserver(schedule).observe(heart,{attributes:true,attributeFilter:["data-exam"],childList:true,subtree:true});
new MutationObserver(schedule).observe(playing,{attributes:true,attributeFilter:["hidden"]});
new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:["data-vice-theme","lang"]});
window.addEventListener("neoline:theory-quiz",schedule);
window.addEventListener("neoline:theory-finish",schedule);
window.addEventListener("neoline:vice-theme",schedule);
schedule();
})();
