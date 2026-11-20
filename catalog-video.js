/* NEOLINE · per-model YouTube video catalogue (2026-11-19).
   Exact, verified video IDs are curated below; other actions launch an honest
   model-specific YouTube search, never a mislabeled/invented video. */
(function(){
 "use strict";
 const get=id=>document.getElementById(id);
 const secureText=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const copy={
  ru:{video:"Видео",header:"Видео о модели",review:"Обзор",comparison:"Сравнение",verified:"Подобранное видео",watch:"Смотреть здесь",youtube:"Смотреть на YouTube ↗",english:"Обзоры на английском",brand:"Реклама и презентации",test:"Примеры съёмки",russian:"Другие обзоры",find:"Искать на YouTube ↗",missing:"Для этой модели пока нет проверенных роликов. Ниже — ссылки на поиск именно этой модели.",note:"Результаты поиска предоставляются YouTube. Видео открываются по нажатию."},
  en:{video:"Videos",header:"Product videos",review:"Review",comparison:"Comparison",verified:"Selected video",watch:"Watch here",youtube:"Open on YouTube ↗",english:"English reviews",brand:"Ads and presentations",test:"Sample footage",russian:"Other reviews",find:"Search YouTube ↗",missing:"No verified videos for this exact model yet. Search links below use its full name.",note:"YouTube search results are provided by YouTube. Playback starts on tap."},
  he:{video:"סרטונים",header:"סרטוני המוצר",review:"סקירה",comparison:"השוואה",verified:"סרטון נבחר",watch:"צפייה כאן",youtube:"פתיחה ביוטיוב ↗",english:"סקירות באנגלית",brand:"פרסומות והצגות",test:"דוגמאות צילום",russian:"סקירות נוספות",find:"חיפוש ביוטיוב ↗",missing:"עדיין אין סרטונים מאומתים לדגם זה. להלן קישורי חיפוש לפי דגם.",note:"תוצאות החיפוש מגיעות מיוטיוב. הסרטון מופעל בלחיצה."},
  ar:{video:"فيديو",header:"فيديوهات المنتج",review:"مراجعة",comparison:"مقارنة",verified:"فيديو محدد",watch:"شاهد هنا",youtube:"مشاهدة على يوتيوب ↗",english:"مراجعات بالإنجليزية",brand:"الإعلانات والعروض",test:"عينات التصوير",russian:"مراجعات أخرى",find:"ابحث في يوتيوب ↗",missing:"لا توجد فيديوهات موثقة لهذا الطراز بعد. روابط البحث خاصة بالطراز نفسه.",note:"نتائج البحث من يوتيوب. يبدأ التشغيل عند الضغط."}
 };
 /* YouTube IDs verified against model-specific public video pages.
    Most verified clips are in Russian; English search is prioritized. */
 const verified={
  1:[{id:"fIaU3RCV2c4",type:"review",lang:"RU",title:"NEOLINE WowCam Wi-Fi — owner review"}],
  2:[{id:"ezMfOK-1EPo",type:"review",lang:"RU",title:"NEOLINE Flash 2K Wi-Fi — owner review"}],
  3:[{id:"A6wInMV9Iww",type:"review",lang:"RU",title:"NEOLINE Flash 2K Wi-Fi Dual — day & night test"}],
  4:[{id:"lwgyCJPBXF4",type:"review",lang:"RU",title:"NEOLINE EasyDrive 2K Wi-Fi Dual — detailed review"}],
  5:[{id:"tKzgL69ELD4",type:"review",lang:"RU",title:"NEOLINE Argus 4K — detailed review"}],
  6:[{id:"2qQBchWAr9E",type:"review",lang:"RU",title:"NEOLINE Argus 4K Dual — detailed review"},
     {id:"QCTWrtoIQUI",type:"comparison",lang:"RU",title:"NEOLINE Argus 4K Dual — dashcam comparison"}],
  7:[{id:"HMu_cLiDllI",type:"review",lang:"RU",title:"NEOLINE SmartWay — detailed review"}],
  8:[{id:"FnmYWNNKT6M",type:"review",lang:"RU",title:"NEOLINE G-Tech X54 Dual — unboxing"}]
 };

/* Public model-specific clips from RUTUBE and VK Video.
   Only curated direct links are shown; no automatic or unverified results. */
 const socialVideos={
  1:[{platform:"rutube",id:"e431d540cbd10ec2bc7613f2ee2576b3",lang:"RU",kind:"review",title:"Обзор Neoline WowCam Wi-Fi"}],
  2:[{platform:"rutube",id:"9a4e4f1738e7690340c6b718c90a9916",lang:"RU",kind:"review",title:"Neoline Flash 2K Wi-Fi — обзор"}],
  3:[{platform:"rutube",id:"480c28ada6963c66f93dc282e7739e11",lang:"RU",kind:"samples",title:"Neoline Flash 2K Wi-Fi Dual — пример съёмки"}],
  4:[{platform:"rutube",id:"708f23de95e67e09c37098c812b95be8",lang:"RU",kind:"review",title:"Neoline EasyDrive 2K Wi-Fi Dual — обзор"}],
  5:[{platform:"rutube",id:"62ab0f250a34a92da079c1abd136377f",lang:"RU",kind:"review",title:"NEOLINE Argus 4K — отзыв"},
     {platform:"vk",id:"-229158013_456239143",lang:"RU",kind:"samples",title:"Neoline Argus 4K — ночная и дневная съёмка"}],
  6:[{platform:"rutube",id:"bafadc656c03fa15f37340f26e3e5d41",lang:"RU",kind:"review",title:"Neoline Argus 4K Dual — обзор"},
     {platform:"rutube",id:"3361320a631057a0587de49a49882eda",lang:"RU",kind:"comparison",title:"Neoline Argus 4K Dual — сравнение видеорегистраторов"}]
 };
 const socialCopy={
  ru:{title:"Видео из соцсетей",kind:{review:"Обзор",comparison:"Сравнение",samples:"Пример записи"},watch:"Смотреть здесь",external:"Открыть источник ↗",language:"Язык",other:"На русском языке",none:"Для этой модели подтверждённых видео из соцсетей пока нет.",help:"Подборка проверенных ссылок — не автоматическая лента."},
  en:{title:"Social video reviews",kind:{review:"Review",comparison:"Comparison",samples:"Recording sample"},watch:"Watch here",external:"Open original ↗",language:"Language",other:"Russian-language videos",none:"No verified social videos for this exact model yet.",help:"Curated direct links, not a live social feed."},
  he:{title:"סרטונים מהרשתות",kind:{review:"סקירה",comparison:"השוואה",samples:"דוגמת צילום"},watch:"צפייה כאן",external:"פתיחת המקור ↗",language:"שפה",other:"סרטונים ברוסית",none:"אין עדיין סרטונים מאומתים לדגם הזה.",help:"קישורים שנבדקו, לא עדכון אוטומטי."},
  ar:{title:"فيديوهات الشبكات",kind:{review:"مراجعة",comparison:"مقارنة",samples:"نموذج تصوير"},watch:"شاهد هنا",external:"فتح المصدر ↗",language:"اللغة",other:"مقاطع باللغة الروسية",none:"لا توجد مقاطع موثقة لهذا الطراز بعد.",help:"روابط مختارة وليست بثاً تلقائياً."}
 };
 function socialSourceUrl(video){
  if(video.platform==="rutube" && /^[a-f0-9]{32}$/.test(video.id))
   return "https://rutube.ru/video/"+video.id+"/";
  if(video.platform==="vk" && /^-\d+_\d+$/.test(video.id))
   return "https://vk.com/video"+video.id;
  return null;
 }
 function socialCards(videos,language){
  const tr=socialCopy[language]||socialCopy.ru;
  return videos.map(v=>{
   const url=socialSourceUrl(v);
   if(!url)return "";
   const type=tr.kind[v.kind]||tr.kind.review;
   const provider=v.platform==="rutube"?"RUTUBE":"VK Видео";
   const providerMark=v.platform==="rutube"?"RT":"VK";
   const play=v.platform==="rutube"?
     '<button type="button" class="product-video-social-play" data-play-social="'+secureText(v.id)+'">▶ '+secureText(tr.watch)+'</button>':"";
   return '<article class="product-video-social-item">'+
    '<div class="product-video-social-heading"><span class="product-video-social-mark" aria-hidden="true">'+providerMark+'</span>'+
    '<span class="product-video-social-origin">'+secureText(provider)+' · '+secureText(v.lang)+' · '+secureText(type)+'</span></div>'+
    '<strong class="product-video-social-title">'+secureText(v.title)+'</strong>'+
    '<div class="product-video-social-actions">'+play+
    '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+secureText(tr.external)+'</a></div>'+
    '<div class="product-video-embed" data-social-embed="'+secureText(v.id)+'"></div></article>';
  }).join("");
 }
 function renderSocial(id,selectedLang){
  const videos=(socialVideos[id]||[]).filter(v=>socialSourceUrl(v));
  if(!videos.length)return "";
  const lc=socialCopy[selectedLang]||socialCopy.ru;
  const pref=localVideo[selectedLang]||localVideo.ru;
  const available=videos.filter(v=>v.lang===pref.tag);
  const foreign=videos.filter(v=>v.lang!==pref.tag);
  const items=available.concat(foreign);
  // Russian videos are available to English/Hebrew/Arabic visitors, but
  // remain tucked away under this accordion rather than being primary.
  const label=selectedLang!=="ru"&&available.length===0
   ?lc.title+" · "+lc.other:lc.title;
  return '<details class="product-video-social"><summary>'+
   '<span class="product-video-social-symbol" aria-hidden="true">▶</span>'+
   '<span class="product-video-social-label">'+secureText(label)+' <small>('+items.length+')</small></span>'+
   '<span class="product-video-chevron" aria-hidden="true"></span></summary>'+
   '<div class="product-video-social-list">'+socialCards(items,selectedLang)+
   '<p class="product-video-social-note">'+secureText(lc.help)+'</p></div></details>';
 }

 const localVideo={
 ru:{hl:"ru",gl:"RU",tag:"RU",flag:"🇷🇺",region:"Россия",title:"Обзоры на русском",items:["Обзоры","Сравнения","Презентации и реклама","Примеры съёмки"],terms:["обзор отзыв тест","сравнение видеорегистраторов","официальная презентация реклама","пример записи день ночь"],other:"Видео на других языках",none:"Проверенных русскоязычных роликов для этой модели пока нет. Начните с подборок ниже.",note:"YouTube открывается на русском языке с регионом Россия. Язык видео не гарантирован."},
 en:{hl:"en-GB",gl:"GB",tag:"EN",flag:"🇬🇧",region:"United Kingdom",title:"English reviews first",items:["English reviews","Comparisons","Ads and presentations","Video samples"],terms:["review hands on English","comparison dashcam English","official promo presentation English","sample footage day night English"],other:"Videos in other languages",none:"No verified English review for this exact model yet. English searches below take priority over Russian videos.",note:"Search opens YouTube in English with the United Kingdom region. Results and spoken language depend on YouTube."},
 he:{hl:"iw",gl:"IL",tag:"HE",flag:"🇮🇱",region:"ישראל",title:"סקירות בעברית",items:["סקירות בעברית","השוואות","פרסומות ומצגות","דוגמאות צילום"],terms:["סקירה ביקורת בדיקה","השוואה מצלמת רכב","פרסומת מצגת רשמית","צילום דוגמה יום לילה"],other:"סרטונים בשפות אחרות",none:"אין כרגע סקירה מאומתת בעברית. חיפוש בעברית מקבל קדימות.",note:"חיפוש ביוטיוב בעברית באזור ישראל. שפת הסרטונים אינה מובטחת."},
 ar:{hl:"ar",gl:"IL",tag:"AR",flag:"🇮🇱",region:"إسرائيل",title:"مراجعات باللغة العربية",items:["مراجعات عربية","مقارنات","إعلانات وعروض","تجارب التصوير"],terms:["مراجعة وتجربة كاميرا سيارة","مقارنة أجهزة تسجيل القيادة","إعلان عرض رسمي","تجربة تصوير نهار ليل"],other:"فيديوهات بلغات أخرى",none:"لا توجد مراجعات عربية موثقة حالياً. البحث باللغة العربية يظهر أولاً.",note:"يفتح البحث في يوتيوب بالعربية والإمارات. اللغة ليست مضمونة."}
 };

 /* Facebook: only manually verified, public, exact-model English videos.
    Catalog is separately maintained so product cards never invent a clip.
    Facebook is the first embedded provider for EN/HE/AR; RU keeps RU first. */
 const facebookText={
  ru:{title:"Видео Facebook на английском",featured:"Англоязычные видео производителя",play:"Смотреть на сайте",source:"Оригинал в Facebook ↗",note:"Встроенный плеер Facebook. Если автор ограничил просмотр, откройте оригинал."},
  en:{title:"Facebook videos · English",featured:"English videos first",play:"Watch on this site",source:"Original on Facebook ↗",note:"Facebook's embedded player. If playback is restricted by its owner, open the original."},
  he:{title:"סרטוני Facebook · אנגלית",featured:"סרטונים באנגלית תחילה",play:"צפייה באתר",source:"מקור ב-Facebook ↗",note:"נגן Facebook מוטמע. אם הסרטון מוגבל, אפשר לפתוח את המקור."},
  ar:{title:"فيديوهات Facebook · الإنجليزية",featured:"الفيديوهات الإنجليزية أولاً",play:"شاهد على الموقع",source:"الأصل على Facebook ↗",note:"مشغل Facebook المضمّن. إذا كانت هناك قيود على العرض، افتح المصدر."}
 };
 let facebookCatalog=[];
 let facebookGuides=[];
 function checkedFacebookUrl(input){
  if(typeof input!=="string")return null;
  try{
   const url=new URL(input);
   if(url.protocol!=="https:" || !["facebook.com","www.facebook.com","m.facebook.com"].includes(url.hostname))return null;
   const path=url.pathname;
   const valid=/^\/[A-Za-z0-9._-]+\/videos\/\d+\/?$/.test(path)
    || /^\/reel\/\d+\/?$/.test(path)
    || (path==="/watch/" && /^\d+$/.test(url.searchParams.get("v")||""))
    || (path==="/video.php" && /^\d+$/.test(url.searchParams.get("v")||""));
   if(!valid)return null;
   const safe=new URL("https://www.facebook.com"+path);
   if(path==="/watch/" || path==="/video.php")safe.searchParams.set("v",url.searchParams.get("v"));
   return safe.href;
  }catch{return null}
 }
 function normalizedVideoModel(value){
  return String(value||"").toLocaleLowerCase("en").replace(/[^a-z0-9]+/g," ").trim();
 }
 function facebookForModel(id){
  const name=normalizedVideoModel(modelName(id));
  return facebookCatalog.filter(v=>{
   if(!v||typeof v!=="object"||!checkedFacebookUrl(v.url))return false;
   if(typeof v.language!=="string" || !/^en(?:[-_][a-z]+)?$/i.test(v.language))return false;
   if(v.modelId!==undefined && v.modelId!==null)return Number(v.modelId)===id;
   return typeof v.model==="string"&&normalizedVideoModel(v.model)===name;
  });
 }
 function renderFacebook(id,selectedLang){
  const videos=facebookForModel(id);
  if(!videos.length)return "";
  const t=facebookText[selectedLang]||facebookText.en;
  const items=videos.map((v,index)=>{
   const original=checkedFacebookUrl(v.url);
   return '<article class="product-video-facebook-item">'+
    '<div class="product-video-facebook-meta"><span class="product-video-facebook-icon" aria-hidden="true">f</span>'+
    '<span>Facebook · EN</span></div>'+
    '<strong class="product-video-facebook-name">'+secureText(v.title||modelName(id))+'</strong>'+
    '<div class="product-video-facebook-actions">'+
    '<button type="button" data-play-facebook="'+index+'">▶ '+secureText(t.play)+'</button>'+
    '<a href="'+original+'" target="_blank" rel="noopener noreferrer">'+secureText(t.source)+'</a></div>'+
    '<div class="product-video-embed" data-facebook-embed-for="'+index+'"></div></article>';
  }).join("");
  return '<section class="product-video-facebook" aria-label="'+secureText(t.title)+'">'+
   '<div class="product-video-facebook-heading"><span class="product-video-facebook-heading-icon" aria-hidden="true">f</span>'+
   '<div><h3>'+secureText(t.title)+'</h3><span>'+secureText(t.featured)+'</span></div></div>'+
   '<div class="product-video-facebook-list">'+items+'</div>'+
   '<p class="product-video-facebook-note">'+secureText(t.note)+'</p></section>';
 }
 function loadFacebookCatalog(){
  fetch("./assets/catalog/facebook-videos.json?v=20261120-addons-v2",{cache:"no-store"})
   .then(response=>{if(!response.ok)throw new Error("Facebook video catalog unavailable");return response.json()})
   .then(data=>{
    facebookCatalog=Array.isArray(data.videos)?data.videos.filter(v=>v&&typeof v==="object"):[];
    facebookGuides=Array.isArray(data.guides)?data.guides.filter(v=>v&&typeof v==="object"):[];
    if(currentId!==null && !overlay.hidden)renderVideoList(currentId);
   }).catch(()=>{/* No unverified fallback videos: the rest of the catalog still works. */});
 }

 /* Main inline player is ALWAYS above search panels.
    No video is mislabeled as English: RU fallback is explicitly tagged.
    When a real verified English Facebook clip is added to the curated JSON,
    it automatically replaces the fallback for English, Hebrew and Arabic. */
 const mainCopy={
  ru:{featured:"Смотреть видео",playlist:"Другие ролики",extras:"Дополнительные видео и поиск",fallback:"Англоязычное видео этой модели ещё не подтверждено. Доступен обзор на русском.",missing:"Для этой модели ещё нет подтверждённого ролика. Поиск доступен ниже.",facebook:"Facebook · на английском",youtube:"YouTube",note:"Нажмите ▶ в плеере, чтобы начать просмотр."},
  en:{featured:"Watch product video",playlist:"More videos",extras:"More videos, reviews and searches",fallback:"No verified English video for this exact model. Russian reviews are available under other languages; you can also search in English.",missing:"No verified video for this exact model yet. Use the additional searches below.",facebook:"Facebook · English",youtube:"YouTube",note:"Tap ▶ in the player to start watching."},
  he:{featured:"צפייה בסרטון המוצר",playlist:"סרטונים נוספים",extras:"סרטונים נוספים וחיפוש",fallback:"עדיין אין סרטון אנגלי מאומת לדגם הזה. סקירות ברוסית נמצאות תחת שפות אחרות.",missing:"עדיין אין סרטון מאומת לדגם הזה. חיפוש נוסף זמין למטה.",facebook:"Facebook · אנגלית",youtube:"YouTube",note:"לחצו ▶ בנגן להתחלת הצפייה."},
  ar:{featured:"شاهد فيديو المنتج",playlist:"فيديوهات أخرى",extras:"مزيد من الفيديوهات وعمليات البحث",fallback:"لم يتم التحقق من فيديو إنجليزي لهذا الطراز. المقاطع الروسية متاحة ضمن اللغات الأخرى.",missing:"لا يوجد فيديو موثق لهذا الطراز بعد. يمكن استخدام البحث الإضافي أدناه.",facebook:"Facebook · الإنجليزية",youtube:"YouTube",note:"اضغط ▶ في المشغل لبدء المشاهدة."}
 };
 let featuredItems=[];

 // Verified video guides: lazy-loaded only on explicit video-catalog open.
 // A verified Polish multi-model review is always marked PL, never EN.
 let tutorialCatalog=[];
 let tutorialLoaded=false;
 let tutorialLoading=null;
 let tutorialFilter="all";
 const tutorialCopy={
  ru:{title:"Проверенные видеоинструкции и обзоры",note:"Ссылки на реальные публикации: автор и язык отмечены. Видео загружается только по нажатию.",all:"Все",connect:"Подключение",review:"Обзор",watch:"Смотреть здесь",original:"YouTube ↗",none:"Проверенного видео по этому разделу для данной модели пока нет. Используйте поиск по модели ниже.",publisher:"Источник",devices:{android:"Android",ios:"iPhone",all:""}},
  en:{title:"Verified tutorials and reviews",note:"Real published clips with original language and creator shown. Playback loads only on tap.",all:"All",connect:"Phone setup",review:"Review",watch:"Watch here",original:"YouTube ↗",none:"No verified video for this model and topic yet. Try the exact-model search below.",publisher:"Publisher",devices:{android:"Android",ios:"iPhone",all:""}},
  he:{title:"הדרכות וסקירות מאומתות",note:"סרטונים אמיתיים עם ציון שפת המקור והיוצר. הנגן נטען רק בלחיצה.",all:"הכול",connect:"חיבור לטלפון",review:"סקירה",watch:"צפייה כאן",original:"יוטיוב ↗",none:"לא נמצא סרטון מאומת לדגם ולנושא. אפשר לחפש לפי שם הדגם.",publisher:"מפרסם",devices:{android:"Android",ios:"iPhone",all:""}},
  ar:{title:"شروحات ومراجعات موثقة",note:"مقاطع منشورة حقيقية مع اللغة والناشر. يُحمّل المشغل بعد النقر فقط.",all:"الكل",connect:"اتصال الهاتف",review:"مراجعة",watch:"شاهد هنا",original:"يوتيوب ↗",none:"لا يوجد مقطع مؤكد لهذا الطراز والموضوع بعد. استخدم البحث باسم الطراز.",publisher:"الناشر",devices:{android:"Android",ios:"iPhone",all:""}}
 };
 function validateTutorial(item){
  return item && item.platform==="youtube" &&
   typeof item.id==="string" && /^[A-Za-z0-9_-]{11}$/.test(item.id) &&
   Array.isArray(item.modelIds) && item.modelIds.length>0 &&
   item.modelIds.every(id=>Number.isInteger(id)&&id>=1&&id<=8) &&
   ["ru","pl","en","he","ar"].includes(item.language) &&
   ["connect","review","setup","record","update"].includes(item.category) &&
   typeof item.title==="string" && item.title.trim().length>3 &&
   typeof item.publisher==="string" && item.publisher.trim().length>2;
 }
 function loadTutorialCatalog(){
  if(tutorialLoaded||tutorialLoading)return tutorialLoading;
  tutorialLoading=fetch("./assets/catalog/tutorial-videos.json?v=20261120-real-guides-v1",{cache:"force-cache"})
   .then(response=>{if(!response.ok)throw Error("Tutorial catalog unavailable");return response.json()})
   .then(data=>{
    tutorialCatalog=(Array.isArray(data.videos)?data.videos:[]).filter(validateTutorial);
    tutorialLoaded=true;
    if(currentId!==null&&!overlay.hidden)renderVideoList(currentId);
   }).catch(()=>{tutorialLoaded=true;tutorialCatalog=[]})
   .finally(()=>{tutorialLoading=null});
  return tutorialLoading;
 }
 function renderTutorials(id,locale){
  const t=tutorialCopy[locale]||tutorialCopy.en;
  const all=tutorialCatalog.filter(v=>v.modelIds.includes(id));
  if(!all.length)return "";
  const tabs=["all","connect","review"].map(k=>
   '<button type="button" data-video-topic="'+k+'" aria-pressed="'+String(k===tutorialFilter)+'">'+
   secureText(t[k])+'</button>').join("");
  const selected=all.filter(v=>tutorialFilter==="all"||v.category===tutorialFilter);
  const items=selected.map(v=>{
   const videoUrl="https://www.youtube.com/watch?v="+v.id;
   const cat=t[v.category]||v.category;
   const device=t.devices[v.device]||"";
   return '<article class="product-video-real-guide" data-guide-id="'+secureText(v.id)+'">'+
    '<div class="product-video-real-thumb"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/'+v.id+'/mqdefault.jpg" alt="">'+
     '<span class="product-video-real-badge">'+secureText(v.language.toUpperCase())+'</span></div>'+
    '<div class="product-video-real-body"><div class="product-video-real-meta">'+
     '<span>'+secureText(cat)+(device?" · "+secureText(device):"")+'</span>'+
     '<span>'+secureText(v.publisher)+'</span></div>'+
     '<strong>'+secureText(v.title)+'</strong>'+
     '<div class="product-video-real-actions"><button type="button" data-play-guide="'+secureText(v.id)+'">▶ '+secureText(t.watch)+'</button>'+
     '<a href="'+videoUrl+'" target="_blank" rel="noopener noreferrer">'+secureText(t.original)+'</a></div></div>'+
     '<div class="product-video-real-embed" data-guide-embed="'+secureText(v.id)+'"></div>'+
    '</article>';
  }).join("");
  return '<section class="product-video-real-guides" aria-label="'+secureText(t.title)+'">'+
   '<div class="product-video-real-heading"><h3>'+secureText(t.title)+'</h3>'+
    '<span>'+all.length+'</span></div>'+
    '<div class="product-video-real-filters" role="group" aria-label="'+secureText(t.title)+'">'+tabs+'</div>'+
    (items?'<div class="product-video-real-list">'+items+'</div>':
      '<p class="product-video-real-empty">'+secureText(t.none)+'</p>')+
    '<p class="product-video-real-note">'+secureText(t.note)+'</p></section>';
 }

 function curatedFeatured(id,selectedLang){
  const fb=facebookForModel(id).map(v=>({
   provider:"facebook",language:"EN",title:v.title||modelName(id),
   original:checkedFacebookUrl(v.url),
   isReel:/\/reel\//.test(v.url),
   kind:typeof v.kind==="string"?v.kind.toLowerCase():"review"
  }));
  const yt=(verified[id]||[]).filter(v=>/^[A-Za-z0-9_-]{11}$/.test(v.id)).map(v=>({
   provider:"youtube",language:v.lang,title:v.title,id:v.id,
   original:"https://www.youtube.com/watch?v="+v.id
  }));
  const enYouTube=yt.filter(v=>v.language==="EN");
  const ruYouTube=yt.filter(v=>v.language==="RU");
  // Do not silently start a Russian video on an English/Hebrew/Arabic page.
  // Local-language searches and accurately tagged foreign videos remain available.
  if(selectedLang==="ru")return [...ruYouTube,...enYouTube,...fb];
  return [...fb,...enYouTube];
 }

 /* Exact-model English tutorials and Facebook Reels appear below the main
    player, never instead of it. No unverifiable Reel IDs are fabricated.
    Only known HTTPS manufacturer pages can be offered as support guides. */
 const addonCopy={
  ru:{title:"Дополнительные видео",setup:"Настройка и подключение",reels:"Facebook Reels",source:"На английском языке",emptySetup:"Проверенных английских видеоинструкций именно для этой модели пока нет.",emptyReels:"Подтверждённых Reels этой модели пока нет.",guide:"Официальная инструкция (EN) ↗",facebook:"Facebook производителя ↗",view:"Смотреть в плеере",language:"EN"},
  en:{title:"More from NEOLINE",setup:"Setup & how-to videos",reels:"Facebook Reels",source:"English-language clips",emptySetup:"No verified English how-to videos for this exact model yet.",emptyReels:"No verified Reels for this exact model yet.",guide:"Official English guide ↗",facebook:"Manufacturer Facebook page ↗",view:"Watch in player",language:"EN"},
  he:{title:"עוד סרטונים של NEOLINE",setup:"הדרכות והגדרות",reels:"Facebook Reels",source:"סרטונים באנגלית",emptySetup:"עדיין אין סרטוני הדרכה מאומתים באנגלית לדגם זה.",emptyReels:"עדיין אין Reels מאומתים לדגם זה.",guide:"הוראות רשמיות באנגלית ↗",facebook:"עמוד הפייסבוק של היצרן ↗",view:"צפייה בנגן",language:"EN"},
  ar:{title:"المزيد من NEOLINE",setup:"الإعداد وطريقة الاستخدام",reels:"Facebook Reels",source:"فيديوهات باللغة الإنجليزية",emptySetup:"لا توجد فيديوهات تعليمية إنجليزية موثقة لهذا الطراز بعد.",emptyReels:"لا توجد Reels موثقة لهذا الطراز بعد.",guide:"دليل الشركة الرسمي بالإنجليزية ↗",facebook:"صفحة الشركة على Facebook ↗",view:"شاهد في المشغل",language:"EN"}
 };
 function safeGuideUrl(input){
  try{
   const u=new URL(input);
   if(u.protocol!=="https:" || !["neoline.com","www.neoline.com","info.neoline.com"].includes(u.hostname))return null;
   return u.href;
  }catch{return null}
 }
 function guideForModel(id){
  return facebookGuides.filter(g=>g &&
   (g.modelId!==undefined && Number(g.modelId)===id ||
     typeof g.model==="string" && normalizedVideoModel(g.model)===normalizedVideoModel(modelName(id))) &&
   /^en(?:[-_][a-z]+)?$/i.test(String(g.language||""))&&safeGuideUrl(g.url));
 }
 function renderAddOnItems(items,caption){
  return items.map(clip=>{
   const index=featuredItems.indexOf(clip);
   if(index<0)return "";
   const thumb=clip.provider==="youtube"?
     '<img src="https://i.ytimg.com/vi/'+clip.id+'/mqdefault.jpg" loading="lazy" decoding="async" alt="">':
     '<span class="product-video-addon-cover-fb" aria-hidden="true">f</span>';
   return '<button type="button" class="product-video-addon-video" data-featured-index="'+index+'">'+
    '<span class="product-video-addon-cover'+(clip.isReel?' is-reel':'')+'">'+thumb+'</span>'+
    '<span class="product-video-addon-itemcopy"><b>'+secureText(clip.title)+'</b>'+
    '<small>▶ '+secureText(caption)+' · '+secureText(clip.provider==="facebook"?"Facebook":"YouTube")+' · EN</small></span></button>';
  }).join("");
 }
 function renderEducationAddons(id,selectedLang){
  const t=addonCopy[selectedLang]||addonCopy.en;
  const verifiedEn=featuredItems.filter(v=>v.language==="EN");
  const setup=verifiedEn.filter(v=>["setup","settings","howto","tutorial","wifi","installation","firmware"].includes(v.kind));
  const reels=verifiedEn.filter(v=>v.provider==="facebook"&&v.isReel);
  const guides=guideForModel(id);
  const guideLinks=guides.map(g=>
   '<a class="product-video-addon-guide" href="'+safeGuideUrl(g.url)+'" target="_blank" rel="noopener noreferrer">'+
   '<span aria-hidden="true">↗</span><span>'+secureText(g.title||t.guide)+'</span></a>'
  ).join("");
  const cards=[
   {label:t.setup,icon:"⚙",type:"setup",clips:setup,
    empty:t.emptySetup,resources:guideLinks},
   {label:t.reels,icon:"▷",type:"reels",clips:reels,
    empty:t.emptyReels,
    resources:'<a class="product-video-addon-guide" href="https://www.facebook.com/neolainas/" target="_blank" rel="noopener noreferrer">'+
      '<span aria-hidden="true">↗</span><span>'+secureText(t.facebook)+'</span></a>'}
  ];
  return '<section class="product-video-addons"><div class="product-video-addons-top"><h3>'+secureText(t.title)+'</h3>'+
    '<span>'+secureText(t.source)+'</span></div><div class="product-video-addons-grid">'+
    cards.map(card=>
      '<details class="product-video-addon" data-video-addon="'+card.type+'"><summary>'+
      '<span class="product-video-addon-symbol" aria-hidden="true">'+card.icon+'</span>'+
      '<span class="product-video-addon-heading">'+secureText(card.label)+
      '<small>'+card.clips.length+' '+secureText(t.language)+'</small></span>'+
      '<span class="product-video-chevron" aria-hidden="true"></span></summary>'+
      '<div class="product-video-addon-body">'+
      (card.clips.length?renderAddOnItems(card.clips,t.view):
        '<p class="product-video-addon-empty">'+secureText(card.empty)+'</p>')+
      card.resources+'</div></details>').join("")+
    '</div></section>';
 }
 function featuredMarkup(id,selectedLang){
  const t=mainCopy[selectedLang]||mainCopy.en;
  featuredItems=curatedFeatured(id,selectedLang);
  const availableEnglish=featuredItems.some(v=>v.language==="EN");
  const fallback=selectedLang!=="ru"&&!availableEnglish;
  const playlist=featuredItems.length>1?
   '<div class="product-video-main-playlist" role="group" aria-label="'+secureText(t.playlist)+'">'+
   featuredItems.map((v,i)=>{
    const thumb=v.provider==="youtube"
      ?'<img src="https://i.ytimg.com/vi/'+v.id+'/mqdefault.jpg" loading="lazy" decoding="async" alt="">'
      :'<span class="product-video-main-fb-thumb" aria-hidden="true">f</span>';
    return '<button type="button" class="product-video-main-choice'+(i===0?' is-active':'')+'" data-featured-index="'+i+'" aria-pressed="'+(i===0)+'">'+
     '<span class="product-video-main-choice-art">'+thumb+'</span>'+
     '<span class="product-video-main-choice-caption"><b>'+secureText(v.language)+'</b>'+
     '<small>'+secureText(v.title)+'</small></span></button>';
   }).join('')+'</div>':"";
  return '<section class="product-video-main" aria-label="'+secureText(t.featured)+'">'+
   '<div class="product-video-main-heading"><h3>'+secureText(t.featured)+'</h3>'+
   (featuredItems.length?'<span class="product-video-main-provider" id="productVideoMainProvider"></span>':"")+'</div>'+
   (featuredItems.length?
    '<div class="product-video-main-frame" id="productVideoMainFrame"></div>'+
    '<div class="product-video-main-caption"><strong id="productVideoMainCaption"></strong>'+
    '<a id="productVideoMainOriginal" target="_blank" rel="noopener noreferrer"></a></div>'+
    (fallback?'<p class="product-video-main-warning">'+secureText(t.fallback)+'</p>':"")+
    playlist+
    '<p class="product-video-main-note">'+secureText(t.note)+'</p>'
    :'<p class="product-video-main-warning">'+secureText(t.missing)+'</p>')+
   '</section>';
 }
 function mainVideoSource(v){
  if(v.provider==="youtube"){
   return "https://www.youtube-nocookie.com/embed/"+v.id+"?rel=0&playsinline=1"+
    (v.language==="RU"?"&cc_load_policy=1&cc_lang_pref=en":"");
  }
  return "https://www.facebook.com/plugins/"+(v.isReel?"post.php":"video.php")+
   "?href="+encodeURIComponent(v.original)+"&show_text=false&width="+(v.isReel?"420":"640");
 }
 function showFeaturedVideo(index){
  const clip=featuredItems[index];
  const holder=get("productVideoMainFrame");
  if(!clip||!holder)return;
  const locale=typeof lang==="string"?lang:document.documentElement.lang;
  const t=mainCopy[locale]||mainCopy.en;
  holder.replaceChildren();
  holder.classList.toggle("is-reel",Boolean(clip.isReel));
  const iframe=document.createElement("iframe");
  iframe.src=mainVideoSource(clip);
  iframe.title=clip.title+" — "+clip.provider+" — "+clip.language;
  iframe.referrerPolicy="strict-origin-when-cross-origin";
  iframe.loading="eager";
  iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
  iframe.allowFullscreen=true;
  holder.append(iframe);
  get("productVideoMainProvider").textContent=
   (clip.provider==="facebook"?t.facebook:t.youtube)+" · "+clip.language;
  get("productVideoMainCaption").textContent=clip.title;
  const link=get("productVideoMainOriginal");
  link.href=clip.original;
  link.textContent=clip.provider==="facebook"?"Facebook ↗":"YouTube ↗";
  overlay.querySelectorAll("[data-featured-index]").forEach((button,i)=>{
   const active=i===index;
   button.classList.toggle("is-active",active);
   button.setAttribute("aria-pressed",String(active));
  });
 }
 function videoPreference(){
  const l=typeof lang==="string"?lang:document.documentElement.lang;
  return localVideo[l]||localVideo.ru;
 }

 const currentLocale=()=>copy[typeof lang==="string"?lang:document.documentElement.lang]||copy.ru;
 let currentId=null;
 const overlay=document.createElement("div");
 overlay.id="productVideoCatalog";
 overlay.className="product-video-catalog";
 overlay.hidden=true;
 overlay.setAttribute("role","dialog");
 overlay.setAttribute("aria-modal","true");
 overlay.setAttribute("aria-labelledby","productVideoTitle");
 overlay.innerHTML='<div class="product-video-backdrop" data-close-video></div><section class="product-video-panel" tabindex="-1">'+
  '<header class="product-video-header"><div><span class="product-video-kicker">NEOLINE</span><h2 id="productVideoTitle"></h2><p class="product-video-model" id="productVideoModel"></p></div>'+
  '<button type="button" class="product-video-close" data-close-video aria-label="Close">×</button></header>'+
  '<div class="product-video-scroll" id="productVideoResults"></div></section>';
 document.body.append(overlay);
 function modelName(id){
  const item=typeof products!=="undefined"?products.find(p=>p.id===id):null;
  return item?.name||"NEOLINE";
 }

 function youtubeSearch(query,pref){
  return "https://www.youtube.com/results?search_query="+encodeURIComponent(query)+
    "&hl="+encodeURIComponent(pref.hl)+"&gl="+encodeURIComponent(pref.gl);
 }
 function stopPlayback(){
  overlay.querySelectorAll("iframe").forEach(frame=>frame.remove());
  overlay.querySelectorAll(".product-video-embed").forEach(el=>el.replaceChildren());
 }
 function closeVideos(){
  if(overlay.hidden)return;
  stopPlayback();overlay.hidden=true;currentId=null;
  document.body.classList.remove("product-video-open");
  get("productVideoOpen")?.focus({preventScroll:true});
 }
 function renderClips(clips,t){
  return '<div class="product-video-tiles">'+clips.map(v=>
   '<article class="product-video-tile"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg" alt="">'+
   '<div class="product-video-tile-copy"><span class="product-video-tag">'+secureText(t[v.type]||t.review)+' · '+secureText(v.lang)+'</span><strong>'+secureText(v.title)+'</strong>'+
   '<div class="product-video-tile-actions"><button type="button" data-play-yt="'+v.id+'">▶ '+secureText(t.watch)+'</button>'+
   '<a href="https://www.youtube.com/watch?v='+v.id+'" target="_blank" rel="noopener noreferrer">'+secureText(t.youtube)+'</a></div>'+
   '</div><div class="product-video-embed" data-embed-for="'+v.id+'"></div></article>').join('')+'</div>';
 }
 function renderVideoList(id){
  const t=currentLocale(),pref=videoPreference(),name=modelName(id);
  get("productVideoTitle").textContent=t.header;
  get("productVideoModel").textContent=name;
  const matched=(verified[id]||[]).filter(v=>v.lang===pref.tag);
  const foreign=(verified[id]||[]).filter(v=>v.lang!==pref.tag);
  /* On mobile the language-specific searches stay visible first.
     Real review videos are available in a compact disclosure below. */
  const localClips=matched.length?
   '<details class="product-video-curated product-video-featured"><summary>'+
    '<span class="product-video-featured-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></svg></span>'+
    '<span class="product-video-featured-title">'+secureText(t.verified)+' ('+matched.length+')</span>'+
    '<span class="product-video-chevron" aria-hidden="true"></span></summary>'+
    '<div class="product-video-featured-body">'+renderClips(matched,t)+'</div></details>':
   '<p class="product-video-empty">'+secureText(pref.none)+'</p>';
  // Four coherent outline icons replace OS-dependent emojis and oversized logos.
  // Review: play/check; comparison: two panels; promo: screen/spark; samples: aperture/REC.
  const iconPaths=[
   '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/><path d="m5.5 19 2 2 3.5-4"/>',
   '<rect x="2.5" y="5" width="8" height="12" rx="2"/><rect x="13.5" y="5" width="8" height="12" rx="2"/><path d="M7 20h10m-3-2 3 2-3 2"/>',
   '<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="m10 10 5 2.2-5 2.3z"/><path d="m18 2 .6 2.3L21 5l-2.4.6L18 8l-.6-2.4L15 5l2.4-.7z"/>',
   '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3"/><path d="M12 4 8.5 9M20 11l-5.5 1.5M12 20l3.5-5M4 13l5.5-1.5"/><circle cx="19.5" cy="4.5" r="1.4" fill="currentColor" stroke="none"/>'
  ];
  const iconSvg=i=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+iconPaths[i]+'</svg>';
  const arrowSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19 19 5M9 5h10v10"/></svg>';
  const worldSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg>';
  const searches='<section class="product-video-searches product-video-localized">'+
   '<div class="product-video-section-heading"><h3><span class="product-video-lang-code" aria-hidden="true">'+secureText(pref.tag)+'</span>'+secureText(pref.title)+'</h3>'+
   '<span class="product-video-region">'+secureText(pref.region)+' · YouTube</span></div>'+
   '<div class="product-video-search-grid">'+pref.items.map((label,i)=>
     '<a target="_blank" rel="noopener noreferrer" href="'+youtubeSearch('"'+name+'" '+pref.terms[i],pref)+'" aria-label="'+secureText(label)+' — YouTube">'+
      '<span class="product-video-search-icon">'+iconSvg(i)+'</span><span class="product-video-search-label">'+secureText(label)+'</span>'+
      '<span class="product-video-search-arrow" aria-hidden="true">'+arrowSvg+'</span></a>'
    ).join('')+'</div><p class="product-video-note">'+secureText(pref.note)+'</p></section>';
  const other=foreign.length?
   '<details class="product-video-other"><summary><span class="product-video-other-symbol">'+worldSvg+'</span><span class="product-video-other-label">'+secureText(pref.other)+' ('+foreign.length+')</span><span class="product-video-chevron" aria-hidden="true"></span></summary><div class="product-video-other-body">'+renderClips(foreign,t)+'</div></details>':"";
  const selectedLang=typeof lang==="string"?lang:document.documentElement.lang;
  // The actual embedded player is visible immediately. Everything else is secondary.
  const mc=mainCopy[selectedLang]||mainCopy.en;
  const main=featuredMarkup(id,selectedLang);
  const additions=renderEducationAddons(id,selectedLang);
  const extra='<details class="product-video-extras"><summary>'+
   '<span class="product-video-extras-icon" aria-hidden="true">☷</span>'+
   '<span>'+secureText(mc.extras)+'</span>'+
   '<span class="product-video-chevron" aria-hidden="true"></span></summary>'+
   '<div class="product-video-extras-body">'+searches+renderSocial(id,selectedLang)+
   (featuredItems.length?"":localClips)+
   (featuredItems.length?"":other)+'</div></details>';
  get("productVideoResults").innerHTML=main+additions+extra;
  if(featuredItems.length)showFeaturedVideo(0);
 }

 function openVideos(id){
  if(!Number.isFinite(id))return;
  stopPlayback();currentId=id;
  renderVideoList(id);
  overlay.hidden=false;document.body.classList.add("product-video-open");
  overlay.querySelector(".product-video-panel").focus({preventScroll:true});
 }
 overlay.addEventListener("click",event=>{
  if(event.target.closest("[data-close-video]")){closeVideos();return}
  const featuredButton=event.target.closest("[data-featured-index]");
  if(featuredButton){
   const index=Number(featuredButton.dataset.featuredIndex);
   if(Number.isSafeInteger(index)&&index>=0&&index<featuredItems.length){
    stopPlayback();
    showFeaturedVideo(index);
    if(featuredButton.closest(".product-video-addon")){
     get("productVideoMainFrame")?.scrollIntoView({behavior:"smooth",block:"nearest"});
    }
   }
   return;
  }
  const fbButton=event.target.closest("[data-play-facebook]");
  if(fbButton){
   const number=Number(fbButton.dataset.playFacebook);
   const video=facebookForModel(currentId)[number];
   const original=video&&checkedFacebookUrl(video.url);
   if(!original || !Number.isSafeInteger(number))return;
   stopPlayback();
   const container=overlay.querySelector('[data-facebook-embed-for="'+number+'"]');
   if(!container)return;
   const frame=document.createElement("iframe");
   const plugin=/\/reel\//.test(original)?"post.php":"video.php";
   frame.src="https://www.facebook.com/plugins/"+plugin+"?href="+encodeURIComponent(original)+"&show_text=false&width=640";
   frame.title="NEOLINE Facebook video";
   frame.loading="eager";
   frame.allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen";
   frame.referrerPolicy="strict-origin-when-cross-origin";
   frame.allowFullscreen=true;
   container.append(frame);
   container.scrollIntoView({behavior:"smooth",block:"nearest"});
   return;
  }
  const social=event.target.closest("[data-play-social]");
  const play=event.target.closest("[data-play-yt]");
  if(!social&&!play)return;
  const id=social?social.dataset.playSocial:play.dataset.playYt;
  const isRutube=Boolean(social);
  if(isRutube){
   // The identifier must belong to the *current model's* reviewed links.
   const listed=(socialVideos[currentId]||[]).some(v=>v.platform==="rutube"&&v.id===id);
   if(!listed||!(/^[a-f0-9]{32}$/.test(id)))return;
  }else if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
  stopPlayback();
  const container=overlay.querySelector(isRutube?'[data-social-embed="'+id+'"]':'[data-embed-for="'+id+'"]');
  if(!container)return;
  const frame=document.createElement("iframe");
  frame.src=isRutube?"https://rutube.ru/play/embed/"+id+"/":
    "https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1&rel=0";
  frame.title=isRutube?"NEOLINE RUTUBE video":"NEOLINE YouTube video";
  frame.loading="lazy";
  frame.allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen";
  frame.referrerPolicy="strict-origin-when-cross-origin";
  frame.allowFullscreen=true;
  container.append(frame);
  container.scrollIntoView({behavior:"smooth",block:"nearest"});
 });
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&!overlay.hidden){
   event.stopImmediatePropagation();event.preventDefault();closeVideos();
  }
 },true);
 function modalButton(id){
  const mediaNode=get("productModalBody")?.querySelector(".modal-media");
  if(!mediaNode)return;
  const previous=mediaNode.querySelector("#productVideoOpen");
  if(previous)previous.remove();
  const button=document.createElement("button");
  button.type="button";button.id="productVideoOpen";
  button.className="product-video-open-button";
  button.setAttribute("aria-label",currentLocale().video);
  button.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/></svg><span>'+secureText(currentLocale().video)+'</span>';
  button.addEventListener("click",()=>openVideos(id));
  mediaNode.append(button);
 }
 function tileButtons(){
  const root=get("products");
  if(!root)return;
  for(const card of root.querySelectorAll("article.product")){
   const photo=card.querySelector("[data-photo]"),detail=card.querySelector("[data-details]");
   const id=Number(photo?.dataset.photo||detail?.dataset.details);
   if(!Number.isFinite(id)||card.querySelector(".catalog-product-video-button"))continue;
   const photoArea=card.querySelector(".product-art");
   if(!photoArea)continue;
   const button=document.createElement("button");
   button.type="button";
   button.className="catalog-product-video-button";
   button.setAttribute("aria-label",currentLocale().video+" — "+modelName(id));
   button.title=currentLocale().video;
   button.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/></svg>';
   button.addEventListener("click",event=>{
    event.stopPropagation();
    openProduct(id);
    openVideos(id);
   });
   photoArea.append(button);
  }
 }
 // Both old showcase items and the imported manufacturer catalog use openProduct().
 const previousOpen=window.openProduct;
 if(typeof previousOpen!=="function")return;
 window.openProduct=function(id){
  const result=previousOpen(id);
  if(get("productModal")?.classList.contains("open"))modalButton(id);
  return result;
 };
 const productRoot=get("products");
 if(productRoot){new MutationObserver(tileButtons).observe(productRoot,{childList:true});tileButtons();}
 // Remove video iframe on closing the product panel and on history/back navigation.
 get("closeProduct")?.addEventListener("click",closeVideos);
 get("productModal")?.addEventListener("click",event=>{
  if(event.target===get("productModal"))closeVideos();
 });
 window.addEventListener("pagehide",closeVideos);
 loadFacebookCatalog();
 window.NEOLINE_PRODUCT_VIDEOS={open:openVideos,close:closeVideos};
})();
