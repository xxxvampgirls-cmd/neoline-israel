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

 const localVideo={
 ru:{hl:"ru",gl:"RU",tag:"RU",flag:"🇷🇺",region:"Россия",title:"Обзоры на русском",items:["Обзоры","Сравнения","Презентации и реклама","Примеры съёмки"],terms:["обзор отзыв тест","сравнение видеорегистраторов","официальная презентация реклама","пример записи день ночь"],other:"Видео на других языках",none:"Проверенных русскоязычных роликов для этой модели пока нет. Начните с подборок ниже.",note:"YouTube открывается на русском языке с регионом Россия. Язык видео не гарантирован."},
 en:{hl:"en-GB",gl:"GB",tag:"EN",flag:"🇬🇧",region:"United Kingdom",title:"English reviews first",items:["English reviews","Comparisons","Ads and presentations","Video samples"],terms:["review hands on English","comparison dashcam English","official promo presentation English","sample footage day night English"],other:"Videos in other languages",none:"No verified English review for this exact model yet. English searches below take priority over Russian videos.",note:"Search opens YouTube in English with the United Kingdom region. Results and spoken language depend on YouTube."},
 he:{hl:"iw",gl:"IL",tag:"HE",flag:"🇮🇱",region:"ישראל",title:"סקירות בעברית",items:["סקירות בעברית","השוואות","פרסומות ומצגות","דוגמאות צילום"],terms:["סקירה ביקורת בדיקה","השוואה מצלמת רכב","פרסומת מצגת רשמית","צילום דוגמה יום לילה"],other:"סרטונים בשפות אחרות",none:"אין כרגע סקירה מאומתת בעברית. חיפוש בעברית מקבל קדימות.",note:"חיפוש ביוטיוב בעברית באזור ישראל. שפת הסרטונים אינה מובטחת."},
 ar:{hl:"ar",gl:"AE",tag:"AR",flag:"🇦🇪",region:"الإمارات",title:"مراجعات باللغة العربية",items:["مراجعات عربية","مقارنات","إعلانات وعروض","تجارب التصوير"],terms:["مراجعة وتجربة كاميرا سيارة","مقارنة أجهزة تسجيل القيادة","إعلان عرض رسمي","تجربة تصوير نهار ليل"],other:"فيديوهات بلغات أخرى",none:"لا توجد مراجعات عربية موثقة حالياً. البحث باللغة العربية يظهر أولاً.",note:"يفتح البحث في يوتيوب بالعربية والإمارات. اللغة ليست مضمونة."}
 };
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
  get("productVideoResults").innerHTML=searches+localClips+other;
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
  const play=event.target.closest("[data-play-yt]");
  if(!play)return;
  const id=play.dataset.playYt;
  if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
  stopPlayback();
  const container=overlay.querySelector('[data-embed-for="'+id+'"]');
  if(!container)return;
  const frame=document.createElement("iframe");
  frame.src="https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1&rel=0";
  frame.title="NEOLINE YouTube video";
  frame.loading="lazy";
  frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
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
 window.NEOLINE_PRODUCT_VIDEOS={open:openVideos,close:closeVideos};
})();
