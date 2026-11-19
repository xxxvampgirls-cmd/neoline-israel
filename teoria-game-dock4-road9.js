/* Selected NEOLINE designs 4 + 9: in-session dock and scenic progress.
 * No fake game stats. Existing quiz engine remains authoritative. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const playing=$("gamePlaying"),dock=$("theoryGameDock"),siteNav=$("theoryBottomNav");
if(!playing||!dock||!siteNav)return;
const lang=()=>{const l=String(document.documentElement.lang||"ru").split("-")[0];return l==="en"||l==="he"?l:"ru"};
const labels={
 ru:{modes:"Режимы",back:"К выбору режимов",progress:"Пройдено вопросов",hearts:"Осталось жизней",
  hint:"Подсказка",hintUsed:"Подсказка уже использована в этом вопросе",
  hintNone:"Подсказки закончились",examNoHint:"В экзамене подсказки недоступны",
  stats:"Мой прогресс",exam:"Экзамен",unlimited:"Без ограничений жизней"},
 en:{modes:"Modes",back:"Back to game modes",progress:"Questions answered",hearts:"Lives left",
  hint:"Hint",hintUsed:"Hint used for this question",hintNone:"No hints left",
  examNoHint:"Hints are not available during the exam",
  stats:"My progress",exam:"Exam",unlimited:"Unlimited lives"},
 he:{modes:"מצבים",back:"בחירת מצב משחק",progress:"שאלות שנענו",hearts:"חיים שנותרו",
  hint:"רמז",hintUsed:"הרמז לשאלה זו כבר נוצל",hintNone:"אין רמזים נוספים",
  examNoHint:"אין רמזים במבחן",stats:"ההתקדמות שלי",exam:"מבחן",unlimited:"ללא הגבלת חיים"}
};
let game={done:0,total:10,lives:3,earned:0,mode:null,hintsLeft:3,hintUsed:false,answered:false};
function current(){return labels[lang()]||labels.ru}

let routeVisibleRatio=null,routeGoal=null,routeFrame=0;
function drawRouteAt(ratio){
 const path=$("gameQuizRouteBase"),fill=$("gameQuizRouteFill"),dot=$("gameQuizRouteCar");
 if(!path||!fill||!dot||typeof path.getTotalLength!=="function")return;
 const length=path.getTotalLength();
 if(!length)return;
 const p=Math.max(0,Math.min(1,ratio));
 fill.style.strokeDasharray=length+" "+length;
 fill.style.strokeDashoffset=(length*(1-p)).toFixed(3);
 const point=path.getPointAtLength(length*p);
 const rtl=document.documentElement.dir==="rtl";
 dot.style.left=(rtl?100-point.x/10:point.x/10).toFixed(3)+"%";
 dot.style.top=point.y.toFixed(3)+"%";
}
function moveRouteMarker(goal){
 const target=Math.max(0,Math.min(1,goal));
 if(routeGoal===target && routeFrame)return;
 routeGoal=target;
 if(routeFrame){cancelAnimationFrame(routeFrame);routeFrame=0}
 const from=routeVisibleRatio===null?target:routeVisibleRatio;
 const noMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(noMotion||Math.abs(from-target)<.00001){
  routeVisibleRatio=target;drawRouteAt(target);return;
 }
 const start=performance.now(),duration=580;
 const frame=now=>{
  const t=Math.min(1,Math.max(0,(now-start)/duration));
  const eased=1-Math.pow(1-t,3);
  routeVisibleRatio=from+(target-from)*eased;
  drawRouteAt(routeVisibleRatio);
  routeFrame=t<1?requestAnimationFrame(frame):0;
 };
 routeFrame=requestAnimationFrame(frame);
}
function syncStage(){
 const active=!playing.hidden&&!document.body.classList.contains("game-over-open");
 dock.hidden=!active;
 document.body.classList.toggle("theory-in-session",active);
 if(!active){
  siteNav.classList.remove("nav-scroll-hidden");
  // Always restore the original site navigation after game results.
 }
}
function updateUI(){
 const c=current(),done=Math.max(0,Math.round(Number(game.done)||0)),total=Math.max(1,Math.round(Number(game.total)||1));
 const ratio=Math.max(0,Math.min(1,done/total));
 const progress=$("dock4Progress"),counter=$("dock4Count");
 counter.textContent=done+"/"+total;
 progress.style.setProperty("--dock-progress",(ratio*360).toFixed(1)+"deg");
 progress.setAttribute("aria-valuemax",String(total));
 progress.setAttribute("aria-valuenow",String(Math.min(total,done)));
 progress.setAttribute("aria-label",c.progress+": "+done+"/"+total);
 const xp=Math.max(0,Number(game.earned)||0);
 $("dock4XP").textContent="+"+xp+" XP";
 const hearts=$("dock4Hearts"),inside=hearts.querySelector("span");
 const exam=game.mode==="exam",unlimited=game.mode==="marathon";
 hearts.dataset.exam=String(exam);hearts.dataset.unlimited=String(unlimited);
 if(exam){
  inside.textContent="⏱";
  hearts.setAttribute("aria-label",c.exam);
 }else if(unlimited){
  inside.textContent="∞";
  hearts.setAttribute("aria-label",c.unlimited);
 }else{
  const lives=Math.max(0,Math.min(3,Number(game.lives)||0));
  inside.textContent="♥".repeat(lives)+"♡".repeat(3-lives);
  hearts.setAttribute("aria-label",c.hearts+": "+lives);
 }
 $("dock4ModesText").textContent=c.modes;
 $("dock4Modes").setAttribute("aria-label",c.back);
 const hint=$("dock4Hint"),remaining=Math.max(0,Number(game.hintsLeft)||0);
 const unavailable=exam||remaining===0||game.hintUsed||game.answered;
 hint.disabled=!!unavailable;
 $("dock4HintCount").textContent=String(remaining);
 hint.setAttribute("aria-label",exam?c.examNoHint:remaining===0?c.hintNone:game.hintUsed?c.hintUsed:c.hint+", "+remaining);
 hint.title=hint.getAttribute("aria-label");
 const basePath=$("gameQuizRouteBase");
 const checkpoints=[...document.querySelectorAll("#gamePlaying .nav9-checkpoint")];
 if(basePath && typeof basePath.getTotalLength==="function"){
  const length=basePath.getTotalLength();
  const rtl=document.documentElement.dir==="rtl";
  for(const [i,node] of checkpoints.entries()){
   const step=(i+1)/(checkpoints.length+1);
   const point=basePath.getPointAtLength(length*step);
   node.style.left=((rtl?100-point.x/10:point.x/10).toFixed(3))+"%";
   node.style.top=point.y.toFixed(3)+"%";
   node.classList.toggle("is-done",ratio>=step-.0001);
  }
 }
 moveRouteMarker(ratio);
}
window.addEventListener("neoline:theory-quiz",event=>{
 const d=event.detail||{};
 game={
  done:d.done??0,total:d.total??10,lives:d.lives??3,
  earned:d.earned??0,mode:d.mode??null,hintsLeft:d.hintsLeft??3,
  hintUsed:!!d.hintUsed,answered:!!d.answered
 };
 updateUI();
 syncStage();
});
window.addEventListener("neoline:theory-hint",event=>{
 const d=event.detail||{};game.hintsLeft=d.hintsLeft??game.hintsLeft;game.hintUsed=true;updateUI();
});
window.addEventListener("neoline:theory-finish",()=>{
 syncStage();
});
$("dock4Modes").addEventListener("click",()=>{$("exitQuiz")?.click()});
$("dock4Hint").addEventListener("click",()=>{
 if(!$("dock4Hint").disabled)window.dispatchEvent(new CustomEvent("neoline:theory-use-hint"));
});
const observer=new MutationObserver(syncStage);
observer.observe(playing,{attributes:true,attributeFilter:["hidden"]});
const gameOver=$("gameOver");if(gameOver)observer.observe(gameOver,{attributes:true,attributeFilter:["hidden"]});
// Language swap should not reset scores and checkpoints.
new MutationObserver(()=>{updateUI();drawRouteAt(routeVisibleRatio??0)}).observe(document.documentElement,{attributes:true,attributeFilter:["lang","dir"]});
updateUI();syncStage();
})();