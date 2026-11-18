/* NEOLINE driving licence picker: custom mobile-friendly modal.
   Original #licenseSelect retains the saved-choice/game-bank logic. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const select=$("licenseSelect"),openButton=$("theoryLicenceOpen"),dialog=$("theoryLicenceDialog");
const options=$("theoryLicenceOptions"),closeButton=$("theoryLicenceClose"),current=$("theoryLicenceCurrent");
if(!select||!openButton||!dialog||!options)return;
const categories=[
 {code:"B",icon:"🚙"},
 {code:"A",icon:"🏍️"},
 {code:"C1",icon:"🚚"},
 {code:"C",icon:"🚛"},
 {code:"D",icon:"🚌"},
 {code:"1",icon:"🚜"}
];
const dict={
 ru:{title:"Категория прав",hint:"Выбери транспорт. Банк вопросов и прогресс переключатся автоматически.",close:"Закрыть окно выбора прав",option:"Категория",names:{B:"Легковые автомобили",A:"Мотоциклы",C1:"Лёгкие грузовики",C:"Грузовые автомобили",D:"Автобусы",1:"Тракторы"}},
 en:{title:"Licence category",hint:"Choose a vehicle category. Questions and progress will switch automatically.",close:"Close licence category chooser",option:"Category",names:{B:"Cars",A:"Motorcycles",C1:"Light trucks",C:"Heavy trucks",D:"Buses",1:"Tractors"}},
 he:{title:"דרגת רישיון",hint:"בחרו סוג רכב. השאלות וההתקדמות יתעדכנו אוטומטית.",close:"סגירת בחירת דרגת הרישיון",option:"דרגה",names:{B:"רכב פרטי",A:"אופנועים",C1:"משאית קלה",C:"משאית כבדה",D:"אוטובוסים",1:"טרקטורים"}},
 ar:{title:"فئة رخصة القيادة",hint:"اختر فئة المركبة. سيتم تحديث الأسئلة والتقدم تلقائيًا.",close:"إغلاق اختيار فئة الرخصة",option:"الفئة",names:{B:"سيارات خاصة",A:"دراجات نارية",C1:"شاحنات خفيفة",C:"شاحنات",D:"حافلات",1:"جرارات"}}
};
const lang=()=>{const l=String(document.documentElement.lang||"ru").split("-")[0].toLowerCase();return dict[l]?l:"ru"};
let lastOpenButton=null;
function refreshLabel(){
 const chosen=categories.find(x=>x.code===select.value)||categories[0];
 current.textContent=chosen.code+" · "+chosen.icon;
 openButton.setAttribute("aria-label",dict[lang()].title+": "+chosen.code);
 openButton.setAttribute("title",dict[lang()].title+": "+chosen.code);
}
function render(){
 const d=dict[lang()],isRTL=["he","ar"].includes(lang());
 $("theoryLicenceDialogTitle").textContent=d.title;
 $("theoryLicenceDialogDescription").textContent=d.hint;
 closeButton.setAttribute("aria-label",d.close);
 options.setAttribute("aria-label",d.title);
 dialog.lang=lang();dialog.dir=isRTL?"rtl":"ltr";
 options.replaceChildren();
 const chosen=select.value;
 for(const item of categories){
  const row=document.createElement("button");row.type="button";
  row.className="theory-licence-option"+(chosen===item.code?" is-active":"");
  row.dataset.licence=item.code;
  row.setAttribute("aria-pressed",String(chosen===item.code));
  row.setAttribute("aria-label",d.option+" "+item.code+": "+d.names[item.code]);
  const icon=document.createElement("span");icon.className="theory-licence-option__icon";
  icon.setAttribute("aria-hidden","true");icon.textContent=item.icon;
  const body=document.createElement("span");body.className="theory-licence-option__text";
  const code=document.createElement("strong");code.textContent=item.code;
  const name=document.createElement("small");name.textContent=d.names[item.code];
  body.append(code,name);
  const mark=document.createElement("span");mark.className="theory-licence-option__mark";
  mark.setAttribute("aria-hidden","true");mark.textContent="✓";
  row.append(icon,body,mark);
  row.addEventListener("click",()=>{
   if(select.value!==item.code){
    select.value=item.code;
    select.dispatchEvent(new Event("change",{bubbles:true}));
   }
   refreshLabel();
   close();
  });
  options.append(row);
 }
 refreshLabel();
}
function open(){
 render();lastOpenButton=openButton;
 if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal()}
 else dialog.setAttribute("open","");
 openButton.setAttribute("aria-expanded","true");
 const active=options.querySelector(".is-active");
 (active||options.querySelector("button"))?.focus({preventScroll:true});
}
function close(){
 if(typeof dialog.close==="function"&&dialog.open)dialog.close();
 else{dialog.removeAttribute("open");resetFocus()}
}
function resetFocus(){
 openButton.setAttribute("aria-expanded","false");
 if(lastOpenButton?.isConnected)lastOpenButton.focus({preventScroll:true});
 lastOpenButton=null;
}
openButton.addEventListener("click",open);
closeButton?.addEventListener("click",close);
select.addEventListener("change",()=>{refreshLabel();if(dialog.open)render()});
dialog.addEventListener("close",resetFocus);
dialog.addEventListener("click",event=>{if(event.target===dialog)close()});
dialog.addEventListener("keydown",event=>{if(event.key==="Escape"&&typeof dialog.close!=="function"){event.preventDefault();close()}});
new MutationObserver(()=>{refreshLabel();if(dialog.open)render()})
.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
refreshLabel();
})();