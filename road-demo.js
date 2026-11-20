/* NEOLINE Israel — premium four-mode motion telemetry demo.
 * Original layered SVG roadway + light-weight CSS compositing. No WebGL/video,
 * no fake claims about live measurements or support by every camera model.
 * Motion is paused offscreen, in background tabs and in reduced-motion mode.
 */
(function(){
 "use strict";
 const root=document.getElementById("neolineRoadDemo");
 if(!root)return;
 const languages={
  ru:{
   label:"Как NEOLINE помогает на дороге",tag:"ВИД С ДОРОГИ",
   demo:"ДЕМОНСТРАЦИЯ",note:"Иллюстрация: функции зависят от модели и региона.",
   rec:"ЗАПИСЬ",gps:"GPS",dual:"2 КАМЕРЫ",parking:"ПАРКОВКА",
   unit:"КМ/Ч",satellites:"12 спутников",lane:"Полоса",laneStatus:"распознана ✓",
   laneWarning:"Выезд из полосы!",gpsNote:"GPS принимает сигналы спутников; схема условная. Функции зависят от модели.",
   recording:"Запись",rear:"Камера сзади",parkingStatus:"Контроль парковки",
   speedLimit:"Ограничение",overspeed:"Превышение скорости",
   stages:[
    {title:"Контроль дороги",sub:"Широкоугольная запись",hud:"REC · FRONT"},
    {title:"GPS-предупреждения",sub:"Поддержка зависит от модели",hud:"GPS · ALERT"},
    {title:"Вторая камера",sub:"Обзор спереди и сзади",hud:"FRONT · REAR"},
    {title:"Парковочный режим",sub:"Контроль автомобиля на стоянке",hud:"P · MONITOR"}
   ]
  },
  en:{
   label:"How NEOLINE works on the road",tag:"ROAD VIEW",
   demo:"DEMONSTRATION",note:"Illustration only. Features vary by model and region.",
   rec:"RECORD",gps:"GPS",dual:"DUAL CAM",parking:"PARKING",
   unit:"KM/H",satellites:"12 satellites",lane:"Lane",laneStatus:"recognized ✓",
   laneWarning:"Lane departure!",gpsNote:"GPS receives satellite signals. Visualized for demonstration; features vary by model.",
   recording:"Recording",rear:"Rear camera",parkingStatus:"Parking monitoring",
   speedLimit:"Speed limit",overspeed:"Speeding warning",
   stages:[
    {title:"Road awareness",sub:"Wide-angle recording",hud:"REC · FRONT"},
    {title:"GPS alerts",sub:"On compatible devices",hud:"GPS · ALERT"},
    {title:"Dual-camera view",sub:"Front and rear view",hud:"FRONT · REAR"},
    {title:"Parking protection",sub:"When supported",hud:"P · MONITOR"}
   ]
  },
  he:{
   label:"כך NEOLINE פועלת בדרך",tag:"מבט על הדרך",
   demo:"להמחשה",note:"הדמיה בלבד. התכונות תלויות בדגם ובאזור.",
   rec:"צילום",gps:"GPS",dual:"2 מצלמות",parking:"חניה",
   unit:'קמ"ש',satellites:"12 לוויינים",lane:"נתיב",laneStatus:"זוהה ✓",
   laneWarning:"סטייה מנתיב!",gpsNote:"GPS קולט אותות מהלוויינים. ההדמיה להמחשה בלבד; תלוי בדגם.",
   recording:"הקלטה",rear:"מצלמה אחורית",parkingStatus:"ניטור חניה",
   speedLimit:"מהירות מותרת",overspeed:"חריגה מהמהירות",
   stages:[
    {title:"שליטה בכביש",sub:"צילום בזווית רחבה",hud:"REC · FRONT"},
    {title:"התראות GPS",sub:"לפי דגם המצלמה",hud:"GPS · ALERT"},
    {title:"שתי מצלמות",sub:"צילום מקדימה ומאחור",hud:"FRONT · REAR"},
    {title:"מצב חניה",sub:"בהתאם לדגם",hud:"P · MONITOR"}
   ]
  },
  ar:{
   label:"كيف تعمل NEOLINE على الطريق",tag:"مشهد الطريق",
   demo:"عرض توضيحي",note:"للتوضيح فقط؛ تختلف الميزات حسب الطراز والمنطقة.",
   rec:"تسجيل",gps:"GPS",dual:"كاميرتان",parking:"وقوف",
   unit:"كم/س",satellites:"12 قمراً صناعياً",lane:"المسار",laneStatus:"تم التعرف ✓",
   laneWarning:"انحراف عن المسار!",gpsNote:"يستقبل GPS إشارات الأقمار الصناعية. العرض توضيحي والميزات حسب الطراز.",
   recording:"التسجيل",rear:"الكاميرا الخلفية",parkingStatus:"مراقبة الوقوف",
   speedLimit:"السرعة المسموحة",overspeed:"تجاوز السرعة",
   stages:[
    {title:"مراقبة الطريق",sub:"تسجيل واسع الزاوية",hud:"REC · FRONT"},
    {title:"تنبيهات GPS",sub:"حسب الطراز",hud:"GPS · ALERT"},
    {title:"كاميرتان",sub:"عرض أمامي وخلفي",hud:"FRONT · REAR"},
    {title:"وضع الوقوف",sub:"عند توفر الدعم",hud:"P · MONITOR"}
   ]
  }
 };
 const query=s=>root.querySelector(s);
 const fields={
  title:query("[data-road-title]"),detail:query("[data-road-detail]"),
  hud:query("[data-road-hud]"),note:query("[data-road-note]"),
  demo:query("[data-road-demo]"),tag:query("[data-road-tag]"),
  speed:query("[data-road-speed]"),unit:query("[data-road-unit]"),
  satellites:query("[data-road-gps]"),lane:query("[data-road-lane]"),
  laneStatus:query("[data-road-lane-status]"),record:query("[data-road-record]"),
  elapsed:query("[data-road-elapsed]"),rear:query("[data-road-rear]"),
  parking:query("[data-road-parking]"),
  limit:query("[data-road-limit]"),overspeed:query("[data-road-overspeed]"),
  excess:query("[data-road-excess]")
 };
 const buttons=[...root.querySelectorAll("[data-road-step]")];
 const media=window.matchMedia("(prefers-reduced-motion: reduce)");
 const language=()=>languages[document.documentElement.lang]||languages.ru;
 let stage=0,visible=false,autoTimer=0,elapsedTimer=0,elapsed=156;
 let laneOnTimer=0,laneOffTimer=0;
 function formatClock(seconds){
  const m=Math.floor(seconds/60),s=seconds%60;
  return String(Math.floor(m/60)).padStart(2,"0")+":"+
   String(m%60).padStart(2,"0")+":"+String(s).padStart(2,"0");
 }
 function repaint(){
  const tr=language();
  const step=tr.stages[stage];
  root.dataset.roadStage=String(stage);
  root.classList.toggle("is-lane-demo",stage===0);
  if(stage!==0)root.classList.remove("is-lane-alert");
  root.setAttribute("aria-label",tr.label);
  fields.title.textContent=step.title;
  fields.detail.textContent=step.sub;
  fields.hud.textContent=step.hud;
  // GPS broadcasts are received by the car. The animated upward pulse
  // represents receiver acquisition, not a real uplink request.
  fields.note.textContent=stage===1?tr.gpsNote:tr.note;
  fields.demo.textContent=tr.demo;
  if(fields.tag)fields.tag.textContent=tr.tag;
  // Illustrative speeds only. In GPS mode a 60 km/h section is simulated:
  // 72 km/h triggers +12 km/h red warning. Never claim live radar sensing.
  const demoSpeed=stage===3?0:stage===2?64:72;
  const speedLimit=60;
  const over=stage===1&&demoSpeed>speedLimit;
  root.classList.toggle("is-overspeed",over);
  fields.speed.textContent=String(demoSpeed);
  fields.limit.textContent=String(speedLimit);
  fields.overspeed.textContent=tr.overspeed;
  fields.excess.textContent="+"+String(Math.max(0,demoSpeed-speedLimit))+" "+tr.unit.toLowerCase();
  const warning=query(".road-demo-speed-warning");
  warning.setAttribute("aria-label",tr.speedLimit+": "+speedLimit+"; "+tr.overspeed+": "+
    (demoSpeed-speedLimit)+" "+tr.unit);
  warning.setAttribute("aria-hidden",String(!over));
  fields.unit.textContent=tr.unit;
  fields.satellites.textContent=tr.satellites;
  fields.lane.textContent=tr.lane;
  fields.laneStatus.textContent=root.classList.contains("is-lane-alert")?
    tr.laneWarning:tr.laneStatus;
  fields.record.textContent=tr.recording;
  fields.rear.textContent=tr.rear;
  fields.parking.textContent=tr.parkingStatus;
  fields.elapsed.textContent=formatClock(elapsed);
  buttons.forEach((button,i)=>{
   button.textContent=[tr.rec,tr.gps,tr.dual,tr.parking][i];
   button.setAttribute("aria-pressed",String(stage===i));
   button.setAttribute("aria-label",button.textContent.trim());
  });
 }
 function clearLaneAlert(){
  root.classList.remove("is-lane-alert");
  if(fields.laneStatus)fields.laneStatus.textContent=language().laneStatus;
 }
 function stop(){
  clearTimeout(autoTimer);autoTimer=0;
  clearInterval(elapsedTimer);elapsedTimer=0;
  clearTimeout(laneOnTimer);laneOnTimer=0;
  clearTimeout(laneOffTimer);laneOffTimer=0;
  clearLaneAlert();
  root.classList.remove("is-playing");
 }
 function scheduleLaneDemo(){
  if(stage!==0||!visible||document.hidden||media.matches)return;
  // CSS car drift takes 7.2s. Raise lane warning while the car's right
  // side actually reaches the lane marker, then clear during recentering.
  // Repeat only when the user holds recording mode for another full cycle.
  const flash=()=>{
   if(stage!==0||!visible||document.hidden||media.matches)return;
   root.classList.add("is-lane-alert");
   fields.laneStatus.textContent=language().laneWarning;
   clearTimeout(laneOffTimer);
   laneOffTimer=window.setTimeout(clearLaneAlert,1660);
   laneOnTimer=window.setTimeout(flash,7200);
  };
  laneOnTimer=window.setTimeout(flash,2800);
 }
 function start(holdUserChoice=false){
  stop();
  if(!visible||document.hidden||media.matches)return;
  root.classList.add("is-playing");
  if(stage===0)scheduleLaneDemo();
  autoTimer=window.setTimeout(()=>{
   stage=(stage+1)%4;
   repaint();
   start(false);
  },holdUserChoice?11500:7800);
  elapsedTimer=window.setInterval(()=>{
   elapsed++;
   if(fields.elapsed)fields.elapsed.textContent=formatClock(elapsed);
  },1000);
 }
 buttons.forEach((button,i)=>{
  button.addEventListener("click",()=>{
   stage=i;repaint();
   // Manual selections remain clearly visible before the automated tour resumes.
   start(true);
  });
 });
 if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
   const on=entries.some(e=>e.isIntersecting && e.intersectionRatio>=.13);
   if(on!==visible){visible=on;start(false);}
  },{threshold:[0,.13,.4]});
  observer.observe(root);
 }else{
  visible=true;start(false);
 }
 document.addEventListener("visibilitychange",()=>start(false));
 if(typeof media.addEventListener==="function")media.addEventListener("change",()=>start(false));
 else if(typeof media.addListener==="function")media.addListener(()=>start(false));
 const attrObserver=new MutationObserver(records=>{
  if(records.some(r=>r.attributeName==="lang"))repaint();
 });
 attrObserver.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 repaint();
})();
