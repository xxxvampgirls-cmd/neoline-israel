/* Dedicated hot-road-events view. Official police updates must be fresh;
   news entries represent published stories, not verified current closures. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
if(!$("trafficPanel")&&!$("trafficStatus"))return;
const URLS={
 traffic:"https://raw.githubusercontent.com/xxxvampgirls-cmd/neoline-israel/traffic-live/assets/traffic/live.json",
 news:"https://raw.githubusercontent.com/xxxvampgirls-cmd/neoline-israel/main/assets/news/news.json"
};
const labels={
 ru:{back:"← Новости",theory:"🎮 Теория",eyebrow:"NEOLINE · ДОРОГИ ИЗРАИЛЯ",heading:"Горячие события на дорогах Израиля",
 intro:"Срочные сообщения полиции, происшествия из проверяемых источников и карта Waze. Перепроверяйте ограничения перед поездкой.",
 police:"Сообщения дорожной полиции",loading:"Проверяем официальный канал…",empty:"За последние три часа новых сообщений полиции не обнаружено. Это не означает, что дороги свободны.",stale:"Сообщения полиции давно не обновлялись — проверяйте источник.",unavailable:"Источник временно недоступен. Проверяйте официальный канал.",count:n=>"Свежих сообщений полиции: "+n,refresh:"Проверить сообщения",sources:"Сообщения могут устареть — перед поездкой проверьте актуальность.",policeLink:"Дорожная полиция ↗",road6:"Шоссе № 6 ↗",details:"Открыть сообщение полиции ↗",
 types:{closure:"Перекрытие движения",reopened:"Движение восстановлено",congestion:"Пробки",planned:"Плановые ограничения",update:"Дорожная информация"},road:"дорога № ",waze:"Живая карта Waze",wazeSub:"Пробки и перекрытия · нажмите, чтобы развернуть",wazeNotice:"Карта и данные предоставлены Waze. Полнота информации зависит от Waze.",wazeOpen:"Открыть Waze ↗",wazeLoading:"Карта загружается при открытии…",areas:["Весь Израиль","Центр","Север","Юг"],
 newsTitle:"ДТП и дорожные происшествия · последние 72 часа",newsNote:"Датированные сообщения из новостной ленты; это не полный перечень аварий и не подтверждение текущих ограничений.",all:"Все новости ↗",newsWait:"Загружаем актуальные публикации…",newsNone:"За последние 72 часа подходящих публикаций в архиве не найдено.",newsFail:"Публикации временно недоступны.",read:"Перейти к источнику ↗",footer:"Данные могут запаздывать и изменяться. Дорожные ограничения всегда проверяйте непосредственно в первоисточниках.",home:"Главная",catalog:"Каталог",news:"Новости",delivery:"Доставка",cart:"Корзина"},
 en:{back:"← News",theory:"🎮 Theory",eyebrow:"NEOLINE · ISRAEL ROADS",heading:"Breaking road events in Israel",
 intro:"Police road updates, recent incident stories and the Waze map. Confirm restrictions before travelling.",
 police:"Traffic police bulletins",loading:"Checking the official police channel…",empty:"No new police bulletins in the last three hours. This does not mean roads are clear.",stale:"Police feed is stale. Check the official channel.",unavailable:"Source unavailable. Check the official channel directly.",count:n=>"Recent police bulletins: "+n,refresh:"Refresh bulletins",sources:"Reports may be outdated. Verify restrictions with the source before travelling.",policeLink:"Traffic police ↗",road6:"Route 6 ↗",details:"Open police bulletin ↗",
 types:{closure:"Road closure",reopened:"Road reopened",congestion:"Traffic congestion",planned:"Planned restriction",update:"Traffic bulletin"},road:"Road ",waze:"Waze Live Map",wazeSub:"Traffic and closures · expand to view",wazeNotice:"Map and traffic data come from Waze, whose coverage may vary.",wazeOpen:"Open Waze ↗",wazeLoading:"Map loads when expanded…",areas:["All Israel","Central","North","South"],
 newsTitle:"Recent incidents and roads · 72 hours",newsNote:"Dated articles from the news feed, not a complete crash register or confirmation of active closures.",all:"All news ↗",newsWait:"Loading recent reports…",newsNone:"No matching articles in the last 72 hours.",newsFail:"Recent reports unavailable.",read:"Open source ↗",footer:"Information may be delayed. Confirm road restrictions with the official sources.",home:"Home",catalog:"Catalog",news:"News",delivery:"Delivery",cart:"Cart"},
 he:{back:"← חדשות",theory:"🎮 תיאוריה",eyebrow:"NEOLINE · כבישי ישראל",heading:"אירועים חמים בכבישי ישראל",
 intro:"הודעות משטרה, אירועים אחרונים ומפת Waze. בדקו מגבלות במקור לפני נסיעה.",
 police:"הודעות אגף התנועה",loading:"בודקים הודעות רשמיות…",empty:"לא נמצאו הודעות חדשות בשלוש השעות האחרונות. זה לא אומר שהכבישים פנויים.",stale:"הנתונים אינם עדכניים. בדקו במקור הרשמי.",unavailable:"המקור אינו זמין כרגע. בדקו בערוץ הרשמי.",count:n=>"הודעות אחרונות: "+n,refresh:"רענון",sources:"המידע עשוי להתיישן. בדקו את מצב הכבישים במקור.",policeLink:"אגף התנועה ↗",road6:"כביש 6 ↗",details:"למקור המשטרתי ↗",
 types:{closure:"חסימת כביש",reopened:"כביש נפתח",congestion:"עומסי תנועה",planned:"הגבלות מתוכננות",update:"עדכון תנועה"},road:"כביש ",waze:"מפת Waze החיה",wazeSub:"עומסים וחסימות · לפתיחת המפה",wazeNotice:"המפה ונתוני התנועה מסופקים על ידי Waze.",wazeOpen:"פתיחה ב-Waze ↗",wazeLoading:"המפה תיטען רק בפתיחה…",areas:["כל ישראל","מרכז","צפון","דרום"],
 newsTitle:"תאונות ודיווחים מהכבישים · 72 שעות",newsNote:"ידיעות מתוארכות ממקורות חדשות, לא רישום מלא של תאונות או הוכחה לחסימה פעילה.",all:"כל החדשות ↗",newsWait:"טוענים דיווחים…",newsNone:"לא נמצאו ידיעות מתאימות ב-72 השעות האחרונות.",newsFail:"החדשות אינן זמינות כעת.",read:"למקור ↗",footer:"מידע עשוי להשתנות. ודאו הגבלות תנועה במקורות הרשמיים.",home:"בית",catalog:"קטלוג",news:"חדשות",delivery:"משלוחים",cart:"סל"},
 ar:{back:"← الأخبار",theory:"🎮 النظري",eyebrow:"NEOLINE · طرق إسرائيل",heading:"أحداث الطرق العاجلة في إسرائيل",
 intro:"بلاغات الشرطة وأخبار الحوادث وخريطة Waze. تحقق من القيود قبل السفر.",
 police:"بلاغات شرطة المرور",loading:"نتحقق من القناة الرسمية…",empty:"لا توجد بلاغات جديدة خلال ثلاث ساعات. لا يعني ذلك أن الطرق خالية.",stale:"بيانات الشرطة قديمة. تحقق من المصدر.",unavailable:"المصدر غير متاح. تحقق من القناة الرسمية.",count:n=>"بلاغات حديثة: "+n,refresh:"تحديث",sources:"قد تصبح البلاغات قديمة. تحقق قبل القيادة.",policeLink:"شرطة المرور ↗",road6:"الطريق 6 ↗",details:"فتح بلاغ الشرطة ↗",
 types:{closure:"إغلاق طريق",reopened:"فتح الطريق",congestion:"ازدحام",planned:"قيود مجدولة",update:"بلاغ مروري"},road:"الطريق ",waze:"خريطة Waze المباشرة",wazeSub:"الازدحام والإغلاق · انقر لعرض الخريطة",wazeNotice:"البيانات والخريطة من Waze وقد لا تشمل جميع الأحداث.",wazeOpen:"افتح Waze ↗",wazeLoading:"تحميل الخريطة عند فتحها…",areas:["كل إسرائيل","الوسط","الشمال","الجنوب"],
 newsTitle:"حوادث وأخبار الطرق · 72 ساعة",newsNote:"منشورات إخبارية مؤرخة، وليست سجلاً كاملاً للحوادث أو تأكيداً للإغلاقات الحالية.",all:"كل الأخبار ↗",newsWait:"تحميل الأخبار…",newsNone:"لم يتم العثور على أخبار خلال 72 ساعة.",newsFail:"الأخبار غير متاحة.",read:"فتح المصدر ↗",footer:"قد تتأخر المعلومات أو تتغير. تحقق من المصادر الرسمية.",home:"الرئيسية",catalog:"الكتالوج",news:"الأخبار",delivery:"التوصيل",cart:"السلة"}
};
const areas={israel:[31.53,34.91,7],center:[32.06,34.85,10],north:[32.84,35.15,9],south:[30.77,34.77,8]};
const locale={ru:"ru-RU",he:"he-IL",en:"en-GB",ar:"ar"};
let language="ru",bulletins=[],policeState="pending",newsData=[],newsOk=false,newsError=false,lastPolice=0,lastNews=0,area="israel",loadingPolice=false,loadingNews=false;
try{const saved=localStorage.getItem("neoline-language");if(labels[saved])language=saved}catch(e){}
const tr=()=>labels[language];
function stamp(value){
 const d=new Date(value);
 return Number.isFinite(+d)?new Intl.DateTimeFormat(locale[language],{timeZone:"Asia/Jerusalem",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(d):"";
}
function link(href,label){
 const a=document.createElement("a");a.href=href;a.target="_blank";a.rel="noopener noreferrer nofollow";a.textContent=label;return a;
}
function setCopy(){
 const t=tr();document.documentElement.lang=language;document.documentElement.dir=["he","ar"].includes(language)?"rtl":"ltr";
 const names={hotBackLink:"back",hotTheoryLink:"theory",hotEyebrow:"eyebrow",hotHeading:"heading",hotIntro:"intro",
 trafficTitle:"police",trafficDisclaimer:"sources",trafficSourceLink:"policeLink",trafficRoad6Link:"road6",
 trafficWazeTitle:"waze",trafficWazeSubtitle:"wazeSub",trafficWazeNotice:"wazeNotice",trafficWazeOpen:"wazeOpen",
 hotArticlesTitle:"newsTitle",hotArticlesNote:"newsNote",hotAllNews:"all",hotFootnote:"footer",
 newsHome:"home",newsCatalog:"catalog",newsNews:"news",newsDelivery:"delivery"};
 for(const [id,key] of Object.entries(names)){
  const el=$(id);if(!el)continue;
  if(el.matches(".news-bottom a"))el.querySelector("span").textContent=t[key];
  else el.textContent=t[key];
 }
 const game=$("newsGame")?.querySelector("span");if(game)game.textContent=({ru:"Игра",he:"משחק",en:"Game",ar:"لعبة"})[language];
 $("trafficRefresh").title=t.refresh;$("trafficRefresh").setAttribute("aria-label",t.refresh);
 document.querySelectorAll("[data-hot-lang]").forEach(btn=>{
  const on=btn.dataset.hotLang===language;btn.classList.toggle("active",on);btn.setAttribute("aria-pressed",String(on));
 });
 if($("trafficWazeLoading"))$("trafficWazeLoading").textContent=t.wazeLoading;
 document.querySelectorAll("[data-waze-area]").forEach((btn,i)=>{
  btn.textContent=t.areas[i];const on=btn.dataset.wazeArea===area;
  btn.classList.toggle("active",on);btn.setAttribute("aria-pressed",String(on));
 });
 renderPolice();renderNews();
}
function renderPolice(){
 const t=tr(),host=$("trafficList");
 const msg=policeState==="loading"?t.loading:policeState==="ok"?
  (bulletins.length?t.count(bulletins.length):t.empty):policeState==="stale"?t.stale:t.unavailable;
 $("trafficStatus").textContent=msg;
 host.replaceChildren();
 host.hidden=bulletins.length===0;
 for(const e of bulletins){
  const box=document.createElement("details");box.className="traffic-report";
  const sum=document.createElement("summary");
  const type=document.createElement("span");type.className="traffic-report-type";
  type.textContent="🔥 "+(t.types[e.kind]||t.types.update);
  const title=document.createElement("span");title.className="traffic-report-title";
  const roads=Array.isArray(e.roads)?e.roads.filter(r=>/^\d{1,3}$/.test(String(r))).slice(0,4):[];
  title.textContent=(t.types[e.kind]||t.types.update)+(roads.length?" · "+t.road+roads.join(", "):"");
  const when=document.createElement("time");when.className="traffic-report-age";when.dateTime=e.publishedAt;when.textContent=stamp(e.publishedAt);
  sum.append(type,title,when);
  const body=document.createElement("div");body.className="traffic-report-body";
  const original=document.createElement("p");original.textContent=e.original;original.lang="he";original.dir="rtl";
  body.append(original,link(e.url,t.details));box.append(sum,body);host.append(box);
 }
}
async function loadPolice(){
 if(loadingPolice)return;
 loadingPolice=true;policeState="loading";renderPolice();$("trafficRefresh").disabled=true;
 try{
  const key=Math.floor(Date.now()/600000);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8500);
  let res;
  try{res=await fetch(URLS.traffic+"?v="+key,{cache:"no-store",signal:controller.signal})}
  finally{clearTimeout(timer)}
  if(!res.ok)throw Error("HTTP "+res.status);
  const obj=await res.json();
  if(obj.version!==1||!Array.isArray(obj.events)||!["ok","pending","unavailable"].includes(obj.sourceStatus))throw Error("invalid data");
  const now=Date.now(),age=now-Date.parse(obj.checkedAt);
  policeState=(!Number.isFinite(age)||age>40*60000||age<-(5*60000))?"stale":
   (obj.sourceStatus==="ok"?"ok":"unavailable");
  bulletins=policeState==="ok"?obj.events.filter(e=>
   /^https:\/\/t\.me\/Atanpolice\/\d+$/.test(e.url||"")&&
   /^Atanpolice\/\d+$/.test(e.id||"")&&
   ["closure","reopened","congestion","planned","update"].includes(e.kind)&&
   typeof e.original==="string"&&e.original.length<=520&&
   Number.isFinite(Date.parse(e.publishedAt))&&now-Date.parse(e.publishedAt)>=-300000&&
   now-Date.parse(e.publishedAt)<3*3600000).slice(0,30):[];
 }catch(e){policeState="unavailable";bulletins=[];console.warn("Police feed:",e.message)}
 finally{lastPolice=Date.now();loadingPolice=false;$("trafficRefresh").disabled=false;renderPolice()}
}
function getText(item){
 const x=item.translations?.[language]||item.translations?.ru||item.translations?.[item.sourceLanguage]||{};
 return x.title||item.title||item.titleOriginal||"";
}
function renderNews(){
 const t=tr(),host=$("hotArticlesGrid");host.replaceChildren();
 if(!newsOk){$("hotArticlesStatus").hidden=false;$("hotArticlesStatus").textContent=newsError?t.newsFail:t.newsWait;return}
 const now=Date.now();
 const articles=newsData.filter(e=>e&&["accidents","roads","speed"].includes(e.category)&&
  Number.isFinite(Date.parse(e.date))&&now-Date.parse(e.date)>=-3600000&&
  now-Date.parse(e.date)<=72*3600000&&
  /^https:\/\//.test(e.url||"")).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,40);
 $("hotArticlesStatus").hidden=articles.length>0;
 if(!articles.length)$("hotArticlesStatus").textContent=t.newsNone;
 for(const item of articles){
  const box=document.createElement("article");box.className="hot-report";
  const category=document.createElement("span");category.className="hot-report-tag";
  category.textContent=item.category==="accidents"?(language==="ru"?"ДТП":"Crash"):item.category==="roads"?(language==="ru"?"Дороги":"Roads"):"Speed";
  const title=document.createElement("strong");title.className="hot-report-title";title.textContent=getText(item);
  const meta=document.createElement("span");meta.className="hot-report-meta";meta.textContent=stamp(item.date)+" · "+(item.publisher||"");
  box.append(category,title,meta,link(item.url,t.read));box.lastChild.className="hot-report-link";
  host.append(box);
 }
}
async function loadNews(){
 if(loadingNews)return;
 loadingNews=true;
 const v=Math.floor(Date.now()/600000);
 const endpoints=["./assets/news/news.json?v="+v,URLS.news+"?v="+v];
 let best=null,bestAt=0;
 await Promise.all(endpoints.map(async url=>{
  try{
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8500);
   let res;
   try{res=await fetch(url,{cache:"no-store",signal:controller.signal})}
   finally{clearTimeout(timer)}
   if(!res.ok)return;
   const d=await res.json();const at=Date.parse(d.updated);
   if(d.version===1&&Array.isArray(d.items)&&Number.isFinite(at)&&at>bestAt&&at<Date.now()+12*3600000){best=d;bestAt=at}
  }catch(e){console.warn("Recent news:",e.message)}
 }));
 if(best){newsData=best.items;newsOk=true;newsError=false}
 else {newsData=[];newsOk=false;newsError=true}
 lastNews=Date.now();loadingNews=false;renderNews();
}
function renderWaze(){
 const frame=$("trafficWazeFrame");frame.replaceChildren();
 if(!$("trafficWaze").open){
  const s=document.createElement("div");s.id="trafficWazeLoading";s.className="traffic-waze-loading";s.textContent=tr().wazeLoading;frame.append(s);return;
 }
 const [lat,lon,zoom]=areas[area];
 const iframe=document.createElement("iframe");iframe.title=tr().waze;iframe.loading="lazy";
 iframe.referrerPolicy="strict-origin-when-cross-origin";
 iframe.src="https://embed.waze.com/"+(labels[language]?language:"en")+"/iframe?zoom="+zoom+"&lat="+lat+"&lon="+lon;
 iframe.setAttribute("allowfullscreen","");frame.append(iframe);
}
document.querySelectorAll("[data-hot-lang]").forEach(b=>b.addEventListener("click",()=>{
 language=b.dataset.hotLang;try{localStorage.setItem("neoline-language",language)}catch(e){}
 setCopy();if($("trafficWaze").open)renderWaze();
}));
$("trafficRefresh").addEventListener("click",loadPolice);
$("trafficWaze").addEventListener("toggle",renderWaze);
$("trafficWazeAreas").addEventListener("click",e=>{
 const b=e.target.closest("[data-waze-area]");if(!b||!areas[b.dataset.wazeArea])return;
 area=b.dataset.wazeArea;setCopy();renderWaze();
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden)return;
 if(Date.now()-lastPolice>10*60000)loadPolice();
 if(Date.now()-lastNews>30*60000)loadNews();
});
setInterval(()=>{if(!document.hidden){
 if(Date.now()-lastPolice>10*60000)loadPolice();
 if(Date.now()-lastNews>30*60000)loadNews();
}},60000);
setCopy();loadPolice();loadNews();
})();
