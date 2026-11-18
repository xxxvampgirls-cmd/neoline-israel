/* NEOLINE Israel • Official annual road-safety figures.
   Data: Israel CBS (lamas), expanded road accidents with casualties.
   2024/2025 final; 2026 provisional as of September 2026 (25 Oct release).
   Deliberately independent of the 30-day NEWS-item chart.
   New CBS monthly releases must be verified and entered here; this file does
   not claim that government statistics refresh every day. */
(()=>{
"use strict";
const root=document.getElementById("accidentAnnual");
if(!root)return;
const $=id=>document.getElementById(id);
const months={
 ru:["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],
 he:["ינו׳","פבר׳","מרץ","אפר׳","מאי","יונ׳","יול׳","אוג׳","ספט׳","אוק׳","נוב׳","דצמ׳"],
 en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
 ar:["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"]
};
const records={
 2022:{deaths:351,fatal:319,crashes:10404},
 2023:{deaths:361,fatal:338,crashes:8832},
 2024:{
  deaths:[33,26,45,41,45,43,31,33,36,40,21,45],
  fatal:[29,26,40,38,42,37,30,31,33,40,19,40],
  crashes:[783,772,765,708,752,660,740,628,696,604,601,606]},
 2025:{
  deaths:[38,28,53,36,38,30,49,38,42,42,31,34],
  fatal:[35,27,49,36,36,28,47,35,40,41,30,34],
  crashes:[670,582,761,670,742,602,662,636,655,627,607,503]},
 2026:{
  deaths:[35,38,27,38,39,39,38,46,41],
  fatal:[34,33,23,36,34,37,37,43,38],
  crashes:[575,528,455,567,598,579,547,536,409]}
};
const labels={
 ru:{summary:"Годовая статистика ДТП",summaryHint:"Официальные данные · раскрыть",heading:"Аварийность на дорогах Израиля",intro:"Сравните месяцы, найдите пики и проследите динамику по официальным отчётам. Эти числа не складываются с сообщениями из новостной ленты.",deaths:"Погибшие",fatal:"Смертельные ДТП",crashes:"ДТП с пострадавшими",provisional:"2026 · предварительные данные, январь–сентябрь",final:"Итог года · окончательные данные",peak:"Максимум за период",month:"Месяц",monthDetail:(m,v,type)=>m+": "+v+" · "+type,select:"Нажмите на столбец, чтобы узнать число за месяц.",comparison:(amount,pct,prior,range)=>"К "+range+" "+prior+": "+(amount>0?"+":"")+amount+" ("+(pct>0?"+":"")+pct.toFixed(1)+"%)",range:"сентябрю",yearly:"Погибшие по годам · завершённые годы",sources:"Первоисточники:",source2025:"Годовой отчёт ЦСБ · 2025",source2026:"Месячный отчёт ЦСБ · сентябрь 2026",sourceQuarter:"Транспортный квартальный сборник ЦСБ",sourceMap:"Официальная карта ДТП",note:"Учитываются зарегистрированные ДТП с пострадавшими по категории ЦСБ «ת״ד מורחב» (включая Иудею и Самарию). Это не все дорожные инциденты, включая аварии только с материальным ущербом. 2026 год предварительный, данные обновляются ЦСБ с задержкой; последний учтённый месяц — сентябрь 2026, публикация — 25.10.2026.",missing:"Нет отчёта",noMerge:"Источники сверены, а не сложены: полиция передаёт данные в ЦСБ; публикации СМИ и страховые обращения не прибавляются.",full:"Полный год",partial:"Янв–сен",chart:"Официальная месячная статистика ДТП",fatalVsDeaths:"В одной смертельной аварии могут погибнуть несколько человек."},
 he:{summary:"נתונים שנתיים על תאונות",summaryHint:"נתונים רשמיים · הרחבה",heading:"בטיחות בדרכים בישראל",intro:"השוו חודשים וגלו את החודשים עם הנתונים הגבוהים ביותר. לא מחברים את המספרים עם ידיעות החדשות.",deaths:"הרוגים",fatal:"תאונות קטלניות",crashes:"תאונות עם נפגעים",provisional:"2026 · נתונים ארעיים, ינואר–ספטמבר",final:"שנה מלאה · נתונים סופיים",peak:"חודש שיא",month:"חודש",monthDetail:(m,v,type)=>m+": "+v+" · "+type,select:"לחצו על עמודה לפרטים לפי חודש.",comparison:(n,p,y,range)=>"בהשוואה ל"+range+" "+y+": "+(n>0?"+":"")+n+" ("+(p>0?"+":"")+p.toFixed(1)+"%)",range:"ספטמבר",yearly:"הרוגים לפי שנה · שנים מלאות",sources:"מקורות רשמיים:",source2025:"סיכום הלמ״ס 2025",source2026:"דוח הלמ״ס · ספטמבר 2026",sourceQuarter:"רבעון סטטיסטי לתחבורה",sourceMap:"מפת תאונות רשמית",note:"נתוני תאונות עם נפגעים מסוג ת״ד מורחב (כולל יהודה ושומרון). לא כל התאונות, ובפרט לא תאונות נזק בלבד. 2026 ארעי; הנתון האחרון: ספטמבר 2026, פורסם 25.10.2026.",missing:"אין נתונים",noMerge:"נתוני המשטרה משולבים בלמ״ס, ולא מוסיפים להם דיווחים מהחדשות או מחברות הביטוח.",full:"שנה מלאה",partial:"ינו׳–ספט׳",chart:"תאונות דרכים לפי חודש",fatalVsDeaths:"בתאונה קטלנית אחת יכולים להיהרג יותר מאדם אחד."},
 en:{summary:"Annual crash statistics",summaryHint:"Official figures · expand",heading:"Road safety in Israel",intro:"Explore monthly peaks and trends from official reports. These totals are separate from news-article counts.",deaths:"People killed",fatal:"Fatal crashes",crashes:"Crashes with casualties",provisional:"2026 · provisional, January–September",final:"Full year · final figures",peak:"Peak month",month:"Month",monthDetail:(m,v,type)=>m+": "+v+" · "+type,select:"Choose a bar to inspect a month.",comparison:(n,p,y,range)=>"Compared with "+range+" "+y+": "+(n>0?"+":"")+n+" ("+(p>0?"+":"")+p.toFixed(1)+"%)",range:"September",yearly:"Road deaths by complete year",sources:"Primary sources:",source2025:"CBS annual report · 2025",source2026:"CBS monthly report · September 2026",sourceQuarter:"CBS transport quarterly",sourceMap:"Official crash map",note:"Expanded road accidents with casualties, including Judea and Samaria, per CBS definition. This excludes property-damage-only incidents and is not a count of all road incidents. 2026 is provisional; latest included month September 2026 (released 25 Oct 2026).",missing:"Not reported",noMerge:"Police data feed CBS statistics. Press articles and insurance claims are not added again.",full:"Full year",partial:"Jan–Sep",chart:"Monthly road-safety figures",fatalVsDeaths:"One fatal crash may involve more than one death."},
 ar:{summary:"إحصاءات حوادث الطرق السنوية",summaryHint:"بيانات رسمية · توسيع",heading:"السلامة على الطرق في إسرائيل",intro:"قارن الأشهر والذروات وفق التقارير الرسمية. الأرقام منفصلة عن عدّ الأخبار.",deaths:"الوفيات",fatal:"الحوادث المميتة",crashes:"حوادث مع إصابات",provisional:"2026 · بيانات أولية حتى سبتمبر",final:"العام الكامل · بيانات نهائية",peak:"الشهر الأعلى",month:"الشهر",monthDetail:(m,v,type)=>m+": "+v+" · "+type,select:"اضغط على العمود لمعرفة العدد الشهري.",comparison:(n,p,y,range)=>"مقارنة حتى "+range+" "+y+": "+(n>0?"+":"")+n+" ("+(p>0?"+":"")+p.toFixed(1)+"%)",range:"سبتمبر",yearly:"وفيات الطرق خلال سنوات مكتملة",sources:"المصادر الرسمية:",source2025:"التقرير السنوي للإحصاء 2025",source2026:"تقرير سبتمبر 2026",sourceQuarter:"الإحصاءات الفصلية للنقل",sourceMap:"خريطة الحوادث الرسمية",note:"تشمل حوادث الطرق مع إصابات حسب تعريف المكتب المركزي للإحصاء، بما فيها يهودا والسامرة؛ لا تشمل حوادث أضرار الممتلكات فقط. أرقام 2026 أولية حتى سبتمبر، نُشرت في 25 أكتوبر 2026.",missing:"لا توجد بيانات",noMerge:"مصدر بيانات الشرطة يُستخدم لدى المكتب المركزي؛ لا نضيف الأخبار أو مطالبات التأمين مرة أخرى.",full:"سنة كاملة",partial:"ينا–سبت",chart:"إحصاءات شهرية",fatalVsDeaths:"قد تسفر حادثة مميتة واحدة عن أكثر من وفاة."}
};
let year=2026,metric="deaths",chosen=-1,drawn=false;
const lang=()=>labels[document.documentElement.lang]?document.documentElement.lang:"ru";
const total=(y,k)=>Array.isArray(records[y][k])?records[y][k].reduce((a,b)=>a+b,0):records[y][k];
const monthCount=y=>records[y].deaths.length;
const num=(n,l=lang())=>new Intl.NumberFormat({ru:"ru-RU",he:"he-IL",en:"en-GB",ar:"ar"}[l]).format(n);
function action(id,items,selected,fn,format){
 const holder=$(id);holder.replaceChildren();
 for(const v of items){
  const button=document.createElement("button");button.type="button";button.className="accident-annual-toggle";button.textContent=format(v);
  button.setAttribute("aria-pressed",String(v===selected));
  button.addEventListener("click",()=>{fn(v);render()});holder.append(button);
 }
}
function render(){
 const l=lang(),t=labels[l],record=records[year],values=record[metric],period=monthCount(year),count=total(year,metric);
 const peak=Math.max(...values),peakIndex=values.indexOf(peak),max=Math.max(1,peak);
 $("accidentAnnualTitle").textContent=t.summary;
 $("accidentAnnualSubtitle").textContent=t.summaryHint;
 if(!root.open&&!drawn)return;
 drawn=true;
 $("accidentAnnualHeading").textContent=t.heading;
 $("accidentAnnualIntro").textContent=t.intro;
 $("accidentAnnualPeriod").textContent=year===2026?t.provisional:t.final;
 $("accidentAnnualNote").textContent=t.note+" "+t.noMerge;
 $("accidentAnnualSecondary").textContent=t.fatalVsDeaths;
 $("accidentAnnualHistoryTitle").textContent=t.yearly;
 $("accidentAnnualSourcesTitle").textContent=t.sources;
 $("annualSource2025").textContent=t.source2025+" ↗";
 $("annualSource2026").textContent=t.source2026+" ↗";
 $("annualSourceQuarter").textContent=t.sourceQuarter+" ↗";
 $("annualSourceMap").textContent=t.sourceMap+" ↗";
 action("accidentAnnualYears",[2024,2025,2026],year,v=>{year=v;chosen=-1},String);
 action("accidentAnnualMetrics",["deaths","fatal","crashes"],metric,v=>{metric=v;chosen=-1},v=>t[v]);
 const summary=$("accidentAnnualCards");summary.replaceChildren();
 for(const kind of ["deaths","fatal","crashes"]){
  const card=document.createElement("div");card.className="accident-annual-card";
  if(kind===metric)card.classList.add("is-current");
  const value=document.createElement("strong");value.textContent=num(total(year,kind),l);
  const name=document.createElement("span");name.textContent=t[kind];
  const periodText=document.createElement("small");periodText.textContent=year===2026?t.partial:t.full;
  card.append(value,name,periodText);summary.append(card);
 }
 const previous=records[year-1],compare=previous?(Array.isArray(previous[metric])?previous[metric].slice(0,period).reduce((a,b)=>a+b,0):previous[metric]):0;
 const delta=count-compare,pct=compare?delta/compare*100:0;
 $("accidentAnnualComparison").textContent=previous?t.comparison(delta,pct,year-1,year===2026?t.range:t.full):"";
 $("accidentAnnualPeak").textContent=t.peak+": "+months[l][peakIndex]+" · "+num(peak,l)+" "+t[metric].toLowerCase();
 const chart=$("accidentAnnualChart");chart.replaceChildren();
 chart.setAttribute("aria-label",t.chart+" · "+year+" · "+t[metric]);
 const sourceMonths=months[l];
 for(let i=0;i<12;i++){
  const val=values[i],has=Number.isFinite(val),item=document.createElement(has?"button":"div");
  if(has){item.type="button";item.className="accident-annual-month";item.setAttribute("aria-pressed",String(chosen===i));item.setAttribute("aria-label",t.monthDetail(sourceMonths[i],num(val,l),t[metric]));item.title=item.getAttribute("aria-label");
   item.addEventListener("click",()=>{chosen=i;render()});}
  else{item.className="accident-annual-month is-missing";item.title=t.missing;}
  if(i===peakIndex)item.classList.add("is-peak");
  const n=document.createElement("span");n.className="accident-annual-month-num";n.textContent=has?num(val,l):"—";
  const rail=document.createElement("span");rail.className="accident-annual-month-rail";
  const bar=document.createElement("span");bar.className="accident-annual-month-bar";
  if(has)bar.style.height=Math.max(5,Math.round(val/max*100))+"%";
  rail.append(bar);
  const name=document.createElement("span");name.className="accident-annual-month-label";name.textContent=sourceMonths[i];
  item.append(n,rail,name);chart.append(item);
 }
 $("accidentAnnualDetail").textContent=chosen>=0&&chosen<values.length?t.monthDetail(sourceMonths[chosen],num(values[chosen],l),t[metric]):t.select;
 const history=$("accidentAnnualHistory");history.replaceChildren();
 for(const yr of [2022,2023,2024,2025]){
  const box=document.createElement("div");box.className="accident-annual-history-col";
  const value=total(yr,"deaths"),countText=document.createElement("strong");countText.textContent=num(value,l);
  const rail=document.createElement("span");rail.className="accident-annual-history-rail";
  const bar=document.createElement("span");bar.style.height=Math.round(value/500*100)+"%";bar.className="accident-annual-history-bar";rail.append(bar);
  const label=document.createElement("small");label.textContent=yr;
  box.append(countText,rail,label);history.append(box);
 }
}
root.addEventListener("toggle",()=>{if(root.open)render()});
window.addEventListener("neoline:news-language",render);
render();
})();