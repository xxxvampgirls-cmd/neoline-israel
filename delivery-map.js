
/* NEOLINE Israel nationwide pickup map.
 * Coordinates originate from OpenStreetMap, not search-result guesses.
 * Coverage is necessarily incomplete; operators' official locators remain
 * authoritative. Uses a single cached Overpass query per browser per day. */
(function(){
 "use strict";
 const bounds=[[29.48,34.20],[33.32,35.86]];
 /* Daily snapshot is fetched by GitHub Actions. Visitors no longer make
    slow mass Overpass requests from every phone / browser session. */
 const snapshotURL="./assets/pickup/points.json";
 const cacheKey="neoline-pickup-osm-v4",cacheMs=24*60*60*1000;
 const retailers={
  ksp:{title:"KSP",mark:"K",color:"#d44a86"},
  ivory:{title:"Ivory",mark:"I",color:"#b942a8"},
  bug:{title:"BUG",mark:"B",color:"#b63b88"},
  autodepot:{title:"AutoDepot",mark:"A",color:"#b43879"},
  ace:{title:"ACE",mark:"A",color:"#9355a8"},
  payngo:{title:"מחסני חשמל",mark:"M",color:"#ca5591"},
  shekem:{title:"Shekem Electric",mark:"S",color:"#b56cb5"},
  alm:{title:"ALM",mark:"ALM",color:"#ae5c9f"}
 };
 const retailSource="./assets/retail/points.json";
 const retailCacheKey="neoline-real-stores-v1";
 let retailPoints=[],retailLoaded=false,retailLoading=false,retailCurrent=null;
 function emitStats(){
  window.dispatchEvent(new CustomEvent("neoline:map-stats",{
   detail:{pickup:points,retail:retailPoints,retailLoaded}
  }));
 }

 const brands={
  boxit:{title:"BOXIT",mark:"B",color:"#087ebf",rx:/box\s*[- ]?\s*it|בוקסיט|בוקס.?איט/i},
  done:{title:"DONE",mark:"D",color:"#0084cd",rx:/\bdone\b|דאן|דון לוקרים/i},
  doar:{title:"Israel Post",mark:"24",color:"#16759e",rx:/israel\s*post|דואר\s*ישראל|doar\s*israel/i},
  epost:{title:"E-POST · HFD",mark:"E",color:"#7758c8",rx:/\be[-\s.]?post\b|\bhfd\b|אי.?פוסט|איפוסט/i},
  pickup:{title:"PickUP",mark:"P",color:"#3283b1",rx:/pick\s*[- ]?\s*up|פיקאפ/i},
  cheetah:{title:"Cheetah Shops",mark:"C",color:"#d18b37",rx:/cheetah|chita|צ.?יטה/i},
  zigzag:{title:"ZigZag BOX",mark:"Z",color:"#c065a6",rx:/zig.?zag|זיג.?זג/i},
  shlager:{title:"Shlager",mark:"S",color:"#19a494",rx:/shlager|שלאגר/i},
  easypoint:{title:"Easy Point",mark:"EP",color:"#5287d8",rx:/easy\s*point|איזי פוינט/i},
  cargo:{title:"Cargo",mark:"C",color:"#5275b5",rx:/\bcargo\b|קארגו/i},
  dhl:{title:"DHL Express",mark:"DHL",color:"#d39800",rx:/\bdhl\b/i},
  fedex:{title:"FedEx",mark:"FX",color:"#7354aa",rx:/fed\s*ex|פדאקס/i},
  other:{title:"Other mapped pickup point",mark:"·",color:"#8195a5"}
 };
 const words={
  ru:{country:"Весь Израиль",loading:"Загружаем реальные точки из OpenStreetMap…",done:"Точек на карте: ",partial:"Данные OSM неполные; проверьте карту оператора.",none:"Точек этой сети пока нет в открытой базе OSM. Уточните адреса на сайте сети.",failed:"Координаты временно недоступны. Используйте ссылки на карты операторов.",noCity:"Город не найден. Выберите город ниже или уточните название.",directions:"Маршрут в Google Maps ↗",noAddress:"Адрес в OpenStreetMap не указан",source:"Данные OpenStreetMap — не реестр всех операторов",title:"Карта Израиля · точки из OpenStreetMap",hint:"Показаны только точки с опубликованными координатами OSM. Полный список проверяйте на официальной карте сети.",typePost:"Почтовое отделение",typeLocker:"Постамат / пункт выдачи",other:"Другой или неуказанный оператор"},
  en:{country:"Whole Israel",loading:"Loading actual OpenStreetMap locations…",done:"Mapped locations: ",partial:"OSM coverage is partial. Check operator locators.",none:"No locations for this network are listed in OSM yet. Check the operator's site.",failed:"Coordinates unavailable right now. Use the official location directories.",noCity:"City not found. Try a nearby city or different spelling.",directions:"Directions in Google Maps ↗",noAddress:"Address not available in OpenStreetMap",source:"OpenStreetMap is not a complete carrier directory",title:"Israel map · OpenStreetMap locations",hint:"Only points with OSM coordinates are mapped. Verify the full network at the operator's official site.",typePost:"Post office",typeLocker:"Parcel locker / pickup point",other:"Other or unknown operator"},
  he:{country:"כל ישראל",loading:"טוענים נקודות עם מיקום אמיתי מ-OpenStreetMap…",done:"נקודות במפה: ",partial:"הנתונים ב-OSM חלקיים. בדקו באתר המפעיל.",none:"עדיין אין נקודות של הרשת במאגר OSM. בדקו באתר הרשמי.",failed:"המיקומים אינם זמינים כעת. עברו למפות הרשתות.",noCity:"העיר לא נמצאה. נסו שם אחר.",directions:"ניווט במפות Google ↗",noAddress:"לא צוינה כתובת ב-OpenStreetMap",source:"OpenStreetMap אינו כולל את כל רשתות החלוקה",title:"מפת ישראל · נקודות מ-OpenStreetMap",hint:"מופיעות רק נקודות עם קואורדינטות OSM. לרשימה מלאה בדקו באתר המפעיל.",typePost:"סניף דואר",typeLocker:"לוקר / נקודת איסוף",other:"מפעיל אחר או לא ידוע"},
  ar:{country:"كل إسرائيل",loading:"جارٍ تحميل مواقع OpenStreetMap الحقيقية…",done:"المواقع على الخريطة: ",partial:"تغطية OSM غير مكتملة. تحقق من موقع المشغل.",none:"لا توجد مواقع لهذه الشبكة في OSM حالياً. تحقق من موقع المشغل.",failed:"المواقع غير متاحة حالياً. استخدم دليل المشغل الرسمي.",noCity:"لم يتم العثور على المدينة. جرب اسماً آخر.",directions:"الاتجاهات في خرائط Google ↗",noAddress:"العنوان غير متوفر في OpenStreetMap",source:"بيانات OpenStreetMap ليست دليلاً شاملاً لكل المشغلين",title:"خريطة إسرائيل · مواقع OpenStreetMap",hint:"تُعرض النقاط ذات الإحداثيات المنشورة فقط. تحقق من القائمة الرسمية للمشغل.",typePost:"مكتب بريد",typeLocker:"خزانة طرود / نقطة استلام",other:"مشغل آخر أو غير معروف"}
 };
 const cityCoords={
  "אריאל":[32.1065,35.1845],"ariel":[32.1065,35.1845],"ариэль":[32.1065,35.1845],
  "תל אביב":[32.0853,34.7818],"tel aviv":[32.0853,34.7818],"тель-авив":[32.0853,34.7818],
  "פתח תקווה":[32.0871,34.8878],"petah tikva":[32.0871,34.8878],"петах-тиква":[32.0871,34.8878],
  "ירושלים":[31.7683,35.2137],"jerusalem":[31.7683,35.2137],"иерусалим":[31.7683,35.2137],
  "חיפה":[32.7940,34.9896],"haifa":[32.7940,34.9896],"хайфа":[32.7940,34.9896],
  "באר שבע":[31.2518,34.7913],"be'er sheva":[31.2518,34.7913],"беэр-шева":[31.2518,34.7913],
  "אילת":[29.5581,34.9482],"eilat":[29.5581,34.9482],"эйлат":[29.5581,34.9482]
 };
 const searchCache={};
 let map=null,group=null,points=[],ready=false,loaded=false,loading=false,
     active="all",fallbackQuery="parcel lockers Israel",fallbackVisible=false;
 const el=id=>document.getElementById(id);
 const language=()=>words[document.documentElement.lang]||words.ru;
 function html(v){
  return String(v??"").replace(/[&<>"']/g,c=>({
   "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
 }
 function status(text,kind){
  const node=el("mapProgress");if(!node)return;
  node.textContent=text;node.classList.toggle("is-error",kind==="error");
  node.classList.toggle("is-ready",kind==="ready");
 }
 function detect(tags){
  const source=[
   tags.brand,tags.operator,tags.network,tags.name,
   tags["name:en"],tags["name:he"],tags["brand:en"],
   tags["operator:en"],tags["operator:he"]
  ].filter(Boolean).join(" ");
  for(const id of Object.keys(brands)){
   if(brands[id].rx&&brands[id].rx.test(source))return id;
  }
  // A tagged post office may not provide the operator's brand.
  // Keep unlabeled branches visible, but don't invent an affiliation.
  return "other";
 }
 function parseOSM(data){
  if(!Array.isArray(data?.elements))throw Error("Invalid OpenStreetMap response");
  const seen=new Set(),items=[];
  for(const item of data.elements){
   const lat=Number(item.lat??item.center?.lat),lon=Number(item.lon??item.center?.lon);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<29.3||lat>33.5||lon<34.1||lon>36.1)continue;
   const key=item.type+":"+item.id;if(seen.has(key))continue;seen.add(key);
   const tags=item.tags||{},id=detect(tags);
   const address=[
    [tags["addr:street"],tags["addr:housenumber"]].filter(Boolean).join(" "),
    tags["addr:city"]||tags["addr:suburb"]||""
   ].filter(Boolean).join(", ");
   const post=tags.amenity==="post_office";
   items.push({key,lat,lon,id,title:tags.name||tags["name:en"]||"",address,post});
  }
  return items.slice(0,5000);
 }
 function markerIcon(id){
  const brand=retailCurrent?(retailers[id]||brands.other):(brands[id]||brands.other);
  return L.divIcon({
   className:"pickup-pin"+(id==="other"?" pickup-pin--other":""),
   html:'<span style="--pin-color:'+brand.color+'"><span>'+html(brand.mark)+'</span></span>',
   iconSize:[36,37],iconAnchor:[17,36],popupAnchor:[0,-31]
  });
 }
 function showPoints(){
  if(!map||!group)return;
  group.clearLayers();
  const isRetail=retailCurrent!==null;
  const list=isRetail?retailPoints:points;
  let count=0;
  for(const point of list){
   if(isRetail?point.id!==retailCurrent:(active!=="all"&&point.id!==active))continue;
   const br=(isRetail?retailers:brands)[point.id]||brands.other,t=language();
   const name=point.title||(isRetail?br.title:(point.post?t.typePost:t.typeLocker));
   const provider=isRetail?br.title:(point.id==="other"?t.other:br.title);
   const mapsUrl="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(point.lat+","+point.lon);
   const popup='<div class="pickup-popup"><strong>'+html(name)+'</strong>'+
    '<div class="pickup-popup-type">'+html(provider)+'</div>'+
    '<div class="pickup-popup-address">'+html(point.address||t.noAddress)+'</div>'+
    '<a href="'+mapsUrl+'" target="_blank" rel="noopener noreferrer">'+html(t.directions)+'</a></div>';
   const mark=L.marker([point.lat,point.lon],{icon:markerIcon(point.id),title:name});
   mark.bindPopup(popup,{maxWidth:260});group.addLayer(mark);count++;
  }
  const dataReady=isRetail?retailLoaded:loaded;
  if(dataReady&&count===0){
   showFallback(true);
   return;
  }
  if(dataReady){
   hideFallback();
   status(language().done+count+" · "+language().partial,"ready");
  }else{
   // No old results can remain visible after switching to a retailer layer.
   status(language().loading);
  }
  emitStats();
 }
 function fitNation(){
  if(!map)return;
  map.fitBounds(bounds,{padding:[7,7],animate:false});
  setTimeout(()=>map.invalidateSize(),120);
 }
 function setProvider(id){
  active=id;
  retailCurrent=null;
  const reset=el("resetCountry");
  if(reset)reset.textContent="🇮🇱 "+language().country;
  if(loaded)showPoints();
  else if(fallbackVisible)showFallback();
 }
 function retailCacheRead(){
  try{
   const saved=JSON.parse(localStorage.getItem(retailCacheKey)||"null");
   if(saved&&Date.now()-saved.at<cacheMs&&Array.isArray(saved.points)&&saved.points.length>=8)
    return saved.points;
  }catch(e){}
  return null;
 }
 async function loadRetail(){
  if(retailLoading||retailLoaded)return;
  retailLoading=true;
  const cache=retailCacheRead();
  if(cache){
   retailPoints=cache;retailLoaded=true;retailLoading=false;
   if(retailCurrent)showPoints();
   emitStats();return;
  }
  const controller=new AbortController(),deadline=setTimeout(()=>controller.abort(),7500);
  try{
   const response=await fetch(retailSource+"?v="+Math.floor(Date.now()/86400000),{
    cache:"no-store",signal:controller.signal
   });
   if(!response.ok)throw Error("Retail snapshot HTTP "+response.status);
   const data=await response.json();
   if(data.version!==1||!Array.isArray(data.points)||data.points.length<8)
    throw Error("Unverified retail snapshot");
   retailPoints=data.points.filter(p=>retailers[p.id]&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&
    p.lat>=29.3&&p.lat<=33.5&&p.lon>=34.1&&p.lon<=36.1);
   if(retailPoints.length<8)throw Error("No verified retailer points");
   retailLoaded=true;
   try{localStorage.setItem(retailCacheKey,JSON.stringify({at:Date.now(),points:retailPoints}))}catch(e){}
   if(retailCurrent)showPoints();
   emitStats();
  }catch(e){
   console.warn("Retail OSM snapshot unavailable:",e.message);
   if(retailCurrent)showFallback();
  }finally{retailLoading=false;clearTimeout(deadline)}
 }
 function setRetailer(id){
  if(!retailers[id])return;
  retailCurrent=id;
  if(retailLoaded)showPoints();
  else{
   group?.clearLayers();
   status(language().loading);
   if(fallbackVisible)showFallback();
   loadRetail();
  }
 }
 function retailStats(){
  const counts={};
  retailPoints.forEach(p=>counts[p.id]=(counts[p.id]||0)+1);
  return {loaded:retailLoaded,count:retailPoints.length,byRetailer:counts};
 }
 function pickupStats(){
  const counts={};
  points.forEach(p=>counts[p.id]=(counts[p.id]||0)+1);
  return {loaded,count:points.length,byProvider:counts};
 }
 function init(){
  if(!window.L){
   showFallback();
   return;
  }
  try{
   map=L.map("pickupMap",{zoomControl:false,scrollWheelZoom:false,
    minZoom:6,maxZoom:18,preferCanvas:true});
   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
    maxZoom:18
   }).addTo(map);
   L.control.zoom({position:"bottomright"}).addTo(map);
   group=typeof L.markerClusterGroup==="function"?
     L.markerClusterGroup({chunkedLoading:true,showCoverageOnHover:false,spiderfyOnMaxZoom:true,
      maxClusterRadius:44,disableClusteringAtZoom:15,
      iconCreateFunction:function(cluster){
       return L.divIcon({className:"pickup-cluster",html:"<span>"+cluster.getChildCount()+"</span>",
        iconSize:[48,48],iconAnchor:[24,24]});
      }
     }):L.layerGroup();
   group.addTo(map);fitNation();
   ready=true;
   el("resetCountry").addEventListener("click",()=>{
    el("city").value="";fitNation();
    setTimeout(()=>map.invalidateSize(),250);
   });
   status(language().loading);
   loadPoints();
  }catch(e){
   console.warn("Pickup map unavailable:",e);
   showFallback();
  }
 }
 // Returns real coordinates only, never synthetic/guessed pins.
 function cacheRead(){
  try{
   const saved=JSON.parse(localStorage.getItem(cacheKey)||"null");
   if(saved&&Number.isFinite(saved.at)&&Date.now()-saved.at<cacheMs&&
    Array.isArray(saved.points)&&saved.points.length>=25)return saved.points;
  }catch(e){}
  return null;
 }
 function cacheSave(list){
  try{localStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),points:list}))}catch(e){}
 }
 function showFallback(noResults=false){
  const frame=el("map"),container=el("pickupMap");
  fallbackVisible=true;
  if(container)container.style.visibility="hidden";
  if(frame){
   frame.hidden=false;
   const src="https://www.google.com/maps?q="+encodeURIComponent(fallbackQuery)+"&output=embed";
   if(frame.src!==src)frame.src=src;
  }
  const lang=document.documentElement.lang||"ru";
  const hint={
   ru:noResults?"В OSM нет подтверждённых точек этой сети. Показываем поиск Google Maps — проверьте официальный справочник.":"Карта Google Maps: результаты поиска, не полный реестр пунктов. Официальные карты сетей доступны ниже.",
   en:noResults?"No verified OSM points for this network. Showing Google search — verify in the operator directory.":"Google Maps search, not a complete official location register. Operator directories are below.",
   he:noResults?"אין נקודות OSM מאומתות לרשת זו. מוצג חיפוש Google — בדקו באתר המפעיל.":"תוצאות חיפוש ב-Google Maps, לא רשימה מלאה. קישורים רשמיים מופיעים למטה.",
   ar:noResults?"لا توجد نقاط OSM موثقة لهذه الشبكة. نعرض بحث Google — تحقق من موقع المشغل.":"نتائج بحث خرائط Google وليست قائمة كاملة. الروابط الرسمية أدناه."
  };
  status(hint[lang]||hint.ru,"error");
 }
 function hideFallback(){
  fallbackVisible=false;
  const frame=el("map"),container=el("pickupMap");
  if(frame)frame.hidden=true;
  if(container)container.style.visibility="visible";
  setTimeout(()=>map?.invalidateSize(),80);
 }
 async function loadPoints(){
  if(loading)return;
  loading=true;
  const cached=cacheRead();
  if(cached){points=cached;loaded=true;showPoints();emitStats();loading=false;return;}
  // Existing page should never stay at "Loading..." for 70 seconds.
  // The static verified snapshot is built daily by GitHub, outside browsers.
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),6500);
  try{
   const day=Math.floor(Date.now()/86400000);
   const response=await fetch(snapshotURL+"?v="+day,{
    signal:controller.signal,cache:"no-store"
   });
   if(!response.ok)throw Error("Static OSM map archive HTTP "+response.status);
   const data=await response.json();
   if(!Array.isArray(data.points)||data.points.length<25||
      data.version!==1)throw Error("No verified OSM locations in snapshot");
   const valid=data.points.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&
     p.lat>=29.3&&p.lat<=33.5&&p.lon>=34.1&&p.lon<=36.1);
   if(valid.length<25)throw Error("Invalid location data");
   points=valid;loaded=true;cacheSave(points);showPoints();emitStats();
  }catch(e){
   console.warn("Countrywide OSM archive unavailable:",e.message);
   showFallback();
  }finally{clearTimeout(timeout);loading=false}
 }
 async function searchCity(name){
  if(!ready)return;
  const text=String(name||"").trim();
  if(!text){fitNation();return}
  const key=text.toLowerCase();
  let coords=cityCoords[key]||searchCache[key];
  if(!coords){
   // Only user-triggered searches; no autocomplete and no bulk geocoding.
   try{
    status(language().loading);
    const url="https://nominatim.openstreetmap.org/search?format=jsonv2&bounded=1&viewbox=34.20,33.42,35.91,29.42&limit=1&q="+encodeURIComponent(text);
    const response=await fetch(url,{headers:{"Accept":"application/json"}});
    if(!response.ok)throw Error("Geocoder "+response.status);
    const data=await response.json();
    if(Array.isArray(data)&&data.length){
     const lat=Number(data[0].lat),lon=Number(data[0].lon);
     if(Number.isFinite(lat)&&Number.isFinite(lon))coords=searchCache[key]=[lat,lon];
    }
   }catch(e){console.warn("City search:",e.message)}
  }
  if(coords){
   if(!fallbackVisible){
    map.flyTo(coords,Math.max(map.getZoom(),12),{duration:.7});
    if(loaded)showPoints();
   }else showFallback();
  }else{
   // If public geocoding is unavailable, search this city with the
   // selected operator in Google Maps rather than leaving a blank view.
   showFallback();
  }
 }
 function setFallback(queryText){
  fallbackQuery=queryText||fallbackQuery;
  if(fallbackVisible)showFallback(!loaded);
 }
 function subtitle(){return language().title}
 function hint(){return language().hint}
 function resetCountry(){
  el("city").value="";
  fitNation();
  if(fallbackVisible)showFallback();
 }
 window.NeolineMap={setProvider,setRetailer,searchCity,resetCountry,setFallback,subtitle,hint,retailStats,pickupStats,available:()=>ready};
 init();
})();
