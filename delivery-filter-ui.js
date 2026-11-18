/* NEOLINE compact map interface: move legacy long lists into a native
   modal sheet, keeping map first. No maps or points are fabricated. */
(function(){
 "use strict";
 const $=id=>document.getElementById(id);
 const text={
  ru:{
   search:"Город, сеть, магазин",networks:"Сети",details:"Подробнее",
   title:"Поиск и фильтры",subtitle:"Города, сети, магазины и статистика",
   city:"Город",network:"Сети",stores:"Магазины",stats:"Статистика",
   cityHeading:"Поиск города или района",cityHint:"Начните вводить город или выберите из списка. Карта откроет его окрестности.",
   networkHeading:"Выберите сеть доставки",networkHint:"Отдельные операторы отображаются только там, где есть координаты OSM.",
   shopHeading:"Магазины · возможные партнёры",shopHint:"Филиалы на карте не означают, что в этих магазинах продаётся NEOLINE.",
   statsHeading:"Точки, контакты и официальные сайты",close:"Закрыть",
   modes:{all:"Все",stores:"Магазины",lockers:"Постаматы",pickup:"Пункты выдачи",post:"Почта",couriers:"Курьеры"},
   surface:{all:"Все точки Израиля",stores:"Магазины Израиля",lockers:"Постаматы",pickup:"Пункты выдачи",post:"Почтовые отделения",couriers:"Курьерские сети"},
   mapHint:"Показаны реальные точки с координатами OpenStreetMap. Для полного списка проверяйте сайты сетей.",
   counts:(p,r)=>p+" точек доставки · "+r+" магазинов на карте (OSM)",
   networkSelected:"Выбрана сеть: ",shopSelected:"Выбран магазин: "
  },
  en:{
   search:"City, network, store",networks:"Networks",details:"Details",
   title:"Search and filters",subtitle:"Cities, carriers, retailers and statistics",
   city:"City",network:"Networks",stores:"Stores",stats:"Statistics",
   cityHeading:"Find a city or district",cityHint:"Enter a city or select one from the list to zoom the map.",
   networkHeading:"Select a delivery network",networkHint:"Only points with public OSM coordinates are plotted.",
   shopHeading:"Retail stores · potential partners",shopHint:"A mapped branch does not confirm the store sells NEOLINE products.",
   statsHeading:"Locations, contacts and official directories",close:"Close",
   modes:{all:"All",stores:"Stores",lockers:"Lockers",pickup:"Pick-up points",post:"Post offices",couriers:"Couriers"},
   surface:{all:"All mapped locations",stores:"Retail stores",lockers:"Parcel lockers",pickup:"Pick-up points",post:"Post offices",couriers:"Courier networks"},
   mapHint:"Actual OpenStreetMap locations only. Check operator websites for complete coverage.",
   counts:(p,r)=>p+" delivery points · "+r+" retail stores (OSM)",
   networkSelected:"Network: ",shopSelected:"Store: "
  },
  he:{
   search:"עיר, רשת או חנות",networks:"רשתות",details:"פרטים",
   title:"חיפוש וסינון",subtitle:"ערים, רשתות, חנויות ונתונים",
   city:"עיר",network:"רשתות",stores:"חנויות",stats:"נתונים",
   cityHeading:"חיפוש יישוב או אזור",cityHint:"הקלידו שם יישוב או בחרו מהרשימה למיקוד המפה.",
   networkHeading:"בחירת רשת משלוחים",networkHint:"מוצגות רק נקודות עם קואורדינטות פומביות ב-OSM.",
   shopHeading:"חנויות · שותפות פוטנציאלית",shopHint:"מיקום של חנות במפה אינו אישור למכירת מוצרי NEOLINE.",
   statsHeading:"נקודות, קשר ומפות רשמיות",close:"סגירה",
   modes:{all:"הכול",stores:"חנויות",lockers:"לוקרים",pickup:"נקודות איסוף",post:"דואר",couriers:"שליחים"},
   surface:{all:"כל הנקודות במפה",stores:"חנויות",lockers:"לוקרים",pickup:"נקודות איסוף",post:"סניפי דואר",couriers:"רשתות שליחויות"},
   mapHint:"נקודות אמתיות מ-OpenStreetMap בלבד. לרשימה מלאה בדקו באתר הרשת.",
   counts:(p,r)=>p+" נקודות משלוח · "+r+" חנויות במפה (OSM)",
   networkSelected:"רשת: ",shopSelected:"חנות: "
  },
  ar:{
   search:"مدينة، شبكة أو متجر",networks:"الشبكات",details:"التفاصيل",
   title:"البحث والتصفية",subtitle:"المدن وشبكات التوصيل والمتاجر والإحصاءات",
   city:"مدينة",network:"الشبكات",stores:"المتاجر",stats:"الإحصاءات",
   cityHeading:"البحث عن مدينة أو منطقة",cityHint:"أدخل اسم المدينة أو اختر من القائمة لتكبير الخريطة.",
   networkHeading:"اختر شبكة التوصيل",networkHint:"تظهر فقط المواقع ذات إحداثيات منشورة في OSM.",
   shopHeading:"متاجر · شركاء محتملون",shopHint:"وجود فرع على الخريطة لا يعني أنه يبيع منتجات NEOLINE.",
   statsHeading:"المواقع، جهات الاتصال والمواقع الرسمية",close:"إغلاق",
   modes:{all:"الكل",stores:"متاجر",lockers:"خزائن",pickup:"نقاط استلام",post:"البريد",couriers:"شركات التوصيل"},
   surface:{all:"كل المواقع",stores:"المتاجر",lockers:"خزائن طرود",pickup:"نقاط الاستلام",post:"مكاتب البريد",couriers:"شركات التوصيل"},
   mapHint:"مواقع حقيقية من OpenStreetMap فقط. تحقق من مواقع الشركات الرسمية للتغطية الكاملة.",
   counts:(p,r)=>p+" نقاط توصيل · "+r+" متاجر على الخريطة (OSM)",
   networkSelected:"الشبكة: ",shopSelected:"المتجر: "
  }
 };
 const dict=()=>text[document.documentElement.lang]||text.ru;
 const tabs=["city","network","stores","stats"];
 const modes=["all","stores","lockers","pickup","post","couriers"];
 let selectedMode="all",currentPanel="city",lastFocus=null,
     selectedBrand=null,selectedShop=null,counts={pickup:0,retail:0};
 const field=id=>$(id);
 function setTab(name){
  if(!tabs.includes(name))name="city";
  currentPanel=name;
  for(const key of tabs){
   const tab=field("locatorTab"+key[0].toUpperCase()+key.slice(1));
   const pane=field("locatorPanel"+key[0].toUpperCase()+key.slice(1));
   const selected=key===name;
   tab.setAttribute("aria-selected",String(selected));
   tab.tabIndex=selected?0:-1;
   pane.hidden=!selected;
  }
  field("locatorDialogContent").scrollTop=0;
 }
 function openSheet(tab){
  const dlg=field("locatorDialog");
  if(!dlg)return;
  lastFocus=document.activeElement;
  setTab(tab);
  if(!dlg.open){
   if(typeof dlg.showModal==="function")dlg.showModal();
   else dlg.setAttribute("open","");
  }
  requestAnimationFrame(()=>field("locatorDialogClose").focus());
 }
 function closeSheet(){
  const dlg=field("locatorDialog");
  if(dlg.open){
   if(typeof dlg.close==="function")dlg.close();
   else dlg.removeAttribute("open");
  }
 }
 function highlight(mode,brand=null,shop=null){
  selectedMode=mode;selectedBrand=brand;selectedShop=shop;
  field("locatorModeFilters").querySelectorAll("[data-map-mode]").forEach(el=>{
   el.setAttribute("aria-pressed",String(el.dataset.mapMode===mode));
  });
  updateSummary();
 }
 function updateSummary(){
  const t=dict();
  if(selectedBrand){
   field("locatorSummary").textContent=t.networkSelected+selectedBrand;
  }else if(selectedShop){
   field("locatorSummary").textContent=t.shopSelected+selectedShop;
  }else{
   field("locatorSummary").textContent=t.counts(counts.pickup,counts.retail);
  }
 }
 function showMode(mode){
  if(!modes.includes(mode))return;
  window.dispatchEvent(new CustomEvent("neoline:delivery-provider",{detail:{id:"all"}}));
  highlight(mode);
  // The network panel must not claim a single carrier is selected after
  // a global type filter replaces that carrier's map.
  document.querySelectorAll("[data-provider]").forEach(button=>{
   const on=mode==="all"&&button.dataset.provider==="all";
   button.classList.toggle("active",on);
   button.setAttribute("aria-pressed",String(on));
  });
  const t=dict(),city=field("city")?.value.trim()||"";
  const queries={
   all:"parcel lockers courier pickup electronic retail stores",
   stores:"electronics and car accessories retail stores",
   lockers:"parcel lockers",
   pickup:"parcel pickup collection points",
   post:"post offices Israel Post",
   couriers:"courier drop off and delivery service points"
  };
  const query=queries[mode]+" "+city+" Israel";
  window.NeolineMap?.setViewMode(mode);
  window.NeolineMap?.setFallback(query);
  field("mapTitle").textContent=t.surface[mode];
  field("mapSub").textContent=t.mapHint;
  field("mapHint").textContent=t.mapHint;
  field("official").hidden=true;
  field("fullMap").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(query);
  if(field("networkNotice"))field("networkNotice").textContent=t.mapHint;
  closeSheet();
 }
 function reapplyAfterLocation(){
  window.dispatchEvent(new Event("neoline:city-changed"));
  // The old city form updates Google fallback query and the old heading.
  // Restore our selected filter label without replacing a brand selection.
  const t=dict();
  if(!selectedBrand&&!selectedShop){
   field("mapTitle").textContent=t.surface[selectedMode];
   field("mapSub").textContent=t.mapHint;
   field("mapHint").textContent=t.mapHint;
   field("official").hidden=true;
  }
  const query=(selectedMode==="stores"?"electronics retail":selectedMode==="lockers"?"parcel lockers":
   selectedMode==="post"?"post offices":selectedMode==="couriers"?"courier service":
   selectedMode==="pickup"?"parcel collection":"parcel pickup electronics retailers")+
   " "+(field("city").value.trim()||"")+" Israel";
  if(!selectedBrand&&!selectedShop){
   window.NeolineMap?.setFallback(query);
   field("fullMap").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(query);
  }
 }
 function translate(){
  const t=dict();
  field("locatorSearchText").textContent=t.search;
  field("locatorNetworksText").textContent=t.networks;
  field("locatorDetailsText").textContent=t.details;
  field("locatorDialogTitle").textContent=t.title;
  field("locatorDialogSubtitle").textContent=t.subtitle;
  field("locatorDialogClose").setAttribute("aria-label",t.close);
  field("locatorPaneCityHeading").textContent=t.cityHeading;
  field("locatorPaneCityHelp").textContent=t.cityHint;
  field("locatorPaneNetworkHeading").textContent=t.networkHeading;
  field("locatorPaneNetworkHelp").textContent=t.networkHint;
  field("locatorPaneStoresHeading").textContent=t.shopHeading;
  field("locatorPaneStoresHelp").textContent=t.shopHint;
  field("locatorPaneStatsHeading").textContent=t.statsHeading;
  for(const [i,key] of tabs.entries()){
   field("locatorTab"+key[0].toUpperCase()+key.slice(1)).textContent=
    [t.city,t.network,t.stores,t.stats][i];
  }
  for(const mode of modes){
   const chip=field("locatorModeFilters").querySelector('[data-map-mode="'+mode+'"]');
   if(chip)chip.textContent=t.modes[mode];
  }
  updateSummary();
  reapplyAfterLocation();
 }
 function relocateContent(){
  // Retain IDs and existing event listeners: moving DOM nodes does not
  // clone the source widgets or break their handlers.
  const nodes=[
   ["search","locatorCityHost"],["cityChoices","locatorCityHost"],
   [".layout > .side","locatorNetworksHost",true],
   ["retailPartners","locatorStoresHost"],
   ["networkInsights","locatorStatsHost"],
   ["officialDirectory","locatorStatsHost"]
  ];
  for(const [selector,host,isCSS] of nodes){
   const element=isCSS?document.querySelector(selector):field(selector);
   if(!element||!field(host))throw Error("Locator panel missing: "+selector);
   field(host).appendChild(element);
  }
  field("networkMore").open=true;
  field("cityChoices").open=true;
  field("retailPartners").open=true;
  field("networkInsights").open=true;
  field("officialDirectory").open=true;
 }
 function installControls(){
  if(field("locatorToolbar"))return;
  const main=document.querySelector("main.wrap"),hero=main?.querySelector(".hero");
  if(!main||!hero)return;
  const toolbar=document.createElement("section");
  toolbar.id="locatorToolbar";toolbar.className="locator-toolbar";toolbar.hidden=true;
  toolbar.setAttribute("aria-label","Фильтры карты");
  toolbar.innerHTML=`
  <div class="locator-action-row">
   <button id="locatorSearchButton" type="button" class="locator-loupe">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15.5 15.5 5.5 5.5"/></svg>
    <span id="locatorSearchText">Город, сеть, магазин</span>
   </button>
   <button id="locatorNetworksButton" type="button"><span id="locatorNetworksText">Сети</span>⌄</button>
   <button id="locatorDetailsButton" type="button"><span id="locatorDetailsText">Подробнее</span>⌄</button>
  </div>
  <div id="locatorModeFilters" class="locator-filter-strip" role="group" aria-label="Быстрые фильтры">
   <button type="button" data-map-mode="all" aria-pressed="true">Все</button>
   <button type="button" data-map-mode="stores" aria-pressed="false">Магазины</button>
   <button type="button" data-map-mode="lockers" aria-pressed="false">Постаматы</button>
   <button type="button" data-map-mode="pickup" aria-pressed="false">Пункты выдачи</button>
   <button type="button" data-map-mode="post" aria-pressed="false">Почта</button>
   <button type="button" data-map-mode="couriers" aria-pressed="false">Курьеры</button>
  </div>
  <div class="locator-summary" id="locatorSummary" aria-live="polite"></div>`;
  hero.after(toolbar);
  const dlg=document.createElement("dialog");
  dlg.id="locatorDialog";dlg.className="locator-dialog";
  dlg.setAttribute("aria-labelledby","locatorDialogTitle");
  dlg.innerHTML=`
  <header class="locator-dialog-head">
   <div><h2 id="locatorDialogTitle">Поиск и фильтры</h2>
   <p id="locatorDialogSubtitle">Города, сети, магазины и статистика</p></div>
   <button type="button" id="locatorDialogClose" class="locator-close" aria-label="Закрыть">×</button>
  </header>
  <nav class="locator-dialog-tabs" id="locatorDialogTabs" role="tablist" aria-label="Разделы справочника">
   <button type="button" id="locatorTabCity" data-locator-tab="city" role="tab" aria-selected="true" aria-controls="locatorPanelCity">Город</button>
   <button type="button" id="locatorTabNetwork" data-locator-tab="network" role="tab" aria-selected="false" aria-controls="locatorPanelNetwork">Сети</button>
   <button type="button" id="locatorTabStores" data-locator-tab="stores" role="tab" aria-selected="false" aria-controls="locatorPanelStores">Магазины</button>
   <button type="button" id="locatorTabStats" data-locator-tab="stats" role="tab" aria-selected="false" aria-controls="locatorPanelStats">Статистика</button>
  </nav>
  <div class="locator-dialog-content" id="locatorDialogContent">
   <section id="locatorPanelCity" class="locator-pane" role="tabpanel" aria-labelledby="locatorTabCity">
    <h3 class="locator-pane-heading" id="locatorPaneCityHeading">Поиск города или района</h3>
    <p class="locator-pane-help" id="locatorPaneCityHelp">Введите город или выберите из списка.</p>
    <div id="locatorCityHost"></div>
   </section>
   <section id="locatorPanelNetwork" class="locator-pane" role="tabpanel" aria-labelledby="locatorTabNetwork" hidden>
    <h3 class="locator-pane-heading" id="locatorPaneNetworkHeading">Выберите сеть доставки</h3>
    <p class="locator-pane-help" id="locatorPaneNetworkHelp">Только подтверждённые координаты.</p>
    <div id="locatorNetworksHost"></div>
   </section>
   <section id="locatorPanelStores" class="locator-pane" role="tabpanel" aria-labelledby="locatorTabStores" hidden>
    <h3 class="locator-pane-heading" id="locatorPaneStoresHeading">Магазины · возможные партнёры</h3>
    <p class="locator-pane-help" id="locatorPaneStoresHelp">Ассортимент NEOLINE не подтверждён.</p>
    <div id="locatorStoresHost"></div>
   </section>
   <section id="locatorPanelStats" class="locator-pane" role="tabpanel" aria-labelledby="locatorTabStats" hidden>
    <h3 class="locator-pane-heading" id="locatorPaneStatsHeading">Точки, контакты и официальные сайты</h3>
    <div id="locatorStatsHost"></div>
   </section>
  </div>`;
  main.after(dlg);
 }
 function init(){
  installControls();
  const toolbar=field("locatorToolbar"),dialog=field("locatorDialog");
  if(!toolbar||!dialog||!window.NeolineMap?.setViewMode)return;
  try{
   relocateContent();
   document.body.classList.add("locator-ui-active");
   toolbar.hidden=false;
   // Once the controls are safely in a sheet, show combined delivery and stores.
   showMode("all");
   translate();
  }catch(e){
   console.warn("Compact locator unavailable; original page remains usable.",e);
   return;
  }
  field("locatorSearchButton").addEventListener("click",()=>openSheet("city"));
  field("locatorNetworksButton").addEventListener("click",()=>openSheet("network"));
  field("locatorDetailsButton").addEventListener("click",()=>openSheet("stats"));
  field("locatorDialogClose").addEventListener("click",closeSheet);
  dialog.addEventListener("close",()=>{
   if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
  });
  dialog.addEventListener("click",e=>{
   // Click outside the content box dismisses the overlay.
   if(e.target===dialog)closeSheet();
  });
  field("locatorDialogTabs").addEventListener("click",e=>{
   const tab=e.target.closest("[data-locator-tab]");
   if(tab)setTab(tab.dataset.locatorTab);
  });
  field("locatorDialogTabs").addEventListener("keydown",e=>{
   if(!["ArrowRight","ArrowLeft"].includes(e.key))return;
   e.preventDefault();
   const current=tabs.indexOf(currentPanel),step=e.key==="ArrowRight"?1:-1;
   const next=tabs[(current+step+tabs.length)%tabs.length];
   setTab(next);
   field("locatorTab"+next[0].toUpperCase()+next.slice(1)).focus();
  });
  field("locatorModeFilters").addEventListener("click",e=>{
   const chip=e.target.closest("[data-map-mode]");
   if(chip)showMode(chip.dataset.mapMode);
  });
  // Existing inline handlers run before this document listener.
  document.addEventListener("click",e=>{
   const network=e.target.closest("[data-provider]");
   if(network){
    const name=network.querySelector("strong")?.textContent?.trim()||network.dataset.provider;
    highlight(null,network.dataset.provider==="all"?null:name,null);
    closeSheet();
   }
   const retailer=e.target.closest("[data-retailer]");
   if(retailer){
    const label=retailer.dataset.retailer==="all"?null:
      retailer.closest(".partner-card")?.querySelector("strong")?.textContent?.trim()||null;
    highlight("stores",null,label);
    closeSheet();
   }
   if(e.target.closest("[data-city]")){
    requestAnimationFrame(reapplyAfterLocation);closeSheet();
   }
  });
  field("search").addEventListener("submit",()=>{
   requestAnimationFrame(reapplyAfterLocation);closeSheet();
  });
  field("cityDirectory").addEventListener("change",()=>{
   requestAnimationFrame(reapplyAfterLocation);closeSheet();
  });
  window.addEventListener("neoline:delivery-language",translate);
  window.addEventListener("neoline:map-stats",e=>{
   const pickup=e.detail?.pickup,retail=e.detail?.retail;
   if(Array.isArray(pickup))counts.pickup=pickup.length;
   if(Array.isArray(retail))counts.retail=retail.length;
   updateSummary();
  });
  // Localized tabs are fully keyboard-navigable, and the map remains free
  // of scrolling panels until a user explicitly opens the sheet.
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();
