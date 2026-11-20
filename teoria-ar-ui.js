/* Fourth-language accessibility and static-label localizations for theory.
   Core game state, licensed questions and all dynamic strings remain in the
   official game engine and teoria-ar.js. */
(()=>{
 "use strict";
 const dictionaries={
  ru:{game:"Теория вождения",modes:"Выбор режима",playing:"Вопросы игры",answers:"Варианты ответа",nav:"Основная навигация NEOLINE",dock:"Игровая панель NEOLINE",progress:"Информация о прохождении",charts:"Результаты по дням",gameOver:"GAME OVER",exit:"Вернуться к режимам",session:"Режим игры",info:"История прохождения",road:"Прогресс",hero:"Теория вождения",gif:"Подарки за игру"},
  en:{game:"Driving theory",modes:"Choose a game mode",playing:"Game questions",answers:"Answer options",nav:"NEOLINE main navigation",dock:"NEOLINE game controls",progress:"Quiz progress",charts:"Results by day",gameOver:"GAME OVER",exit:"Back to modes",session:"Game mode",info:"Recent games",road:"Progress",hero:"Driving theory",gif:"Game gifts"},
  he:{game:"תיאוריה בנהיגה",modes:"בחירת מצב משחק",playing:"שאלות המשחק",answers:"אפשרויות תשובה",nav:"ניווט ראשי NEOLINE",dock:"לחצני משחק NEOLINE",progress:"התקדמות בבחינה",charts:"תוצאות לפי ימים",gameOver:"המשחק הסתיים",exit:"חזרה למצבים",session:"מצב משחק",info:"משחקים אחרונים",road:"התקדמות",hero:"תיאוריה בנהיגה",gif:"מתנות במשחק"},
  ar:{game:"اختبار القيادة النظري",modes:"اختيار وضع اللعب",playing:"أسئلة اللعبة",answers:"خيارات الإجابة",nav:"القائمة الرئيسية NEOLINE",dock:"لوحة التحكم باللعبة",progress:"التقدّم في الامتحان",charts:"النتائج حسب اليوم",gameOver:"انتهت اللعبة",exit:"العودة إلى الأوضاع",session:"وضع اللعب",info:"آخر الألعاب",road:"التقدّم",hero:"اختبار القيادة النظري",gif:"هدايا اللعب"}
 };
 const map=[
  ["gameLobby","aria-label","modes"],
  ["gamePlaying","aria-label","playing"],
  ["answers","aria-label","answers"],
  ["theoryBottomNav","aria-label","nav"],
  ["theoryGameDock","aria-label","dock"],
  ["progress","aria-label","progress"],
  ["gameProgressChart","aria-label","charts"],
  ["exitQuiz","title","exit"],
  ["gameOverTitle","textContent","gameOver"]
 ];
 function refresh(){
  const code=String(document.documentElement.lang||"ru").split("-")[0];
  const c=dictionaries[code]||dictionaries.ru;
  for(const [id,key,value] of map){
   const el=document.getElementById(id);
   if(!el)continue;
   if(key==="textContent")el.textContent=c[value];
   else el.setAttribute(key,c[value]);
  }
  const hero=document.querySelector(".game-hero");
  if(hero)hero.setAttribute("aria-label",c.hero);
  const gift=document.getElementById("gameGiftTrigger");
  if(gift)gift.setAttribute("aria-label",c.gif);
  const mode=document.querySelector(".game-panel.playing .quiz-hud");
  if(mode)mode.setAttribute("aria-label",c.session);
 }
 new MutationObserver(records=>{
  if(records.some(r=>r.attributeName==="lang"))refresh();
 }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 refresh();
})();
