/* NEOLINE ISRAEL · THEORY QUEST — official CC BY question data, not a government service.
   All answer keys are taken from official Ministry of Transport records.
   Practice progress stays only in this browser, no login / analytics. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DICTS={
ru:{backHome:"← На главную",heroEyebrow:"NEOLINE · ИЗРАИЛЬ · ИГРА",heroTitle:"Теория.<br><em>Твой путь к правам.</em>",heroSubtitle:"Реальные экзаменационные вопросы Израиля — теперь в формате игры. Освой знаки, правила и сложные ситуации на дорогах.",badgeOfficial:"✓ Государственный банк вопросов",badgeFree:"Без регистрации",badgeB:"Категория B",selectLabel:"НАСТРОЙКИ",selectTitle:"Выбери свой маршрут",licenseLabel:"Права",statSeenLabel:"Вопросов изучено",statAccuracyLabel:"Точность",statMistakesLabel:"Ошибок для повтора",modeRoute:"Поездка по городу",descRoute:"10 вопросов, три жизни и очки за правильные ответы.",ctaRoute:"Начать маршрут ↗",modeSigns:"Охота за знаками",descSigns:"12 заданий по настоящим израильским дорожным знакам.",ctaSigns:"Учить знаки ↗",modeExam:"Как на экзамене",descExam:"30 вопросов · 40 минут · для сдачи нужно 26 верных.",ctaExam:"Пробный экзамен ↗",modeMistakes:"Работа над ошибками",descMistakes:"Повторяй вопросы, которые раньше вызвали затруднения.",ctaMistakes:"Повторить ↗",modeMarathon:"Большое путешествие · все билеты",descMarathon:"Все вопросы из официального банка по этапам из 20 заданий. Проходи новые билеты и сохраняй прогресс.",ctaMarathon:"Продолжить путешествие ↗",sourceNotice:"Источник: Министерство транспорта и безопасности дорожного движения Израиля (государственные данные, CC BY). NEOLINE — независимый учебный проект, не официальный экзамен. Проверяйте актуальность правил.",sourceBank:"Государственный банк вопросов ↗",sourceRules:"Официальные условия экзамена ↗",exitLabel:"Режимы",questionTip:"Выбери один правильный ответ.",next:"Далее →",done:"Завершить →",resultKicker:"МАРШРУТ ЗАВЕРШЁН",resultPercentLabel:"Верных ответов",resultXPLabel:"Заработано",restartLabel:"Ещё раз",backModesLabel:"Другие режимы",footerBack:"На главную ↗",loading:"Загружаем официальные вопросы…",bankReady:(count,b)=>"✓ Загружено "+count+" официальных вопросов · для прав "+b+" доступно "+countB,bankBroken:"Банк официальных вопросов временно недоступен. Попробуй обновить страницу.",bankShort:"Для этого режима вопросов недостаточно в официальном банке.",noMistakes:"Пока нет ошибок для повторения — сначала пройди игру!",correct:"Верно! Отличная реакция! +15 XP",wrong:"Не совсем. Правильный ответ выделен зелёным.",examSelected:"Ответ принят. В режиме экзамена правильность покажем в конце.",heart:"Жизни",topics:{signs:"Дорожные знаки",laws:"Правила движения",vehicle:"Устройство автомобиля",safety:"Безопасность на дороге"},resultPass:"Экзамен сдан! 🎉",resultFail:"Экзамен пока не сдан",resultGreat:"Отличный маршрут!",resultGood:"Хорошая тренировка!",resultKeep:"Повторим сложные вопросы?",examResult:(n)=>"Для сдачи требуется 26 из 30. Ты ответил правильно на "+n+".",practiceResult:"Продолжай тренироваться — каждый верный ответ приближает к водительским правам.",zeroMistakes:"Все ответы верные — ошибок нет!",errorsList:"Вопросы для повторения",timeOut:"Время вышло. Неотвеченные вопросы считаются ошибками.",retry:"Повторить"},
en:{backHome:"← Home",heroEyebrow:"NEOLINE · ISRAEL · GAME",heroTitle:"Theory.<br><em>Your road to a licence.</em>",heroSubtitle:"Israel's actual driving theory questions, turned into a game. Master signs, regulations and real road scenarios.",badgeOfficial:"✓ Government question bank",badgeFree:"No registration",badgeB:"Licence B",selectLabel:"SETTINGS",selectTitle:"Choose your route",licenseLabel:"Licence",statSeenLabel:"Questions studied",statAccuracyLabel:"Accuracy",statMistakesLabel:"Mistakes to review",modeRoute:"City drive",descRoute:"10 questions, three lives and points for correct answers.",ctaRoute:"Start driving ↗",modeSigns:"Road sign hunt",descSigns:"12 tasks featuring actual Israeli road signs.",ctaSigns:"Learn signs ↗",modeExam:"Real exam practice",descExam:"30 questions · 40 minutes · 26 correct to pass.",ctaExam:"Mock exam ↗",modeMistakes:"Retry mistakes",descMistakes:"Practise questions you previously missed.",ctaMistakes:"Review ↗",modeMarathon:"Grand road trip · all questions",descMarathon:"Work through the entire official bank, 20 questions at a time. Track all your progress.",ctaMarathon:"Continue the road trip ↗",sourceNotice:"Source: Israel Ministry of Transport and Road Safety (open government data, CC BY). NEOLINE is an independent learning tool, not a government exam. Always check current rules.",sourceBank:"Official question bank ↗",sourceRules:"Government exam rules ↗",exitLabel:"Modes",questionTip:"Select one correct answer.",next:"Next →",done:"Finish →",resultKicker:"ROUTE COMPLETED",resultPercentLabel:"Correct answers",resultXPLabel:"Earned",restartLabel:"Play again",backModesLabel:"Other modes",footerBack:"Home ↗",loading:"Loading official questions…",bankReady:(count,b)=>"✓ "+count+" official questions · "+countB+" for licence "+b,bankBroken:"The official question bank is temporarily unavailable. Please reload.",bankShort:"Not enough licensed questions are available for this mode.",noMistakes:"No mistakes to review yet. Play another route first!",correct:"Correct! Great reaction! +15 XP",wrong:"Not quite. The correct answer is highlighted in green.",examSelected:"Answer saved. Correct answers are revealed after the mock exam.",heart:"Lives",topics:{signs:"Road signs",laws:"Traffic rules",vehicle:"Vehicle knowledge",safety:"Road safety"},resultPass:"Mock exam passed! 🎉",resultFail:"Mock exam not passed yet",resultGreat:"Amazing drive!",resultGood:"Nice practice!",resultKeep:"Let's review the tricky ones",examResult:(n)=>"26 out of 30 are needed to pass. You got "+n+" correct.",practiceResult:"Keep learning — each correct answer brings you closer to your driving licence.",zeroMistakes:"Perfect run — no mistakes!",errorsList:"Questions to review",timeOut:"Time's up. Unanswered questions count as incorrect.",retry:"Try again"},
he:{backHome:"→ חזרה לראשי",heroEyebrow:"NEOLINE · ישראל · משחק",heroTitle:"תיאוריה.<br><em>הדרך שלך לרישיון.</em>",heroSubtitle:"השאלות האמיתיות של מבחן התיאוריה בישראל, עכשיו במשחק. תרגלו תמרורים, חוקים ובטיחות בדרכים.",badgeOfficial:"✓ מאגר השאלות הממשלתי",badgeFree:"בלי הרשמה",badgeB:"דרגה B",selectLabel:"הגדרות",selectTitle:"בחרו מסלול",licenseLabel:"רישיון",statSeenLabel:"שאלות שנלמדו",statAccuracyLabel:"דיוק",statMistakesLabel:"טעויות לחזרה",modeRoute:"נסיעה בעיר",descRoute:"10 שאלות, שלושה לבבות ונקודות לתשובה נכונה.",ctaRoute:"לדרך ↗",modeSigns:"ציד תמרורים",descSigns:"12 שאלות על תמרורי הדרך האמיתיים בישראל.",ctaSigns:"ללמוד תמרורים ↗",modeExam:"הדמיית מבחן",descExam:"30 שאלות · 40 דקות · 26 תשובות נכונות למעבר.",ctaExam:"מבחן לדוגמה ↗",modeMistakes:"לומדים מטעויות",descMistakes:"חוזרים לשאלות שבהן טעיתם בעבר.",ctaMistakes:"חזרה ↗",modeMarathon:"מסע גדול · כל השאלות",descMarathon:"כל השאלות מהמאגר הרשמי, 20 בכל שלב. ההתקדמות נשמרת.",ctaMarathon:"ממשיכים במסע ↗",sourceNotice:"מקור: משרד התחבורה והבטיחות בדרכים (מידע ממשלתי פתוח, CC BY). כלי הלימוד של NEOLINE אינו מבחן ממשלתי רשמי. יש לבדוק את הכללים העדכניים.",sourceBank:"מאגר השאלות הרשמי ↗",sourceRules:"כללי הבחינה באתר הממשלה ↗",exitLabel:"מסלולים",questionTip:"בחרו תשובה אחת נכונה.",next:"הבא ←",done:"סיום ←",resultKicker:"המסלול הושלם",resultPercentLabel:"תשובות נכונות",resultXPLabel:"נקודות",restartLabel:"לשחק שוב",backModesLabel:"מסלולים נוספים",footerBack:"לראשי ↗",loading:"טוענים שאלות רשמיות…",bankReady:(count,b)=>"✓ "+count+" שאלות רשמיות · "+countB+" לרישיון "+b,bankBroken:"מאגר השאלות אינו זמין כרגע. נא לטעון מחדש.",bankShort:"אין מספיק שאלות למצב משחק זה.",noMistakes:"אין כרגע טעויות לחזור עליהן. שחקו במסלול אחר!",correct:"נכון! כל הכבוד! ‎+15 XP",wrong:"לא בדיוק. התשובה הנכונה מסומנת בירוק.",examSelected:"התשובה נשמרה. התוצאות יוצגו בסיום המבחן.",heart:"לבבות",topics:{signs:"תמרורים",laws:"חוקי התנועה",vehicle:"הכרת הרכב",safety:"בטיחות בדרכים"},resultPass:"עברתם את הבחינה! 🎉",resultFail:"עוד לא עברתם את הבחינה",resultGreat:"נסיעה מצוינת!",resultGood:"תרגול מוצלח!",resultKeep:"בואו נחזור לשאלות הקשות",examResult:(n)=>"כדי לעבור צריך 26 מתוך 30. השבתם נכון על "+n+" שאלות.",practiceResult:"המשיכו לתרגל — כל תשובה נכונה מקדמת אתכם לרישיון.",zeroMistakes:"כל הכבוד! לא היו טעויות.",errorsList:"שאלות לחזרה",timeOut:"הזמן נגמר. שאלות ללא תשובה נחשבות שגויות.",retry:"לנסות שוב"}
};
const text=(k)=>(DICTS[state.lang]||DICTS.ru)[k];
const state={lang:"ru",licence:"B",banks:{},pool:[],mode:null,questions:[],index:0,choices:[],selected:null,answers:[],correct:0,earned:0,lives:3,ticker:null,deadline:0,loadSeq:0,ready:false,finished:false};
let stats={answered:{},wrong:[],xp:0,history:[]};
function safeStoreGet(key){try{return localStorage.getItem(key)}catch(e){return null}}
function safeStorePut(key,value){try{localStorage.setItem(key,value)}catch(e){}}
const statsKey=()=> "neoline-teoria:v1:"+state.lang+":"+state.licence;
function readStats(){try{const data=JSON.parse(safeStoreGet(statsKey())||"{}");return {answered:data.answered&&typeof data.answered==="object"?data.answered:{},wrong:Array.isArray(data.wrong)?data.wrong:[],xp:Number(data.xp)||0,history:Array.isArray(data.history)?data.history.slice(-30):[]}}catch(e){return {answered:{},wrong:[],xp:0,history:[]}}}
function saveStats(){safeStorePut(statsKey(),JSON.stringify(stats))}
function shuffled(values){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function classes(){return state.pool.filter(q=>q.classes.includes(state.licence))}
function sourceFor(lang){return "https://data.gov.il/he/datasets/ministry_of_transport/"+({ru:"tqru",he:"tqhe",en:"tqen"}[lang]||"tqru")}
function setCopy(){
 document.documentElement.lang=state.lang;
 document.documentElement.dir=state.lang==="he"?"rtl":"ltr";
 for(const id of ["backHome","heroEyebrow","heroSubtitle","badgeOfficial","badgeFree","badgeB","selectLabel","selectTitle","licenseLabel","statSeenLabel","statAccuracyLabel","statMistakesLabel","modeRoute","descRoute","ctaRoute","modeSigns","descSigns","ctaSigns","modeExam","descExam","ctaExam","modeMistakes","descMistakes","ctaMistakes","modeMarathon","descMarathon","ctaMarathon","sourceNotice","sourceBank","sourceRules","exitLabel","questionTip","resultKicker","resultPercentLabel","resultXPLabel","restartLabel","backModesLabel","footerBack"]){
  const el=$(id);if(el&&text(id))el.textContent=typeof text(id)==="function"?"":text(id)
 }
 $("heroTitle").innerHTML=text("heroTitle");
 $("sourceBank").href=sourceFor(state.lang);
 document.querySelectorAll("[data-lang]").forEach(b=>{b.classList.toggle("on",b.dataset.lang===state.lang);b.setAttribute("aria-pressed",String(b.dataset.lang===state.lang))});
 $("licenseSelect").value=state.licence;
 $("badgeB").textContent=(state.lang==="he"?"דרגה ":state.lang==="en"?"Licence ":"Категория ")+state.licence;
 refreshStats();
}
function refreshStats(){
 stats=readStats();
 const records=Object.values(stats.answered);
 const total=records.reduce((sum,x)=>sum+(Number(x.n)||0),0);
 const correct=records.reduce((sum,x)=>sum+(Number(x.ok)||0),0);
 $("statSeen").textContent=records.length;
 $("statAccuracy").textContent=total?Math.round(correct/total*100)+"%":"—";
 $("statXP").textContent=stats.xp;
 $("statMistakes").textContent=stats.wrong.length;
 $("mistakesBadge").textContent=stats.wrong.length;
 document.querySelector('[data-mode="mistakes"]').disabled=!stats.wrong.length || !state.ready;
}
async function loadBank(){
 const seq=++state.loadSeq;
 state.ready=false;
 $("bankStatus").className="bank-status";
 $("bankText").textContent=text("loading");
 document.querySelectorAll("[data-mode]").forEach(b=>b.disabled=true);
 try{
  if(!state.banks[state.lang]){
   const response=await fetch("./assets/teoria/"+state.lang+".json",{cache:"no-cache"});
   if(!response.ok)throw Error("bank response "+response.status);
   const data=await response.json();
   if(data.version!==1||data.language!==state.lang||!Array.isArray(data.questions)||data.questions.length<900)throw Error("Invalid or incomplete official bank");
   const all=data.questions;
   if(all.some(q=>!q.id||!Array.isArray(q.a)||q.a.length!==4||q.correct<0||q.correct>3||!Array.isArray(q.classes)))throw Error("Invalid official question fields");
   state.banks[state.lang]=data;
  }
  if(seq!==state.loadSeq)return;
  state.pool=state.banks[state.lang].questions;
  state.ready=classes().length>=30;
  $("bankStatus").className="bank-status "+(state.ready?"loaded":"error");
  const count=state.pool.length,countB=classes().length;
  $("bankText").textContent=state.ready?
   (state.lang==="ru"?"✓ "+count+" официальных вопросов · для категории "+state.licence+" доступно "+countB:
    state.lang==="he"?"✓ "+count+" שאלות רשמיות · "+countB+" לדרגה "+state.licence:
    "✓ "+count+" official questions · "+countB+" for licence "+state.licence):text("bankShort");
 }catch(error){
  if(seq!==state.loadSeq)return;
  console.warn("NEOLINE official theory bank load problem:",error.message);
  state.ready=false;
  $("bankStatus").className="bank-status error";
  $("bankText").textContent=text("bankBroken");
 }
 document.querySelectorAll("[data-mode]").forEach(b=>b.disabled=!state.ready);
 refreshStats();
}
function selectLanguage(lang){
 if(!DICTS[lang])return;
 state.lang=lang;
 safeStorePut("neoline-language",lang);
 setCopy();loadBank();
}
function selectLicence(value){
 state.licence=value;
 safeStorePut("neoline-teoria-licence",value);
 setCopy();loadBank();
}
function quitSession(){
 stopClock();
 state.mode=null;
 state.finished=true;
 $("gamePlaying").hidden=true;
 $("gameResult").hidden=true;
 $("gameLobby").hidden=false;
 refreshStats();
 window.scrollTo({top:0,behavior:"smooth"});
}
function stopClock(){if(state.ticker){clearInterval(state.ticker);state.ticker=null}}
function formatClock(){
 const left=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
 const mm=Math.floor(left/60),ss=left%60;
 $("timer").textContent=String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0");
 $("timerBox").classList.toggle("urgent",left<300);
 if(left<=0&&state.mode==="exam"&&!state.finished)finishSession(true);
}
function startMode(mode){
 if(!state.ready)return;
 stats=readStats();
 const available=classes();
 let selected=[];
 if(mode==="signs"){selected=available.filter(q=>q.topic==="signs");}
 else if(mode==="mistakes"){const failed=new Set(stats.wrong);selected=available.filter(q=>failed.has(q.id));}
 else selected=available;
 if(mode==="mistakes"&&!selected.length){$("bankText").textContent=text("noMistakes");return}
 const need=mode==="exam"?30:mode==="signs"?12:mode==="marathon"?20:mode==="mistakes"?Math.min(20,selected.length):10;
 if(selected.length<need){$("bankText").textContent=text("bankShort");return}
 const unseen=selected.filter(q=>!stats.answered[q.id]);
 const seen=selected.filter(q=>!!stats.answered[q.id]);
 const candidates=(mode==="exam"?shuffled(selected):shuffled(unseen).concat(shuffled(seen)));
 state.questions=candidates.slice(0,need);
 state.mode=mode;
 state.index=0;state.selected=null;state.answers=[];state.correct=0;state.earned=0;state.lives=3;state.finished=false;
 $("gameLobby").hidden=true;
 $("gameResult").hidden=true;
 $("gamePlaying").hidden=false;
 $("timerBox").hidden=mode!=="exam";
 $("currentMode").textContent=text({route:"modeRoute",signs:"modeSigns",exam:"modeExam",mistakes:"modeMistakes",marathon:"modeMarathon"}[mode]);
 stopClock();
 if(mode==="exam"){
  state.deadline=Date.now()+40*60*1000;
  formatClock();
  state.ticker=setInterval(formatClock,1000);
 }
 renderQuestion();
 $("gamePlaying").scrollIntoView({behavior:"smooth",block:"start"});
}
function safeImage(url){
 try{
  const x=new URL(url);
  return x.protocol==="https:"&&x.hostname==="www.gov.il"&&x.pathname.startsWith("/BlobFolder/")?x.href:null;
 }catch(e){return null}
}
function renderQuestion(){
 const q=state.questions[state.index];
 if(!q){finishSession(false);return}
 state.selected=null;
 state.choices=shuffled([0,1,2,3]);
 const total=state.questions.length;
 $("questionCounter").textContent=(state.index+1)+" / "+total;
 $("questionId").textContent="№ "+q.id;
 $("questionTopic").textContent=text("topics")[q.topic]||text("topics").laws;
 $("questionText").textContent=q.q;
 $("questionText").dir=state.lang==="he"?"rtl":"auto";
 $("scoreMeta").textContent="+"+state.earned+" XP";
 $("lifeMeta").textContent=state.mode==="exam"?"":state.mode==="marathon"?"∞":Array.from({length:3},(_,i)=>i<state.lives?"♥":"♡").join(" ");
 const progress=state.index/total*100;
 $("progressFill").style.width=progress+"%";
 $("progress").setAttribute("aria-valuenow",String(Math.round(progress)));
 const img=safeImage(q.image);
 $("questionPicture").hidden=!img;
 $("signPicture").src=img||"";
 $("signPicture").alt=text("topics")[q.topic]||"";
 $("signPicture").onerror=()=>{$("questionPicture").hidden=true};
 $("feedback").hidden=true;$("feedback").textContent="";$("feedback").classList.remove("negative");
 $("questionTip").textContent=text("questionTip");
 $("nextQuestion").disabled=true;
 $("nextQuestion").textContent=state.index===total-1?text("done"):text("next");
 $("answers").innerHTML=state.choices.map((original,i)=>
  '<button type="button" class="answer" data-original="'+original+'"><span class="letter">'+String.fromCharCode(65+i)+'</span><span dir="auto">'+esc(q.a[original])+'</span></button>'
 ).join("");
 $("answers").querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>pickAnswer(Number(button.dataset.original))));
}
function recordProgress(q,selected,wasCorrect){
 stats=readStats();
 const entry=stats.answered[q.id]||{n:0,ok:0};
 entry.n+=1;if(wasCorrect)entry.ok+=1;
 stats.answered[q.id]=entry;
 const set=new Set(stats.wrong);
 if(wasCorrect)set.delete(q.id);else set.add(q.id);
 stats.wrong=[...set].slice(-1200);
 stats.xp+=wasCorrect?15:0;
 saveStats();
}
function pickAnswer(chosen){
 if(state.selected!==null||state.finished)return;
 const q=state.questions[state.index];
 state.selected=chosen;
 const success=chosen===q.correct;
 state.answers.push({q,chosen,success});
 state.correct+=Number(success);
 if(success)state.earned+=15;else state.lives=Math.max(0,state.lives-1);
 $("nextQuestion").disabled=false;
 $("scoreMeta").textContent="+"+state.earned+" XP";
 const buttons=[...$("answers").querySelectorAll("button")];
 for(const b of buttons){
  b.disabled=true;
  const n=Number(b.dataset.original);
  if(state.mode==="exam"){if(n===chosen)b.classList.add("selected")}
  else{
   if(n===q.correct)b.classList.add("correct");
   if(n===chosen&&!success)b.classList.add("wrong");
  }
 }
 if(state.mode==="exam"){
  $("questionTip").textContent=text("examSelected");
 }else{
  recordProgress(q,chosen,success);
  const feedback=$("feedback");
  feedback.hidden=false;feedback.classList.toggle("negative",!success);
  feedback.textContent=success?text("correct"):text("wrong");
  $("lifeMeta").textContent=state.mode==="marathon"?"∞":Array.from({length:3},(_,i)=>i<state.lives?"♥":"♡").join(" ");
 }
}
function nextQuestion(){
 if(state.selected===null||state.finished)return;
 if(state.index>=state.questions.length-1||(state.mode==="route"&&state.lives===0)){
  finishSession(false);return;
 }
 state.index+=1;
 renderQuestion();
}
function finishSession(timedOut){
 if(state.finished)return;
 state.finished=true;
 stopClock();
 const n=state.questions.length;
 if(state.mode==="exam"){
  const answered=new Set(state.answers.map(x=>x.q.id));
  for(const entry of state.answers)recordProgress(entry.q,entry.chosen,entry.success);
  for(const q of state.questions.filter(q=>!answered.has(q.id))){
   recordProgress(q,null,false);
   state.answers.push({q,chosen:null,success:false});
  }
 }
 stats=readStats();
 stats.history.push({mode:state.mode,lang:state.lang,licence:state.licence,
     correct:state.correct,total:n,time:new Date().toISOString()});
 stats.history=stats.history.slice(-30);saveStats();
 $("gamePlaying").hidden=true;$("gameResult").hidden=false;
 const passed=state.mode==="exam"&&state.correct>=26,percent=Math.round(100*state.correct/n);
 $("resultBadge").textContent=passed?"🏆":percent>=80?"🌟":percent>=60?"🚙":"🛣️";
 $("resultTitle").textContent=state.mode==="exam"?(passed?text("resultPass"):text("resultFail")):percent>=90?text("resultGreat"):percent>=60?text("resultGood"):text("resultKeep");
 $("resultSubtitle").textContent=timedOut?text("timeOut"):state.mode==="exam"?text("examResult")(state.correct):text("practiceResult");
 $("resultScore").textContent=state.correct+" / "+n;
 $("resultPercent").textContent=percent+"%";
 $("resultXP").textContent="+"+state.earned+" XP";
 $("resultMistakes").hidden=true;$("resultMistakes").innerHTML="";
 const wrong=state.answers.filter(x=>!x.success);
 if(wrong.length){
  $("resultMistakes").hidden=false;
  $("resultMistakes").innerHTML="<strong>"+esc(text("errorsList"))+"</strong>"+wrong.slice(0,30).map(x=>
   '<div><strong>№ '+esc(x.q.id)+' · '+esc(x.q.q)+'</strong><span>✓ '+esc(x.q.a[x.q.correct])+'</span></div>'
  ).join("");
 }
 $("gameResult").scrollIntoView({behavior:"smooth",block:"start"});
 refreshStats();
}
function init(){
 const saved=safeStoreGet("neoline-language");
 state.lang=DICTS[saved]?saved:"ru";
 const license=safeStoreGet("neoline-teoria-licence");
 state.licence=["B","A","C1","C","D","1"].includes(license)?license:"B";
 setCopy();
 document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>selectLanguage(b.dataset.lang)));
 $("licenseSelect").addEventListener("change",e=>selectLicence(e.target.value));
 document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
 $("exitQuiz").addEventListener("click",quitSession);
 $("nextQuestion").addEventListener("click",nextQuestion);
 $("backToModes").addEventListener("click",quitSession);
 $("restartMode").addEventListener("click",()=>startMode(state.mode));
 document.addEventListener("visibilitychange",()=>{if(state.mode==="exam"&&!document.hidden&&!state.finished)formatClock()});
 loadBank();
}
init();
})();