/* NEOLINE · Vice Sunset cinematic carousel + optional entrance effects.
   Reuses the existing five-slide carousel, targets and timer.
   Images are original SVG assets bundled with the site. */
(()=>{
"use strict";
const host=document.querySelector(".theory-promo-host");
// Progressive enhancement: only use screenshot-faithful reference artwork
// when this browser actually decodes the local AVIF. Other languages retain
// editable translated headings and the original multi-layer poster.
const refPoster=new Image();
refPoster.onload=()=>document.documentElement.classList.add("vice-reference-ready");
refPoster.onerror=()=>document.documentElement.classList.remove("vice-reference-ready");
refPoster.src="./assets/teoria/vice-hero-reference.avif";
if(!host || host.querySelector(".vice-cinema-stage"))return;
const existing=[...host.querySelectorAll(".hero-studio-svg,.theory-promo-slide")];
const dots=[...host.querySelectorAll(".theory-promo-dot")];
if(existing.length!==5||dots.length!==5)return;
const i18n={
 ru:[
  {tag:"ИЗРАИЛЬ · ИГРА",headline:"НОВЫЙ СЕЗОН ИГРЫ",body:"Проходи задания · Получай XP · Открывай подарки"},
  {tag:"ПЯТЬ РЕЖИМОВ",headline:"ТВОЙ МАРШРУТ",body:"Выбирай задания · Играй каждый день"},
  {tag:"XP И НАГРАДЫ",headline:"НОВЫЙ СЕЗОН ИГРЫ",body:"Проходи задания · Получай XP · Открывай подарки"},
  {tag:"КАК НА ЭКЗАМЕНЕ",headline:"ПРОВЕРЬ СЕБЯ",body:"30 вопросов · 40 минут · Настоящие правила"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"Включи неоновый мир · Верни обычный стиль"}
 ],
 en:[
  {tag:"ISRAEL · GAME",headline:"NEW GAME SEASON",body:"Complete missions · Earn XP · Unlock rewards"},
  {tag:"FIVE GAME MODES",headline:"YOUR ROUTE",body:"Choose a mission · Earn experience"},
  {tag:"XP & REWARDS",headline:"A NEW GAME SEASON",body:"Complete missions · Earn XP · Unlock gifts"},
  {tag:"EXAM TRAINING",headline:"TEST YOUR SKILLS",body:"30 questions · 40 minutes · Real rules"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"Enter the neon world · Switch back at any time"}
 ],
 he:[
  {tag:"ישראל · משחק",headline:"עונת משחק חדשה",body:"משלימים משימות · צוברים XP · פותחים פרסים"},
  {tag:"חמישה מצבי משחק",headline:"המסלול שלך",body:"בוחרים משימות · לומדים כל יום"},
  {tag:"XP ופרסים",headline:"עונת משחק חדשה",body:"משלימים משימות · צוברים XP · פותחים מתנות"},
  {tag:"הכנה למבחן",headline:"בוחנים את עצמכם",body:"30 שאלות · 40 דקות · חוקי תנועה"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"מצב ניאון · חזרה לעיצוב המקורי"}
 ],
 ar:[
  {tag:"إسرائيل · لعبة",headline:"موسم لعب جديد",body:"أكمل المهام · اكسب XP · افتح الهدايا"},
  {tag:"خمسة أنماط",headline:"طريقك الخاص",body:"اختر المهام · واكتسب الخبرة"},
  {tag:"نقاط XP والهدايا",headline:"موسم لعبة جديد",body:"أكمل المهام · اكسب XP · افتح الهدايا"},
  {tag:"الامتحان التجريبي",headline:"اختبر مهاراتك",body:"30 سؤالًا · 40 دقيقة · قوانين المرور"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"عالم النيون · يمكنك العودة للوضع العادي"}
 ]
};
const artClasses=["city","signs","rewards","exam","duo"];
const sceneURLs=[
 "./assets/teoria/vice-cinematic-duo.svg",
 "./assets/teoria/vice-card-marathon.svg",
 "./assets/teoria/vice-approved-protagonists.webp",
 "./assets/teoria/vice-card-exam.svg",
 "./assets/teoria/vice-approved-protagonists.webp"
];
const stage=document.createElement("div");
stage.className="vice-cinema-stage";
stage.setAttribute("aria-hidden","true");
const frames=sceneURLs.map((url,index)=>{
 const frame=document.createElement("div");
 frame.className="vice-cinema-frame vice-cinema-frame--"+artClasses[index];
 frame.dataset.slide=String(index);
 const scene=document.createElement("div");
 scene.className="vice-cinema-scene";
 scene.style.backgroundImage='url("'+url+'")';
 const mask=document.createElement("span");
 mask.className="vice-cinema-mask";
 const words=document.createElement("div");
 words.className="vice-cinema-story";
 const tag=document.createElement("span");tag.className="vice-cinema-tag";
 const headline=document.createElement("strong");headline.className="vice-cinema-headline";
 const body=document.createElement("span");body.className="vice-cinema-sub";
 words.append(tag,headline,body);
 frame.append(scene,mask,words);
 stage.appendChild(frame);
 return {frame,tag,headline,body};
});
host.appendChild(stage);
// Original slide navigation stays in charge of timers, dots and destinations.
const previous=document.createElement("button"),next=document.createElement("button");
for(const [button,direction]of [[previous,-1],[next,1]]){
 button.type="button";
 button.className="vice-cinema-arrow vice-cinema-arrow--"+(direction<0?"prev":"next");
 button.setAttribute("aria-label",direction<0?"Предыдущий слайд":"Следующий слайд");
 button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg>';
 button.addEventListener("click",event=>{
  event.preventDefault();event.stopPropagation();
  const current=dots.findIndex(dot=>dot.getAttribute("aria-current")==="true");
  const target=(Math.max(current,0)+direction+dots.length)%dots.length;
  dots[target].click();
 });
 host.appendChild(button);
}
let current=-1;
function active(){
 let now=dots.findIndex(dot=>dot.getAttribute("aria-current")==="true");
 if(now<0)now=0;
 if(now===current)return;
 current=now;
 host.dataset.viceActiveSlide=String(now);
 document.querySelector(".game-hero.theory-dashboard")?.setAttribute("data-vice-promo-slide",String(now));
 for(let i=0;i<frames.length;i++){
  const el=frames[i].frame;
  el.classList.toggle("is-active",i===now);
  el.setAttribute("aria-hidden",i===now?"false":"true");
 }
}
new MutationObserver(active).observe(host,{subtree:true,attributes:true,attributeFilter:["aria-current"]});
function localize(){
 const locale=document.documentElement.lang.split("-")[0];
 const entries=i18n[locale]||i18n.ru;
 frames.forEach((p,i)=>{
  p.tag.textContent=entries[i].tag;
  p.headline.textContent=entries[i].headline;
  p.body.textContent=entries[i].body;
 });
 previous.setAttribute("aria-label",({ru:"Предыдущий рекламный слайд",en:"Previous promotional slide",he:"שקופית קודמת",ar:"الشريحة السابقة"})[locale]||"Предыдущий рекламный слайд");
 next.setAttribute("aria-label",({ru:"Следующий рекламный слайд",en:"Next promotional slide",he:"שקופית הבאה",ar:"الشريحة التالية"})[locale]||"Следующий рекламный слайд");
}
new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
localize();
active();
// Expose a truthful description for screen readers; all real actions stay on
// the existing promotional button and dots.
host.setAttribute("aria-roledescription","карусель");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let showTimeout=0;
function entrance(){
 if(reduce||document.documentElement.dataset.viceTheme!=="on")return;
 for(const [i,elem]of [...document.querySelectorAll("#gameLobby .route-card,.game-hero.theory-dashboard,.theory-daily")].entries()){
  elem.style.setProperty("--vice-reveal-order",String(Math.min(i,6)));
  elem.classList.remove("vice-is-entering");
  void elem.offsetWidth;
  elem.classList.add("vice-is-entering");
 }
 clearTimeout(showTimeout);
 showTimeout=setTimeout(()=>{
  document.querySelectorAll(".vice-is-entering").forEach(el=>el.classList.remove("vice-is-entering"));
 },1000);
}
function welcome(){
 // Open the cinematic protagonist poster as the FIRST slide of the neon mode.
 // The regular five-slide timer continues rotating afterwards.
 if(dots[0]?.getAttribute("aria-current")!=="true")dots[0]?.click();
 entrance();
}
let wasEnabled=document.documentElement.dataset.viceTheme==="on";
window.addEventListener("neoline:vice-theme",event=>{
 const nowEnabled=Boolean(event.detail?.enabled);
 // Localization refreshes this event too. Do not reset an open carousel slide
 // just because the visitor switched Russian, English, Hebrew or Arabic.
 if(nowEnabled&&!wasEnabled)welcome();
 wasEnabled=nowEnabled;
});
if(wasEnabled)requestAnimationFrame(welcome);
})();
