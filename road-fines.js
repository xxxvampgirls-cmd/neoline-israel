/* NEOLINE · official road-enforcement reports
   Source: Israeli Police Statistical Yearbook 2024, tables 4.30–4.31.
   Total reports include fine notices, warnings and court summons.
   Offence shares relate to a DIFFERENT denominator (1,093,779).
   Several offences may occur on one report, never add these shares
   to the total or to Waze/accident/news counts.
   2025/2026: official comparable annual totals not verified, use null.
*/
(()=>{
"use strict";
const root=document.getElementById("roadFines");
if(!root)return;
const id=s=>document.getElementById(s);
const policePDF="https://www.gov.il/BlobFolder/reports/police_statistical_2024/he/%D7%A9%D7%A0%D7%AA%D7%95%D7%9F%20%D7%A1%D7%98%D7%98%D7%99%D7%A1%D7%98%D7%99%202024%20%D7%9E%D7%A9%D7%98%D7%A8%D7%AA%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%20%D7%9E%D7%95%D7%A0%D7%92%D7%A9.pdf";
const report={
 2022:{fine:1042823,warning:99567,court:58932,total:1201322},
 2023:{fine:837889,warning:88830,court:59330,total:986049},
 2024:{fine:918754,warning:105908,court:64576,total:1089238},
 2025:null,2026:null
};
const offenceShares=[
 ["speed",21],["caution",15],["vehicle",10],["safety",8],["signs",7],
 ["careless",6],["license",5],["parking",5],["other",5],["otherSigns",4],
 ["trafficLights",4],["remaining",10]
];
const translations={
ru:{
 summary:"Штрафы · официальные данные",subtitle:"2024–2026 · раскрыть",heading:"Штрафы и дорожные нарушения",
 desc:"Официальные отчёты полиции Израиля: сколько было оформлено документов о нарушениях и за что. Предупреждения и вызовы в суд показаны отдельно — не каждое оформление означает денежный штраф.",
 total:"Всего документов",fine:"Штрафные уведомления",warning:"Предупреждения",court:"Вызовы в суд",
 source:"Полиция Израиля · статистический ежегодник 2024, таблицы 4.30 и 4.31 ↗",portal:"Статистика полиции по регионам и видам нарушений ↗",
 period:"Официальная сводка",history:"Число оформленных документов по годам",split:"За что выписывают: доля по видам нарушений, 2024",
 noData:"За этот год пока нет проверенной сопоставимой годовой сводки полиции. Цифры не подставляем из новостей или взысканных платежей.",
 separate:"За 2025 и 2026 годы не найдена сопоставимая полная годовая разбивка по той же методике. Пропуски на графике — не нулевые значения.",
 shareNote:"Доли по видам нарушений приведены по отдельной таблице (база 1 093 779 записей, проценты округлены). Один документ может содержать несколько составов; это не количество уникальных водителей и не сумма взысканных денег.",
 definition:"Под «всеми документами» здесь понимаются штрафные уведомления, предупреждения и вызовы в суд на момент регистрации. Количество оформленных документов не равно числу оплаченных штрафов.",
 select:"Выберите год или столбец для подробностей.",bar:(year,value)=>year+": "+value+" оформленных документов",unknown:"Нет проверенных данных",
 comparison:(difference,pct)=>"Изменение к 2023 году: "+(difference>0?"+":"")+difference+" ("+(pct>0?"+":"")+pct+"%)",
 notice:"Не складываем с ДТП, публикациями СМИ и сообщениями Waze.",
 speed:"Превышение скорости",caution:"Непринятие мер предосторожности*",vehicle:"Технические нормы ТС",safety:"Средства безопасности",signs:"Манёвры и дорожные знаки",careless:"Неосторожное вождение",license:"Права, регистрация, страховка",parking:"Парковка",other:"Прочее",otherSigns:"Другие знаки",trafficLights:"Светофоры",remaining:"Остальные нарушения",asterisk:"* Включая использование телефона при управлении."
},
he:{
 summary:"דוחות תנועה · נתונים רשמיים",subtitle:"2024–2026 · להרחבה",heading:"דוחות תנועה ועבירות",
 desc:"נתוני השנתון הסטטיסטי של משטרת ישראל. דוחות ברירת משפט, אזהרות והזמנות לדין מוצגים בנפרד; לא כולם קנסות כספיים.",
 total:"כלל הדוחות",fine:"ברירת משפט",warning:"דוחות אזהרה",court:"הזמנות לדין",
 source:"שנתון משטרת ישראל 2024, לוחות 4.30 ו־4.31 ↗",portal:"מאגר מידע משטרתי ↗",
 period:"נתונים רשמיים",history:"דוחות תנועה לפי שנה",split:"התפלגות העבירות · 2024",
 noData:"טרם נמצא פרסום שנתי מלא ובר־השוואה לשנה זו. אין להציב מספרים מדיווחים או מתיקי גבייה.",
 separate:"לשנים 2025–2026 לא אומתו נתונים שנתיים מלאים זהים. נתון חסר אינו אפס.",
 shareNote:"אחוזים מתוך לוח נפרד (בסיס 1,093,779 רישומים, באחוזים מעוגלים). דוח יכול להכיל יותר מסוג עבירה אחד.",
 definition:"המספר כולל דוחות ברירת משפט, דוחות אזהרה והזמנות לדין בעת רישומם; אין להסיק ממנו על תשלום בפועל.",
 select:"בחרו שנה או עמודה.",bar:(y,v)=>y+": "+v+" דוחות",unknown:"אין נתונים מאומתים",
 comparison:(d,p)=>"שינוי לעומת 2023: "+(d>0?"+":"")+d+" ("+(p>0?"+":"")+p+"%)",
 notice:"אין לחבר למספר התאונות, ידיעות או דיווחי Waze.",
 speed:"מהירות",caution:"אי נקיטת אמצעי זהירות*",vehicle:"תקנות רכב",safety:"אמצעי בטיחות",signs:"סטיות ותמרורים",careless:"נהיגה בחוסר זהירות",license:"רישיונות וביטוח",parking:"חניה",other:"אחר",otherSigns:"תמרורים אחרים",trafficLights:"אי ציות לרמזור",remaining:"שאר העבירות",asterisk:"* לרבות שימוש בטלפון בעת נהיגה."
},
en:{
 summary:"Traffic fines · official data",subtitle:"2024–2026 · expand",heading:"Traffic enforcement reports",
 desc:"Official Israel Police yearbook figures. Fine notices, warnings and court summons are kept separate; not every notice represents a monetary fine.",
 total:"All reports",fine:"Fine notices",warning:"Warnings",court:"Court summons",
 source:"Israel Police 2024 yearbook · tables 4.30–4.31 ↗",portal:"Police statistics portal ↗",
 period:"Official figures",history:"Traffic enforcement reports by year",split:"Offence types · 2024 shares",
 noData:"No comparable, verified annual police breakdown is available for this year. News stories or fine-collection figures are not substituted.",
 separate:"Comparable complete annual totals for 2025 and 2026 have not been verified. Blank bars are missing, not zero.",
 shareNote:"Percentages belong to a separate table (base 1,093,779 records, rounded). A report may include multiple offence categories.",
 definition:"These figures count fine notices, warnings and court summons at issuance, not fines paid.",
 select:"Choose a year or bar for details.",bar:(y,v)=>y+": "+v+" reports",unknown:"Unverified",
 comparison:(d,p)=>"Change vs 2023: "+(d>0?"+":"")+d+" ("+(p>0?"+":"")+p+"%)",
 notice:"Never added to crash, news or Waze counts.",
 speed:"Speeding",caution:"Failure to take precautions*",vehicle:"Vehicle regulations",safety:"Safety equipment",signs:"Manoeuvres and signs",careless:"Careless driving",license:"Licences and insurance",parking:"Parking",other:"Other",otherSigns:"Other sign violations",trafficLights:"Traffic lights",remaining:"Remaining offences",asterisk:"* Including mobile-phone use while driving."
},
ar:{
 summary:"المخالفات المرورية · بيانات رسمية",subtitle:"2024–2026 · توسيع",heading:"المخالفات وتقارير الشرطة",
 desc:"من التقرير الإحصائي الرسمي لشرطة إسرائيل. نفرق بين مخالفات الغرامة والتحذيرات والاستدعاءات للمحكمة؛ ليس كلها غرامات مدفوعة.",
 total:"إجمالي التقارير",fine:"إشعارات الغرامة",warning:"التحذيرات",court:"الاستدعاء للمحكمة",
 source:"تقرير الشرطة 2024 · الجدولان 4.30 و4.31 ↗",portal:"قاعدة بيانات الشرطة ↗",
 period:"بيانات رسمية",history:"التقارير المرورية حسب السنة",split:"أنواع المخالفات · نسب 2024",
 noData:"لا يتوفر تقرير سنوي كامل قابل للمقارنة ومؤكد لهذه السنة. لا نستخدم أرقام الأخبار أو التحصيل.",
 separate:"لا تتوفر أرقام سنوية متطابقة ومؤكدة لعامي 2025 و2026. الفراغ لا يعني صفر.",
 shareNote:"النسب من جدول منفصل (أساس 1,093,779 سجلًا، النسب مقربة). قد يتضمن التقرير أكثر من نوع مخالفة.",
 definition:"يشمل الإجمالي الإشعارات والتحذيرات والاستدعاءات عند تسجيلها، لا المدفوعات الفعلية.",
 select:"اختر سنة أو عموداً.",bar:(y,v)=>y+": "+v+" تقرير",unknown:"غير متاح",
 comparison:(d,p)=>"التغير عن 2023: "+(d>0?"+":"")+d+" ("+(p>0?"+":"")+p+"%)",
 notice:"لا تُجمع مع الحوادث أو الأخبار أو بلاغات Waze.",
 speed:"السرعة الزائدة",caution:"عدم اتخاذ الاحتياطات*",vehicle:"لوائح المركبات",safety:"معدات السلامة",signs:"المناورات والإشارات",careless:"القيادة بإهمال",license:"التراخيص والتأمين",parking:"الوقوف",other:"أخرى",otherSigns:"إشارات أخرى",trafficLights:"الإشارات الضوئية",remaining:"بقية المخالفات",asterisk:"* يشمل استخدام الهاتف أثناء القيادة."
}
};
let year=2024,rendered=false;
const lang=()=>translations[document.documentElement.lang]?document.documentElement.lang:"ru";
const loc={ru:"ru-RU",he:"he-IL",en:"en-GB",ar:"ar"};
const num=n=>new Intl.NumberFormat(loc[lang()]).format(n);
const text=(name,value)=>{const e=id(name);if(e)e.textContent=value};
function yearNav(){
 const row=id("finesYears");row.replaceChildren();
 for(const y of [2024,2025,2026]){
  const b=document.createElement("button");
  b.className="fines-year";b.type="button";b.textContent=String(y);b.setAttribute("aria-pressed",String(y===year));
  b.onclick=()=>{year=y;render()};
  row.append(b);
 }
}
function render(){
 const t=translations[lang()];
 text("roadFinesTitle",t.summary);text("roadFinesSubtitle",t.subtitle);
 if(!root.open&&!rendered)return;
 rendered=true;
 for(const [idName,key] of Object.entries({
 finesHeading:"heading",finesIntro:"desc",finesPeriod:"period",
 finesHistoryTitle:"history",finesDistributionTitle:"split",finesDefinition:"definition",
 finesNotice:"notice",finesSource:"source",finesPolicePortal:"portal"}))text(idName,t[key]);
 id("finesSource").href=policePDF;
 yearNav();
 const current=report[year],cards=id("finesCards");
 cards.replaceChildren();
 if(current){
  for(const key of ["total","fine","warning","court"]){
   const card=document.createElement("div");card.className="fines-stat-card";
   const n=document.createElement("strong");n.textContent=num(current[key]);
   const label=document.createElement("span");label.textContent=t[key];card.append(n,label);cards.append(card);
  }
  const difference=current.total-report[2023].total;
  text("finesPeriod",t.period+" · "+year);
  text("finesStatus",year===2024?t.comparison(num(difference),((difference/report[2023].total)*100).toFixed(1)):t.period);
 }else{
  const no=document.createElement("p");no.className="fines-missing-notice";no.textContent=t.noData;cards.append(no);
  text("finesPeriod",t.period+" · "+year);
  text("finesStatus",t.separate);
 }
 const bars=id("finesHistoryChart");bars.replaceChildren();
 const highest=1201322;
 for(const y of [2022,2023,2024,2025,2026]){
  const r=report[y],box=document.createElement("div");
  box.className="fines-history-column"+(r?"":" is-missing")+(y===year?" is-selected":"");
  if(y>=2024){
   box.tabIndex=0;box.role="button";
   box.onclick=()=>{year=y;render()};
   box.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();year=y;render()}};
  }
  const n=document.createElement("strong");n.textContent=r?num(r.total):"—";
  const rail=document.createElement("span");rail.className="fines-history-rail";
  const bar=document.createElement("span");bar.className="fines-history-bar";
  if(r)bar.style.height=Math.max(3,Math.round(r.total/highest*100))+"%";
  rail.append(bar);
  const label=document.createElement("small");label.textContent=y;
  box.title=r?t.bar(y,num(r.total)):t.unknown;
  box.append(n,rail,label);bars.append(box);
 }
 text("finesHistoryNote",t.separate);
 const distribution=id("finesOffences");distribution.replaceChildren();
 for(const [key,percent] of offenceShares){
  const row=document.createElement("div");row.className="fines-offence-row";
  const label=document.createElement("span");label.className="fines-offence-label";label.textContent=t[key];
  const track=document.createElement("span");track.className="fines-offence-track";
  const progress=document.createElement("span");progress.className="fines-offence-fill";progress.style.width=(percent/21*100)+"%";
  track.append(progress);
  const value=document.createElement("strong");value.textContent=percent+"%";
  row.append(label,track,value);distribution.append(row);
 }
 text("finesShareNote",t.shareNote+" "+t.asterisk);
}
root.addEventListener("toggle",()=>{if(root.open)render()});
window.addEventListener("neoline:news-language",render);
render();
})();
