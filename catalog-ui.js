/* NEOLINE Russia catalog: static, locally cached source extraction. */
(function(){
"use strict";
const imported=new Map();
let visibleProducts=8; // Mobile and desktop: load first 8, then on demand.
const originalRender=renderProducts,originalOpen=openProduct,originalAdd=add;
const names={
 ru:{all:"Все",hybrid:"Гибриды",radar:"Радар-детекторы",accessories:"Аксессуары",audio:"Акустика",sale:"Уценка",price:"Цена в Израиле уточняется",details:"Описание и характеристики",origin:"Карточка производителя ↗",notYet:"Продажи и цены в Израиле пока не подтверждены.",description:"Описание",specs:"Технические характеристики",fallback:"Фото уточняется",total:"Товаров в каталоге",from:"Из каталога neoline.ru",noSpec:"Характеристики доступны по ссылке производителя."},
 en:{all:"All",hybrid:"Hybrids",radar:"Radar detectors",accessories:"Accessories",audio:"Speakers",sale:"Discounted",price:"Israel price to be confirmed",details:"Description and specifications",origin:"Manufacturer's product page ↗",notYet:"Israeli sales and prices are not confirmed.",description:"Description",specs:"Technical specifications",fallback:"Photo pending",total:"Catalog products",from:"From neoline.ru",noSpec:"See manufacturer's page for full details."},
 he:{all:"הכול",hybrid:"משולבים",radar:"גלאי רדאר",accessories:"אביזרים",audio:"רמקולים",sale:"מוזלים",price:"מחיר בישראל טרם נקבע",details:"תיאור ומפרט",origin:"עמוד מוצר באתר היצרן ↗",notYet:"מכירות ומחירים בישראל אינם מאושרים.",description:"תיאור",specs:"מפרט טכני",fallback:"אין תמונה",total:"מוצרים בקטלוג",from:"מתוך neoline.ru",noSpec:"למפרט המלא ראו אתר היצרן."},
 ar:{all:"الكل",hybrid:"الأجهزة الهجينة",radar:"كاشفات الرادار",accessories:"الملحقات",audio:"الصوتيات",sale:"المخفضة",price:"السعر في إسرائيل غير مؤكد",details:"التفاصيل والمواصفات",origin:"الصفحة الرسمية للمنتج ↗",notYet:"الأسعار والمبيعات في إسرائيل غير مؤكدة.",description:"الوصف",specs:"المواصفات",fallback:"لا تتوفر صورة",total:"منتجات الكتالوج",from:"من neoline.ru",noSpec:"راجع موقع الشركة للمعلومات الكاملة."}
};
const ui=(key)=>(names[lang]||names.ru)[key]||key;
const esc=str=>String(str??"").replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function secureSource(value){
 try{const x=new URL(value);return x.protocol==="https:"&&x.hostname==="neoline.ru"?x.href:null}catch(e){return null}
}
function securePhoto(value){return typeof value==="string"&&/^\.\/assets\/catalog\/images\/\d+-\d+\.webp$/.test(value)?value:null}
function inferCategory(p){
 const t=p.name.toLowerCase().trim();
 // Compatibility accessories often contain the words "radar-detector" or
 // "hybrid" but are NOT detectors. Match the product type before keywords.
 if(/кабел|креплен|держател|адаптер|компрессор|power cord|fuse cord|hardwire|x-cop magnet|x-cop pad|фильтр|powerbook|мультитул|задняя камера/.test(t))return "accessories";
 if(/динамики|акустик|ultera/.test(t))return "audio";
 if(/гибрид|^видеорегистратор с радар-детектором|радар-детектором/.test(t))return "hybrid";
 if(/^радар-детектор|^сигнатурный радар-детектор|^neoline x-cop (5900|6100|6200|8700|8900)/.test(t))return "radar";
 if(/видеорегистратор|wowcam|smartway|argus|flash 2k|easydrive|g-tech/.test(t))return /dual|двумя камер|заднего вида|зеркало/.test(t)?"dual":"single";
 if(p.category==="sale")return "sale";
 return "accessories";
}
function normalized(s){return String(s).toLowerCase().replace(/[^a-zа-яё0-9]+/gi,"")}
function isExistingModel(item){
 const t=normalized(item.name);
 return products.some(p=>{
  if(p.isImported)return false;
  const n=normalized(p.name);
  return n.length>8&&t.includes(n);
 });
}
function productImage(p){
 const urls=media[p.id]||[];
 if(!urls.length)return '<div class="catalog-image-empty">'+esc(ui("fallback"))+'</div>';
 return '<button class="photo-trigger" data-photo="'+p.id+'" aria-label="'+esc(p.name)+'">'+
   '<img src="'+esc(urls[0])+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async">'+
   '</button>';
}
function renderExtendedProducts(){
 let items=products.filter(p=>(cat==="all"||p.category===cat)&&p.name.toLowerCase().includes($('search').value.toLowerCase()));
 const sort=$('sort').value,preferred=[6,5,3,4,2,1,7,8];
 if(sort==="low")items.sort((a,b)=>(a.isImported?1e14:a.price)-(b.isImported?1e14:b.price));
 else if(sort==="high")items.sort((a,b)=>(a.isImported?-1e14:a.price)-(b.isImported?-1e14:b.price));
 else items.sort((a,b)=>{
  const ia=preferred.indexOf(a.id),ib=preferred.indexOf(b.id);
  if(ia>=0||ib>=0)return (ia<0?999:ia)-(ib<0?999:ib);
  return a.name.localeCompare(b.name,"ru");
 });
 const visibleItems=items.slice(0,visibleProducts);
 $('products').innerHTML=visibleItems.length?visibleItems.map(p=>{
  const src=(media[p.id]||[])[0];
  let art;
  if(p.isImported)art=productImage(p);
  else art=src?'<button class="photo-trigger" data-photo="'+p.id+'" aria-label="'+esc(p.name)+'"><img src="'+esc(src)+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async" onerror="recoverPhoto(this,'+p.id+')"><span class="fallback" hidden>'+deviceSvg(p.shape)+'</span></button>':deviceSvg(p.shape);
  const badge=p.isImported?esc(imported.get(p.id)?.group||'NEOLINE'):(p.id===6?'4K / DUAL':p.id===3?'2K / DUAL':t(p.badge));
  const price=p.isImported?'<div class="catalog-price-pending">'+esc(ui("price"))+'</div>':'<div class="price">₪'+p.price.toLocaleString('en-US')+'<small>'+t('estimated')+'</small></div>';
  const buy=p.isImported?"":'<button class="add" data-add="'+p.id+'" aria-label="Add to cart">+</button>';
  const specs=(p.spec||[]).map(esc).join(' · ');
  return '<article class="product"><div class="product-art">'+art+'<span class="badge">'+badge+'</span><button class="heart '+(favs.has(p.id)?'active':'')+'" data-fav="'+p.id+'" aria-label="Favorite">'+(favs.has(p.id)?'♥':'♡')+'</button></div><div class="product-content"><div class="product-name">'+esc(p.name)+'</div><div class="spec">'+specs+'</div><div class="price-row">'+price+buy+'</div><button class="details-link" data-details="'+p.id+'">'+(p.isImported?esc(ui('details')):extraTranslations[lang].productDetails)+'</button></div></article>';
 }).join(''):'<div class="empty">'+esc(t('resultsEmpty'))+'</div>';
 const more=$('catalogShowMore'),button=$('catalogShowMoreBtn'),count=$('catalogProductCount');
 if(more&&button&&count){
  const remaining=items.length-visibleItems.length;
  more.hidden=remaining<=0;
  count.textContent=(lang==='ru'?'Показано ':lang==='he'?'מוצגים ':lang==='ar'?'المعروض ': 'Showing ')+visibleItems.length+' / '+items.length;
  button.textContent=(lang==='ru'?'Показать ещё товары':lang==='he'?'הצג עוד מוצרים':lang==='ar'?'عرض المزيد من المنتجات':'Show more products')+' ('+remaining+') ↓';
  button.setAttribute('aria-expanded',visibleItems.length>8?'true':'false');
 }
 document.querySelectorAll('[data-add]').forEach(e=>e.onclick=()=>add(Number(e.dataset.add)));
 document.querySelectorAll('[data-fav]').forEach(e=>e.onclick=()=>toggleFav(Number(e.dataset.fav)));
 document.querySelectorAll('[data-photo]').forEach(e=>e.onclick=()=>openProduct(Number(e.dataset.photo)));
 document.querySelectorAll('[data-details]').forEach(e=>e.onclick=()=>openProduct(Number(e.dataset.details)));
}
const moreButton=$('catalogShowMoreBtn');
if(moreButton)moreButton.addEventListener('click',()=>{visibleProducts+=8;renderProducts()});
function renderExtendedTabs(){
 const list=[['all','all'],['single','single'],['dual','dual'],['premium','premium'],['hybrid','hybrid'],['radar','radar'],['accessories','accessories'],['audio','audio'],['sale','sale']];
 const tabs=list.filter(([cat])=>cat==="all"||products.some(p=>p.category===cat));
 $('tabs').innerHTML=tabs.map(([code,key])=>'<button class="tab '+(cat===code?'active':'')+'" data-cat="'+code+'">'+esc(names[lang]?.[key]||t(key))+'</button>').join('');
 document.querySelectorAll('[data-cat]').forEach(e=>e.onclick=()=>{cat=e.dataset.cat;visibleProducts=8;renderTabs();renderProducts()});

}
function importedModal(id){
 const p=products.find(x=>x.id===id),info=imported.get(id);
 if(!p||!info)return;
 const urls=media[id]||[];
 const imgs=urls.length?'<img class="modal-big" id="modalBig" src="'+esc(urls[0])+'" alt="'+esc(p.name)+'">'+
   '<div class="modal-gallery-controls"><button class="modal-photo-arrow" id="modalPrevImage" type="button">‹</button><span id="modalPhotoCounter">1 / '+urls.length+'</span><button class="modal-photo-arrow" id="modalNextImage" type="button">›</button></div>'+
   '<div class="modal-thumbs">'+urls.map((u,i)=>'<button type="button" data-import-photo="'+i+'" class="'+(i?'':'active')+'"><img src="'+esc(u)+'" loading="lazy" alt=""></button>').join('')+'</div>':
   '<div class="catalog-image-empty">'+esc(ui("fallback"))+'</div>';
 const specs=info.specs.map(kv=>'<div class="catalog-import-property"><strong>'+esc(kv.label)+'</strong><span>'+esc(kv.value)+'</span></div>').join('');
 $('productModalBody').innerHTML='<div class="modal-grid"><div class="modal-media">'+imgs+'</div><div class="modal-content">'+
  '<div class="kicker">'+esc(info.group)+'</div><h2>'+esc(p.name)+'</h2><p class="catalog-price-pending">'+esc(ui("price"))+'</p>'+
  '<p class="modal-help">'+esc(ui("notYet"))+'</p>'+
  '<a class="secondary catalog-origin" href="'+esc(info.source)+'" target="_blank" rel="noopener noreferrer">'+esc(ui("origin"))+'</a></div></div>'+
  '<section class="catalog-import-detail"><h3>'+esc(ui("description"))+'</h3><p>'+esc(info.description||p.name)+'</p>'+
  '<h3>'+esc(ui("specs"))+'</h3><div class="catalog-import-grid">'+(specs||'<p>'+esc(ui('noSpec'))+'</p>')+'</div></section>';
 const img=$('modalBig');
 if(img){
  let index=0;
  const advance=delta=>{index=(index+delta+urls.length)%urls.length;img.src=urls[index];$('modalPhotoCounter').textContent=(index+1)+' / '+urls.length;document.querySelectorAll('[data-import-photo]').forEach((b,j)=>b.classList.toggle('active',j===index))};
  $('modalPrevImage').onclick=()=>advance(-1);$('modalNextImage').onclick=()=>advance(1);
  document.querySelectorAll('[data-import-photo]').forEach((el,i)=>el.onclick=()=>advance(i-index));
  img.onclick=()=>{$('lightboxImg').src=img.src;$('photoLightbox').classList.add('open')};
 }
 $('productModal').classList.add('open');
 $('productModal').querySelector('.product-panel').scrollTop=0;
 document.body.style.overflow='hidden';
 clearTimeout(slideTimer);
}
renderProducts=renderExtendedProducts;
renderTabs=renderExtendedTabs;
openProduct=function(id){return imported.has(id)?importedModal(id):originalOpen(id)};
add=function(id){return imported.has(id)?importedModal(id):originalAdd(id)};
$('search').oninput=()=>{visibleProducts=8;renderProducts()};
$('sort').onchange=()=>{visibleProducts=8;renderProducts()};
async function load(){
 try{
  const response=await fetch('./assets/catalog/catalog.json',{cache:'no-cache'});
  if(!response.ok)return;
  const manifest=await response.json();
  if(manifest.version!==1||!Array.isArray(manifest.products)||manifest.products.length<12)return;
  for(const item of manifest.products){
   if(!item||!Number.isSafeInteger(item.id)||item.id<1000||typeof item.name!=="string"||item.name.length>185||imported.has(item.id)||isExistingModel(item))continue;
   const source=secureSource(item.source);
   if(!source)continue;
   const row={id:item.id,name:item.name,category:inferCategory(item),badge:"demo",price:0,shape:"compact",isImported:true,
     spec:Array.isArray(item.spec)?item.spec.filter(x=>typeof x==="string").slice(0,3):[]};
   const pics=Array.isArray(item.images)?item.images.map(securePhoto).filter(Boolean).slice(0,3):[];
   const specs=Array.isArray(item.specs)?item.specs.filter(x=>x&&typeof x.label==="string"&&typeof x.value==="string").slice(0,38):[];
   imported.set(row.id,{description:typeof item.description==="string"?item.description.slice(0,900):"",specs,source,group:item.group||""});
   products.push(row);media[row.id]=pics;datas[row.id]=row.spec;productUrls[row.id]=source;
  }
  renderTabs();renderProducts();
  console.info("NEOLINE verified catalog rows loaded",imported.size);
 }catch(e){console.warn("Manufacturer catalog file unavailable: retaining original product list",e)}
}
renderTabs();renderProducts();load();
})();