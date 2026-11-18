/* Shared NEOLINE header adapter. Native page translators still own
   the texts; this adapter only connects delivery flags to its existing
   select and marks the actual active language. */
(()=>{
 "use strict";
 const header=document.querySelector(".neoline-site-header");
 if(!header)return;
 const flags=[...header.querySelectorAll(".neoline-site-header__flag[data-language],.neoline-site-header__flag[data-site-lang],.neoline-site-header__flag[data-news-lang],.neoline-site-header__flag[data-hot-lang],.neoline-site-header__flag[data-lang]")];
 const target=button=>button.dataset.language||button.dataset.siteLang||button.dataset.newsLang||button.dataset.hotLang||button.dataset.lang;
 function safeSaved(){try{return localStorage.getItem("neoline-language")||"ru"}catch(e){return"ru"}}
 const deliverySelect=header.querySelector("#language");
 function sync(lang){
  for(const button of flags){
   const selected=target(button)===lang;
   // News, hot events, home and Theory own their native active classes.
   // Only Delivery needs its class managed here. Otherwise switching
   // languages could leave TWO flags highlighted.
   if(deliverySelect)button.classList.toggle("active",selected);
   button.setAttribute("aria-pressed",String(selected));
  }
  const basket=header.querySelector(".neoline-site-header__cart");
  if(basket?.tagName==="A"){
   const label=({ru:"Корзина",he:"סל קניות",en:"Shopping cart",ar:"سلة التسوق"})[lang]||"Корзина";
   basket.setAttribute("aria-label",label);
   basket.title=label;
  }
 }
 if(deliverySelect){
  header.addEventListener("click",event=>{
   const button=event.target.closest(".neoline-site-header__flag[data-site-lang]");
   if(!button||!header.contains(button))return;
   const lang=button.dataset.siteLang;
   if(deliverySelect.value===lang)return;
   deliverySelect.value=lang;
   deliverySelect.dispatchEvent(new Event("change",{bubbles:true}));
   sync(lang);
  });
  deliverySelect.addEventListener("change",()=>sync(deliverySelect.value));
 }
 // Each native page script sets its own persisted language during startup.
 // Synchronize after it has initialized without taking over its behavior.
 const refresh=()=>{
  const native=deliverySelect?.value;
  const lang=native||document.documentElement.lang||safeSaved();
  if(flags.some(b=>target(b)===lang))sync(lang);
 };
 window.addEventListener("pageshow",refresh);
 window.addEventListener("neoline:delivery-language",refresh);
 window.addEventListener("neoline:news-language",refresh);
 window.setTimeout(refresh,0);
})();
