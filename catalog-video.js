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
  1:[{id:"fIaU3RCV2c4",type:"review",lang:"RU",title:"NEOLINE WowCam Wi-Fi — user review"}],
  2:[{id:"ezMfOK-1EPo",type:"review",lang:"RU",title:"NEOLINE Flash 2K Wi-Fi — owner review"}],
  6:[{id:"2qQBchWAr9E",type:"review",lang:"RU",title:"NEOLINE Argus 4K Dual — detailed review"},
     {id:"QCTWrtoIQUI",type:"comparison",lang:"RU",title:"NEOLINE Argus 4K Dual — dashcam comparison"}]
 };
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
  '<header class="product-video-header"><div><span class="product-video-kicker">NEOLINE · YouTube</span><h2 id="productVideoTitle"></h2><p class="product-video-model" id="productVideoModel"></p></div>'+
  '<button type="button" class="product-video-close" data-close-video aria-label="Close">×</button></header>'+
  '<div class="product-video-scroll" id="productVideoResults"></div></section>';
 document.body.append(overlay);
 function modelName(id){
  const item=typeof products!=="undefined"?products.find(p=>p.id===id):null;
  return item?.name||"NEOLINE";
 }
 function youtubeSearch(value){return "https://www.youtube.com/results?search_query="+encodeURIComponent(value)}
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
 function renderVideoList(id){
  const t=currentLocale(),name=modelName(id);
  get("productVideoTitle").textContent=t.header;
  get("productVideoModel").textContent=name;
  const existing=verified[id]||[];
  const clips=existing.length
   ?'<div class="product-video-curated"><h3>▶ '+secureText(t.verified)+'</h3><div class="product-video-tiles">'+existing.map(v=>
     '<article class="product-video-tile"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg" alt="">'+
     '<div class="product-video-tile-copy"><span class="product-video-tag">'+secureText(t[v.type]||t.review)+' · '+v.lang+'</span><strong>'+secureText(v.title)+'</strong>'+
     '<div class="product-video-tile-actions"><button type="button" data-play-yt="'+v.id+'">▶ '+secureText(t.watch)+'</button>'+
     '<a href="https://www.youtube.com/watch?v='+v.id+'" target="_blank" rel="noopener noreferrer">'+secureText(t.youtube)+'</a></div>'+
     '</div><div class="product-video-embed" data-embed-for="'+v.id+'"></div></article>').join('')+'</div></div>'
   :'<p class="product-video-empty">'+secureText(t.missing)+'</p>';
  const searches=[
   {label:t.english,query:'"'+name+'" dash cam review English',icon:"🇬🇧"},
   {label:t.brand,query:'"'+name+'" NEOLINE official promo commercial',icon:"📣"},
   {label:t.test,query:'"'+name+'" test sample footage',icon:"🎬"},
   {label:t.russian,query:'"'+name+'" обзор тест',icon:"🔎"}
  ];
  get("productVideoResults").innerHTML=clips+
   '<div class="product-video-searches"><h3>YouTube · '+secureText(t.find)+'</h3><div class="product-video-search-grid">'+
   searches.map(row=>'<a target="_blank" rel="noopener noreferrer" href="'+youtubeSearch(row.query)+'"><span class="product-video-search-icon">'+row.icon+'</span><span>'+secureText(row.label)+'</span><span aria-hidden="true">↗</span></a>').join('')+
   '</div><p class="product-video-note">'+secureText(t.note)+'</p></div>';
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
