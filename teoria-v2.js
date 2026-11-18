/* NEOLINE Theory 2.0 — presentation only.
   Read real local progress; never grant XP, coupons, rewards or cart credit. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const dialog=$("gameProgressDialog");
const buttons=[$("gameProgressOpen"),$("gameResultsProgress")].filter(Boolean);
const locale=()=>["ru","he","en"].includes(document.documentElement.lang)?document.documentElement.lang:"ru";
const L={
 ru:{
  hero:"ОБУЧЕНИЕ · ИГРА · ЭКЗАМЕН",route:"ТВОЙ МАРШРУТ",
  lead:"Выбирай приключение — изучай реальные правила.",progress:"Мой прогресс",
  quizWarning:"Соблюдай правила — береги жизни ❤️",badge:"МОЯ ИГРА",achKicker:"ТВОИ ДОСТИЖЕНИЯ",
  intro:"Здесь только реальные результаты твоих игр.",
  questions:"Вопросов",accuracy:"Точность",xp:"XP",games:"В истории",
  achievements:"Достижения",week:"Последние 7 дней",
  weekHelp:"Точность по завершённым играм. Пропуски — нет данных.",
  history:"Последние игры",footnote:"Прогресс хранится на этом устройстве для выбранного языка и категории прав.",
  noGames:"Пока нет завершённых игр. Выбери режим и начни играть!",
  noHistory:"Пока нет данных за эти дни.",correct:"Правильно",errors:"Ошибки",right:"верно",
  completed:"Получено",locked:"Ещё не открыто",gift:"Информация о будущих подарках",
  close:"Закрыть прогресс",resultProgress:"Мой прогресс и достижения",
  routes:{route:"Поездка по городу",signs:"Охота за знаками",exam:"Как на экзамене",mistakes:"Работа над ошибками",marathon:"Большое путешествие"},
  badges:[
   {id:"first",name:"Первая поездка",help:"Заверши любую игру",emoji:"🚘"},
   {id:"ten",name:"Первые 10 вопросов",help:"Изучи 10 разных вопросов",emoji:"📖"},
   {id:"signs",name:"Охотник за знаками",help:"Заверши режим знаков",emoji:"🚦"},
   {id:"exam",name:"Экзамен сдан",help:"Минимум 26 из 30 в экзамене",emoji:"🏆"},
   {id:"marathon",name:"Марафонец",help:"Заверши этап путешествия",emoji:"🗺️"}
  ],
  days:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
 },
 en:{
  hero:"LEARN · PLAY · EXAM",route:"YOUR JOURNEY",lead:"Choose a game and learn real road rules.",
  progress:"My progress",quizWarning:"Stay safe and follow the rules ❤️",
  badge:"MY GAME",achKicker:"YOUR ACHIEVEMENTS",intro:"Only your actual game results are shown.",
  questions:"Questions",accuracy:"Accuracy",xp:"XP",games:"Recorded",
  achievements:"Achievements",week:"Last 7 days",weekHelp:"Accuracy from completed games. Gaps mean no data.",
  history:"Recent games",footnote:"Progress is stored on this device for the selected language and licence class.",
  noGames:"No completed games yet. Choose a mode to begin!",noHistory:"No game results for these days.",
  correct:"Correct",errors:"Mistakes",right:"correct",completed:"Unlocked",locked:"Locked",
  gift:"Potential gift information",close:"Close progress",resultProgress:"Progress and achievements",
  routes:{route:"City drive",signs:"Sign hunt",exam:"Mock exam",mistakes:"Learn from mistakes",marathon:"Grand journey"},
  badges:[
   {id:"first",name:"First drive",help:"Finish any game",emoji:"🚘"},
   {id:"ten",name:"10 questions",help:"Study 10 different questions",emoji:"📖"},
   {id:"signs",name:"Sign hunter",help:"Complete a sign-hunt game",emoji:"🚦"},
   {id:"exam",name:"Exam passed",help:"At least 26/30 on the exam",emoji:"🏆"},
   {id:"marathon",name:"Marathon explorer",help:"Finish a journey stage",emoji:"🗺️"}
  ],
  days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
 },
 he:{
  hero:"לימוד · משחק · מבחן",route:"המסלול שלך",lead:"בחרו משחק ולמדו את חוקי הדרך.",
  progress:"ההתקדמות שלי",quizWarning:"סעו בזהירות ❤️",
  badge:"המשחק שלי",achKicker:"ההישגים שלך",intro:"מוצגות רק תוצאות המשחקים האמיתיות שלך.",
  questions:"שאלות",accuracy:"דיוק",xp:"XP",games:"ברשימה",
  achievements:"הישגים",week:"7 הימים האחרונים",weekHelp:"אחוז הצלחה במשחקים שהושלמו. יום ריק פירושו שאין נתונים.",
  history:"משחקים אחרונים",footnote:"ההתקדמות נשמרת במכשיר זה עבור השפה ודרגת הרישיון שנבחרו.",
  noGames:"עדיין אין משחקים שהושלמו. בחרו מצב משחק!",noHistory:"אין תוצאות לימים האלה.",
  correct:"תשובות נכונות",errors:"טעויות",right:"נכון",completed:"נפתח",locked:"נעול",
  gift:"מידע על מתנות עתידיות",close:"סגירת ההתקדמות",resultProgress:"התקדמות והישגים",
  routes:{route:"נסיעה בעיר",signs:"ציד תמרורים",exam:"מבחן לדוגמה",mistakes:"למידה מטעויות",marathon:"מסע גדול"},
  badges:[
   {id:"first",name:"נסיעה ראשונה",help:"סיימו משחק כלשהו",emoji:"🚘"},
   {id:"ten",name:"10 שאלות",help:"למדו 10 שאלות שונות",emoji:"📖"},
   {id:"signs",name:"צייד תמרורים",help:"סיימו משחק תמרורים",emoji:"🚦"},
   {id:"exam",name:"עברתי מבחן",help:"לפחות 26 מתוך 30 במבחן",emoji:"🏆"},
   {id:"marathon",name:"מרתון",help:"סיימו שלב במסע",emoji:"🗺️"}
  ],
  days:["א","ב","ג","ד","ה","ו","ש"]
 }
};
let current=null,openedBy=null,toastTimer=null;
function set(id,value){const e=$(id);if(e)e.textContent=value}
function localStats(){
 const lang=locale(),license=$("licenseSelect")?.value||"B";
 let parsed={};
 try{parsed=JSON.parse(localStorage.getItem("neoline-teoria:v1:"+lang+":"+license)||"{}")}catch(e){}
 const records=parsed.answered&&typeof parsed.answered==="object"?Object.values(parsed.answered):[];
 const attempts=records.reduce((sum,x)=>sum+(Number(x?.n)||0),0);
 const correct=records.reduce((sum,x)=>sum+(Number(x?.ok)||0),0);
 return {
  seen:records.length,accuracy:attempts?Math.round(100*correct/attempts):null,
  xp:Math.max(0,Math.round(Number(parsed.xp)||0)),
  history:Array.isArray(parsed.history)?parsed.history.filter(x=>x&&typeof x==="object").slice(-30):[],
  wrong:Array.isArray(parsed.wrong)?parsed.wrong.length:0,
  licence:license,language:lang
 };
}
const num=n=>new Intl.NumberFormat(locale()==="ru"?"ru-RU":locale()==="he"?"he-IL":"en-GB").format(n);
function dom(tag,className,content){
 const e=document.createElement(tag);if(className)e.className=className;
 if(content!==undefined)e.textContent=String(content);
 return e;
}
function validGames(history){
 return history.filter(h=>["route","signs","exam","mistakes","marathon"].includes(h.mode)&&
  Number.isFinite(Number(h.correct))&&Number.isFinite(Number(h.total))&&Number(h.total)>0&&
  !Number.isNaN(new Date(h.time).getTime()));
}
function badgeState(key,d,history){
 const games=validGames(history);
 switch(key){
  case "first":return games.length>0;
  case "ten":return d.seen>=10;
  case "signs":return games.some(g=>g.mode==="signs"&&!g.gameOver);
  case "exam":return games.some(g=>g.mode==="exam"&&!g.gameOver&&Number(g.total)>=30&&Number(g.correct)>=26);
  case "marathon":return games.some(g=>g.mode==="marathon"&&!g.gameOver);
  default:return false;
 }
}
/* Unlocked achievement icons persist even after the 30-entry history rolls over.
   This remains an on-device recognition, never proof of a redeemable prize. */
function earnedAchievements(data,history){
 const key="neoline-teoria-achievements:v1:"+data.language+":"+data.licence;
 const allowed=["first","ten","signs","exam","marathon"];
 let previous=[];
 try{const saved=JSON.parse(localStorage.getItem(key)||"[]");if(Array.isArray(saved))previous=saved.filter(id=>allowed.includes(id))}catch(e){}
 const earned=new Set(previous);
 for(const id of allowed){if(badgeState(id,data,history))earned.add(id)}
 if(earned.size!==previous.length){
  try{localStorage.setItem(key,JSON.stringify([...earned]))}catch(e){}
 }
 return earned;
}
function formatDay(x){
 const lang=locale()==="ru"?"ru-RU":locale()==="he"?"he-IL":"en-GB";
 return new Intl.DateTimeFormat(lang,{day:"2-digit",month:"short"}).format(x);
}
function dayKey(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function drawProgress(){
 const copy=L[locale()]||L.ru;
 const data=current||localStats();const history=validGames(data.history);
 set("gameProgressSeen",num(data.seen));set("gameProgressAccuracy",data.accuracy===null?"—":num(data.accuracy)+"%");
 set("gameProgressXP",num(data.xp));set("gameProgressGames",num(history.length));
 const grid=$("gameAchievementGrid");grid.replaceChildren();
 const earned=earnedAchievements(data,history);
 for(const badge of copy.badges){
  const isOn=earned.has(badge.id);
  const card=dom("div","game-achievement"+(isOn?"":" is-locked"));
  card.setAttribute("aria-label",badge.name+" · "+(isOn?copy.completed:copy.locked));
  card.append(dom("span","game-achievement__icon",isOn?badge.emoji:"🔒"));
  const title=dom("div","game-achievement__text");
  title.append(dom("strong","",badge.name),dom("span","",isOn?copy.completed:badge.help));
  card.append(title);grid.append(card);
 }
 const chart=$("gameProgressChart");chart.replaceChildren();
 const today=new Date(),start=new Date(today.getFullYear(),today.getMonth(),today.getDate());
 start.setDate(start.getDate()-6);
 let hasAny=false;
 for(let i=0;i<7;i++){
  const day=new Date(start);day.setDate(start.getDate()+i);
  const dayHistory=history.filter(entry=>dayKey(new Date(entry.time))===dayKey(day));
  const answered=dayHistory.reduce((n,g)=>n+Math.max(0,Number(g.gameOver?g.answered:g.total)||0),0);
  const correct=dayHistory.reduce((n,g)=>n+Math.max(0,Number(g.correct)||0),0);
  const percent=answered>0?Math.round(100*correct/answered):null;
  const col=dom("div","day");col.dataset.empty=percent===null?"true":"false";
  const bar=dom("div","day__bar");
  if(percent!==null){hasAny=true;const fill=dom("span","day__fill");fill.style.height=percent+"%";bar.append(fill)}
  col.append(dom("span","day__value",percent===null?"—":percent+"%"),bar,dom("span","day__label",copy.days[day.getDay()]));
  col.title=formatDay(day)+": "+(percent===null?copy.noHistory:percent+"% · "+dayHistory.length);
  chart.append(col);
 }
 chart.setAttribute("aria-label",hasAny?copy.week+": "+history.length+" "+copy.games.toLowerCase():copy.noHistory);
 const list=$("gameProgressHistory");list.replaceChildren();
 if(history.length===0){list.append(dom("p","game-progress-empty",copy.noGames))}
 else for(const h of history.slice(-7).reverse()){
  const item=dom("div","game-progress-history-item");
  const mode=dom("span","",copy.routes[h.mode]||h.mode);
  const denominator=Math.max(1,Number(h.gameOver?h.answered:h.total)||1);
  const score=dom("strong","",num(Number(h.correct)||0)+" / "+num(denominator));
  const time=dom("time","",new Intl.DateTimeFormat(locale()==="ru"?"ru-RU":locale()==="he"?"he-IL":"en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(h.time)));
  item.append(mode,score,time);list.append(item);
 }
}
function updateCopy(){
 const c=L[locale()]||L.ru;
 const map={
  gameHeroMini:"hero",gameLobbyOverline:"route",gameLobbyLead:"lead",gameProgressOpenLabel:"progress",
  gameQuizLabel:"route",gameQuizWarning:"quizWarning",
  gameProgressHeaderLabel:"badge",gameProgressKicker:"achKicker",
  gameProgressTitle:"progress",gameProgressSubtitle:"intro",gameProgressSeenText:"questions",
  gameProgressAccuracyText:"accuracy",gameProgressXPText:"xp",gameProgressGamesText:"games",
  gameProgressAchievementsTitle:"achievements",gameProgressChartTitle:"week",
  gameProgressChartNote:"weekHelp",gameProgressHistoryTitle:"history",
  gameProgressFootnote:"footnote",gameResultsProgressLabel:"resultProgress",
  gameResultCorrectLabel:"correct",gameResultMistakesLabel:"errors",
  gameResultGaugeLabel:"right"
 };
 for(const [id,key] of Object.entries(map))set(id,c[key]);
 $("gameProgressClose")?.setAttribute("aria-label",c.close);
 $("gameProgressGift")?.setAttribute("aria-label",c.gift);
 if(dialog){dialog.lang=locale();dialog.dir=locale()==="he"?"rtl":"ltr"}
}
function openProgress(trigger){
 if(!dialog)return;
 openedBy=trigger;current=localStats();updateCopy();drawProgress();
 if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal()}
 else dialog.setAttribute("open","");
 $("gameProgressClose")?.focus({preventScroll:true});
}
function closeProgress(){
 if(!dialog)return;
 if(typeof dialog.close==="function"&&dialog.open)dialog.close();
 else dialog.removeAttribute("open");
}
for(const b of buttons)b?.addEventListener("click",()=>openProgress(b));
$("gameProgressClose")?.addEventListener("click",closeProgress);
dialog?.addEventListener("click",event=>{if(event.target===dialog)closeProgress()});
dialog?.addEventListener("close",()=>{if(openedBy?.isConnected)openedBy.focus({preventScroll:true});openedBy=null});
window.addEventListener("neoline:theory-progress",event=>{
 const d=event.detail||{};
 current={
  seen:Math.max(0,Number(d.seen)||0),
  accuracy:d.accuracy===null?null:Number(d.accuracy),
  xp:Math.max(0,Number(d.xp)||0),
  history:Array.isArray(d.history)?d.history:[],
  wrong:Number(d.wrong)||0,
  language:d.language||locale(),licence:d.licence||$("licenseSelect")?.value||"B"
 };
 if(dialog?.open)drawProgress();
});
window.addEventListener("neoline:theory-quiz",event=>{
 const d=event.detail||{},total=Math.max(1,Number(d.total)||1);
 const amount=Math.max(0,Math.min(1,(Number(d.done)||0)/total));
 const fill=$("gameQuizRouteFill"),car=$("gameQuizRouteCar");
 if(fill)fill.style.width=(amount*100)+"%";
 if(car){if(document.documentElement.dir==="rtl")car.style.right=(amount*100)+"%";else car.style.left=(amount*100)+"%"}
});
window.addEventListener("neoline:theory-answer",event=>{
 const d=event.detail||{},node=$("gameXPFloat");
 // A mock exam must never disclose correctness before the end of the exam.
 if(!node||d.mode==="exam"||!d.correct||!d.delta||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 clearTimeout(toastTimer);
 node.textContent="+"+Math.max(0,Number(d.delta)||0)+" XP";
 node.hidden=false;node.style.animation="none";void node.offsetWidth;node.style.animation="";
 toastTimer=setTimeout(()=>{node.hidden=true},1150);
});
window.addEventListener("neoline:theory-finish",event=>{
 const d=event.detail||{},answered=Math.max(1,Number(d.total)||1);
 const correct=Math.min(answered,Math.max(0,Number(d.correct)||0));
 const percent=Math.round(100*correct/answered),gauge=$("gameResultGauge");
 if(gauge)gauge.style.setProperty("--result-sweep",(percent*3.6)+"deg");
 set("gameResultCorrect",num(correct));set("gameResultMistakes",num(answered-correct));
 current=localStats();if(dialog?.open)drawProgress();
});
$("licenseSelect")?.addEventListener("change",()=>{current=null;if(dialog?.open)drawProgress()});
new MutationObserver(()=>{current=null;updateCopy();if(dialog?.open){current=localStats();drawProgress()}})
 .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
updateCopy();
})();