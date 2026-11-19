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

/* A different navigation route for each new game, not each question.
   Distinct shape families avoid visually repeating the previous route. */
const navigationRoutes=[{"group":"corners","name":"narrow-streets","path":"M 37 31 H 280 Q 300 31 300 50 V 67 Q 300 78 318 78 H 563 Q 579 78 579 62 V 32 Q 579 22 600 22 H 965"},{"group":"curves","name":"broad-s","path":"M 37 73 C 152 72 189 20 304 23 S 474 74 596 73 S 780 29 965 31"},{"group":"climb","name":"climbing-road","path":"M 37 75 C 180 76 198 75 310 60 C 425 45 490 26 583 25 C 706 23 762 64 860 64 C 915 64 934 39 965 37"},{"group":"corners","name":"double-block","path":"M 37 58 H 130 Q 150 58 150 42 V 22 Q 150 15 170 15 H 325 Q 340 15 340 34 V 77 Q 340 85 355 85 H 580 Q 600 85 600 69 V 47 Q 600 35 620 35 H 965"},{"group":"curves","name":"rolling-hills","path":"M 37 70 C 190 70 225 28 360 28 C 490 28 520 62 645 62 C 760 62 805 22 965 22"},{"group":"corners","name":"wide-city","path":"M 37 42 H 176 Q 205 42 205 65 V 73 Q 205 84 222 84 H 453 Q 473 84 473 62 V 35 Q 473 17 494 17 H 710 Q 733 17 733 35 V 54 Q 733 70 753 70 H 965"},{"group":"curves","name":"meander","path":"M 37 26 C 185 25 165 69 315 69 S 478 27 603 27 S 802 71 965 69"},{"group":"climb","name":"gradual-descent","path":"M 37 25 C 130 25 245 33 338 48 C 438 65 481 81 592 81 C 714 81 750 39 844 37 C 901 36 919 58 965 58"},{"group":"corners","name":"city-switchbacks","path":"M 37 21 H 190 Q 215 21 215 40 V 56 Q 215 72 237 72 H 376 Q 397 72 397 52 V 44 Q 397 29 419 29 H 594 Q 616 29 616 44 V 61 Q 616 76 637 76 H 821 Q 845 76 845 55 V 38 Q 845 21 866 21 H 965"},{"group":"curves","name":"river-curve","path":"M 37 55 C 169 18 216 18 325 47 C 437 80 491 86 593 48 C 711 8 760 20 858 51 C 911 68 935 60 965 40"}];
const lastRouteKey="neoline:theory:last-navigation-route";
let routeSessionActive=false;
function previousRouteName(){
 try{return sessionStorage.getItem(lastRouteKey)||""}catch(_){return window.__neolineLastNavigationRoute||""}
}
function storeRouteName(name){
 window.__neolineLastNavigationRoute=name;
 try{sessionStorage.setItem(lastRouteKey,name)}catch(_){}
}
function randomRouteIndex(size){
 if(window.crypto&&typeof window.crypto.getRandomValues==="function"){
  const values=new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return values[0]%size;
 }
 return Math.floor(Math.random()*size);
}
function updateRouteEndpoints(){
 const path=$("gameQuizRouteBase");
 if(!path||typeof path.getTotalLength!=="function")return;
 const total=path.getTotalLength();
 if(!total)return;
 const rtl=document.documentElement.dir==="rtl";
 for(const [element,position] of [[$("gameQuizRouteStart"),0],[$("gameQuizRouteTarget"),total]]){
  if(!element)continue;
  const point=path.getPointAtLength(position);
  element.style.left=(rtl?100-point.x/10:point.x/10).toFixed(3)+"%";
  element.style.top=point.y.toFixed(3)+"%";
 }
}
function newNavigationRoute(){
 const prior=navigationRoutes.find(item=>item.name===previousRouteName());
 let possible=navigationRoutes.filter(item=>!prior||(item.group!==prior.group&&item.name!==prior.name));
 if(!possible.length)possible=navigationRoutes.filter(item=>!prior||item.name!==prior.name);
 const chosen=possible[randomRouteIndex(possible.length)];
 const route=$("gameQuizRouteBase"),fill=$("gameQuizRouteFill");
 if(!route||!fill)return;
 if(routeFrame){cancelAnimationFrame(routeFrame);routeFrame=0}
 routeGoal=null;
 routeVisibleRatio=null;
 const casing=document.querySelector("#gamePlaying .nav9-route-casing");
 for(const p of [route,fill,casing])if(p)p.setAttribute("d",chosen.path);
 storeRouteName(chosen.name);
 updateRouteEndpoints();
}

function syncStage(){
 const active=!playing.hidden&&!document.body.classList.contains("game-over-open");
 dock.hidden=!active;
 document.body.classList.toggle("theory-in-session",active);
 if(!active){
  routeSessionActive=false;
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
 if(!routeSessionActive&&!playing.hidden){newNavigationRoute();routeSessionActive=true}
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
new MutationObserver(()=>{updateRouteEndpoints();updateUI();drawRouteAt(routeVisibleRatio??0)}).observe(document.documentElement,{attributes:true,attributeFilter:["lang","dir"]});
updateUI();syncStage();
})();