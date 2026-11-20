/* NEOLINE Academy — an in-page owner learning center.
   Facts and links come from curated NEOLINE_DETAILS and official EU
   support metadata. No downloads, remote video embeds or tracking load
   unless the visitor explicitly requests them. */
(()=>{
"use strict";
const root=document.getElementById("neolineAcademy");
if(!root)return;
const names={
 1:"NEOLINE WowCam Wi-Fi",
 2:"NEOLINE Flash 2K Wi-Fi",
 3:"NEOLINE Flash 2K Wi-Fi Dual",
 4:"NEOLINE EasyDrive 2K Wi-Fi Dual",
 5:"NEOLINE Argus 4K",
 6:"NEOLINE Argus 4K Dual",
 7:"NEOLINE SmartWay",
 8:"NEOLINE G-Tech X54 Dual"
};
const modelIds=Object.keys(names).map(Number);
const topicKeys=["setup","connect","record","update"];
const topicIcons=["◫","⌁","▣","↻"];
const copy={
 ru:{
  kick:"NEOLINE ACADEMY",title:"Знакомство с устройством",
  lead:"Практические инструкции по вашей модели: установка, подключение телефона, запись видео и безопасные обновления.",
  choose:"Выберите модель",progress:"Изучено разделов",sections:"Шаги обучения",
  steps:"Что проверить",complete:"Отметить как изучено",completed:"✓ Изучено",
  video:"▶ Видеообзоры и инструкции",manual:"Руководство (PDF, русский) ↗",
  product:"Описание производителя ↗",eu:"Поддержка модели · Европа ↗",euDirectory:"Каталог обновлений NEOLINE Europe ↗",noFirmware:"Прямой файл прошивки для этой модификации не подтверждён. Проверьте каталог производителя или свяжитесь с поддержкой.",
  app:"Приложение",support:"Помощь NEOLINE Europe ↗",
  official:"Официальные источники",intro:"Выберите раздел слева, затем изучите три шага.",
  details:"Характеристики и фотографии",moreUpdates:"Показать ссылки на обновления",lessUpdates:"Скрыть обновления",
  videoNotice:"Проверенные ролики доступны преимущественно на русском. Для других языков видеокаталог предлагает поиск по точной модели.",
  legal:"Учебная памятка, не замена руководству производителя. Возможности зависят от модели, региона и аппаратной версии. Отметки сохраняются только в этом браузере.",
  variant:"Внимание: европейская страница может относиться к другой модификации. Совместимость прошивки не подтверждена.",
  wifiCaution:"Убедитесь, что выбранная модификация поддерживает Wi‑Fi; точный порядок подключения смотрите в инструкции.",
  buttons:["Установка","Смартфон и Wi-Fi","Запись","Обновления"],
  brief:["Крепление и питание","Приложение и сопряжение","Качество и память","Прошивка и безопасность"],
  lessons:[
   {head:"Первый запуск",items:[
    "Проверьте полное название модели, комплектацию и тип крепления по официальной инструкции.",
    "Установите устройство так, чтобы оно не мешало обзору водителя. Используйте подходящее питание.",
    "Включите устройство и проверьте, что изображение и запись работают до начала поездки."
   ],note:"Двухкамерные модели могут требовать отдельного подключения задней камеры. Ориентируйтесь на инструкцию именно вашей версии."},
   {head:"Подключение к телефону",items:[
    "Найдите нужное приложение в источниках производителя для выбранной модели.",
    "При наличии Wi‑Fi включите его по инструкции устройства и выполните сопряжение телефона.",
    "Проверьте доступность просмотра и переноса файлов. Не используйте настройки другого устройства."
   ],note:"Приложения и порядок сопряжения различаются между моделями. Для некоторых модификаций Wi‑Fi недоступен."},
   {head:"Настройка записи",items:[
    "Сверьте поддерживаемое разрешение, число камер и параметры видео с руководством.",
    "Выберите совместимую карту памяти, отформатируйте её способом из инструкции и настройте циклическую запись, если она предусмотрена.",
    "Сделайте пробную запись и проверьте качество и звук, а при наличии задней камеры — оба канала."
   ],note:"Режим парковки и GPS-предупреждения работают не у всех моделей; иногда нужно отдельное питание или база камер."},
   {head:"Обновления и безопасность",items:[
    "Сверьте точную модель, аппаратную ревизию и регион устройства с данными производителя.",
    "Прочитайте официальную инструкцию обновления и проверьте, нужен ли отдельный файл GPS-базы.",
    "Сохраняйте стабильное питание во время обновления. Не устанавливайте файл от похожей модели."
   ],note:"Европейская прошивка не обязательно совместима с российской или израильской модификацией. Ссылки даны для проверки, не для автоматической установки."}
  ]
 },
 en:{
  kick:"NEOLINE ACADEMY",title:"Learn your device",
  lead:"Model-specific guides to setup, phone connection, recording and safe updates — with official manufacturer sources.",
  choose:"Choose a model",progress:"Topics reviewed",sections:"Learning topics",
  steps:"What to check",complete:"Mark as reviewed",completed:"✓ Reviewed",
  video:"▶ Video reviews & tutorials",manual:"User manual (PDF, Russian) ↗",
  product:"Manufacturer product page ↗",eu:"EU model support ↗",euDirectory:"NEOLINE Europe updates directory ↗",noFirmware:"No direct firmware package is verified for this variant. Check the official update directory or contact support.",
  app:"Mobile app",support:"NEOLINE Europe support ↗",
  official:"Official resources",intro:"Pick a topic and follow the three steps.",
  details:"Specifications & photos",moreUpdates:"Show update links",lessUpdates:"Hide update links",
  videoNotice:"Most verified video clips are in Russian. Other languages have exact-model video searches rather than invented translations.",
  legal:"Quick learning guide, not a replacement for manufacturer instructions. Features vary by model, region and hardware revision. Progress is saved only in this browser.",
  variant:"Important: the EU page may describe a different model variant. Firmware compatibility has not been confirmed.",
  wifiCaution:"Check that your exact variant supports Wi‑Fi; the official manual controls pairing steps.",
  buttons:["Installation","Phone & Wi‑Fi","Recording","Updates"],
  brief:["Mounting and power","App and pairing","Video and storage","Firmware safety"],
  lessons:[
   {head:"First start",items:[
    "Match the full model name, box contents and mount type to the official manual.",
    "Mount the device without blocking the driver's view. Use the recommended power connection.",
    "Power it on and verify recording works before driving."
   ],note:"Two-camera products may require a separate rear camera connection. Follow the manual for your actual variant."},
   {head:"Phone connection",items:[
    "Find the model's recommended app in the official manufacturer resources.",
    "If Wi‑Fi is supported, enable it according to the manual and pair your phone.",
    "Test playback and file transfer. Avoid copying setup steps from a different model."
   ],note:"Apps and pairing procedures vary. Wi‑Fi may not be available on every hardware variant."},
   {head:"Recording settings",items:[
    "Review the supported resolution, camera channels and video options in the manual.",
    "Use a supported memory card, format it as instructed, and configure loop recording if available.",
    "Record a short test clip, verify audio and picture, and check the rear view if supported."
   ],note:"Parking mode and GPS camera warnings are not universal; some require a separate power kit or camera database."},
   {head:"Safe device updates",items:[
    "Compare the exact model, hardware revision and region with the official support information.",
    "Read the manufacturer's update procedure and check whether the GPS database is a separate download.",
    "Keep power stable during updating and never install firmware for a similarly named model."
   ],note:"European firmware may be incompatible with Russian or Israeli variants. Links are for manual verification, never automatic installation."}
  ]
 },
 he:{
  kick:"NEOLINE ACADEMY",title:"לומדים להכיר את המכשיר",
  lead:"מדריך לפי דגם להתקנה, חיבור לטלפון, הקלטה ועדכונים בטוחים, עם מקורות רשמיים.",
  choose:"בחירת דגם",progress:"נושאים שנלמדו",sections:"נושאי לימוד",
  steps:"מה צריך לבדוק",complete:"סימון כנלמד",completed:"✓ נלמד",
  video:"▶ סרטוני סקירה והדרכה",manual:"מדריך (PDF, ברוסית) ↗",
  product:"דף המוצר של היצרן ↗",eu:"תמיכה אירופית לדגם ↗",euDirectory:"קטלוג עדכוני NEOLINE אירופה ↗",noFirmware:"אין קובץ קושחה ישיר ומאומת לגרסה זו. בדקו בקטלוג היצרן או פנו לתמיכה.",
  app:"אפליקציה",support:"תמיכת NEOLINE אירופה ↗",
  official:"מקורות רשמיים",intro:"בחרו נושא ובצעו את שלושת השלבים.",
  details:"מפרט ותמונות",moreUpdates:"הצגת קישורים לעדכונים",lessUpdates:"הסתרת קישורי עדכון",
  videoNotice:"רוב הסרטונים שאומתו הם ברוסית. בשפות אחרות מוצעים קישורי חיפוש לדגם המדויק.",
  legal:"הדרכה קצרה שאינה מחליפה את הוראות היצרן. התכונות תלויות בדגם, באזור ובגרסת החומרה. ההתקדמות נשמרת בדפדפן בלבד.",
  variant:"חשוב: עמוד התמיכה האירופי עשוי להתייחס לגרסה אחרת של המכשיר. תאימות הקושחה לא אומתה.",
  wifiCaution:"ודאו שגרסת המכשיר תומכת ב-Wi‑Fi; יש לפעול לפי המדריך הרשמי.",
  buttons:["התקנה","טלפון ו-Wi‑Fi","הקלטה","עדכונים"],
  brief:["קיבוע וחשמל","אפליקציה וחיבור","איכות ואחסון","בטיחות הקושחה"],
  lessons:[
   {head:"הפעלה ראשונה",items:[
    "בדקו את השם המלא של הדגם, תכולת האריזה והמתקן במדריך הרשמי.",
    "התקינו את המכשיר כך שלא יחסום את שדה הראייה והשתמשו במתח המתאים.",
    "הפעילו ובדקו שהצילום וההקלטה פועלים לפני תחילת הנסיעה."
   ],note:"דגמים עם שתי מצלמות עשויים לדרוש חיבור נפרד של המצלמה האחורית. פעלו לפי ההוראות לגרסה המדויקת."},
   {head:"חיבור לטלפון",items:[
    "מצאו את האפליקציה המתאימה לדגם במקורות הרשמיים.",
    "אם הדגם תומך ב-Wi‑Fi, הפעילו אותו לפי ההוראות וחברו את הטלפון.",
    "בדקו צפייה והעברת קבצים. אל תשתמשו בהוראות של דגם אחר."
   ],note:"אפליקציות ושלבי החיבור משתנים בין דגמים; בחלק מהגרסאות אין Wi‑Fi."},
   {head:"הגדרות הקלטה",items:[
    "בדקו במדריך את הרזולוציה, מספר המצלמות ואפשרויות הווידאו.",
    "השתמשו בכרטיס זיכרון תואם, פרמטו לפי ההוראות והפעילו הקלטה מחזורית אם נתמכת.",
    "בצעו הקלטת ניסיון ובדקו תמונה, קול ומצלמה אחורית אם קיימת."
   ],note:"מצב חניה והתראות GPS אינם זמינים בכל דגם; ייתכן שנדרש חיבור חשמל או מאגר מצלמות נפרד."},
   {head:"עדכון בטוח",items:[
    "בדקו את הדגם המדויק, גרסת החומרה ואזור השיווק מול היצרן.",
    "קראו את הוראות העדכון ובדקו אם קיים קובץ GPS נפרד.",
    "הבטיחו מתח יציב במהלך העדכון ואל תתקינו קושחה של דגם דומה."
   ],note:"קושחה אירופית אינה בהכרח תואמת לגרסה ישראלית או רוסית. הקישורים מיועדים לבדיקה ידנית בלבד."}
  ]
 },
 ar:{
  kick:"NEOLINE ACADEMY",title:"تعلّم استخدام جهازك",
  lead:"إرشادات حسب الطراز للتثبيت والاتصال بالهاتف والتسجيل والتحديثات الآمنة، مع مصادر الشركة الرسمية.",
  choose:"اختر الطراز",progress:"موضوعات تمت مراجعتها",sections:"موضوعات التدريب",
  steps:"الخطوات",complete:"وضع علامة تمت المراجعة",completed:"✓ تمت المراجعة",
  video:"▶ مراجعات ودروس فيديو",manual:"الدليل (PDF بالروسية) ↗",
  product:"صفحة المنتج لدى الشركة ↗",eu:"دعم الطراز الأوروبي ↗",euDirectory:"دليل تحديثات NEOLINE أوروبا ↗",noFirmware:"لم يتم التحقق من ملف برنامج ثابت مباشر لهذا الإصدار. راجع دليل الشركة الرسمي أو الدعم.",
  app:"تطبيق الهاتف",support:"دعم NEOLINE أوروبا ↗",
  official:"مصادر رسمية",intro:"اختر الموضوع واتبع الخطوات الثلاث.",
  details:"المواصفات والصور",moreUpdates:"إظهار روابط التحديث",lessUpdates:"إخفاء روابط التحديث",
  videoNotice:"معظم المقاطع المؤكدة باللغة الروسية. تتوفر روابط بحث بالطراز الدقيق للغات الأخرى.",
  legal:"إرشادات مختصرة لا تحل محل دليل الشركة. تختلف الميزات حسب الطراز والمنطقة وإصدار الجهاز. يتم حفظ التقدم في هذا المتصفح فقط.",
  variant:"تنبيه: قد تخص صفحة أوروبا نسخة مختلفة من الجهاز. لم يتم تأكيد توافق البرامج الثابتة.",
  wifiCaution:"تأكد من دعم إصدار جهازك لشبكة Wi‑Fi واتبع دليل الشركة الرسمي.",
  buttons:["التثبيت","الهاتف وWi‑Fi","التسجيل","التحديثات"],
  brief:["التثبيت والتغذية","التطبيق والاتصال","الفيديو والتخزين","سلامة البرامج الثابتة"],
  lessons:[
   {head:"التشغيل الأول",items:[
    "تحقق من اسم الطراز الكامل ومحتويات العلبة ونوع الحامل في الدليل الرسمي.",
    "ثبّت الجهاز من دون حجب رؤية السائق واستخدم التغذية الكهربائية المناسبة.",
    "شغّل الجهاز وتأكد من عمل التسجيل قبل القيادة."
   ],note:"قد تتطلب الطرازات ذات الكاميرتين توصيل الكاميرا الخلفية بشكل منفصل. اتبع دليل نسختك."},
   {head:"الاتصال بالهاتف",items:[
    "اعثر على التطبيق الموصى به لطرازك في المصادر الرسمية.",
    "إذا كان الجهاز يدعم Wi‑Fi، فعّل الاتصال حسب الدليل واربط هاتفك.",
    "اختبر عرض الملفات ونقلها ولا تنسخ إعدادات طراز مختلف."
   ],note:"تختلف التطبيقات وخطوات الاتصال بين الطرازات؛ بعض الإصدارات لا تدعم Wi‑Fi."},
   {head:"إعدادات التسجيل",items:[
    "راجع الدقة المدعومة وعدد الكاميرات وخيارات الفيديو في الدليل.",
    "استخدم بطاقة ذاكرة متوافقة وهيّئها كما هو موضح، واضبط التسجيل المتكرر إذا كان مدعومًا.",
    "سجّل مقطعًا تجريبيًا وتحقق من الصورة والصوت والكاميرا الخلفية إن وُجدت."
   ],note:"وضع الوقوف وتنبيهات GPS ليست متاحة في جميع الطرازات؛ قد تتطلب مصدر طاقة أو قاعدة بيانات منفصلة."},
   {head:"التحديث الآمن",items:[
    "طابق الطراز وإصدار العتاد والمنطقة مع معلومات الشركة.",
    "اقرأ تعليمات التحديث وتحقق مما إذا كانت قاعدة بيانات GPS ملفًا منفصلًا.",
    "حافظ على استقرار التغذية أثناء التحديث ولا تثبّت برنامج طراز مشابه."
   ],note:"قد لا تكون البرامج الثابتة الأوروبية متوافقة مع الإصدارات الإسرائيلية أو الروسية. الروابط للمراجعة اليدوية فقط."}
  ]
 }
};
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const code=()=>{const lang=String(document.documentElement.lang||"ru").split("-")[0];return copy[lang]?lang:"ru"};
const tr=()=>copy[code()];
const storedModelKey="neoline:saved-device:v1";
const progressKey="neoline:academy:reviewed:v1";
const readSaved=()=>{try{const v=Number(localStorage.getItem(storedModelKey));return modelIds.includes(v)?v:null}catch{return null}};
let model=readSaved()||6,topic="setup",showUpdates=false;
let reviewed={};
try{
 const p=JSON.parse(localStorage.getItem(progressKey)||"{}");
 if(p&&typeof p==="object"&&!Array.isArray(p))reviewed=p;
}catch(_){}
const readSource=id=>{
 const s=window.NEOLINE_DEVICE_UPDATES?.get?.(id);
 return s||{euPage:"https://neoline.com/update/",manual:null,app:null,appName:null,variant:false,noPackage:true};
};
const trusted=url=>{
 try{
  const u=new URL(url);
  return u.protocol==="https:"&&["neoline.com","www.neoline.com","neoline.ru","www.neoline.ru","info.neoline.com","drive.google.com","play.google.com"].includes(u.hostname)?u.href:null;
 }catch{return null}
};
const officialLink=(url,label)=>{
 const safe=trusted(url);
 return safe?'<a href="'+esc(safe)+'" target="_blank" rel="noopener noreferrer" class="academy-resource-link">'+esc(label)+'</a>':"";
};
const countDone=id=>topicKeys.filter(k=>Boolean(reviewed[id+"."+k])).length;
const currentLesson=()=>Math.max(0,topicKeys.indexOf(topic));
function render(){
 const t=tr(),s=readSource(model),p=window.NEOLINE_DETAILS?.read?.(model,code());
 const lessonIndex=currentLesson(),lesson=t.lessons[lessonIndex],done=Boolean(reviewed[model+"."+topic]);
 const rtl=["he","ar"].includes(code());
 root.dir=rtl?"rtl":"ltr";
 root.setAttribute("lang",code());
 root.innerHTML=
  '<div class="academy-heading"><div class="academy-title-group"><span class="academy-kicker">'+esc(t.kick)+'</span><h2>'+esc(t.title)+'</h2><p>'+esc(t.lead)+'</p></div><div class="academy-progress" aria-label="'+esc(t.progress)+'"><strong>'+countDone(model)+'<small> / 4</small></strong><span>'+esc(t.progress)+'</span></div></div>'+
  '<div class="academy-body">'+
  '<div class="academy-model-heading"><strong>'+esc(t.choose)+'</strong><span>'+esc(names[model])+'</span></div>'+
  '<div class="academy-model-list" role="group" aria-label="'+esc(t.choose)+'">'+
   modelIds.map(id=>'<button type="button" data-academy-model="'+id+'" aria-pressed="'+String(id===model)+'"'+(id===model?' class="academy-model-active"':'')+'>'+esc(names[id].replace(/^NEOLINE\s+/,""))+'</button>').join("")+
  '</div>'+
  '<div class="academy-topic-grid" role="tablist" aria-label="'+esc(t.sections)+'">'+
   topicKeys.map((key,i)=>'<button type="button" class="academy-topic'+(key===topic?' active':'')+'" role="tab" id="academy-tab-'+key+'" aria-controls="academy-lesson" aria-selected="'+String(key===topic)+'" data-academy-topic="'+key+'"><span class="academy-topic-icon" aria-hidden="true">'+topicIcons[i]+'</span><span class="academy-topic-name">'+esc(t.buttons[i])+'</span><small>'+esc(t.brief[i])+'</small>'+(reviewed[model+"."+key]?'<span class="academy-topic-checked" aria-hidden="true">✓</span>':'')+'</button>').join("")+
  '</div>'+
  '<div class="academy-content">'+
   '<div class="academy-lesson" id="academy-lesson" role="tabpanel" aria-labelledby="academy-tab-'+topic+'">'+
    '<div class="academy-lesson-lead"><span class="academy-step-number">0'+(lessonIndex+1)+'</span><div><small>'+esc(t.steps)+'</small><h3>'+esc(lesson.head)+'</h3></div></div>'+
    '<ol class="academy-step-list">'+lesson.items.map((item,i)=>'<li><span class="academy-number" aria-hidden="true">'+(i+1)+'</span><p>'+esc(item)+'</p></li>').join("")+'</ol>'+
    '<p class="academy-safety'+(topic==="update"?' academy-safety-strong':'')+'"><span aria-hidden="true">ⓘ</span>'+esc(lesson.note)+'</p>'+
    (topic==="connect"?'<p class="academy-wifi-caution">'+esc(t.wifiCaution)+'</p>':"")+
    (s.variant?'<p class="academy-variant-warning">'+esc(t.variant)+'</p>':"")+
    (topic==='update'&&s.noPackage?'<p class="academy-variant-warning">'+esc(t.noFirmware)+'</p>':"")+
    '<div class="academy-lesson-actions"><button type="button" class="academy-mark'+(done?' is-completed':'')+'" data-academy-done aria-pressed="'+String(done)+'">'+esc(done?t.completed:t.complete)+'</button>'+
    '<button type="button" class="academy-video-button" data-academy-video>'+esc(t.video)+'</button></div>'+
    '<p class="academy-video-note">'+esc(t.videoNotice)+'</p>'+
   '</div>'+
   '<aside class="academy-resources"><h3>'+esc(t.official)+'</h3>'+
    '<div class="academy-resource-links">'+
     officialLink(s.euPage,s.euPage==='https://neoline.com/update/'?t.euDirectory:t.eu)+
     (s.manual?officialLink(s.manual,t.manual):"")+
     (s.app?officialLink(s.app,t.app+(s.appName?" · "+s.appName:"")+" ↗"):"")+
     (p?.source?officialLink(p.source,t.product):"")+
     officialLink("https://neoline.com/support/",t.support)+
    '</div>'+
    '<button type="button" class="academy-details" data-academy-details>'+esc(t.details)+' ↗</button>'+
    '<button type="button" class="academy-update-toggle" data-academy-updates aria-expanded="'+String(showUpdates)+'">'+esc(showUpdates?t.lessUpdates:t.moreUpdates)+' <span aria-hidden="true">'+(showUpdates?'−':'+')+'</span></button>'+
   '</aside>'+
  '</div>'+
  (showUpdates?'<div class="academy-update-details">'+(window.NEOLINE_DEVICE_UPDATES?.render?.(model,code(),esc)||"")+'</div>':"")+
  '<p class="academy-fineprint">'+esc(t.legal)+'</p>'+
  '</div>';
}
const markReviewed=()=>{
 const key=model+"."+topic;
 if(reviewed[key])delete reviewed[key];else reviewed[key]=true;
 try{localStorage.setItem(progressKey,JSON.stringify(reviewed))}catch(_){}
 render();
};
root.addEventListener("click",event=>{
 const b=event.target.closest("button");if(!b)return;
 if(b.hasAttribute("data-academy-model")){
  const next=Number(b.dataset.academyModel);
  if(!modelIds.includes(next))return;
  model=next;showUpdates=false;render();return;
 }
 if(b.hasAttribute("data-academy-topic")){
  const next=b.dataset.academyTopic;
  if(!topicKeys.includes(next))return;
  topic=next;showUpdates=false;render();
  root.querySelector('[data-academy-topic="'+next+'"]')?.focus({preventScroll:true});
  return;
 }
 if(b.hasAttribute("data-academy-done")){markReviewed();return}
 if(b.hasAttribute("data-academy-video")){
  window.NEOLINE_PRODUCT_VIDEOS?.open?.(model);return;
 }
 if(b.hasAttribute("data-academy-details")){
  window.openProduct?.(model);return;
 }
 if(b.hasAttribute("data-academy-updates")){
  showUpdates=!showUpdates;render();return;
 }
});
root.addEventListener("keydown",event=>{
 const current=event.target.closest("[data-academy-topic]");
 if(!current||!["ArrowRight","ArrowLeft"].includes(event.key))return;
 const index=topicKeys.indexOf(current.dataset.academyTopic);
 const forward=event.key==="ArrowRight";
 const next=(index+(forward?1:-1)+topicKeys.length)%topicKeys.length;
 event.preventDefault();
 topic=topicKeys[next];showUpdates=false;render();
 root.querySelector('[data-academy-topic="'+topic+'"]')?.focus({preventScroll:true});
});
new MutationObserver(records=>{
 if(records.some(r=>r.attributeName==="lang"))render();
}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
window.addEventListener("neoline:device-saved",event=>{
 const next=Number(event.detail?.id);
 if(modelIds.includes(next)){model=next;showUpdates=false;render()}
});
window.NEOLINE_ACADEMY={
 open(id){
  const next=Number(id);
  if(modelIds.includes(next)){model=next;showUpdates=false}
  render();root.scrollIntoView({behavior:"smooth",block:"start"});
 },
 selectModel(id){
  const next=Number(id);
  if(modelIds.includes(next)){model=next;showUpdates=false;render()}
 },
 getModel:()=>model,
 getReviewed:()=>countDone(model),
 topics:Object.freeze(topicKeys.slice())
};
render();
})();
