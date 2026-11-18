/* NEOLINE Delivery: published operator statistics, direct contacts,
   and a DISTINCT potential-retailer catalog. Counts with "on map" are only
   currently recorded OSM features; they are NOT official coverage totals.
   No stock relationship or partnership is asserted for any retailer. */
(function(){
 "use strict";
 const delivery=[
  {id:"boxit",name:"BOXIT",official:"https://boxit.co.il/",contacts:"https://boxit.co.il/"},
  {id:"done",name:"DONE",published:"380+",source:"https://done.co.il/maps-english/",official:"https://done.co.il/maps-english/",contacts:"https://done.co.il/"},
  {id:"doar",name:"Israel Post",phone:"171",tel:"tel:171",official:"https://doar.israelpost.co.il/he/locatebranch",contacts:"https://doar.israelpost.co.il/contactus/"},
  {id:"epost",name:"E-POST · HFD",published:"~1 000",source:"https://www.hfd.co.il/נקודות-איסוף/",phone:"03-9244441",tel:"tel:039244441",official:"https://www.hfd.co.il/en/pick-up-points/",contacts:"https://www.hfd.co.il/privacy-policy/"},
  {id:"pickup",name:"PickUP",official:"https://www.pickuppoint.co.il/?page_id=14",contacts:"https://www.pickuppoint.co.il/?page_id=10"},
  {id:"cheetah",name:"Cheetah Shops",published:"~1 300",source:"https://chitadelivery.co.il/en/branches/",phone:"055-957-7119",tel:"https://wa.me/972559577119",whatsapp:true,official:"https://chitadelivery.co.il/branches/",contacts:"https://chitadelivery.co.il/צרו-קשר-חדש/"},
  {id:"zigzag",name:"ZigZag BOX",phone:"052-685-5036",tel:"https://wa.me/972526855036",whatsapp:true,official:"https://zig-zag.co.il/help/stores",contacts:"https://zig-zag.co.il/contact"},
  {id:"shlager",name:"Shlager",official:"https://www.shlager.com/",contacts:"https://www.shlager.com/"},
  {id:"easypoint",name:"Easy Point",official:"https://easypoint.co.il/נקודות-חלוקה/",contacts:"https://easypoint.co.il/"},
  {id:"cargo",name:"Cargo",official:"https://dashboard.cargo.co.il/pickup-points-map",contacts:"https://cargo.co.il/"},
  {id:"dhl",name:"DHL Express",phone:"1-700-707-345",tel:"tel:1700707345",official:"https://fspa.dhl.com/locatorweb",contacts:"https://www.dhl.com/discover/en-il/contact"},
  {id:"fedex",name:"FedEx",phone:"1-700-700-339",tel:"tel:1700700339",official:"https://local.fedex.com/en-il",contacts:"https://www.fedex.com/en-il/customer-support.html"}
 ];
 const shops=[
  {id:"ksp",name:"KSP",count:"74",source:"https://ksp.co.il/mob/stores",official:"https://ksp.co.il/mob/stores",query:"KSP computer store"},
  {id:"ivory",name:"Ivory",count:"40",source:"https://www.ivory.co.il/content.php?id=1000",official:"https://www.ivory.co.il/stores.html",phone:"*8280",tel:"tel:*8280",query:"Ivory אייבורי store"},
  {id:"bug",name:"BUG",count:"~60",source:"https://www.bug.co.il/about-us/",official:"https://www.bug.co.il/branches/",query:"BUG באג חנות"},
  {id:"autodepot",name:"AutoDepot",count:"22",source:"https://www.ace.co.il/odotdepot",official:"https://www.ace.co.il/stores",phone:"079-3002400",tel:"tel:0793002400",query:"AUTODEPOT אוטודיפו"},
  {id:"ace",name:"ACE",official:"https://www.ace.co.il/stores",query:"ACE אייס סניפים"},
  {id:"payngo",name:"מחסני חשמל",count:"74",source:"https://www.payngo.co.il/branches",official:"https://www.payngo.co.il/branches",query:"מחסני חשמל"},
  {id:"shekem",name:"Shekem Electric",official:"https://www.shekem-electric.co.il/branches",query:"שקם אלקטריק"},
  {id:"alm",name:"ALM",count:"54",source:"https://www.alm.co.il/store-locator",official:"https://www.alm.co.il/store-locator",query:"א.ל.מ חנות חשמל"}
 ];
 const strings={
  ru:{stats:"Статистика сетей и телефоны",statsNote:"«На карте» — сколько координат есть в OpenStreetMap. «По данным сети» — заявленное оператором количество, не число наших точек.",retailTitle:"Крупные магазины Израиля",retailSubtitle:"8 торговых сетей · потенциальные партнёры",retailNotice:"Отдельный каталог магазинов, которым можно предложить продукцию NEOLINE. Партнёрство, ассортимент и наличие товаров НЕ подтверждены.",retailDisclaimer:"Карта показывает только магазины с открытыми координатами. Полный список филиалов — на официальном сайте каждой сети.",mapped:"На карте",reported:"По данным сети",unknown:"не опубликовано",phone:"Позвонить",whatsapp:"WhatsApp",contact:"Контакты",official:"Сайт / филиалы ↗",map:"На карту",retailMap:"Магазины",retailMapNote:"Возможные партнёры · фактические точки OSM, не продавцы NEOLINE",noNetwork:"Пунктов этой сети в OSM нет — смотрите официальный список",status:"Открытые координаты OSM · данные могут быть неполными"},
  en:{stats:"Networks: points and contacts",statsNote:"Mapped = OpenStreetMap coordinates. Operator figure = network's own published estimate, not the number we map.",retailTitle:"Major Israel retail stores",retailSubtitle:"8 retail chains · potential partners",retailNotice:"Separate catalog of retailers that could be approached about NEOLINE. No partnership, stock or availability is confirmed.",retailDisclaimer:"Only stores with public coordinates appear on the map. For all branches, use the retailer's official locator.",mapped:"Mapped",reported:"Operator says",unknown:"not published",phone:"Call",whatsapp:"WhatsApp",contact:"Contacts",official:"Branches ↗",map:"Show on map",retailMap:"Retail stores",retailMapNote:"Prospective partners · real OSM points, not confirmed NEOLINE stockists",noNetwork:"No OSM points are available for this operator. Use its official locator.",status:"OpenStreetMap coordinates · coverage may be incomplete"},
  he:{stats:"רשתות: נקודות וקשר",statsNote:"במפה = נקודות עם קואורדינטות ב-OSM. לפי הרשת = מספר שפרסם המפעיל, לא הכיסוי במפה.",retailTitle:"רשתות קמעונאיות בישראל",retailSubtitle:"8 רשתות · שותפות פוטנציאלית",retailNotice:"מדריך נפרד לרשתות שאפשר להציע להן את NEOLINE. אין אישור לשותפות, למלאי או למכירת המוצרים.",retailDisclaimer:"במפה מופיעות רק חנויות עם מיקום פומבי. לכל הסניפים יש לעיין באתר הרשמי.",mapped:"במפה",reported:"לפי הרשת",unknown:"לא פורסם",phone:"התקשרו",whatsapp:"WhatsApp",contact:"יצירת קשר",official:"אתר וסניפים ↗",map:"הצג במפה",retailMap:"חנויות",retailMapNote:"שותפים פוטנציאליים · נקודות OSM אמיתיות, לא משווקים מאושרים",noNetwork:"אין נקודות OSM לרשת זו. בדקו את אתר המפעיל.",status:"מיקומים מ-OpenStreetMap · הכיסוי עשוי להיות חלקי"},
  ar:{stats:"الشبكات: المواقع والاتصال",statsNote:"في الخريطة = مواقع بإحداثيات OSM. رقم الشبكة = تقدير منشور من المشغل، وليس عدد النقاط المعروضة.",retailTitle:"سلاسل المتاجر الكبرى في إسرائيل",retailSubtitle:"8 سلاسل · شركاء محتملون",retailNotice:"دليل منفصل لمتاجر يمكن عرض منتجات NEOLINE عليها. لا توجد شراكة أو مخزونات أو مبيعات مؤكدة.",retailDisclaimer:"تظهر المتاجر ذات الإحداثيات العامة فقط. تحقق من القائمة الرسمية للفروع.",mapped:"على الخريطة",reported:"حسب الشبكة",unknown:"غير منشور",phone:"اتصال",whatsapp:"WhatsApp",contact:"التواصل",official:"الموقع والفروع ↗",map:"عرض على الخريطة",retailMap:"المتاجر",retailMapNote:"شركاء محتملون · نقاط حقيقية من OSM، ليسوا بائعين معتمدين",noNetwork:"لا توجد نقاط لهذه الشبكة في OSM. تحقق من الموقع الرسمي.",status:"إحداثيات OpenStreetMap · التغطية قد تكون غير مكتملة"}
 };
 const byId=id=>document.getElementById(id);
 const lang=()=>strings[document.documentElement.lang]||strings.ru;
 const pickupCounts={},shopCounts={};
 let currentShop=null;
 function make(tag,cls,value){
  const el=document.createElement(tag);if(cls)el.className=cls;
  if(value!==undefined)el.textContent=value;
  return el;
 }
 function link(href,label,extra=""){
  const a=make("a",extra,label);a.href=href;
  if(!href.startsWith("tel:")){a.target="_blank";a.rel="noopener noreferrer"}
  return a;
 }
 function infoValue(name,value){
  const chip=make("span");
  chip.append(make("span",null,name+" "),make("b",null,value));
  return chip;
 }
 function createCard(item,shop){
  const t=lang(),container=make("article","partner-card"),name=make("strong",null,item.name);
  container.appendChild(name);
  const info=make("div","partner-card-stats");
  const count=(shop?shopCounts:pickupCounts)[item.id]??null;
  info.append(
   infoValue(t.mapped,count===null?"—":String(count)),
   infoValue(t.reported,item[shop?"count":"published"]||t.unknown)
  );
  container.appendChild(info);
  const actions=make("div","partner-actions");
  if(shop){
   const mapButton=make("button","shop-map-action",t.map);
   mapButton.type="button";mapButton.dataset.retailer=item.id;
   mapButton.setAttribute("aria-label",t.map+": "+item.name);
   actions.append(mapButton);
  }
  if(item.phone&&item.tel)actions.append(link(item.tel,
   (item.whatsapp?t.whatsapp:t.phone)+" "+item.phone,"phone-action"));
  else actions.append(link(item.contacts||item.official,t.contact));
  actions.append(link(item.official,t.official));
  container.append(actions);
  if(item.source){
   const src=link(item.source,t.reported+": "+item[shop?"count":"published"]);
   src.className="partner-source";src.title=item.source;
   container.append(src);
  }
  return container;
 }
 function render(){
  const t=lang();
  byId("networkInsightsTitle").textContent="📊 "+t.stats;
  byId("networkInsightsHint").textContent=t.statsNote;
  byId("retailTitle").textContent=t.retailTitle;
  byId("retailSubtitle").textContent=t.retailSubtitle;
  byId("retailNotice").textContent=t.retailNotice;
  byId("retailDisclaimer").textContent=t.retailDisclaimer;
  const stats=byId("networkInsightsGrid"),retail=byId("retailCards");
  stats.replaceChildren(...delivery.map(item=>createCard(item,false)));
  retail.replaceChildren(...shops.map(item=>createCard(item,true)));
  if(currentShop)document.querySelectorAll("[data-retailer]").forEach(el=>el.classList.toggle("is-active",el.dataset.retailer===currentShop));
 }
 function applyCounts(kind,list){
  const target=kind==="retail"?shopCounts:pickupCounts;
  if(!Array.isArray(list))return;
  Object.keys(target).forEach(k=>delete target[k]);
  for(const point of list)if(typeof point.id==="string"){
   target[point.id]=(target[point.id]||0)+1;
  }
  render();
 }
 function renderRetailMap(id,scroll){
  const item=shops.find(x=>x.id===id);if(!item)return;
  const t=lang();
  currentShop=id;
  const city=byId("city").value.trim();
  const q=item.query+" "+city+" Israel";
  byId("mapTitle").textContent=item.name+" · "+t.retailMap;
  byId("mapSub").textContent=t.retailMapNote;
  byId("mapHint").textContent=t.retailDisclaimer;
  byId("networkNotice").textContent=t.retailNotice;
  byId("official").hidden=false;
  byId("official").href=item.official;
  byId("official").textContent=t.official;
  byId("fullMap").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);
  document.querySelectorAll("[data-retailer]").forEach(button=>{
   button.classList.toggle("is-active",button.dataset.retailer===id);
  });
  if(window.NeolineMap){
   window.NeolineMap.setFallback(q);
   window.NeolineMap.setRetailer(id);
  }
  if(scroll){
   const panel=document.querySelector(".map-panel"),reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
   requestAnimationFrame(()=>panel?.scrollIntoView({behavior:reduce?"instant":"smooth",block:"start"}));
  }
 }
 function exitRetail(){
  currentShop=null;
  document.querySelectorAll("[data-retailer]").forEach(el=>el.classList.remove("is-active"));
 }
 document.addEventListener("click",e=>{
  const button=e.target.closest("[data-retailer]");
  if(button)renderRetailMap(button.dataset.retailer,true);
  const p=e.target.closest("[data-delivery-provider]");
  if(p){
   const control=document.querySelector('[data-provider="'+p.dataset.deliveryProvider+'"]');
   control?.click();
  }
 });
 window.addEventListener("neoline:delivery-provider",exitRetail);
 window.addEventListener("neoline:delivery-language",()=>{
  render();
  if(currentShop)renderRetailMap(currentShop,false);
 });
 window.addEventListener("neoline:map-stats",e=>{
  if(Array.isArray(e.detail?.pickup))applyCounts("delivery",e.detail.pickup);
  if(e.detail?.retailLoaded&&Array.isArray(e.detail.retail))applyCounts("retail",e.detail.retail);
 });
 // For a fresh visit, source counts from the already published snapshot without
 // requiring live OSM API requests, which was responsible for blank maps.
 async function hydrateCounts(url,kind){
  try{
   const response=await fetch(url+"?v="+Math.floor(Date.now()/86400000),{cache:"no-store"});
   if(!response.ok)return;
   const data=await response.json();
   if(data.version===1&&Array.isArray(data.points))applyCounts(kind,data.points);
  }catch(e){console.warn("Map statistics:",e.message)}
 }
 render();
 hydrateCounts("./assets/pickup/points.json","delivery");
 hydrateCounts("./assets/retail/points.json","retail");
})();
