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
 function sync(lang){
  for(const button of flags){
   const selected=target(button)===lang;
   button.classList.toggle("active",selected);
   button.classList.toggle("on",selected);
   button.setAttribute("aria-pressed",String(selected));
  }
 }
 const deliverySelect=header.querySelector("#language");
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
