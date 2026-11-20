/* NEOLINE Israel: low-overhead animated road illustration.
   Built-in SVG; paused when offscreen, page hidden, or reduced-motion requested.
   An illustration only: not every feature is available in every NEOLINE model. */
(function(){
 "use strict";
 const root=document.getElementById("neolineRoadDemo");
 if(!root)return;
 const languages={
  ru:{
   label:"Как NEOLINE помогает на дороге",
   tag:"ВИД С ДОРОГИ",demo:"ДЕМОНСТРАЦИЯ",note:"Иллюстрация: функции зависят от модели и региона.",
   rec:"ЗАПИСЬ",gps:"GPS",dual:"2 КАМЕРЫ",parking:"ПАРКОВКА",
   stages:[
    {title:"Контроль дороги",sub:"Широкоугольная запись",hud:"REC · FRONT"},
    {title:"GPS-предупреждения",sub:"Поддержка зависит от модели",hud:"GPS · ALERT"},
    {title:"Вторая камера",sub:"Обзор сзади",hud:"REAR · VIEW"},
    {title:"Парковочный режим",sub:"Контроль при стоянке",hud:"P · MONITOR"}
   ]
  },
  en:{
   label:"How NEOLINE works on the road",
   tag:"LIVE ROAD VIEW",demo:"ILLUSTRATION",note:"Illustration only. Features depend on model and region.",
   rec:"RECORD",gps:"GPS",dual:"DUAL CAM",parking:"PARKING",
   stages:[
    {title:"Road recording",sub:"Wide-angle recording",hud:"REC · FRONT"},
    {title:"GPS alerts",sub:"On compatible devices",hud:"GPS · ALERT"},
    {title:"Dual-camera view",sub:"Rear coverage",hud:"REAR · VIEW"},
    {title:"Parking monitoring",sub:"When supported",hud:"P · MONITOR"}
   ]
  },
  he:{
   label:"כך NEOLINE פועלת בדרך",
   tag:"מבט על הדרך",demo:"להמחשה",note:"הדמיה בלבד. התכונות תלויות בדגם ובאזור.",
   rec:"צילום",gps:"GPS",dual:"2 מצלמות",parking:"חניה",
   stages:[
    {title:"צילום הדרך",sub:"צילום בזווית רחבה",hud:"REC · FRONT"},
    {title:"התראות GPS",sub:"תלוי בדגם ובאזור",hud:"GPS · ALERT"},
    {title:"שתי מצלמות",sub:"תצוגה אחורית",hud:"REAR · VIEW"},
    {title:"ניטור חניה",sub:"לפי הדגם והחיבור",hud:"P · MONITOR"}
   ]
  },
  ar:{
   label:"كيف تعمل NEOLINE على الطريق",
   tag:"عرض الطريق",demo:"عرض توضيحي",note:"رسم توضيحي، تختلف الميزات حسب الطراز والمنطقة.",
   rec:"تسجيل",gps:"GPS",dual:"كاميرتان",parking:"وقوف",
   stages:[
    {title:"تسجيل الطريق",sub:"تصوير بزاوية واسعة",hud:"REC · FRONT"},
    {title:"تنبيهات GPS",sub:"حسب الطراز والمنطقة",hud:"GPS · ALERT"},
    {title:"الكاميرا الخلفية",sub:"عرض الكاميرا الخلفية",hud:"REAR · VIEW"},
    {title:"مراقبة الوقوف",sub:"للطرازات المدعومة",hud:"P · MONITOR"}
   ]
  }
 };
 const title=root.querySelector("[data-road-title]");
 const detail=root.querySelector("[data-road-detail]");
 const hud=root.querySelector("[data-road-hud]");
 const note=root.querySelector("[data-road-note]");
 const demo=root.querySelector("[data-road-demo]");
 const tag=root.querySelector("[data-road-tag]");
 const steps=[...root.querySelectorAll("[data-road-step]")];
 const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)");
 let stage=0,timer=0,visible=false;
 const language=()=>languages[document.documentElement.lang]||languages.ru;
 function repaint(){
  const tr=language();
  const index=stage%tr.stages.length;
  root.dataset.roadStage=String(index);
  root.setAttribute("aria-label",tr.label);
  title.textContent=tr.stages[index].title;
  detail.textContent=tr.stages[index].sub;
  hud.textContent=tr.stages[index].hud;
  note.textContent=tr.note;
  demo.textContent=tr.demo;
  if(tag)tag.textContent=tr.tag;
  steps.forEach((btn,i)=>{
   btn.textContent=[tr.rec,tr.gps,tr.dual,tr.parking][i];
   btn.setAttribute("aria-pressed",String(i===index));
  });
 }
 function stop(){
  if(timer){window.clearInterval(timer);timer=0;}
  root.classList.remove("is-playing");
 }
 function start(){
  stop();
  if(!visible || document.hidden || prefersReduced.matches)return;
  root.classList.add("is-playing");
  timer=window.setInterval(()=>{stage=(stage+1)%4;repaint();},4500);
 }
 steps.forEach((button,i)=>button.addEventListener("click",()=>{
  stage=i;repaint();start();
 }));
 const observe=new IntersectionObserver(entries=>{
  visible=entries.some(entry=>entry.isIntersecting && entry.intersectionRatio>=.14);
  start();
 },{threshold:[0,.14,.5]});
 observe.observe(root);
 document.addEventListener("visibilitychange",start);
 if(typeof prefersReduced.addEventListener==="function")
  prefersReduced.addEventListener("change",start);
 const attrObserver=new MutationObserver(records=>{
  if(records.some(r=>r.attributeName==="lang"))repaint();
 });
 attrObserver.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 repaint();
})();
