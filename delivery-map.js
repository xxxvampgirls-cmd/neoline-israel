
/* NEOLINE Israel nationwide pickup map.
 * Coordinates originate from OpenStreetMap, not search-result guesses.
 * Coverage is necessarily incomplete; operators' official locators remain
 * authoritative. Uses a single cached Overpass query per browser per day. */
(function(){
 "use strict";
 const bounds=[[29.48,34.20],[33.32,35.86]];
 const sources=[
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter"
 ];
 const cacheKey="neoline-pickup-osm-v1",cacheMs=24*60*60*1000;
 const brands={
  boxit:{title:"BOXIT",mark:"B",color:"#087ebf",rx:/box\s*[- ]?\s*it|בוקסיט|בוקס.?איט/i},
  done:{title:"DONE",mark:"D",color:"#0084cd",rx:/\bdone\b|דאן|דון לוקרים/i},
  doar:{title:"Israel Post",mark:"24",color:"#16759e",rx:/israel\s*post|דואר\s*ישראל|doar\s*israel/i},
  epost:{title:"E-POST · HFD",mark:"E",color:"#7758c8",rx:/e[\s.-]?post|hfd|אי.?פוסט|איפוסט/i},
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
     active="all",fallbackQuery="parcel lockers in Israel";
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
  const brand=brands[id]||brands.other;
  return L.divIcon({
   className:"pickup-pin"+(id==="other"?" pickup-pin--other":""),
   html:'<span style="--pin-color:'+brand.color+'"><span>'+html(brand.mark)+'</span></span>',
   iconSize:[36,37],iconAnchor:[17,36],popupAnchor:[0,-31]
  });
 }
 function showPoints(){
  if(!map||!group)return;
  group.clearLayers();
  let count=0;
  for(const point of points){
   if(active!=="all"&&point.id!==active)continue;
   const br=brands[point.id]||brands.other,t=language();
   const name=point.title||(point.post?t.typePost:t.typeLocker);
   const provider=point.id==="other"?t.other:br.title;
   const mapsUrl="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(point.lat+","+point.lon);
   const popup='<div class="pickup-popup"><strong>'+html(name)+'</strong>'+
    '<div class="pickup-popup-type">'+html(provider)+'</div>'+
    '<div class="pickup-popup-address">'+html(point.address||t.noAddress)+'</div>'+
    '<a href="'+mapsUrl+'" target="_blank" rel="noopener noreferrer">'+html(t.directions)+'</a></div>';
   const mark=L.marker([point.lat,point.lon],{icon:markerIcon(point.id),title:name});
   mark.bindPopup(popup,{maxWidth:260});group.addLayer(mark);count++;
  }
  if(loaded)status(count?language().done+count+" · "+language().partial:language().none,"ready");
 }
 function fitNation(){
  if(!map)return;
  map.fitBounds(bounds,{padding:[7,7],animate:false});
  setTimeout(()=>map.invalidateSize(),120);
 }
 function setProvider(id){
  active=id;
  if(loaded)showPoints();
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
 function showFallback(){
  const frame=el("map"),container=el("pickupMap");
  if(container)container.style.display="none";
  if(frame){
   frame.hidden=false;
   frame.src="https://www.google.com/maps?q="+encodeURIComponent(fallbackQuery)+"&output=embed";
  }
  status(language().failed,"error");
 }
 const query='[out:json][timeout:30];'+
  'area["ISO3166-1"="IL"]["admin_level"="2"]->.israel;'+
  '(nwr["amenity"~"^(post_office|parcel_locker)$"](area.israel);'+
  'nwr["shop"="parcel_pickup"](area.israel);'+
  'nwr["parcel_pickup"="yes"](area.israel);'+
  ');out center;';
 function cacheRead(){
  try{
   const value=JSON.parse(localStorage.getItem(cacheKey)||"null");
   if(value&&Number.isFinite(value.at)&&Date.now()-value.at<cacheMs&&
    Array.isArray(value.points)&&value.points.length>0)return value.points;
  }catch(e){}
  return null;
 }
 function cacheSave(list){
  try{localStorage.setItem(cacheKey,JSON.stringify({at:Date.now(),points:list}))}catch(e){}
 }
 async function fetchOverpass(endpoint){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),35000);
  try{
   const response=await fetch(endpoint,{method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
    body:"data="+encodeURIComponent(query),signal:controller.signal});
   if(!response.ok){
    const error=new Error("Overpass HTTP "+response.status);
    error.code=response.status;throw error;
   }
   const result=await response.json();
   if(result.remark&&(!result.elements||!result.elements.length))throw Error(result.remark);
   return parseOSM(result);
  }finally{clearTimeout(timer)}
 }
 async function loadPoints(){
  if(loading)return;
  loading=true;
  const cached=cacheRead();
  if(cached){
   points=cached;loaded=true;showPoints();loading=false;return;
  }
  try{
   let lastError=null;
   for(const endpoint of sources){
    try{
     const rows=await fetchOverpass(endpoint);
     if(rows.length===0)throw Error("No OSM points returned");
     points=rows;loaded=true;cacheSave(rows);showPoints();lastError=null;break;
    }catch(e){
     lastError=e;console.warn("OpenStreetMap pickup data:",e.message);
     if(e.code===429)break;
    }
   }
   if(lastError){
    status(language().failed,"error");
   }
  }finally{loading=false}
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
    const url="https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=il&limit=1&q="+encodeURIComponent(text);
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
   map.flyTo(coords,Math.max(map.getZoom(),12),{duration:.7});
   if(loaded)showPoints();
   else status(language().loading);
  }else status(language().noCity,"error");
 }
 function setFallback(queryText){fallbackQuery=queryText||fallbackQuery}
 function subtitle(){return language().title}
 function hint(){return language().hint}
 function resetCountry(){el("city").value="";fitNation()}
 window.NeolineMap={setProvider,searchCity,resetCountry,setFallback,subtitle,hint,available:()=>ready};
 init();
})();
