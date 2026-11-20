/* NEOLINE Israel — EU manufacturer updates, direct links as published on neoline.com.
   Do not automatically download/install firmware. Device hardware and regional
   revision must be checked by the owner before using any .bin/.img package.
   No version/currentness claim is made: manufacturer pages can change. */
(function(){
 "use strict";
 const catalog={
  1:{
   euPage:"https://neoline.com/wowcam/",
   euName:"Wowcam",
   files:[{type:"firmware",url:"https://update.srv.neoline.com/WOWCAM/FW_3513.bin"}],
   manual:"https://drive.google.com/file/d/1n1pauu3okg7xiCIzTJntDAnfZaxH_k5p/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.neoline.awificonnect",
   appName:"Neoline Connect"
  },
  2:{
   euPage:"https://neoline.com/flash-2k/",
   euName:"Flash 2K",
   caution:true,
   files:[
    {type:"firmware",url:"https://update.srv.neoline.com/FLASH2K/FLASH2K.img"},
    {type:"tool",url:"https://update.srv.neoline.com/FLASH2K/PhoenixCard.rar"}
   ],
   manual:"https://drive.google.com/file/d/1MbkONvcV8vrdQ5ZWZfIPnwUF2H8JSlp-/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.vidure.roadvideo",
   appName:"RoadVideo"
  },
  3:{
   euPage:"https://neoline.com/flash-2k-dual/",
   euName:"Flash 2K Dual",
   caution:true,
   files:[
    {type:"firmware",url:"https://update.srv.neoline.com/FLASH2KD/FLASH2KD.img"},
    {type:"tool",url:"https://update.srv.neoline.com/FLASH2KD/PhoenixCard.rar"}
   ],
   manual:"https://drive.google.com/file/d/1qoTvE17u9tc7sTyONuAIj7I1R1FIfKUq/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.vidure.roadvideo",
   appName:"RoadVideo"
  },
  4:{
   euPage:"https://neoline.com/update/",
   caution:true,
   noPackage:true
  },
  5:{
   euPage:"https://neoline.com/argus-4k-argus-4k-dual/",
   euName:"Argus 4K",
   files:[{type:"firmware",url:"https://update.srv.neoline.com/ARGUS/FW_3572.bin"}],
   manual:"https://drive.google.com/file/d/1JbUU2PSx_woRyXY7cNbIb3XL4hI57sMu/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.apical.neoline",
   appName:"Neoline Assist"
  },
  6:{
   euPage:"https://neoline.com/argus-4k-argus-4k-dual/",
   euName:"Argus 4K Dual",
   files:[{type:"firmware",url:"https://update.srv.neoline.com/ARGUS/FW_3572.bin"}],
   manual:"https://drive.google.com/file/d/1JbUU2PSx_woRyXY7cNbIb3XL4hI57sMu/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.apical.neoline",
   appName:"Neoline Assist"
  },
  7:{
   euPage:"https://neoline.com/smartway/",
   euName:"SmartWay",
   files:[],
   noPackage:true,
   manual:"https://drive.google.com/file/d/1sdr5NMfWbeDCn55BIECSA1jn-3KwJrj0/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.vidure.app",
   appName:"Viidure"
  },
  8:{
   euPage:"https://neoline.com/g-tech-x54/",
   euName:"G-Tech X54",
   caution:true,
   noPackage:true,
   variant:true,
   files:[],
   manual:"https://drive.google.com/file/d/1aNRi6S1y2QDC99QlsO-Y4_Ne4muhfhH5/view?usp=sharing",
   app:"https://play.google.com/store/apps/details?id=com.dkhs.neoline",
   appName:"Neoline OnAir"
  }
 };
 const loc={
  ru:{
   title:"Обновления устройства",intro:"Официальные европейские страницы NEOLINE для выбранной модели.",
   firmware:"Скачать прошивку · EU",tool:"PhoenixCard · Windows",manual:"Инструкция · Европа",
   app:"Приложение",modelPage:"Обновления этой модели",directory:"Все устройства NEOLINE Europe",
   support:"Поддержка NEOLINE Europe",warning:"Перед установкой обязательно сверьте точную модель, аппаратную ревизию и регион устройства. Европейская прошивка может не подходить для российской или израильской версии. Не выключайте питание во время обновления.",
   variant:"На сайте Европы указана близкая модель, но совместимость этой модификации не подтверждена. Прямую загрузку прошивки не показываем.",
   unknown:"Для этой модели на европейском сайте не найден подтверждённый прямой файл прошивки. Используйте официальный каталог обновлений или поддержку.",
   noGps:"Отдельную GPS-базу показываем только при наличии проверенной отдельной загрузки. Не используйте файл прошивки вместо базы.",
   verify:"Проверяйте совместимость до скачивания.",europe:"Европейский источник",
   go:"Перейти ↗",download:"Скачать ↗",appGet:"Открыть Google Play ↗",
   fileNote:"Ссылка ведёт прямо к файлу на сервере производителя.",
   appNote:"Приложение устанавливается через Google Play.",
   x54:"Европейская страница посвящена G-Tech X54; соответствие версии X54 Dual не установлено."
  },
  en:{
   title:"Device updates",intro:"Official NEOLINE Europe sources for this product.",
   firmware:"Download EU firmware",tool:"PhoenixCard · Windows",manual:"European user manual",
   app:"Mobile app",modelPage:"This model's update page",directory:"All devices · NEOLINE Europe",
   support:"NEOLINE Europe support",warning:"Before installing, confirm the exact model, hardware revision and regional variant. European firmware may not work on Russian or Israeli versions. Never disconnect power during an update.",
   variant:"The European page lists a closely named model, but compatibility of this variant has not been verified. Direct firmware links are withheld.",
   unknown:"No verified direct European firmware file was found for this model. Use the official update directory or support.",
   noGps:"Separate GPS databases are linked only when individually verified. A firmware file must not be treated as a GPS database.",
   verify:"Check compatibility before downloading.",europe:"European source",
   go:"Open ↗",download:"Download ↗",appGet:"Open in Google Play ↗",
   fileNote:"Direct file hosted on the manufacturer server.",
   appNote:"Install the app through Google Play.",
   x54:"The EU support page is for G-Tech X54; equivalence with X54 Dual is unconfirmed."
  },
  he:{
   title:"עדכוני מכשיר",intro:"קישורים רשמיים של NEOLINE אירופה לדגם הנבחר.",
   firmware:"הורדת קושחה אירופית",tool:"PhoenixCard · Windows",manual:"מדריך משתמש מאירופה",
   app:"אפליקציה",modelPage:"עמוד העדכון של הדגם",directory:"כל המכשירים · NEOLINE אירופה",
   support:"תמיכת NEOLINE אירופה",warning:"לפני ההתקנה יש לוודא דגם מדויק, גרסת חומרה ואזור שיווק. קושחה אירופית לא בהכרח מתאימה לדגם שנמכר בישראל או ברוסיה. אין לנתק חשמל בזמן העדכון.",
   variant:"שם הדגם באתר האירופי דומה אך לא אומתה התאמה לגרסה זו. אין קישור ישיר לקושחה.",
   unknown:"לא נמצא קובץ קושחה אירופי מאומת לדגם זה. ניתן לבדוק בקטלוג הרשמי או לפנות לתמיכה.",
   noGps:"קישור למאגר GPS נפרד מופיע רק אם אומת. אין להתקין קושחה במקום מאגר GPS.",
   verify:"יש לוודא תאימות לפני ההורדה.",europe:"מקור אירופי",
   go:"פתיחה ↗",download:"הורדה ↗",appGet:"פתיחה ב-Google Play ↗",
   fileNote:"הקובץ מאוחסן בשרת היצרן.",appNote:"ההתקנה דרך Google Play.",
   x54:"הדף האירופי מיועד ל-G-Tech X54; התאמתו ל-X54 Dual לא אומתה."
  },
  ar:{
   title:"تحديثات الجهاز",intro:"روابط NEOLINE أوروبا الرسمية الخاصة بالطراز المحدد.",
   firmware:"تنزيل البرنامج الثابت الأوروبي",tool:"PhoenixCard · Windows",manual:"دليل المستخدم الأوروبي",
   app:"تطبيق الهاتف",modelPage:"صفحة تحديث هذا الطراز",directory:"كل الأجهزة · NEOLINE أوروبا",
   support:"دعم NEOLINE أوروبا",warning:"تحقق من الطراز الدقيق وإصدار العتاد والمنطقة قبل التثبيت. قد لا تتوافق البرامج الثابتة الأوروبية مع الأجهزة الروسية أو الإسرائيلية. لا تفصل الطاقة أثناء التحديث.",
   variant:"الطراز المذكور في الموقع الأوروبي مشابه، لكن التوافق مع هذا الإصدار غير مؤكد، لذا لا نعرض رابط تنزيل مباشر.",
   unknown:"لم يُعثر على ملف ثابت أوروبي مباشر وموثق لهذا الطراز. استخدم فهرس الشركة أو الدعم.",
   noGps:"لا نعرض قاعدة GPS منفصلة إلا إذا تحققنا من رابط مستقل لها. ملف البرنامج الثابت ليس قاعدة GPS.",
   verify:"تحقق من التوافق قبل التنزيل.",europe:"المصدر الأوروبي",
   go:"فتح ↗",download:"تنزيل ↗",appGet:"فتح Google Play ↗",
   fileNote:"الملف مباشرة من خادم الشركة المصنعة.",appNote:"ثبّت التطبيق من Google Play.",
   x54:"تخص الصفحة الأوروبية G-Tech X54؛ لم تُثبت مطابقتها مع X54 Dual."
  }
 };
 function permittedUrl(source){
  if(typeof source!=="string")return null;
  try{
   const url=new URL(source);
   if(url.protocol!=="https:")return null;
   if(!["neoline.com","www.neoline.com","update.srv.neoline.com","drive.google.com","play.google.com"].includes(url.hostname))return null;
   return url.href;
  }catch{return null;}
 }
 const defEscape=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function anchor(url,label,escape,extraClass=""){
  const safe=permittedUrl(url);
  if(!safe)return "";
  const rel=/update\.srv\.neoline\.com/.test(safe)?"noreferrer noopener":"noopener noreferrer";
  return '<a class="pd-update-link '+extraClass+'" href="'+escape(safe)+'" target="_blank" rel="'+rel+'">'+escape(label)+'</a>';
 }
 function render(id,language,escapeFn){
  const t=loc[language]||loc.ru;
  const e=typeof escapeFn==="function"?escapeFn:defEscape;
  const obj=catalog[Number(id)]||{euPage:"https://neoline.com/update/",noPackage:true};
  let files="";
  for(const item of obj.files||[]){
   const text=item.type==="firmware"?t.firmware:t.tool;
   const url=permittedUrl(item.url);
   if(!url)continue;
   files+='<div class="pd-update-download">'+
    '<div><strong>'+e(text)+'</strong><small>'+e(item.type==="firmware"?t.fileNote:t.verify)+'</small></div>'+
    anchor(url,t.download,e,"pd-update-primary")+'</div>';
  }
  const noFile=!files;
  let note=obj.variant?t.x54:(obj.caution?t.verify:null);
  return '<div class="pd-updates">'+
   '<div class="pd-updates-eyebrow"><span aria-hidden="true">↻</span>'+e(t.europe)+'</div>'+
   '<h4>'+e(t.title)+'</h4><p class="pd-updates-lead">'+e(t.intro)+'</p>'+
   '<div class="pd-updates-warning"><span aria-hidden="true">!</span><p>'+e(t.warning)+'</p></div>'+
   (note?'<p class="pd-updates-variant">'+e(note)+'</p>':"")+
   (noFile?'<p class="pd-updates-no-file">'+e(t.unknown)+(obj.variant?' '+e(t.variant):'')+'</p>':files)+
   '<div class="pd-updates-links">'+
    '<div class="pd-updates-links-head">'+e(t.modelPage)+'</div>'+
    anchor(obj.euPage,t.go,e)+
    (obj.manual?'<div class="pd-updates-links-head">'+e(t.manual)+'</div>'+anchor(obj.manual,t.go,e):"")+
    (obj.app?'<div class="pd-updates-links-head">'+e(t.app)+' · '+e(obj.appName||"")+'</div>'+anchor(obj.app,t.appGet,e):"")+
    '<div class="pd-updates-links-head">'+e(t.directory)+'</div>'+
    anchor("https://neoline.com/update/",t.go,e)+
    '<div class="pd-updates-links-head">'+e(t.support)+'</div>'+
    anchor("https://neoline.com/support/",t.go,e)+
   '</div>'+
   '<p class="pd-updates-footnote">'+e(t.noGps)+'</p>'+
   '</div>';
 }
 window.NEOLINE_DEVICE_UPDATES={render,models:Object.freeze(Object.keys(catalog).map(Number))};
})();
