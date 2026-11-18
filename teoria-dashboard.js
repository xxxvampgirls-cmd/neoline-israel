/* Live hero stats for NEOLINE Theory; no fabricated progress and no external calls. */
(()=>{
"use strict";
const root=document.querySelector(".game-hero.theory-dashboard");
if(!root)return;
const $=id=>document.getElementById(id);
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
const copy={
 ru:{questions:"Вопросы",accuracy:"Точность",xp:"Опыт (XP)",of:"из",progress:"Игровой прогресс"},
 en:{questions:"Questions",accuracy:"Accuracy",xp:"XP earned",of:"of",progress:"Game progress"},
 he:{questions:"שאלות",accuracy:"דיוק",xp:"נקודות XP",of:"מתוך",progress:"התקדמות במשחק"}
};
const stat={
 seen:{number:0,animated:0,ring:"heroSeenRing",id:"heroSeenValue"},
 accuracy:{number:null,animated:null,ring:"heroAccuracyRing",id:"heroAccuracyValue"},
 xp:{number:0,animated:0,ring:"heroXPRing",id:"heroXPValue"}
};
let lang="ru",total=0,first=true;
const fmt=n=>new Intl.NumberFormat(lang==="he"?"he-IL":lang==="en"?"en-GB":"ru-RU").format(n);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function setText(){
 const t=copy[lang]||copy.ru;
 $("heroSeenLabel").textContent=t.questions;
 $("heroAccuracyLabel").textContent=t.accuracy;
 $("heroXPLabel").textContent=t.xp;
 $("heroTotal").textContent=t.of+" "+(total?fmt(total):"—");
 root.querySelector(".hero-orbs").setAttribute("aria-label",t.progress);
}
function animateValue(key,value){
 const obj=stat[key],el=$(obj.id);
 if(value===null){obj.number=null;el.textContent="—";return}
 const safe=clamp(Number(value)||0,0,10000000);
 if(reduce.matches||document.hidden||first){
   el.textContent=fmt(safe)+(key==="accuracy"?"%":"");
   obj.number=safe;return;
 }
 const before=Number.isFinite(obj.number)?obj.number:safe;
 const change=safe-before;
 if(!change){el.textContent=fmt(safe)+(key==="accuracy"?"%":"");return}
 const serial=Symbol(key);obj.serial=serial;
 const start=performance.now(),duration=640;
 const step=(now)=>{
   if(obj.serial!==serial)return;
   const t=clamp((now-start)/duration,0,1);
   const ease=1-Math.pow(1-t,3);
   el.textContent=fmt(Math.round(before+change*ease))+(key==="accuracy"?"%":"");
   if(t<1)requestAnimationFrame(step);
   else obj.number=safe;
 };
 requestAnimationFrame(step);
}
function update(event){
 const d=event.detail||{};
 lang=copy[d.language]?d.language:"ru";
 const seen=clamp(Number(d.seen)||0,0,10000000);
 total=clamp(Number(d.total)||0,0,10000000);
 const accuracy=d.accuracy===null?null:clamp(Number(d.accuracy)||0,0,100);
 const xp=clamp(Number(d.xp)||0,0,10000000);
 setText();
 animateValue("seen",seen);
 animateValue("accuracy",accuracy);
 animateValue("xp",xp);
 // Each circumference depicts real coverage; XP arc is decorative because
 // the game does not define XP tiers / a fixed maximum.
 const degreeSeen=total?clamp(seen/total,0,1)*360:0;
 const degreeAccuracy=accuracy===null?0:accuracy*3.6;
 requestAnimationFrame(()=>{
   $("heroSeenRing").style.setProperty("--orb-sweep",degreeSeen.toFixed(1)+"deg");
   $("heroAccuracyRing").style.setProperty("--orb-sweep",degreeAccuracy.toFixed(1)+"deg");
   $("heroXPRing").style.setProperty("--orb-sweep","265deg");
 });
 first=false;
}
window.addEventListener("neoline:theory-progress",update);
const t=copy.ru;
$("heroSeenLabel").textContent=t.questions;
$("heroAccuracyLabel").textContent=t.accuracy;
$("heroXPLabel").textContent=t.xp;
})();