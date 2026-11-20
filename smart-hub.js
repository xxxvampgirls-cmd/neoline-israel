/* NEOLINE Smart Hub: rule-based model finder, facts-backed comparison and
   on-device saved model. No personal data, fake stock, external libraries or
   unsupported performance claims. Uses existing NEOLINE_DETAILS manufacturer
   specs; only original eight models have verified comparable specifications. */
(()=>{
"use strict";
const root=document.getElementById("smartHub"),api=window.NEOLINE_DETAILS;
if(!root||!api)return;
const names={
 1:"NEOLINE WowCam Wi-Fi",2:"NEOLINE Flash 2K Wi-Fi",
 3:"NEOLINE Flash 2K Wi-Fi Dual",4:"NEOLINE EasyDrive 2K Wi-Fi Dual",
 5:"NEOLINE Argus 4K",6:"NEOLINE Argus 4K Dual",
 7:"NEOLINE SmartWay",8:"NEOLINE G-Tech X54 Dual"
};
const ids=Object.keys(names).map(Number);
const savedKey="neoline:saved-device:v1";
const words={
 ru:{kick:"УМНЫЙ ВЫБОР",title:"Найдите свой NEOLINE",sub:"Сравните характеристики, получите подсказку по выбору и сохраните свою модель. Только данные производителя — без выдуманных возможностей.",
 tabs:["Подбор камеры","Сравнение","Моё устройство"],
 findTitle:"Какая камера подойдёт?",findIntro:"Два ответа — и мы покажем модели, которые соответствуют выбранным характеристикам.",
 camera:"Количество камер",camOpts:["Не важно","Одна камера","Передняя + задняя"],focus:"Что важнее?",focusOpts:["Максимальное разрешение","GPS","Компактность","Парковочный режим","Экран"],
 match:"Подходит по характеристикам",open:"Подробнее",compare:"Сравнить",resultNote:"Подбор основан на опубликованных характеристиках производителя. Это не рейтинг качества и не рекомендация о покупке.",
 compareTitle:"Сравните до 3 моделей",compareIntro:"Различия видны сразу. Все значения взяты из карточек производителя.",model:"Модель",
 choose:"Выберите модель",third:"Третья модель (необязательно)",already:"Модели не должны повторяться.",compareNote:"Данные из описаний NEOLINE. Наличие функций, комплектация и совместимость зависят от версии устройства и региона. Цены магазина демонстрационные.",
 ownerTitle:"Ваш NEOLINE + Академия",ownerIntro:"Сохраните устройство на этом телефоне: руководство, проверенные параметры и обновления будут рядом.",
 ownerPick:"Ваше устройство",save:"Сохранить на этом устройстве",saved:"Сохранено в этом браузере · без регистрации",manual:"Руководство производителя (RU) ↗",source:"Официальная карточка ↗",updates:"Обновления и приложения",updateHide:"Скрыть обновления",
 lessons:["Первое подключение","Приложение и Wi-Fi","Прошивки и поддержка"],lessonText:["Выберите место установки, закрепите регистратор и проверьте питание. Следуйте инструкции именно своей модели.","Смотрите название приложения в характеристиках модели. Перед подключением проверьте настройки Wi-Fi.","Устанавливайте только прошивку для точной модели, аппаратной версии и региона; не отключайте питание."],
 academyNote:"Это краткая памятка, а не замена официальной инструкции. Видеоуроки можно открыть в карточке соответствующей модели.",
 noManual:"Для этой модели подтверждённая PDF-инструкция пока не добавлена.",details:"Открыть карточку",rows:["Передняя камера","Задняя камера","Количество камер","GPS","Wi-Fi и связь","Экран","Парковочный режим","Приложение","Карты памяти"],notProvided:"—",yes:"Да",no:"Нет"},
 en:{kick:"SMART CHOICE",title:"Find your NEOLINE",sub:"Compare specifications, explore a guided finder and save your model. Manufacturer facts only.",
 tabs:["Camera finder","Compare models","My device"],
 findTitle:"Which camera suits you?",findIntro:"Two choices reveal models matching your selected specifications.",
 camera:"Cameras",camOpts:["Any","Front only","Front + rear"],focus:"Main priority",focusOpts:["High resolution","GPS","Compact size","Parking mode","Display"],
 match:"Matches your preferences",open:"Explore details",compare:"Compare",resultNote:"Matching is based on manufacturer specifications, not independent testing or a purchase endorsement.",
 compareTitle:"Compare up to 3 models",compareIntro:"Explore the differences, using published device specifications.",model:"Model",
 choose:"Select a model",third:"Third model (optional)",already:"Select different models.",compareNote:"Manufacturer specifications. Features, box contents and regional compatibility may vary. Store prices are illustrative.",
 ownerTitle:"Your NEOLINE + Academy",ownerIntro:"Keep a device profile on this phone, with manuals, specifications and update support.",
 ownerPick:"Your device",save:"Save on this device",saved:"Saved in this browser · no account needed",manual:"Manufacturer manual (RU) ↗",source:"Official product page ↗",updates:"Updates and apps",updateHide:"Hide updates",
 lessons:["First-time setup","App and Wi-Fi","Firmware and support"],lessonText:["Mount securely, connect suitable power and follow the exact model's manual.","Check which app the model uses and follow its Wi-Fi pairing instructions.","Only use firmware for the exact model, hardware revision and region; keep power connected."],
 academyNote:"A quick guide, not a replacement for official instructions. Open the product details for its videos.",
 noManual:"A verified PDF manual has not been added for this model.",details:"Open product details",rows:["Front video","Rear video","Cameras","GPS","Wi-Fi / connection","Screen","Parking mode","Phone app","Memory card"],notProvided:"—",yes:"Yes",no:"No"},
 he:{kick:"בחירה חכמה",title:"מוצאים את ה-NEOLINE שלכם",sub:"השוואת מפרטים, התאמה לפי צרכים ושמירת דגם במכשיר. מידע מבוסס יצרן בלבד.",
 tabs:["בחירת מצלמה","השוואת דגמים","המכשיר שלי"],
 findTitle:"איזו מצלמה מתאימה?",findIntro:"בחרו שתי העדפות וראו דגמים מתאימים לפי מפרט היצרן.",
 camera:"מספר מצלמות",camOpts:["לא משנה","קדמית בלבד","קדמית ואחורית"],focus:"מה הכי חשוב?",focusOpts:["רזולוציה גבוהה","GPS","גודל קומפקטי","מצב חניה","מסך"],
 match:"מתאים להעדפות",open:"לפרטים",compare:"השוואה",resultNote:"ההתאמה מבוססת על מפרט היצרן, ולא על בדיקה עצמאית או המלצת רכישה.",
 compareTitle:"השוו עד 3 דגמים",compareIntro:"הבדלים לפי מאפייני היצרן.",model:"דגם",
 choose:"בחרו דגם",third:"דגם שלישי (לא חובה)",already:"יש לבחור דגמים שונים.",compareNote:"מפרט היצרן. התכונות והתאימות עשויות להשתנות לפי אזור וגרסת חומרה. המחירים באתר להמחשה בלבד.",
 ownerTitle:"ה-NEOLINE שלי + הדרכה",ownerIntro:"שמרו את הדגם בטלפון וצפו במדריך ובמידע על עדכונים.",
 ownerPick:"המכשיר שלכם",save:"שמירה במכשיר",saved:"נשמר בדפדפן · ללא הרשמה",manual:"מדריך יצרן (רוסית) ↗",source:"דף הדגם הרשמי ↗",updates:"עדכונים ואפליקציות",updateHide:"הסתרת עדכונים",
 lessons:["חיבור ראשון","אפליקציה ו-Wi-Fi","קושחה ותמיכה"],lessonText:["התקינו את המצלמה, חברו מתח מתאים ופעלו לפי המדריך לדגם המדויק.","בדקו במפרט מהו שם האפליקציה ואת הוראות החיבור לרשת.","השתמשו רק בקושחה המתאימה לדגם, לגרסת החומרה ולאזור. אין לנתק מתח במהלך העדכון."],
 academyNote:"הסבר מקוצר בלבד, לא תחליף למדריך הרשמי. סרטונים זמינים בפרטי הדגם.",
 noManual:"לא נוסף מדריך PDF מאומת לדגם זה.",details:"פתיחת פרטי הדגם",rows:["צילום קדמי","צילום אחורי","מצלמות","GPS","חיבור אלחוטי","מסך","מצב חניה","אפליקציה","כרטיס זיכרון"],notProvided:"—",yes:"כן",no:"לא"},
 ar:{kick:"اختيار ذكي",title:"اعثر على NEOLINE المناسب",sub:"قارن المواصفات واختر وفق احتياجاتك واحفظ جهازك. بيانات الشركة المصنعة فقط.",
 tabs:["اختيار الكاميرا","مقارنة الطرازات","جهازي"],
 findTitle:"أي كاميرا تناسبك؟",findIntro:"اختر تفضيلين لعرض الطرازات المتوافقة مع المواصفات المنشورة.",
 camera:"عدد الكاميرات",camOpts:["لا يهم","أمامية فقط","أمامية وخلفية"],focus:"الأولوية",focusOpts:["دقة عالية","GPS","حجم صغير","وضع الوقوف","الشاشة"],
 match:"متوافق مع التفضيلات",open:"تفاصيل",compare:"مقارنة",resultNote:"الاختيار يعتمد على مواصفات الشركة ولا يمثل اختباراً مستقلاً أو توصية شراء.",
 compareTitle:"قارن حتى 3 طرازات",compareIntro:"اطّلع على الفروق وفق مواصفات الشركة المصنعة.",model:"الطراز",
 choose:"اختر طرازاً",third:"الطراز الثالث (اختياري)",already:"اختر طرازات مختلفة.",compareNote:"المعلومات من الشركة. قد تختلف الميزات والتوافق حسب المنطقة وإصدار الجهاز. الأسعار توضيحية فقط.",
 ownerTitle:"جهازي + الأكاديمية",ownerIntro:"احفظ جهازك في هذا الهاتف للرجوع إلى الدليل والتحديثات.",
 ownerPick:"جهازك",save:"حفظ على هذا الجهاز",saved:"محفوظ في المتصفح · دون حساب",manual:"دليل الشركة (بالروسية) ↗",source:"صفحة المنتج الرسمية ↗",updates:"التحديثات والتطبيقات",updateHide:"إخفاء التحديثات",
 lessons:["الإعداد لأول مرة","التطبيق وWi-Fi","البرامج الثابتة والدعم"],lessonText:["ثبّت الكاميرا ووصل التغذية المناسبة واتبع دليل طرازك المحدد.","تحقق من اسم التطبيق وإرشادات الاتصال بالشبكة حسب الطراز.","استخدم فقط البرامج الثابتة المتوافقة مع الطراز وإصدار العتاد والمنطقة. لا تفصل الطاقة أثناء التحديث."],
 academyNote:"دليل مختصر لا يغني عن تعليمات الشركة الرسمية. يمكن فتح فيديوهات المنتج من تفاصيله.",
 noManual:"لم يُضف بعد دليل PDF مؤكد لهذا الطراز.",details:"فتح تفاصيل المنتج",rows:["الفيديو الأمامي","الفيديو الخلفي","الكاميرات","GPS","الاتصال اللاسلكي","الشاشة","وضع الوقوف","التطبيق","بطاقة الذاكرة"],notProvided:"—",yes:"نعم",no:"لا"}
};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl=u=>{try{const x=new URL(u);return x.protocol==="https:"&&["neoline.ru","neoline.com","www.neoline.com"].includes(x.hostname)?x.href:null}catch{return null}};
const locale=()=>{const v=String(document.documentElement.lang||"ru").split("-")[0];return words[v]?v:"ru"};
const tx=()=>words[locale()];
const raw=(id)=>api.read(Number(id),"en");
const shown=(id)=>api.read(Number(id),locale());
const field=(r,key)=>r.specs.find(x=>x.key===key)?.value||"";
const has=(id,key)=>{
 const r=raw(id);if(!r)return false;
 if(key==="4k")return /4K|3840×2160/.test(field(r,"front"));
 if(key==="gps")return /^(Yes|GPS)/i.test(field(r,"GPS"));
 if(key==="wifi")return /Wi-Fi/i.test(field(r,"wireless"));
 if(key==="park")return /^Yes$/i.test(field(r,"parking"));
 if(key==="dual")return Number.parseInt(field(r,"cameras"),10)>1;
 if(key==="single")return Number.parseInt(field(r,"cameras"),10)===1;
 if(key==="screen")return field(r,"screen")!==""&&!/^No$/i.test(field(r,"screen"));
 if(key==="compact")return [1,8].includes(Number(id));
 return false;
};
const ranks=(count="any",priority="quality")=>ids.map(id=>{
 let score=0;
 if(count==="dual")score+=has(id,"dual")?12:-18;
 else if(count==="single")score+=has(id,"single")?12:-18;
 else score+=2;
 const flags={quality:"4k",gps:"gps",compact:"compact",parking:"park",screen:"screen"};
 const p=flags[priority]||"4k";
 score+=has(id,p)?11:-4;
 if(has(id,"wifi"))score++;
 if(has(id,"park"))score++;
 return {id,score};
}).sort((a,b)=>b.score-a.score||a.id-b.id);
const values=["front","rear","cameras","GPS","wireless","screen","parking","app","storage"];
const labels={ru:"Сравнить",en:"Compare",he:"השוואה",ar:"مقارنة"};
let tab="finder",count="any",priority="quality",chosen=[5,6,0],device=0,savedDevice=0,showUpdates=false;
try{const saved=Number(localStorage.getItem(savedKey));if(ids.includes(saved)){device=saved;savedDevice=saved}}catch(_){}
const optionModel=(selected,includeEmpty=false,emptyLabel="")=>(includeEmpty?'<option value="0">'+esc(emptyLabel)+'</option>':"")+
 ids.map(id=>'<option value="'+id+'"'+(id===Number(selected)?' selected':'')+'>'+esc(names[id])+'</option>').join("");
function openModel(id){
 if(typeof window.openProduct==="function"){window.openProduct(id);return;}
 const target=document.querySelector('#products [data-details="'+id+'"]');
 if(target){target.click();return;}
 document.getElementById("catalog")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function link(url,label){
 const u=safeUrl(url);
 return u?'<a class="hub-link" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>':"";
}
function findPanel(){
 const t=tx();
 const selectors='<div class="hub-form">'+
  '<label class="hub-field">'+esc(t.camera)+'<select data-hub-count>'+["any","single","dual"].map((v,i)=>'<option value="'+v+'"'+(v===count?' selected':'')+'>'+esc(t.camOpts[i])+'</option>').join("")+'</select></label>'+
  '<label class="hub-field">'+esc(t.focus)+'<select data-hub-priority>'+["quality","gps","compact","parking","screen"].map((v,i)=>'<option value="'+v+'"'+(v===priority?' selected':'')+'>'+esc(t.focusOpts[i])+'</option>').join("")+'</select></label></div>';
 const pick=ranks(count,priority).slice(0,3);
 const cards=pick.map(({id},i)=>{
  const p=shown(id),facts=["front","cameras","GPS"].map(key=>p.specs.find(x=>x.key===key)).filter(Boolean);
  return '<article class="hub-product"><span class="hub-product-flag">'+esc(t.match)+' · '+(i+1)+'</span>'+
   '<h4>'+esc(names[id])+'</h4><p>'+esc(p.summary.length>155?p.summary.slice(0,152)+"…":p.summary)+'</p>'+
   '<div class="hub-product-specs">'+facts.map(x=>'<span>'+esc(x.value)+'</span>').join("")+'</div>'+
   '<div class="hub-product-actions"><button type="button" class="hub-action" data-hub-open="'+id+'">'+esc(t.open)+'</button>'+
   '<button type="button" class="hub-action hub-action--soft" data-hub-choose="'+id+'">'+esc(t.compare)+'</button></div></article>';
 }).join("");
 return '<section class="hub-panel" id="hubPanel" role="tabpanel" aria-labelledby="hubTab-finder"><h3>'+esc(t.findTitle)+'</h3><p>'+esc(t.findIntro)+'</p>'+
  selectors+'<div class="hub-results" aria-live="polite">'+cards+'</div><div class="hub-summary">'+esc(t.resultNote)+'</div></section>';
}
function comparisonPanel(){
 const t=tx(), selected=chosen.filter(Boolean);
 const selects='<div class="hub-compare-selectors">'+chosen.map((id,i)=>'<label class="hub-field">'+esc(i===2?t.third:t.model+" "+(i+1))+
  '<select data-hub-compare="'+i+'">'+optionModel(id,i===2,t.choose)+'</select></label>').join("")+'</div>';
 const table='<div class="hub-compare-wrap" role="region" tabindex="0" aria-label="'+esc(t.compareTitle)+'"><table class="hub-compare"><thead><tr><th scope="col">'+esc(t.model)+'</th>'+
 selected.map(id=>'<th scope="col">'+esc(names[id])+'</th>').join("")+'</tr></thead><tbody>'+
 values.map((key,i)=>'<tr><th scope="row">'+esc(t.rows[i])+'</th>'+
 selected.map(id=>{const v=field(shown(id),key)||t.notProvided;const good=/^(Yes|כן|نعم|Есть)$/i.test(v);return '<td data-good="'+good+'">'+esc(v)+'</td>'}).join("")+'</tr>').join("")+
 '</tbody></table></div>';
 return '<section class="hub-panel" id="hubPanel" role="tabpanel" aria-labelledby="hubTab-compare">'+
 '<h3>'+esc(t.compareTitle)+'</h3><p>'+esc(t.compareIntro)+'</p>'+selects+
 '<p class="hub-error" id="hubCompareError" hidden role="status">'+esc(t.already)+'</p>'+table+
 '<div class="hub-owner-actions">'+selected.map(id=>'<button class="hub-link" type="button" data-hub-open="'+id+'">'+esc(t.open)+' · '+esc(names[id])+'</button>').join("")+'</div>'+
 '<div class="hub-summary">'+esc(t.compareNote)+'</div></section>';
}
function ownerPanel(){
 const t=tx(),id=device;
 const pick='<label class="hub-field">'+esc(t.ownerPick)+'<select data-hub-device>'+optionModel(id||1)+'</select></label>';
 const p=shown(id||1),facts=p.specs.filter(x=>["front","rear","GPS","parking","wireless","app"].includes(x.key));
 const lessons=t.lessons.map((x,i)=>'<div class="hub-academy-item"><strong>'+(i===0?'01':i===1?'02':'03')+' · '+esc(x)+'</strong><span>'+esc(t.lessonText[i])+'</span></div>').join("");
 const current='<div class="hub-device-box"><div class="hub-owner-row"><div class="hub-owner-model">'+esc(names[id||1])+'</div>'+
 '<button type="button" class="hub-action hub-action--soft" data-hub-save>'+esc(t.save)+'</button></div>'+
 '<div class="hub-owner-tags">'+facts.map(v=>'<span>'+esc(v.label)+': '+esc(v.value)+'</span>').join("")+'</div>'+
 '<div class="hub-owner-actions">'+link(p.source,t.source)+(p.manual?link(p.manual,t.manual):'<span class="hub-inline-note">'+esc(t.noManual)+'</span>')+
 '<button type="button" class="hub-link" data-hub-updates>'+esc(showUpdates?t.updateHide:t.updates)+'</button>'+
 '<button type="button" class="hub-link" data-hub-open="'+(id||1)+'">'+esc(t.details)+'</button></div>'+
 (id===savedDevice?'<p class="hub-inline-note">'+esc(t.saved)+'</p>':"")+
 (showUpdates&&window.NEOLINE_DEVICE_UPDATES?.render?'<div class="hub-update-details">'+window.NEOLINE_DEVICE_UPDATES.render(id||1,locale())+'</div>':"")+
 '</div>';
 return '<section class="hub-panel" id="hubPanel" role="tabpanel" aria-labelledby="hubTab-owner">'+
 '<h3>'+esc(t.ownerTitle)+'</h3><p>'+esc(t.ownerIntro)+'</p><div class="hub-form">'+pick+'</div>'+current+
 '<div class="hub-academy-grid">'+lessons+'</div><p class="hub-inline-note">'+esc(t.academyNote)+'</p></section>';
}
function render(){
 const t=tx();
 root.setAttribute("dir",["he","ar"].includes(locale())?"rtl":"ltr");
 root.innerHTML='<div class="hub-title-group"><div><div class="hub-kicker">'+esc(t.kick)+'</div><h2 class="hub-heading">'+esc(t.title)+'</h2><p class="hub-sub">'+esc(t.sub)+'</p></div></div>'+
 '<div class="hub-layout"><div class="hub-tabs" role="tablist" aria-label="'+esc(t.title)+'">'+
 ["finder","compare","owner"].map((k,i)=>'<button type="button" id="hubTab-'+k+'" class="hub-tab" role="tab" aria-controls="hubPanel" aria-selected="'+(tab===k)+'" data-hub-tab="'+k+'"><span aria-hidden="true">'+["◎","⚖","▣"][i]+'</span><span>'+esc(t.tabs[i])+'</span></button>').join("")+
 '</div>'+(tab==="finder"?findPanel():tab==="compare"?comparisonPanel():ownerPanel())+'</div>';
 updateShortcuts();
 decorateProducts();
}
function decorateProducts(){
 const grid=document.getElementById("products");if(!grid)return;
 for(const card of grid.querySelectorAll(".product")){
  const target=card.querySelector("[data-details]");
  const id=Number(target?.dataset.details);
  if(!ids.includes(id))continue;
  const area=card.querySelector(".product-content");
  if(!area)continue;
  let btn=area.querySelector(".hub-compact-compare");
  if(!btn){
   btn=document.createElement("button");
   btn.type="button";btn.className="hub-compact-compare";
   btn.dataset.hubCardCompare=String(id);
   area.append(btn);
  }
  btn.textContent="⚖ "+labels[locale()];
 }
}
root.addEventListener("change",event=>{
 const e=event.target;
 if(e.matches("[data-hub-count]")){count=e.value;render()}
 else if(e.matches("[data-hub-priority]")){priority=e.value;render()}
 else if(e.matches("[data-hub-compare]")){
  const index=Number(e.dataset.hubCompare),id=Number(e.value);
  if(id&&chosen.some((x,i)=>i!==index&&x===id)){
   e.value=String(chosen[index]);
   const message=document.getElementById("hubCompareError");if(message)message.hidden=false;
   return;
  }
  chosen[index]=id;render();
 }else if(e.matches("[data-hub-device]")){
  device=Number(e.value);
  if(!ids.includes(device))device=1;
  showUpdates=false;render();
 }
});
root.addEventListener("click",event=>{
 const button=event.target.closest("button");if(!button)return;
 if(button.matches("[data-hub-tab]")){tab=button.dataset.hubTab;showUpdates=false;render();root.querySelector('[data-hub-tab="'+tab+'"]')?.focus();return}
 if(button.matches("[data-hub-open]")){openModel(Number(button.dataset.hubOpen));return}
 if(button.matches("[data-hub-choose]")){
  const id=Number(button.dataset.hubChoose);
  chosen=chosen.filter(x=>x&&x!==id);
  chosen.unshift(id);chosen=chosen.slice(0,3);
  while(chosen.length<3)chosen.push(0);
  if(chosen.filter(Boolean).length===1)chosen[1]=chosen[0]===5?6:5;
  tab="compare";render();root.scrollIntoView({behavior:"smooth",block:"start"});return;
 }
 if(button.matches("[data-hub-save]")){
  const current=Number(root.querySelector("[data-hub-device]")?.value)||device||1;
  if(!ids.includes(current))return;
  device=current;
  try{localStorage.setItem(savedKey,String(device));savedDevice=device}catch(_){}
  render();return;
 }
 if(button.matches("[data-hub-updates]")){showUpdates=!showUpdates;render();return}
});
document.getElementById("products")?.addEventListener("click",event=>{
 const btn=event.target.closest("[data-hub-card-compare]");
 if(!btn)return;
 const id=Number(btn.dataset.hubCardCompare);
 if(!ids.includes(id))return;
 chosen=chosen.filter(x=>x&&x!==id);chosen.unshift(id);
 chosen=chosen.slice(0,3);
 while(chosen.length<3)chosen.push(0);
 if(chosen.filter(Boolean).length===1)chosen[1]=chosen[0]===5?6:5;
 tab="compare";render();root.scrollIntoView({behavior:"smooth",block:"start"});
});
/* Primary catalog shortcuts keep the new features discoverable before the
   long product listing. They are buttons, not fake sales CTAs. */
const tools=document.querySelector("#catalog .catalog-tools");
let shortcuts=null;
if(tools){
 shortcuts=document.createElement("div");
 shortcuts.className="hub-quick-link-row";
 tools.insertAdjacentElement("afterend",shortcuts);
 shortcuts.addEventListener("click",event=>{
  const b=event.target.closest("[data-hub-jump]");
  if(!b)return;
  tab=b.dataset.hubJump;
  render();
  root.scrollIntoView({behavior:"smooth",block:"start"});
  root.querySelector('[data-hub-tab="'+tab+'"]')?.focus({preventScroll:true});
 });
}
function updateShortcuts(){
 if(!shortcuts)return;
 const t=tx();
 shortcuts.innerHTML='<button type="button" data-hub-jump="finder"><span aria-hidden="true">◎</span>'+esc(t.tabs[0])+'</button>'+
  '<button type="button" data-hub-jump="compare"><span aria-hidden="true">⚖</span>'+esc(t.tabs[1])+'</button>'+
  '<button type="button" data-hub-jump="owner"><span aria-hidden="true">▣</span>'+esc(t.tabs[2])+'</button>';
}
const products=document.getElementById("products");
if(products)new MutationObserver(decorateProducts).observe(products,{childList:true});
new MutationObserver(records=>{if(records.some(x=>x.attributeName==="lang"))render();}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.NEOLINE_SMART_HUB={ranks,has,selectTab(key){if(["finder","compare","owner"].includes(key)){tab=key;render()}},models:ids.slice()};
render();
})();
