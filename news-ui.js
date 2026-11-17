/* Rolling 30-day automotive news – never show expired articles, even if the
   scheduled sync is delayed or the visitor keeps an old browser cache. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const PAGE_SIZE=8;
const state={items:[],category:"all",query:"",lang:"ru",visible:PAGE_SIZE,rendered:0};
let lastExpiryCheck=Date.now();
try{const saved=localStorage.getItem("neoline-language");if(["ru","he","en","ar"].includes(saved))state.lang=saved}catch(e){}
const i18n={
ru:{eyebrow:"NEOLINE · ИЗРАИЛЬ · АВТОНОВОСТИ",heading:"Что происходит <em>на дорогах Израиля</em>",intro:"Аварии, камеры контроля скорости, новые правила, дороги и автомобили. Коротко о главном — с датой публикации и ссылкой на первоисточник.",period:"Только последние 30 дней",search:"Найти новость…",all:"Все",accidents:"ДТП",speed:"Скорость",laws:"Правила и законы",roads:"Дороги",cars:"Автомобили",updated:"Обновлено",empty:"За последние 30 дней пока нет проверенных материалов в этой категории. Попробуйте другую тему.",noFeed:"Сейчас нет доступных новостей за последние 30 дней. Как только появятся новые проверенные публикации, они автоматически отобразятся здесь.",read:"Читать источник",expand:"Развернуть новость",collapse:"Свернуть",original:"Заголовок первоисточника",allPeriod:"Новости за 30 дней · законы за 6 месяцев",lawsPeriod:"Правила и законы · последние 6 месяцев",image:"Иллюстрация",home:"Главная",catalog:"Каталог",news:"Новости",fav:"Избранное",cart:"Корзина",back:"← Каталог",warning:"Это информационная сводка, а не подтверждение вступления закона в силу.",legal:"Короткие справки, дата и ссылка на первоисточник. Обложки — нейросетевые изображения либо фотографии по свободной лицензии с указанием автора; они не являются снимками описанных происшествий. Статус правил дорожного движения сверяйте с официальными публикациями Министерства транспорта Израиля."},
en:{eyebrow:"NEOLINE · ISRAEL · AUTO NEWS",heading:"What's happening <em>on Israel's roads</em>",intro:"Traffic accidents, speed cameras, rules, roads and new cars. Short updates with original sources.",period:"Last 30 days only",search:"Search news…",all:"All",accidents:"Crashes",speed:"Speed",laws:"Rules and laws",roads:"Roads",cars:"Cars",updated:"Updated",empty:"No verified reports in this category during the last 30 days.",noFeed:"No recent verified reports yet. New items will appear here after the next update.",read:"Read source",expand:"Expand story",collapse:"Collapse",original:"Original headline",allPeriod:"News 30 days · laws 6 months",lawsPeriod:"Rules and laws · last 6 months",image:"Illustration",home:"Home",catalog:"Catalog",news:"News",fav:"Favorites",cart:"Cart",back:"← Catalog",warning:"An article does not confirm a rule has entered into force.",legal:"Short source-linked reports. Covers are AI-created images or attributed openly licensed photographs, not pictures of the reported incidents. Check official Ministry of Transport publications for current legal rules."},
he:{eyebrow:"NEOLINE · ישראל · חדשות רכב",heading:"מה חדש <em>בכבישי ישראל</em>",intro:"תאונות, מצלמות מהירות, חוקים, כבישים ורכב. עדכונים קצרים עם קישורים למקורות.",period:"רק ב־30 הימים האחרונים",search:"חיפוש בחדשות…",all:"הכול",accidents:"תאונות",speed:"מהירות",laws:"חוקים",roads:"כבישים",cars:"רכב",updated:"עודכן",empty:"אין כתבות מאומתות בקטגוריה זו בחודש האחרון.",noFeed:"אין כרגע כתבות מעודכנות ומאומתות. פרסומים חדשים יופיעו לאחר עדכון.",read:"למקור",expand:"הרחבת הידיעה",collapse:"סגירה",original:"הכותרת המקורית",allPeriod:"חדשות 30 יום · חוקים 6 חודשים",lawsPeriod:"חוקים ותקנות · שישה חודשים",image:"איור",home:"ראשי",catalog:"קטלוג",news:"חדשות",fav:"מועדפים",cart:"סל",back:"← קטלוג",warning:"פרסום על הצעה אינו אישור שהחוק נכנס לתוקף.",legal:"תקצירים קצרים וקישורים למקור. תמונות השער נוצרו ב-AI או פורסמו ברישיון חופשי עם קרדיט; הן אינן תיעוד של האירועים. יש לבדוק תקנות עדכניות במשרד התחבורה."},
ar:{eyebrow:"NEOLINE · إسرائيل · أخبار السيارات",heading:"ما الجديد <em>على طرق إسرائيل</em>",intro:"حوادث وكاميرات السرعة والأنظمة والطرق والسيارات. تحديثات قصيرة مع روابط المصادر.",period:"آخر 30 يومًا فقط",search:"البحث في الأخبار…",all:"الكل",accidents:"حوادث",speed:"السرعة",laws:"القوانين",roads:"الطرق",cars:"السيارات",updated:"آخر تحديث",empty:"لا توجد أخبار موثقة في هذه الفئة خلال آخر 30 يومًا.",noFeed:"لا توجد أخبار حديثة موثقة حاليًا. ستظهر المنشورات الجديدة بعد التحديث.",read:"اقرأ المصدر",expand:"توسيع الخبر",collapse:"طي الخبر",original:"العنوان الأصلي",allPeriod:"أخبار 30 يومًا · قوانين 6 أشهر",lawsPeriod:"الأنظمة والقوانين · آخر 6 أشهر",image:"رسم توضيحي",home:"الرئيسية",catalog:"الكتالوج",news:"الأخبار",fav:"المفضلة",cart:"السلة",back:"← الكتالوج",warning:"وجود خبر عن مقترح لا يعني دخوله حيز التنفيذ.",legal:"ملخصات قصيرة وروابط للمصادر. الصور مولدة بالذكاء الاصطناعي أو مرخصة مع الإسناد، وليست صورًا للحوادث المذكورة. تحقق من القواعد السارية لدى وزارة النقل."}
};
const tr=k=>(i18n[state.lang]||i18n.ru)[k]||k;
const safe=str=>String(str??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeURL=url=>{try{const x=new URL(url);return x.protocol==="https:"&&!/(^|\.)google\./.test(x.hostname)?x.href:""}catch(e){return ""}};
const newsPicture=item=>typeof item.image==="string"&&/^\.\/assets\/news\/images\/[a-f0-9]{20}\.(?:svg|webp|jpe?g|png)$/.test(item.image)?item.image:"";
function localStory(item){
 const t=item.translations||{}, row=t[state.lang]||{};
 return {
  title:typeof row.title==="string"&&row.title.trim()?row.title:(state.lang==="he"&&item.sourceLanguage==="he"?item.titleOriginal:(state.lang==="ru"?item.title:item.titleOriginal)),
  summary:typeof row.summary==="string"&&row.summary.trim()?row.summary:(
   state.lang==="ru"?item.summary:(i18n[state.lang][item.category==="cars"?"cars":"read"]+" · "+i18n[state.lang].read))
 };
}
const artPaths={
accidents:'<path d="M70 98 102 62l29 27 23-32 25 34" fill="none" stroke="#215b88" stroke-width="6" stroke-linejoin="round"/><path d="m153 57 8-9m-30 10-5-11" stroke="#0b8cd1" stroke-width="5" stroke-linecap="round"/><path d="M51 110h140" stroke="#287cb3" stroke-width="4" stroke-linecap="round"/><path d="m173 25 23 43h-46z" fill="#fff" stroke="#067cc4" stroke-width="4"/><path d="M173 39v13" stroke="#067cc4" stroke-width="4" stroke-linecap="round"/><circle cx="173" cy="60" r="2" fill="#067cc4"/>',
speed:'<rect x="78" y="25" width="88" height="88" rx="18" fill="#fff" stroke="#3d8dbe" stroke-width="4"/><circle cx="122" cy="68" r="28" fill="#dcf3ff" stroke="#1281bb" stroke-width="3"/><path d="M122 68l18-19" stroke="#056bad" stroke-width="5" stroke-linecap="round"/><path d="M107 89h31" stroke="#82b8d7" stroke-width="3" stroke-linecap="round"/><path d="M160 91h25v18h-25" stroke="#247db0" stroke-width="5" fill="#bceaff"/><path d="M96 30h52" stroke="#7bbdeb" stroke-width="3"/>',
laws:'<rect x="83" y="18" width="89" height="117" rx="10" fill="#fff" stroke="#378cbe" stroke-width="4"/><path d="M104 48h47M104 61h47M104 74h33M104 98h43" stroke="#87b7d8" stroke-width="4" stroke-linecap="round"/><circle cx="162" cy="107" r="18" fill="#bee9fb" stroke="#167db8" stroke-width="3"/><path d="m152 107 8 7 13-17" stroke="#0a719e" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
roads:'<path d="m94 14-37 123h146L162 14Z" fill="#aecfe4" stroke="#3e8abd" stroke-width="3"/><path d="m128 17 1 120" stroke="#fff" stroke-width="6" stroke-dasharray="17 16"/><path d="M80 99h96" stroke="#fff" stroke-width="5"/><rect x="65" y="77" width="125" height="24" rx="5" fill="#f7fbff" stroke="#237cb4" stroke-width="3"/><path d="M85 80v17M111 80v17M137 80v17M163 80v17" stroke="#2f9eda" stroke-width="8"/>',
cars:'<path d="M43 94h151l-9-30-28-24H89L64 64Z" fill="#e7f7ff" stroke="#147cb4" stroke-width="4" stroke-linejoin="round"/><path d="m91 44-17 26h100l-22-26Z" fill="#95d9f2" stroke="#2e8ab9" stroke-width="3"/><path d="M43 94v20h159V94" fill="#d8eafb" stroke="#147cb4" stroke-width="4"/><circle cx="81" cy="114" r="14" fill="#3e7299" stroke="#fff" stroke-width="5"/><circle cx="164" cy="114" r="14" fill="#3e7299" stroke="#fff" stroke-width="5"/><path d="M47 86h18m114 0h18" stroke="#0fa0e5" stroke-width="5" stroke-linecap="round"/>'
};
function artwork(kind){
 const name=artPaths[kind]||artPaths.cars;
 return '<svg role="img" aria-label="'+safe(tr("image"))+'" viewBox="0 0 244 153" xmlns="http://www.w3.org/2000/svg">'+
 '<ellipse cx="122" cy="143" rx="95" ry="6" fill="#1e74b51c"/>'+name+'</svg>';
}
function displayDate(value){
 const date=new Date(value);
 if(!Number.isFinite(+date))return "";
 const locale={ru:"ru-RU",en:"en-GB",he:"he-IL",ar:"ar-IL"}[state.lang]||"ru-RU";
 return new Intl.DateTimeFormat(locale,{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Jerusalem"}).format(date);
}
function currentOnly(o){
 const t=Date.parse(o.date),now=Date.now();
 if(!Number.isFinite(t)||t>now+12*3600e3||!safeURL(o.url)||!o.titleOriginal||!(o.category in artPaths))return false;
 if(o.category==="laws"){
  // Exact six calendar months; clamp end-of-month dates (31st, leap years).
  const d=new Date(now),day=d.getUTCDate();
  d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-6);
  const end=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
  d.setUTCDate(Math.min(day,end));
  return t>=d.getTime();
 }
 return t>=now-30*86400e3;
}

/* Featured news header: only one slide image exists in the DOM at a time.
   It rotates the latest 10 valid stories independently of the 8-card list. */
const feature={items:[],index:0,timer:null,touchX:null,touchY:null,paused:false,swipedUntil:0};
const featureTerms={
 ru:{latest:"10 СВЕЖИХ НОВОСТЕЙ",view:"Читать новость",slide:"Новость",of:"из",prev:"Предыдущая новость",next:"Следующая новость",pick:"Выбрать новость",loading:"Загружаем последние новости…",empty:"Пока нет проверенных новостей"},
 en:{latest:"10 LATEST STORIES",view:"Read original",slide:"Story",of:"of",prev:"Previous story",next:"Next story",pick:"Choose story",loading:"Loading latest stories…",empty:"No verified news yet"},
 he:{latest:"10 חדשות אחרונות",view:"לקריאת הידיעה",slide:"ידיעה",of:"מתוך",prev:"ידיעה קודמת",next:"הידיעה הבאה",pick:"בחירת ידיעה",loading:"טוען חדשות אחרונות…",empty:"אין כרגע חדשות מאומתות"},
 ar:{latest:"آخر 10 أخبار",view:"اقرأ الخبر",slide:"خبر",of:"من",prev:"الخبر السابق",next:"الخبر التالي",pick:"اختر الخبر",loading:"جار تحميل آخر الأخبار…",empty:"لا توجد أخبار موثقة"}
};
const featureTr=k=>(featureTerms[state.lang]||featureTerms.ru)[k];
function stopFeatureTimer(){clearTimeout(feature.timer);feature.timer=null}
function featureReducedMotion(){return window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}
function restartFeatureTimer(){
 stopFeatureTimer();
 if(feature.items.length<2||feature.paused||document.hidden||featureReducedMotion())return;
 feature.timer=setTimeout(()=>setFeatureIndex(feature.index+1,false),7600);
}
function drawFeature(){
 const host=$("newsFeatureSlide"),controls=$("newsFeatureControls");
 if(!host||!controls)return;
 const list=feature.items;
 controls.hidden=list.length<2;
 $("newsFeatureCarousel").setAttribute("aria-label",featureTr("latest"));
 $("newsFeaturePrev").setAttribute("aria-label",featureTr("prev"));
 $("newsFeatureNext").setAttribute("aria-label",featureTr("next"));
 $("newsFeatureDots").setAttribute("aria-label",featureTr("pick"));
 if(!list.length){host.innerHTML='<p class="news-feature-loading">'+safe(featureTr("empty"))+'</p>';return}
 const item=list[feature.index],localized=localStory(item),url=safeURL(item.url),pic=newsPicture(item);
 const photo=pic?'<img src="'+safe(pic)+'" width="640" height="360" decoding="async" alt="" class="news-feature-img">':'';
 const creditURL=item.imageCredit&&safeURL(item.imageCredit.url);
 const attribution=creditURL?'<a class="news-feature-credit" href="'+safe(creditURL)+'" target="_blank" rel="noopener noreferrer" title="'+safe(item.imageCredit.text||"Photo credit")+'">'+safe(item.imageCredit.text||"Photo credit")+'</a>':'';
 host.innerHTML='<a class="news-feature-story" href="'+safe(url)+'" target="_blank" rel="noopener noreferrer nofollow" aria-label="'+safe(localized.title)+'">'+
  '<span class="news-feature-photo">'+photo+'</span>'+
  '<span class="news-feature-pattern" aria-hidden="true"></span><span class="news-feature-blueprint" aria-hidden="true"></span>'+
  '<span class="news-feature-copy"><span class="news-feature-tag">'+safe(featureTr("latest"))+' <i>·</i> '+safe(tr(item.category))+'</span>'+
  '<strong class="news-feature-title" dir="auto">'+safe(localized.title)+'</strong>'+
  '<span class="news-feature-footer">'+safe(displayDate(item.date))+' · '+safe(item.publisher||"")+'<span class="news-feature-go">'+safe(featureTr("view"))+' ↗</span></span></span></a>'+attribution;
 const dots=$("newsFeatureDots");
 if(dots.childElementCount!==list.length){
  dots.innerHTML=list.map((v,i)=>'<button type="button" data-feature-dot="'+i+'" class="news-feature-dot" aria-label="'+safe(featureTr("slide"))+' '+(i+1)+' '+safe(featureTr("of"))+' '+list.length+'"></button>').join("");
 }
 dots.querySelectorAll("button").forEach((button,i)=>{
  const active=i===feature.index;
  button.classList.toggle("active",active);
  button.setAttribute("aria-current",active?"true":"false");
  button.setAttribute("aria-label",featureTr("slide")+" "+(i+1)+" "+featureTr("of")+" "+list.length);
 });
 $("newsFeatureCounter").textContent=String(feature.index+1).padStart(2,"0")+" / "+String(list.length).padStart(2,"0");
}
function setFeatureIndex(index,manual=true){
 if(!feature.items.length)return;
 feature.index=(index+feature.items.length)%feature.items.length;
 drawFeature();
 if(manual)feature.paused=false;
 restartFeatureTimer();
}
function initializeFeatures(){
 feature.items=state.items.filter(currentOnly).slice(0,10);
 feature.index=0;
 drawFeature();
 restartFeatureTimer();
}
$("newsFeaturePrev").addEventListener("click",()=>setFeatureIndex(feature.index-1));
$("newsFeatureNext").addEventListener("click",()=>setFeatureIndex(feature.index+1));
$("newsFeatureDots").addEventListener("click",event=>{
 const target=event.target.closest("[data-feature-dot]");
 if(target)setFeatureIndex(Number(target.dataset.featureDot));
});
const featureNode=$("newsFeatureCarousel");
featureNode.addEventListener("mouseenter",()=>{feature.paused=true;stopFeatureTimer()});
featureNode.addEventListener("mouseleave",()=>{feature.paused=false;restartFeatureTimer()});
featureNode.addEventListener("focusin",()=>{feature.paused=true;stopFeatureTimer()});
featureNode.addEventListener("focusout",()=>{setTimeout(()=>{if(!featureNode.contains(document.activeElement)){feature.paused=false;restartFeatureTimer()}},20)});
featureNode.addEventListener("keydown",event=>{
 if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();setFeatureIndex(feature.index+(event.key==="ArrowRight"?1:-1))}
});
featureNode.addEventListener("touchstart",event=>{
 if(event.touches.length===1){feature.touchX=event.touches[0].clientX;feature.touchY=event.touches[0].clientY}
},{passive:true});
featureNode.addEventListener("touchend",event=>{
 if(feature.touchX===null)return;
 const dx=event.changedTouches[0].clientX-feature.touchX,dy=event.changedTouches[0].clientY-feature.touchY;
 feature.touchX=null;feature.touchY=null;
 if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2){
  feature.swipedUntil=Date.now()+500;
  setFeatureIndex(feature.index+(dx<0?1:-1));
 }
},{passive:true});
featureNode.addEventListener("click",event=>{
 if(event.target.closest(".news-feature-story")&&Date.now()<feature.swipedUntil){event.preventDefault();event.stopPropagation()}
},true);

function localize(){
 document.querySelectorAll('[data-news-lang]').forEach(el=>{
  const active=el.dataset.newsLang===state.lang;
  el.classList.toggle('active',active);
  el.setAttribute('aria-pressed',active?'true':'false');
 });
 document.documentElement.lang=state.lang;
 document.documentElement.dir=["he","ar"].includes(state.lang)?"rtl":"ltr";
 $("newsEyebrow").textContent=tr("eyebrow");$("newsHeading").innerHTML=tr("heading");
 $("newsIntro").textContent=tr("intro");$("newsRetention").textContent=tr("period");
 $("newsSearch").placeholder=tr("search");
 const note=$("newsCopyright");
 note.textContent=tr("legal")+" ";
 const official=document.createElement("a");
 official.href="https://www.gov.il/he/departments/ministry_of_transport_and_road_safety";
 official.target="_blank";official.rel="noopener noreferrer";
 official.textContent=state.lang==="ru"?"Официальный сайт Минтранса ↗":state.lang==="he"?"אתר משרד התחבורה ↗":state.lang==="ar"?"وزارة النقل ↗":"Ministry of Transport ↗";
 note.appendChild(official);
 $("returnCatalog").textContent=tr("back");
 for(const [id,k] of [["newsHome","home"],["newsCatalog","catalog"],["newsNews","news"],["newsFav","fav"],["newsCart","cart"]]){
  const label=$(id).querySelector("span");if(label)label.textContent=tr(k);
 }
}
function tabs(){
 const cats=["all","accidents","laws","speed","roads","cars"];
 const items=state.items.filter(currentOnly);
 $("newsRetention").textContent=state.category==="laws"?tr("lawsPeriod"):state.category==="all"?tr("allPeriod"):tr("period");
 $("newsCategories").innerHTML=cats.map(k=>{
  const n=k==="all"?items.length:items.filter(x=>x.category===k).length;
  return '<button class="news-chip '+(state.category===k?'active':'')+'" type="button" data-news-category="'+k+'" aria-pressed="'+(state.category===k?'true':'false')+'">'+safe(tr(k))+' <span class="news-count">'+n+'</span></button>';
 }).join("");
 $("newsCategories").querySelectorAll("button").forEach(el=>el.onclick=()=>{state.category=el.dataset.newsCategory;state.visible=PAGE_SIZE;tabs();render()});
}
function render(append=false){
 const recent=state.items.filter(currentOnly);
 const query=state.query.trim().toLocaleLowerCase();
 const matches=recent.filter(x=>{
  const local=localStory(x);
  return (state.category==="all"||x.category===state.category)
   &&(!query||[local.title,local.summary,x.titleOriginal,x.publisher].join(" ").toLocaleLowerCase().includes(query));
 });
 const offset=append?state.rendered:0;
 const list=matches.slice(offset,state.visible);
 const cards=list.map((item,index)=>{
  const pos=offset+index;
  const label=tr(item.category),url=safeURL(item.url),localized=localStory(item);
  const pic=newsPicture(item);
  const image=pic?
   '<img class="news-art-image" loading="'+(pos<2?'eager':'lazy')+'" decoding="async" width="640" height="360" alt="'+safe(tr("image"))+'" src="'+safe(pic)+'">':
   '<div class="news-photo-placeholder" aria-hidden="true"></div>';
  const type=item.imageType==="sourceLicensedPhoto"?({ru:"Фото из публикации",en:"Publisher photo",he:"צילום מהמקור",ar:"صورة المصدر"}[state.lang]):
   item.imageType==="ai"?({ru:"AI · иллюстрация",en:"AI · illustration",he:"AI · הדמיה",ar:"AI · صورة توضيحية"}[state.lang]):
   item.imageType==="licensedPhoto"?({ru:"Фото · иллюстрация",en:"Photo · illustration",he:"צילום · המחשה",ar:"صورة توضيحية"}[state.lang]):tr("image");
  const photoCredit=item.imageCredit&&item.imageCredit.url?
   '<a class="news-photo-credit" href="'+safe(safeURL(item.imageCredit.url))+'" target="_blank" rel="noopener noreferrer">'+safe(item.imageCredit.text||"Wikimedia Commons")+'</a>':'';
  return '<article class="news-card '+(pos===0&&state.category==="all"&&!state.query?'news-card--lead':'')+'">'+
   '<div class="news-art news-art--'+safe(item.category)+'"><span class="news-art-type">'+safe(label)+'</span>'+image+
   '<span class="news-art-decoration" aria-hidden="true"></span><span class="news-art-source">'+safe(type)+'</span><a class="news-art-caption" href="'+safe(url)+'" target="_blank" rel="noopener noreferrer nofollow" dir="auto" aria-label="'+safe(tr("read"))+'">'+safe(localized.title)+'</a>'+photoCredit+'</div>'+
   '<div class="news-card-body"><div class="news-card-meta">'+safe(displayDate(item.date))+
   ' <b>· '+safe(item.publisher||"")+'</b>'+(item.official?' · gov.il':'')+'</div>'+
   '<h2 dir="auto"><a class="news-title-button" href="'+safe(url)+'" target="_blank" rel="noopener noreferrer nofollow" aria-label="'+safe(tr("read"))+'">'+safe(localized.title)+'</a></h2>'+
   '<p class="summary" dir="auto">'+safe(localized.summary||"")+'</p>'+
   (item.category==="laws"&&!item.official?'<p class="summary note">'+safe(tr("warning"))+'</p>':'')+
   '<a class="news-link" href="'+safe(url)+'" target="_blank" rel="noopener noreferrer nofollow">'+safe(tr("read"))+' ↗</a></div></article>';
 }).join("");
 if(append)$("newsGrid").insertAdjacentHTML("beforeend",cards);
 else $("newsGrid").innerHTML=cards;
 state.rendered=offset+list.length;
 $("newsEmpty").hidden=matches.length>0;
 if(!matches.length)$("newsEmpty").textContent=recent.length?tr("empty"):tr("noFeed");
 const more=$("newsLoadMore");
 const remaining=Math.max(0,matches.length-state.rendered);
 more.hidden=remaining===0;
 if(remaining){
  $("newsMoreButton").textContent=({ru:"Показать ещё новости",he:"עוד חדשות",en:"Show",ar:"عرض المزيد من الأخبار"}[state.lang])+" "+Math.min(PAGE_SIZE,remaining)+(state.lang==="en"?" more":"");
  $("newsVisibleCount").textContent=({ru:"Показано",he:"מוצגות",en:"Showing",ar:"عرض"}[state.lang])+" "+state.rendered+" / "+matches.length;
 }
}
async function load(){
 try{
  const response=await fetch("./assets/news/news.json",{cache:"no-store"});
  if(!response.ok)throw new Error("feed not yet published");
  const data=await response.json();
  if(data.version!==1||!Array.isArray(data.items)||data.retentionDays!==30||data.lawsRetentionMonths!==6)throw new Error("bad feed");
  state.items=data.items.filter(currentOnly);
  state.items.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
  const stamp=new Date(data.updated);
  $("newsUpdated").textContent=Number.isFinite(+stamp)?tr("updated")+": "+displayDate(stamp):"";
 }catch(e){
  console.warn("News feed temporarily unavailable:",e.message);
  $("newsUpdated").textContent="";
  state.items=[];
 }
 tabs();render();initializeFeatures();
}
$("newsMoreButton").addEventListener("click",()=>{
 // Append just 8 more articles when the visitor explicitly requests them.
 if($("newsLoadMore").hidden)return;
 state.visible+=PAGE_SIZE;
 render(true);
});
$("newsSearch").addEventListener("input",e=>{state.query=e.target.value;state.visible=PAGE_SIZE;render()});
document.querySelectorAll('[data-news-lang]').forEach(el=>el.addEventListener('click',()=>{
 state.lang=el.dataset.newsLang;
 try{localStorage.setItem("neoline-language",state.lang)}catch(e){}
 localize();tabs();render();drawFeature();
}));
document.addEventListener("visibilitychange",()=>{
 // Only recheck age limits after a long idle period; no needless DOM rebuilds.
 if(document.hidden){stopFeatureTimer();return}
 restartFeatureTimer();
 if(Date.now()-lastExpiryCheck<3600000)return;
 lastExpiryCheck=Date.now();tabs();render();
 const count=feature.items.length;
 feature.items=state.items.filter(currentOnly).slice(0,10);
 if(feature.index>=feature.items.length)feature.index=0;
 if(feature.items.length!==count)drawFeature();
});
localize();tabs();load();
})();
