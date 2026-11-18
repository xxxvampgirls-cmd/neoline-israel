/* NEOLINE · separate enforcement-operation archive; never a national daily fine total. */
(()=>{
"use strict";
const root=document.getElementById("finesOps");
if(!root)return;
const $=id=>document.getElementById(id);
const LIVE="https://raw.githubusercontent.com/xxxvampgirls-cmd/neoline-israel/fines-live/assets/fines/operations.json";
const FALLBACK="./assets/fines/operations.json";
const names={
 ru:{heading:"Операции дорожной полиции",intro:"Подтверждённые отдельные операции и недельные сводки. Это НЕ все штрафы Израиля за день; показатели разных периодов не складываются.",all:"Все",operation:"Операции",day:"За сутки",week:"За неделю",weekend:"Выходные",fine:"протоколов",more:"Более",link:"Первоисточник ↗",empty:"Для этого периода пока нет подтверждённых чисел.",pending:"Проверяем официальные источники…",sourceDown:"Новые сообщения сейчас недоступны; показан проверенный архив.",checked:"Последняя проверка",unknown:"Автопроверка ожидается",auto:"Проверка каждый час · публикации могут запаздывать",press:"СМИ со ссылкой на полицию",official:"Дорожная полиция",issued:"Протоколы в указанной операции",speed:"Скорость",phone:"Телефон",redLight:"Красный свет",notice:"Масштаб красных полос относительный в рамках выбранного списка, но периоды и география могут отличаться. Категории не прибавляются к общему числу."},
 he:{heading:"מבצעי אכיפת תנועה",intro:"דיווחים נפרדים ומאומתים על מבצעים וסיכומי שבוע. אינם מייצגים את כל הדוחות ביום בישראל; אין לחבר בין תקופות.",all:"הכול",operation:"מבצע",day:"יממה",week:"שבוע",weekend:"סוף שבוע",fine:"דוחות",more:"מעל",link:"למקור ↗",empty:"אין מספרים מאומתים לתקופה זו.",pending:"בודקים מקורות רשמיים…",sourceDown:"העדכון אינו זמין כרגע; מוצג ארכיון מאומת.",checked:"בדיקה אחרונה",unknown:"ממתינים לבדיקה",auto:"בדיקה בכל שעה · ייתכנו עיכובים",press:"תקשורת בהסתמך על המשטרה",official:"אגף התנועה",issued:"דוחות במבצע המתואר",speed:"מהירות",phone:"טלפון",redLight:"רמזור אדום",notice:"העמודות מציגות קנה מידה יחסי בתוך הרשימה; תקופות ואזורים עשויים להיות שונים. לא מחברים תתי-קטגוריות לסך הכול."},
 en:{heading:"Traffic-police enforcement operations",intro:"Verified individual operations and weekly summaries; NOT all fines issued nationwide each day. Do not add different periods together.",all:"All",operation:"Operation",day:"One day",week:"Week",weekend:"Weekend",fine:"reports",more:"Over",link:"Original source ↗",empty:"No verified figures for this filter.",pending:"Checking official sources…",sourceDown:"New updates are unavailable; showing the verified archive.",checked:"Last checked",unknown:"Automatic check pending",auto:"Hourly checks · source publication may be delayed",press:"Press reporting police figures",official:"Traffic Police",issued:"Reports in the stated operation",speed:"Speeding",phone:"Phone use",redLight:"Red lights",notice:"Red bars use a relative scale within the displayed list; timeframes and geographic coverage may differ. Offence categories are part of the reported total."},
 ar:{heading:"حملات إنفاذ المرور",intro:"بيانات مؤكدة عن عمليات محددة وأسابيع مختلفة؛ ليست جميع الغرامات اليومية في إسرائيل ولا تُجمع الفترات.",all:"الكل",operation:"عملية",day:"يوم",week:"أسبوع",weekend:"نهاية الأسبوع",fine:"مخالفة",more:"أكثر من",link:"المصدر ↗",empty:"لا توجد أرقام موثقة لهذا الاختيار.",pending:"جار فحص المصادر الرسمية…",sourceDown:"التحديث غير متاح؛ نعرض السجلات الموثقة.",checked:"آخر فحص",unknown:"بانتظار الفحص",auto:"فحص كل ساعة · قد تتأخر المصادر",press:"صحافة تنقل عن الشرطة",official:"شرطة المرور",issued:"مخالفات في العملية المحددة",speed:"السرعة",phone:"الهاتف",redLight:"الإشارة الحمراء",notice:"الأشرطة الحمراء نسبية داخل القائمة؛ قد تختلف الفترات والتغطية الجغرافية. لا تُجمع فئات المخالفات مع الإجمالي."}
};
const locales={ru:"ru-RU",he:"he-IL",en:"en-GB",ar:"ar"};
let payload=null,active="all",lastAttempt=0,remoteError=false;
const language=()=>names[document.documentElement.lang]?document.documentElement.lang:"ru";
const number=(v)=>new Intl.NumberFormat(locales[language()]).format(v);
const ui=(tag,className,text)=>{const x=document.createElement(tag);if(className)x.className=className;if(text!==undefined)x.textContent=text;return x};
const valid=(data)=>data&&data.version===1&&Array.isArray(data.reports);
const source=(url)=>typeof url==="string" && /^https:\/\/(t\.me\/Atanpolice\/\d+|www\.gov\.il\/|www\.globes\.co\.il\/)/.test(url);
const date=(iso)=>{
 const d=new Date(String(iso)+"T12:00:00Z");
 return Number.isFinite(d.getTime())?new Intl.DateTimeFormat(locales[language()],{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(d):iso;
};
function render(){
 const t=names[language()];
 $("finesOpsHeading").textContent=t.heading;
 $("finesOpsIntro").textContent=t.intro;
 $("finesOpsHint").textContent=t.auto;
 $("finesOpsNotice").textContent=t.notice;
 const status=$("finesOpsStatus");
 if(!payload){status.textContent=t.pending;return}
 if(payload.checkedAt){
  const d=new Date(payload.checkedAt);
  const stamp=Number.isFinite(d.getTime())?new Intl.DateTimeFormat(locales[language()],{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Jerusalem"}).format(d)+" (IL)":t.unknown;
  status.textContent=(payload.sourceStatus==="unavailable"||remoteError?t.sourceDown+" · ":"")+t.checked+": "+stamp;
 }else{
  status.textContent=t.unknown+(remoteError?" · "+t.sourceDown:"");
 }
 const filter=$("finesOpsFilters");
 filter.replaceChildren();
 for(const value of ["all","operation","day","week","weekend"]){
  const button=ui("button","fines-ops-tab",t[value]);
  button.type="button";button.setAttribute("aria-pressed",String(active===value));
  button.addEventListener("click",()=>{active=value;render()});
  filter.append(button);
 }
 const list=$("finesOpsList");
 list.replaceChildren();
 const data=payload.reports.filter(r=>r&&source(r.sourceUrl)&&typeof r.date==="string"&&
  (Number.isInteger(r.count)&&r.count>=0||Number.isInteger(r.minimum)&&r.minimum>=0));
 const visible=data.filter(r=>active==="all"||r.period===active).sort((a,b)=>
  String(b.date).localeCompare(String(a.date))||String(b.id).localeCompare(String(a.id)));
 $("finesOpsTotal").textContent=number(visible.length);
 if(!visible.length){list.append(ui("p","fines-ops-empty",t.empty));return}
 const max=Math.max(1,...visible.map(x=>x.count||0));
 for(const item of visible){
  const card=ui("article","fines-ops-entry");
  const row=ui("div","fines-ops-meta");
  row.append(ui("time","",date(item.date)),ui("span","fines-ops-tag",t[item.period]||t.operation));
  row.append(ui("span","fines-ops-type",item.sourceType==="media-police-report"?t.press:t.official));
  const stat=ui("div","fines-ops-stat");
  const value=ui("strong","fines-ops-value",
   item.count===null?t.more+" "+number(item.minimum):number(item.count));
  const caption=ui("span","fines-ops-unit",t.fine);
  stat.append(value,caption);
  const meter=ui("div","fines-ops-meter");
  meter.setAttribute("aria-hidden","true");
  const bar=ui("span","fines-ops-fill");
  if(Number.isInteger(item.count))bar.style.width=Math.max(3,Math.round(item.count/max*100))+"%";
  else meter.classList.add("fines-ops-meter--unknown");
  meter.append(bar);
  const sub=ui("div","fines-ops-sub");
  if(item.periodStart&&item.periodEnd){
   sub.append(ui("span","",date(item.periodStart)+" – "+date(item.periodEnd)));
  }else{
   sub.append(ui("span","",t.issued));
  }
  if(item.categories&&typeof item.categories==="object"){
   const cat=ui("div","fines-ops-categories");
   for(const [key,count] of Object.entries(item.categories)){
    if(Number.isInteger(count)&&count>=0){
     cat.append(ui("span","fines-ops-category",(t[key]||key)+": "+number(count)));
    }
   }
   if(cat.children.length)sub.append(cat);
  }
  const link=ui("a","fines-ops-source",t.link);
  link.href=item.sourceUrl;link.target="_blank";link.rel="noopener noreferrer";
  card.append(row,stat,meter,sub,link);
  list.append(card);
 }
}
async function fetchJson(url){
 const response=await fetch(url+"?t="+Date.now(),{cache:"no-store"});
 if(!response.ok)throw Error("HTTP "+response.status);
 const json=await response.json();
 if(!valid(json))throw Error("Invalid fines data");
 return json;
}
async function refresh(){
 if(Date.now()-lastAttempt<60000)return;
 lastAttempt=Date.now();
 if(!payload){
  try{payload=await fetchJson(FALLBACK);render()}catch(error){remoteError=true}
 }
 try{
  const live=await fetchJson(LIVE);
  if(!payload||String(live.checkedAt||"")>=String(payload.checkedAt||"")){
   payload=live;
  }
  remoteError=false;
 }catch(error){remoteError=true}
 render();
}
root.addEventListener("click",()=>{if(!payload)refresh()});
window.addEventListener("neoline:news-language",render);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&Date.now()-lastAttempt>=3600000)refresh()});
setInterval(refresh,3600000);
render();refresh();
})();
