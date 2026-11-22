/* Home dashboard: reuse the ORIGINAL newsroom ДТП chart implementation.
 * Accident chart counts distinct published news items, not actual collisions.
 * The fines series is annual official police notifications (last fully
 * comparable year 2024), not imaginary daily fine totals.
 */
(()=>{
"use strict";
const root=document.getElementById("homeRoadNews");
if(!root)return;
const byId=id=>document.getElementById(id);
const copy={
 ru:{
  kicker:"NEOLINE · ДОРОГИ ИЗРАИЛЯ",heading:"ДТП и штрафы",
  intro:"Публикации о ДТП за последние 30 дней и официальная годовая статистика штрафных уведомлений.",
  finesKicker:"ПОЛИЦИЯ ИЗРАИЛЯ · ШТРАФЫ",finesCaption:"Оформлено штрафных уведомлений в 2024 году",
  finesNote:"2022–2024: данные полицейского ежегодника. Это не число оплаченных штрафов. Сопоставимой годовой статистики за 2025–2026 годы пока нет.",
  finesSource:"Источник: ежегодник полиции Израиля ↗",all:"Смотреть все новости",
  daily:"График отражает публикации СМИ о ДТП, а не общее число аварий. Для штрафов официальных дневных чисел нет."
 },
 en:{
  kicker:"NEOLINE · ISRAEL ROAD REPORTS",heading:"Crashes and fines",
  intro:"30 days of published crash reports alongside official annual traffic-fine notices.",
  finesKicker:"ISRAEL POLICE · FINES",finesCaption:"Fine notices issued in 2024",
  finesNote:"2022–2024: police yearbook figures, not fines paid. Comparable complete annual figures for 2025–2026 are not yet available.",
  finesSource:"Source: Israel Police yearbook ↗",all:"View all news",
  daily:"Blue bars count crash news reports, not all crashes. Verified daily fine counts are unavailable."
 },
 he:{
  kicker:"NEOLINE · כבישי ישראל",heading:"תאונות ודוחות תנועה",
  intro:"דיווחי תאונות ב־30 הימים האחרונים לצד נתונים שנתיים רשמיים על הודעות קנס.",
  finesKicker:"משטרת ישראל · דוחות",finesCaption:"הודעות קנס שנרשמו בשנת 2024",
  finesNote:"2022–2024: נתוני שנתון המשטרה, לא קנסות ששולמו. נתונים שנתיים מלאים ובני השוואה לשנים 2025–2026 טרם פורסמו.",
  finesSource:"מקור: שנתון משטרת ישראל ↗",all:"לכל החדשות",
  daily:"העמודות הכחולות מציגות ידיעות על תאונות ולא את מספר התאונות. נתוני קנסות יומיים מאומתים אינם זמינים."
 },
 ar:{
  kicker:"NEOLINE · طرق إسرائيل",heading:"حوادث الطرق والمخالفات",
  intro:"تقارير حوادث الطرق خلال آخر 30 يومًا بجانب أرقام رسمية سنوية لإشعارات الغرامات.",
  finesKicker:"الشرطة الإسرائيلية · مخالفات",finesCaption:"إشعارات الغرامات الصادرة في عام 2024",
  finesNote:"2022–2024: أرقام التقرير السنوي للشرطة، وليست غرامات مدفوعة. لا تتوفر بيانات سنوية كاملة قابلة للمقارنة لعامي 2025–2026.",
  finesSource:"المصدر: التقرير السنوي للشرطة ↗",all:"عرض جميع الأخبار",
  daily:"الأعمدة الزرقاء تعد تقارير الحوادث المنشورة وليس كل الحوادث. لا تتوفر بيانات يومية موثقة للمخالفات."
 }
};
const locale={ru:"ru-RU",en:"en-GB",he:"he-IL",ar:"ar-IL"};
function language(){return copy[document.documentElement.lang] ? document.documentElement.lang:"ru";}
function applyLanguage(){
 const l=language(),t=copy[l];
 for(const [id,key] of [
  ["homeRoadNewsKicker","kicker"],["homeRoadNewsTitle","heading"],
  ["homeRoadNewsIntro","intro"],["homeFinesKicker","finesKicker"],
  ["homeFinesCaption","finesCaption"],["homeFinesNote","finesNote"],
  ["homeFinesSource","finesSource"],["homeNewsAllButtonLabel","all"],
  ["accidentChartDisclaimer","daily"]
 ]){
  const element=byId(id);if(element)element.textContent=t[key];
 }
 const number=byId("homeFinesCurrent");
 if(number)number.textContent=new Intl.NumberFormat(locale[l]).format(918754);
 window.dispatchEvent(new Event("neoline:news-language"));
}
new MutationObserver(mutations=>{
 if(mutations.some(x=>x.attributeName==="lang"))applyLanguage();
}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
let lastFetched=0,lastPublished=0,busy=false;
const fallback="https://raw.githubusercontent.com/xxxvampgirls-cmd/neoline-israel/main/assets/news/news.json";
const sources=["./api/news","./assets/news/news.json",fallback];
async function load(url){
 try{
  const stamp=Math.floor(Date.now()/600000);
  const separator=url.includes("?")?"&":"?";
  const response=await fetch(url+separator+"v="+stamp,{
   cache:"no-store",signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)return null;
  const payload=await response.json();
  if(payload?.version!==1||payload.retentionDays!==30||
     payload.lawsRetentionMonths!==6||!Array.isArray(payload.items))return null;
  const updated=Date.parse(payload.updated);
  if(!Number.isFinite(updated)||updated>Date.now()+6*3600000)return null;
  return {updated,items:payload.items};
 }catch(_){return null}
}
async function refresh(){
 if(busy||document.hidden)return;
 busy=true;lastFetched=Date.now();
 try{
  const versions=(await Promise.all(sources.map(load))).filter(Boolean)
    .sort((a,b)=>b.updated-a.updated);
  if(!versions.length){
   if(!lastPublished)window.dispatchEvent(new Event("neoline:news-archive-unavailable"));
   return;
  }
  if(versions[0].updated<=lastPublished)return;
  lastPublished=versions[0].updated;
  // Same event and identical chart JS as on /news.html, no duplicate logic.
  window.dispatchEvent(new CustomEvent("neoline:news-archive",{
   detail:{items:versions[0].items,updated:new Date(lastPublished).toISOString()}
  }));
 }finally{busy=false}
}
applyLanguage();
refresh();
document.addEventListener("visibilitychange",()=>{
 if(!document.hidden && Date.now()-lastFetched>=5*60000)refresh();
});
setInterval(()=>{if(!document.hidden&&Date.now()-lastFetched>=10*60000)refresh()},60000);
})();
