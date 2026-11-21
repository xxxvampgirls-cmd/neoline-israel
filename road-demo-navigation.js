/* NEOLINE — contextual four-tab dock while viewing the road demonstration.
   Replaces the disappearing five-tab bottom nav ONLY while road demo is on screen.
   "Back" returns to the exact promotional carousel slide that led here. */
(()=>{
 "use strict";
 const road=document.getElementById("neolineRoadDemo");
 const nav=document.getElementById("roadDemoQuicknav");
 if(!road||!nav)return;
 const mobile=matchMedia("(max-width:720px)");
 const reduced=matchMedia("(prefers-reduced-motion: reduce)");
 const text={
  ru:{nav:"Навигация по демонстрации",back:"К рекламе",catalog:"Каталог",news:"Новости",delivery:"Доставка"},
  en:{nav:"Demo navigation",back:"Back to ad",catalog:"Catalog",news:"News",delivery:"Delivery"},
  he:{nav:"ניווט בהדגמה",back:"חזרה לפרסומת",catalog:"קטלוג",news:"חדשות",delivery:"משלוחים"},
  ar:{nav:"التنقل من العرض",back:"العودة للإعلان",catalog:"الكتالوج",news:"الأخبار",delivery:"التوصيل"}
 };
 const labels=()=>text[(document.documentElement.lang||"ru").toLowerCase().split("-")[0]]||text.ru;
 function localize(){
  const c=labels();
  nav.setAttribute("aria-label",c.nav);
  for(const key of ["back","catalog","news","delivery"]){
   const link=nav.querySelector('[data-road-quick="'+key+'"]');
   if(!link)continue;
   const name=c[key];
   const label=link.querySelector("span");
   if(label)label.textContent=name;
   link.setAttribute("aria-label",name);
  }
 }
 let queued=false;
 function refresh(){
  queued=false;
  const rect=road.getBoundingClientRect();
  const active=mobile.matches && rect.bottom>150 && rect.top<innerHeight-125;
  document.body.classList.toggle("road-demo-nav-active",active);
  nav.setAttribute("aria-hidden",active?"false":"true");
  nav.inert=!active;
 }
 function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(refresh);
 }
 nav.querySelector('[data-road-quick="back"]')?.addEventListener("click",()=>{
  // Restore the How-It-Works advertisement, not a random product slide.
  const slides=[...document.querySelectorAll("#showcaseSlides .featured-slide")];
  const index=slides.findIndex(slide=>slide.classList.contains("featured-slide--promo-how"));
  if(index>=0)document.querySelector('#showcaseDots [data-dot="'+index+'"]')?.click();
  if(location.hash==="#neolineRoadDemo"){
   try{history.replaceState(history.state,"",location.pathname+location.search)}catch(_){}
  }
  window.scrollTo({top:0,behavior:reduced.matches?"instant":"smooth"});
  schedule();
 });
 nav.querySelector('[data-road-quick="catalog"]')?.addEventListener("click",()=>{
  const catalog=document.getElementById("catalog");
  if(!catalog)return;
  try{history.pushState(history.state,"","#catalog")}catch(_){}
  catalog.scrollIntoView({behavior:reduced.matches?"instant":"smooth",block:"start"});
  schedule();
 });
 window.addEventListener("scroll",schedule,{passive:true});
 window.addEventListener("resize",schedule,{passive:true});
 window.addEventListener("hashchange",schedule);
 window.addEventListener("pageshow",schedule);
 if(typeof mobile.addEventListener==="function")mobile.addEventListener("change",schedule);
 else mobile.addListener(schedule);
 new MutationObserver(localize).observe(document.documentElement,{
  attributes:true,attributeFilter:["lang"]
 });
 localize();
 schedule();
})();
