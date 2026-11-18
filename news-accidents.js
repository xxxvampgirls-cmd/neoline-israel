/* 30-day trend of NEWS ITEMS tagged accidents, never official crash totals.
   Uses the existing once-daily news synchronizer, without extra scraping. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
if(!$("accidentChart"))return;
const ruPosts=n=>{const m=n%10,p=n%100;return p>=11&&p<=14?"публикаций":m===1?"публикация":m>=2&&m<=4?"публикации":"публикаций"};
const copy={
 ru:{title:"ДТП и штрафы",kind:"ДТП · публикации по дням",hot:"Горячие события ↗",wait:"Проверяем новости за 30 дней…",error:"Данные за месяц временно недоступны",total:n=>"За 30 дней: "+n+" "+ruPosts(n)+" о ДТП",day:(d,n)=>d+": "+n+" "+ruPosts(n)+" о ДТП",select:"Нажмите столбец, чтобы увидеть число сообщений за день.",official:"Официальная статистика ↗",disclaimer:"График показывает публикации о ДТП в нашей ленте, НЕ все аварии Израиля. Несколько сообщений могут относиться к одной аварии. Отсутствие сообщений не означает отсутствие ДТП.",sources:"Источники и полнота статистики",explain:"Мы считаем только уникальные публикации из новостей. Страховые отчёты не дают открытого ежедневного перечня конкретных ДТП, а государственные данные могут публиковаться с задержкой — поэтому не смешиваем их с новостями без надёжного сопоставления событий.",cbs:"ЦСБ Израиля ↗",police:"Статистика полиции ↗",map:"Карта ДТП ↗",updated:" · обновлено "},
 he:{title:"תאונות ודוחות תנועה",kind:"תאונות · ידיעות לפי יום",hot:"אירועים חמים ↗",wait:"בודקים חדשות ל־30 ימים…",error:"נתוני החודש אינם זמינים כעת",total:n=>"30 ימים: "+n+" ידיעות על תאונות",day:(d,n)=>d+": "+n+" ידיעות על תאונות",select:"לחצו על עמודה להצגת מספר הידיעות ביום.",official:"נתונים רשמיים ↗",disclaimer:"הגרף מציג ידיעות חדשותיות על תאונות, ולא את כל התאונות בישראל. כמה ידיעות עשויות לתאר תאונה אחת. אפס ידיעות אינו אומר אפס תאונות.",sources:"מקורות ומה נכלל בנתונים",explain:"נספרים פרסומים ייחודיים בלבד. דוחות ביטוח אינם מספקים מאגר פתוח של אירועים יומיים בודדים, והנתונים הרשמיים עשויים להתפרסם באיחור. לא מאחדים נתונים ללא זיהוי מהימן של האירועים.",cbs:"הלמ״ס ↗",police:"נתוני המשטרה ↗",map:"מפת התאונות ↗",updated:" · עודכן "},
 en:{title:"Crashes & traffic fines",kind:"Crashes · daily news reports",hot:"Breaking road events ↗",wait:"Checking 30 days of news…",error:"Monthly feed temporarily unavailable",total:n=>"30 days: "+n+" crash news reports",day:(d,n)=>d+": "+n+" news reports",select:"Tap a bar to see that day's news count.",official:"Official statistics ↗",disclaimer:"This chart counts articles tagged as crashes, NOT actual traffic crashes across Israel. One crash may appear in multiple stories. No stories does not mean no crashes.",sources:"Sources and coverage",explain:"Only distinct news articles are counted. Insurer reports do not provide an open daily register of individual crashes, while official records can have reporting delays. We do not merge unmatched incidents or claim complete coverage.",cbs:"Israel CBS ↗",police:"Police statistics ↗",map:"Official crash map ↗",updated:" · updated "},
 ar:{title:"الحوادث والمخالفات",kind:"الحوادث · بلاغات الأخبار اليومية",hot:"الأحداث العاجلة ↗",wait:"نراجع أخبار آخر 30 يوماً…",error:"بيانات الشهر غير متاحة حالياً",total:n=>"30 يوماً: "+n+" تقريراً عن الحوادث",day:(d,n)=>d+": "+n+" تقريراً عن الحوادث",select:"اضغط على عمود لمعرفة عدد الأخبار في ذلك اليوم.",official:"إحصاءات رسمية ↗",disclaimer:"يحسب الرسم المنشورات الإخبارية عن الحوادث، وليس عدد الحوادث الفعلي في إسرائيل. قد يتكرر خبر عن الحادث ذاته؛ عدم وجود أخبار لا يعني عدم وجود حوادث.",sources:"المصادر وشمول البيانات",explain:"نحسب منشورات إخبارية فريدة فقط. لا توفر تقارير شركات التأمين سجلاً يومياً عاماً للحوادث الفردية، وقد تتأخر البيانات الرسمية. لا ندمج الأرقام دون التحقق من تطابق الحوادث.",cbs:"الإحصاء المركزي ↗",police:"إحصاءات الشرطة ↗",map:"خريطة الحوادث ↗",updated:" · تحديث "}
};
const locale={ru:"ru-RU",he:"he-IL",en:"en-GB",ar:"ar"};
const setDayDetail=(text,isVisible)=>{const e=$("accidentDayDetail");e.hidden=!isVisible;e.textContent=isVisible?text:""};
const words=()=>copy[document.documentElement.lang]||copy.ru;
const dateKey=d=>{
 const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Jerusalem",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(d);
 const x=Object.fromEntries(p.map(v=>[v.type,v.value]));
 return x.year+"-"+x.month+"-"+x.day;
};
const display=(d)=>new Intl.DateTimeFormat(locale[document.documentElement.lang]||"ru-RU",{timeZone:"UTC",day:"numeric",month:"short"}).format(d);
let articles=null,updated="",selected=null,dayShown="",unavailable=false;
function draw(){
 const c=$("accidentChart"),t=words();
 if(!articles){
  $("accidentStripStatus").textContent=unavailable?t.error:t.wait;
  setDayDetail("",false);
  return;
 }
 const today=dateKey(new Date()),end=Date.parse(today+"T12:00:00Z");
 const days=Array.from({length:30},(_,i)=>{
  const date=new Date(end-(29-i)*86400000);
  return {date,key:date.toISOString().slice(0,10),count:0};
 });
 const table=new Map(days.map(x=>[x.key,x])),seen=new Set(),seenLinks=new Set();
 const canonicalLink=url=>{
  if(typeof url!=="string")return null;
  try{
   const u=new URL(url);
   if(!["https:","http:"].includes(u.protocol))return null;
   u.hash="";
   for(const key of [...u.searchParams.keys()]){
    if(/^utm_|^(?:fbclid|gclid|yclid|mc_cid|mc_eid)$/i.test(key))u.searchParams.delete(key);
   }
   return u.hostname.toLowerCase()+u.pathname.replace(/\/+$/,"")+u.search;
  }catch(e){return null}
 };
 for(const article of articles){
  if(article?.category!=="accidents"||typeof article.id!=="string"||seen.has(article.id))continue;
  const d=new Date(article.date);
  if(!Number.isFinite(d.getTime())||d.getTime()>Date.now()+3600000)continue;
  const row=table.get(dateKey(d));
  if(!row)continue;
  // Prevent the same source article from being counted twice with a
  // tracking parameter / mirrored archive ID. Different articles about
  // one collision remain separate unless we have a common incident ID.
  const key=canonicalLink(article.url);
  if(key&&seenLinks.has(key))continue;
  seen.add(article.id);if(key)seenLinks.add(key);row.count++;
 }
 // Fill the chart only from the first day represented in the current
 // rolling news archive through today; do not spread 7 days over 30 empty slots.
 // Calendar gaps inside that observed window mean zero news posts, not zero crashes.
 const firstObserved=days.findIndex(d=>d.count>0);
 const visibleDays=firstObserved<0?[]:days.slice(firstObserved);
 const peak=Math.max(1,...visibleDays.map(d=>d.count));
 c.replaceChildren();
 c.style.setProperty("--visible-days",String(Math.max(1,visibleDays.length)));
 c.classList.toggle("is-empty",visibleDays.length===0);
 if(visibleDays.length===0){
  selected=null;
  setDayDetail("",false);
  $("accidentStripStatus").textContent=t.total(0);
  dayShown=today;
  return;
 }
 for(const [index,row] of visibleDays.entries()){
  const b=document.createElement("button");b.type="button";b.className="accident-day";b.dataset.day=row.key;
  const label=t.day(display(row.date),row.count);
  b.title=label;b.setAttribute("aria-label",label);
  b.setAttribute("aria-pressed",String(selected===row.key));
  const rail=document.createElement("span");rail.className="accident-day-rail";
  const bar=document.createElement("span");bar.className="accident-day-bar";
  bar.style.height=(row.count?Math.max(7,Math.round(row.count/peak*100)):0)+"%";
  if(!row.count)bar.classList.add("is-empty");
  rail.append(bar);
  const tick=document.createElement("span");tick.className="accident-day-tick";
  tick.textContent=(visibleDays.length<=14||index===0||index===visibleDays.length-1||row.date.getUTCDate()===1||row.date.getUTCDate()%5===0)?row.date.getUTCDate():"·";
  b.append(rail,tick);
  b.addEventListener("click",()=>{
   selected=row.key;
   c.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
   setDayDetail(label,true);
  });
  c.append(b);
 }
 const sum=days.reduce((n,x)=>n+x.count,0);
 const upd=new Date(updated);
 const updLabel=Number.isFinite(upd.getTime())?new Intl.DateTimeFormat(locale[document.documentElement.lang]||"ru-RU",{timeZone:"Asia/Jerusalem",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(upd):"";
 $("accidentStripStatus").textContent=t.total(sum)+(updLabel?t.updated+updLabel:"");
 const chosen=visibleDays.find(day=>day.key===selected);
 setDayDetail(chosen?t.day(display(chosen.date),chosen.count):"",Boolean(chosen));
 dayShown=today;
}
function relabel(){
 const t=words();
 $("accidentStripTitle").textContent=t.title;
 if($("accidentStripKind"))$("accidentStripKind").textContent=t.kind;
 $("hotEventsLink").textContent=t.hot;
 $("accidentOfficial").textContent=t.official;
 $("accidentChartDisclaimer").textContent=t.disclaimer;
 const extra=[["accidentSourcesTitle","sources"],["accidentSourcesInfo","explain"],
 ["accidentCBS","cbs"],["accidentPolice","police"],["accidentMapSource","map"],["accidentChartHelp","select"]];
 for(const [id,key] of extra){const el=$(id);if(el)el.textContent=t[key]}
 draw();
}
window.addEventListener("neoline:news-archive",e=>{
 if(!Array.isArray(e.detail?.items))return;
 articles=e.detail.items;updated=e.detail.updated||"";unavailable=false;draw();
});
window.addEventListener("neoline:news-language",relabel);
window.addEventListener("neoline:news-archive-unavailable",()=>{if(!articles){unavailable=true;draw()}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&dayShown!==dateKey(new Date()))draw()});
setInterval(()=>{if(!document.hidden&&dayShown!==dateKey(new Date()))draw()},600000);
relabel();
})();
