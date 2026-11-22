/* NEOLINE auto-bundle JS 2/2; exact original order. Do not edit. */

/* SOURCE: site-header.js */
;
/* Shared NEOLINE header adapter. Native page translators still own
   the texts; this adapter only connects delivery flags to its existing
   select and marks the actual active language. */
(()=>{
 "use strict";
 const header=document.querySelector(".neoline-site-header");
 if(!header)return;
 const flags=[...header.querySelectorAll(".neoline-site-header__flag[data-language],.neoline-site-header__flag[data-site-lang],.neoline-site-header__flag[data-news-lang],.neoline-site-header__flag[data-hot-lang],.neoline-site-header__flag[data-lang]")];
 const target=button=>button.dataset.language||button.dataset.siteLang||button.dataset.newsLang||button.dataset.hotLang||button.dataset.lang;
 function safeSaved(){try{return localStorage.getItem("neoline-language")||"ru"}catch(e){return"ru"}}
 const deliverySelect=header.querySelector("#language");
 function sync(lang){
  for(const button of flags){
   const selected=target(button)===lang;
   // News, hot events, home and Theory own their native active classes.
   // Only Delivery needs its class managed here. Otherwise switching
   // languages could leave TWO flags highlighted.
   if(deliverySelect)button.classList.toggle("active",selected);
   button.setAttribute("aria-pressed",String(selected));
  }
  const basket=header.querySelector(".neoline-site-header__cart");
  if(basket?.tagName==="A"){
   const label=({ru:"Корзина",he:"סל קניות",en:"Shopping cart",ar:"سلة التسوق"})[lang]||"Корзина";
   basket.setAttribute("aria-label",label);
   basket.title=label;
  }
 }
 if(deliverySelect){
  header.addEventListener("click",event=>{
   const button=event.target.closest(".neoline-site-header__flag[data-site-lang]");
   if(!button||!header.contains(button))return;
   const lang=button.dataset.siteLang;
   if(deliverySelect.value===lang)return;
   deliverySelect.value=lang;
   deliverySelect.dispatchEvent(new Event("change",{bubbles:true}));
   sync(lang);
  });
  deliverySelect.addEventListener("change",()=>sync(deliverySelect.value));
 }
 // Each native page script sets its own persisted language during startup.
 // Synchronize after it has initialized without taking over its behavior.
 const refresh=()=>{
  const native=deliverySelect?.value;
  const lang=native||document.documentElement.lang||safeSaved();
  if(flags.some(b=>target(b)===lang))sync(lang);
 };
 window.addEventListener("pageshow",refresh);
 window.addEventListener("neoline:delivery-language",refresh);
 window.addEventListener("neoline:news-language",refresh);
 window.setTimeout(refresh,0);
})();

;

/* SOURCE: teoria-hero-promo.js */
;
/* NEOLINE / THEORY: five animated promotional slides inside the existing
   upper-right hero image; does not change the heading, stats or game flow. */
(function(){
 "use strict";
 const art=document.querySelector('.game-hero.theory-dashboard .hero-art.hero-art--studio');
 if(!art||art.dataset.theoryPromoReady)return;
 const first=art.querySelector('svg.hero-studio-svg');
 if(!first)return;
 art.dataset.theoryPromoReady='1';
 art.classList.add('theory-promo-host');
 art.removeAttribute('aria-hidden');
 first.classList.add('is-active');
 first.setAttribute('aria-hidden','true');
 first.setAttribute('focusable','false');

 function scene(id,content){
  return '<svg viewBox="0 0 360 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">'+
   '<defs>'+
    '<linearGradient id="'+id+'Bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8ed9fa"/><stop offset=".45" stop-color="#e7faff"/><stop offset="1" stop-color="#95d6f5"/></linearGradient>'+
    '<linearGradient id="'+id+'Ice" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset=".42" stop-color="#e5f7ff"/><stop offset="1" stop-color="#a0c9e2"/></linearGradient>'+
    '<linearGradient id="'+id+'Blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2dc4ff"/><stop offset=".45" stop-color="#097dc6"/><stop offset="1" stop-color="#08467e"/></linearGradient>'+
    '<linearGradient id="'+id+'Gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff2bd"/><stop offset=".35" stop-color="#ffcb59"/><stop offset="1" stop-color="#e48b19"/></linearGradient>'+
    '<filter id="'+id+'Shadow" x="-40%" y="-50%" width="190%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0a527d" flood-opacity=".27"/></filter>'+
   '</defs>'+
   '<rect width="360" height="210" fill="url(#'+id+'Bg)"/>'+
   '<circle cx="170" cy="90" r="128" fill="#fff" opacity=".24"/>'+
   '<path d="M-30 179Q112 123 212 160T400 122" stroke="#fff" stroke-width="13" opacity=".28" fill="none"/>'+
   '<path d="M-30 192Q112 136 212 173T400 135" stroke="#2a96ca" stroke-width="3" opacity=".24" fill="none"/>'+
   content+'</svg>';
 }

 const modeArt=scene('tpMode',
  '<g filter="url(#tpModeShadow)">'+
   '<circle cx="111" cy="105" r="79" fill="url(#tpModeIce)" stroke="#fff" stroke-width="3"/>'+
   '<circle cx="111" cy="105" r="66" fill="url(#tpModeBlue)" stroke="#0d77bc" stroke-width="3"/>'+
   '<path d="M70 73Q113 38 156 71" fill="none" stroke="#b8f1ff" stroke-opacity=".45" stroke-width="9" stroke-linecap="round"/>'+
   '<text x="111" y="132" text-anchor="middle" font-family="Arial,sans-serif" font-size="94" font-weight="900" fill="#fff">5</text>'+
  '</g>'+
  '<g filter="url(#tpModeShadow)" transform="rotate(5 258 103)">'+
   '<rect x="201" y="22" width="126" height="164" rx="21" fill="url(#tpModeIce)" stroke="#fff" stroke-width="3"/>'+
   '<rect x="214" y="35" width="100" height="40" rx="12" fill="url(#tpModeBlue)"/>'+
   '<path d="M235 59l6-12h37l9 12z" fill="#d7f6ff"/><rect x="230" y="57" width="62" height="10" rx="5" fill="#fff"/><circle cx="244" cy="66" r="5" fill="#164b72"/><circle cx="280" cy="66" r="5" fill="#164b72"/>'+
   '<rect x="214" y="84" width="100" height="40" rx="12" fill="#fff"/>'+
   '<circle cx="264" cy="104" r="15" fill="#fff" stroke="#df414a" stroke-width="5"/><text x="264" y="111" font-family="Arial" font-size="18" text-anchor="middle" font-weight="800" fill="#233d51">50</text>'+
   '<rect x="214" y="133" width="100" height="40" rx="12" fill="#d5f5ff"/>'+
   '<path d="M243 151l12 11 28-26" fill="none" stroke="#159d88" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'+
  '</g>'
 );

 const rewardArt=scene('tpReward',
  '<g filter="url(#tpRewardShadow)">'+
   '<circle cx="112" cy="101" r="81" fill="url(#tpRewardIce)" stroke="#fff" stroke-width="3"/>'+
   '<circle cx="112" cy="101" r="67" fill="url(#tpRewardBlue)" stroke="#147cba" stroke-width="4"/>'+
   '<circle cx="112" cy="101" r="59" fill="none" stroke="#e9faff" opacity=".32" stroke-width="2"/>'+
   '<path d="m112 50 15 30 33 5-24 23 6 33-30-16-30 16 6-33-24-23 33-5z" fill="url(#tpRewardGold)" stroke="#ffeabb" stroke-width="3"/>'+
   '<text x="112" y="112" text-anchor="middle" font-family="Arial" font-weight="900" font-size="30" fill="#795015">XP</text>'+
  '</g>'+
  '<g filter="url(#tpRewardShadow)">'+
   '<path d="M237 72l47-28 47 28v65l-47 26-47-26z" fill="#136aab"/>'+
   '<path d="M237 72l47 22 47-22-47-27z" fill="#69ccf4"/>'+
   '<path d="M284 94v68" stroke="#ffd65d" stroke-width="18"/>'+
   '<path d="M237 74l47 21 47-21" fill="none" stroke="#ffd65d" stroke-width="10"/>'+
   '<path d="M283 49c-19-25-39-7-20 5l20 6c-14-17 9-33 20-17 7 13-8 18-20 18" fill="none" stroke="#ffcc4c" stroke-width="9" stroke-linejoin="round"/>'+
   '<path d="M247 125l9 6m56-7-9 6" stroke="#a5f2ff" stroke-width="3" stroke-linecap="round"/>'+
  '</g>'+
  '<g fill="#fff3ae"><path d="m204 25 5 12 12 5-12 4-5 12-4-12-12-4 12-5z"/><path d="m333 28 3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/></g>'
 );

 const examArt=scene('tpExam',
  '<g filter="url(#tpExamShadow)" transform="rotate(-5 157 108)">'+
   '<rect x="68" y="24" width="220" height="170" rx="20" fill="url(#tpExamIce)" stroke="#fff" stroke-width="4"/>'+
   '<rect x="85" y="42" width="186" height="45" rx="10" fill="url(#tpExamBlue)"/>'+
   '<text x="110" y="78" font-family="Arial,sans-serif" font-size="39" font-weight="900" fill="#fff">30</text>'+
   '<rect x="193" y="52" width="64" height="24" rx="12" fill="#e8faff" stroke="#fff" stroke-width="1"/>'+
   '<text x="225" y="68" font-family="Arial,sans-serif" text-anchor="middle" font-size="14" font-weight="800" fill="#1a709d">40:00</text>'+
   '<circle cx="107" cy="108" r="10" fill="#dcf7f1"/><path d="m101 108 4 4 8-9" stroke="#14a889" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="M128 108h104" stroke="#75b6d7" stroke-width="8" stroke-linecap="round"/>'+
   '<circle cx="107" cy="137" r="10" fill="#dcf7f1"/><path d="m101 137 4 4 8-9" stroke="#14a889" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="M128 137h87" stroke="#8ac6e1" stroke-width="8" stroke-linecap="round"/>'+
   '<circle cx="107" cy="166" r="10" fill="#dcf7f1"/><path d="m101 166 4 4 8-9" stroke="#14a889" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="M128 166h114" stroke="#a4d7ee" stroke-width="8" stroke-linecap="round"/>'+
  '</g>'+
  '<g filter="url(#tpExamShadow)"><circle cx="301" cy="41" r="26" fill="#fff" stroke="#e9434e" stroke-width="8"/>'+
   '<text x="301" y="51" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="900" fill="#243c50">50</text></g>'
 );

 const viceArt=
  '<svg viewBox="0 0 360 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">'+
  '<defs>'+
    '<linearGradient id="tpViceSky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#442a78"/><stop offset=".42" stop-color="#e16ba2"/><stop offset=".73" stop-color="#ffab8a"/><stop offset="1" stop-color="#6c3167"/></linearGradient>'+
    '<linearGradient id="tpViceRoad" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#75436e"/><stop offset="1" stop-color="#25162d"/></linearGradient>'+
    '<linearGradient id="tpViceCar" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffb0ad"/><stop offset=".44" stop-color="#ed6899"/><stop offset="1" stop-color="#732e6b"/></linearGradient>'+
    '<radialGradient id="tpViceSun"><stop stop-color="#fff4be"/><stop offset=".72" stop-color="#ffc78b"/><stop offset="1" stop-color="#ff957c"/></radialGradient>'+
    '<filter id="tpViceGlow"><feGaussianBlur stdDeviation="3"/></filter>'+
  '</defs>'+
  '<rect width="360" height="210" fill="url(#tpViceSky)"/>'+
  '<circle cx="248" cy="70" r="55" fill="url(#tpViceSun)" opacity=".94"/>'+
  '<g stroke="#db699d" stroke-width="2" opacity=".5"><path d="M193 82h109M188 93h119M184 104h127"/></g>'+
  '<path d="M0 139h14v-28h15v11h12V95h21v44h10V85h17v54h15v-24h17v24h19V96h16v43h21v-23h15v23h17V88h22v51h18v-23h20v23h17V98h23v41h37v71H0Z" fill="#4b2b61" opacity=".82"/>'+
  '<path d="M0 146h360v64H0z" fill="url(#tpViceRoad)"/>'+
  '<path d="M182 143L50 210H310Z" fill="#32203c"/>'+
  '<g stroke="#fff0bb" stroke-width="2" stroke-dasharray="17 20" opacity=".66"><path d="M183 147 182 210"/></g>'+
  '<g stroke="#ffe3b8" stroke-linecap="round" fill="none"><path d="M39 153V44" stroke="#2d1a42" stroke-width="7"/>'+
    '<path d="M39 47Q16 17 2 33M40 47Q56 17 83 24M39 51Q7 41 1 62M39 51Q63 33 84 47M39 49Q28 22 33 8M39 49Q51 25 56 9" stroke="#271a44" stroke-width="9"/>'+
    '<path d="M332 158V36" stroke="#2d1a42" stroke-width="8"/>'+
    '<path d="M332 43Q311 19 288 19M332 43Q357 22 378 31M332 47Q310 41 289 57M332 47Q355 39 383 55M332 42Q328 14 319 5M332 42Q349 19 351 4" stroke="#271a44" stroke-width="9"/></g>'+
  '<ellipse cx="192" cy="185" rx="102" ry="18" fill="#1a102e" opacity=".75"/>'+
  '<path d="M104 166Q129 151 154 151L178 130Q220 124 250 150L282 160 297 184H93L98 172Z" fill="url(#tpViceCar)" stroke="#ffe5c5" stroke-width="2"/>'+
  '<path d="M164 150 181 134Q220 133 239 151Z" fill="#2a2b60" stroke="#ffdbcc" stroke-width="1.8"/>'+
  '<path d="M181 134l-6 17M236 150l-12-15" stroke="#d2b4d4" stroke-width="2"/>'+
  '<path d="M101 177h31M259 177h31" stroke="#e8fff4" stroke-width="6" stroke-linecap="round"/>'+
  '<circle cx="142" cy="181" r="15" fill="#20152f" stroke="#ffb0cb" stroke-width="4"/><circle cx="249" cy="181" r="15" fill="#20152f" stroke="#ffb0cb" stroke-width="4"/>'+
  '<g transform="translate(12 9)"><rect width="140" height="43" rx="9" fill="#231633d9" stroke="#ffb9c3" stroke-width="1.5"/>'+
   '<text x="10" y="18" font-family="Arial,sans-serif" font-size="11" font-weight="900" letter-spacing="2" fill="#ffb38d">VICE · NEON</text>'+
   '<text x="10" y="35" font-family="Arial,sans-serif" font-size="17" font-weight="900" letter-spacing="1" fill="#ffffff">GTA VI STYLE</text></g>'+
  '<path d="M76 198h210" stroke="#ff8dba" stroke-width="2" opacity=".66" filter="url(#tpViceGlow)"/>'+
  '</svg>';

 const translations={
  ru:[
   ['Дорожные знаки','Открыть тренировку дорожных знаков'],
   ['5 игровых режимов','Посмотреть игровые режимы'],
   ['XP и награды','Посмотреть игровые очки XP и примеры будущих подарков'],
   ['Пробный экзамен','Найти пробный экзамен: 30 вопросов, 40 минут'],
   ['GTA VI · Неоновый стиль','Переключить всю игру в стиль GTA VI и обратно']
  ],
  en:[
   ['Road signs','Explore road sign practice'],
   ['5 ways to play','Explore game modes'],
   ['XP and rewards','View XP points and sample future gifts'],
   ['Practice exam','Find the practice test: 30 questions, 40 minutes'],
   ['GTA VI · Neon style','Switch the full game to GTA VI inspired style or back']
  ],
  he:[
   ['תמרורים','פתיחת תרגול תמרורים'],
   ['5 מצבי משחק','צפייה במצבי המשחק'],
   ['XP ופרסים','הצגת נקודות XP ומתנות עתידיות לדוגמה'],
   ['מבחן לדוגמה','מעבר למבחן תרגול: 30 שאלות, 40 דקות'],
   ['GTA VI · עיצוב ניאון','שינוי המראה של כל המשחק לסגנון GTA VI וחזרה']
  ],
  ar:[
   ['إشارات المرور','افتح تدريب إشارات المرور'],
   ['5 أنماط للعب','استكشف أنماط اللعب'],
   ['XP والمكافآت','عرض نقاط XP وأمثلة الهدايا المستقبلية'],
   ['امتحان تجريبي','انتقل إلى الامتحان التجريبي: 30 سؤالاً، 40 دقيقة'],
   ['GTA VI · النمط النيوني','غيّر تصميم اللعبة إلى نمط مستوحى من GTA VI أو العكس']
  ]
 };
 const all=[first];
 for(const html of [modeArt,rewardArt,examArt,viceArt]){
  const slide=document.createElement('div');
  slide.className='theory-promo-slide is-right'+(html===viceArt?' vice-promo-slide':'');
  slide.setAttribute('aria-hidden','true');
  slide.innerHTML=html;
  art.appendChild(slide);
  all.push(slide);
 }
 const caption=document.createElement('span');
 caption.className='theory-promo-caption';
 caption.setAttribute('aria-hidden','true');
 art.appendChild(caption);
 const button=document.createElement('button');
 button.type='button';
 button.className='theory-promo-click';
 art.appendChild(button);
 const dots=document.createElement('div');
 dots.className='theory-promo-dots';
 dots.setAttribute('role','group');
 dots.setAttribute('aria-label','Promo slides');
 const controls=all.map((_,i)=>{
  const dot=document.createElement('button');
  dot.className='theory-promo-dot';
  dot.type='button';
  dot.dataset.slide=String(i);
  dot.addEventListener('click',event=>{
   event.stopPropagation();
   select(i,i>=current?1:-1);
   restart();
  });
  dots.appendChild(dot);
  return dot;
 });
 art.appendChild(dots);
 let current=0;
 let timer=0;
 let onScreen=true;
 let hovering=false;
 let focusWithin=false;
 let suppressClickUntil=0;
 const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const labels=()=>translations[document.documentElement.lang.split('-')[0]]||translations.ru;
 function localize(){
  const list=labels();
  caption.textContent=list[current][0];
  button.setAttribute('aria-label',list[current][1]);
  controls.forEach((dot,i)=>{
   dot.setAttribute('aria-label',String(i+1)+' / '+all.length+': '+list[i][0]);
   dot.setAttribute('aria-current',i===current?'true':'false');
  });
  dots.setAttribute('aria-label',({ru:'Рекламные слайды игры',en:'Game promotional slides',he:'שקופיות מידע על המשחק',ar:'شرائح تعريفية باللعبة'})[document.documentElement.lang.split('-')[0]]||'Game slides');
 }
 function select(index,direction){
  const next=(index+all.length)%all.length;
  if(next===current)return;
  const outgoing=all[current];
  const incoming=all[next];
  const arrival=direction>=0?'is-right':'is-left';
  const departure=direction>=0?'is-left':'is-right';
  incoming.style.transition='none';
  incoming.classList.remove('is-active','is-left','is-right');
  incoming.classList.add(arrival);
  void incoming.offsetWidth;
  incoming.style.transition='';
  outgoing.classList.remove('is-active','is-left','is-right');
  outgoing.classList.add(departure);
  incoming.classList.remove(arrival);
  incoming.classList.add('is-active');
  current=next;
  localize();
 }
 function restart(){
  clearTimeout(timer);
  // Give the visually important first poster time to be seen and read.
  // All other promotions still rotate; touch, dots and arrows stay instant.
  if(document.hidden||!onScreen||hovering||focusWithin||motionReduced)return;
  const neon=document.documentElement.dataset.viceTheme==="on";
  const stay=(neon&&current===0)?13500:(neon?7700:5600);
  timer=window.setTimeout(()=>{
   select(current+1,1);
   restart();
  },stay);
 }
 function jumpTo(el){
  if(!el)return;
  el.scrollIntoView({behavior:motionReduced?'instant':'smooth',block:'center'});
  if(el.matches('button')&&!el.disabled)el.focus({preventScroll:true});
 }
 button.addEventListener('click',()=>{
  if(Date.now()<suppressClickUntil)return;
  if(current===2){
   document.getElementById('gameGiftTrigger')?.click();
   return;
  }
  if(current===0&&document.documentElement.dataset.viceTheme==="on"){
   document.getElementById('gameGiftTrigger')?.click();
   return;
  }
  if(current===0)return jumpTo(document.querySelector('[data-mode="signs"]'));
  if(current===1)return jumpTo(document.querySelector('[data-mode="route"]'));
  if(current===3)return jumpTo(document.querySelector('[data-mode="exam"]'));
  if(current===4){window.dispatchEvent(new Event('neoline:toggle-vice-theme'));restart();return}
 });
 let startX=0,startY=0;
 art.addEventListener('touchstart',event=>{
  const touch=event.touches[0];
  if(touch){startX=touch.clientX;startY=touch.clientY;}
 },{passive:true});
 art.addEventListener('touchend',event=>{
  if(event.target.closest('.theory-promo-dot'))return;
  const touch=event.changedTouches[0];
  if(!touch)return;
  const dx=touch.clientX-startX,dy=touch.clientY-startY;
  if(Math.abs(dx)>32&&Math.abs(dx)>Math.abs(dy)*1.3){
   suppressClickUntil=Date.now()+650;
   select(current+(dx<0?1:-1),dx<0?1:-1);
   restart();
  }
 },{passive:true});
 art.addEventListener('mouseenter',()=>{hovering=true;restart()});
 art.addEventListener('mouseleave',()=>{hovering=false;restart()});
 art.addEventListener('focusin',()=>{focusWithin=true;restart()});
 art.addEventListener('focusout',()=>{focusWithin=false;restart()});
 document.addEventListener('visibilitychange',restart);
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   onScreen=entries.some(x=>x.isIntersecting);
   restart();
  },{threshold:.28});
  observer.observe(art);
 }
 new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 localize();
 restart();
})();

;

/* SOURCE: teoria-gta6-style.js */
;
/* GTA VI-inspired original sunset/neon visual mode for NEOLINE Theory.
 * This is a purely cosmetic fan-inspired skin, not the GTA game or Rockstar UI.
 * No game progress, answers, rewards, licence, or score calculation changes.
 */
(()=>{
"use strict";
const STORAGE="neoline.theory.visualTheme.v1";
const ACTIVE="vice";
const html=document.documentElement;
const switches=[...document.querySelectorAll("[data-vice-theme-toggle]")];
if(!switches.length)return;
const text={
 ru:{enable:"Включить стиль GTA VI",disable:"Вернуть обычный стиль NEOLINE",on:"ОБЫЧНЫЙ ВИД",off:"GTA VI STYLE",liveOn:"Неоновый стиль включён",liveOff:"Обычный стиль возвращён"},
 en:{enable:"Enable GTA VI inspired style",disable:"Restore classic NEOLINE style",on:"CLASSIC LOOK",off:"GTA VI STYLE",liveOn:"Neon style enabled",liveOff:"Classic look restored"},
 he:{enable:"הפעלת עיצוב בהשראת GTA VI",disable:"חזרה לעיצוב המקורי",on:"עיצוב רגיל",off:"GTA VI STYLE",liveOn:"העיצוב הנאוני הופעל",liveOff:"העיצוב הרגיל הוחזר"},
 ar:{enable:"تفعيل نمط مستوحى من GTA VI",disable:"العودة إلى التصميم الأصلي",on:"النمط الأصلي",off:"GTA VI STYLE",liveOn:"تم تفعيل النمط النيوني",liveOff:"عاد التصميم الأصلي"}
};
const lang=()=>{const code=html.lang.split("-")[0];return text[code]||text.ru};
let enabled=false;
try{enabled=localStorage.getItem(STORAGE)===ACTIVE}catch(_){}
const note=document.createElement("span");note.className="vice-theme-status";
note.setAttribute("role","status");note.setAttribute("aria-live","polite");
note.setAttribute("aria-atomic","true");
document.body.appendChild(note);
let announceTimeout=0;
function update(silent=false){
 html.dataset.viceTheme=enabled?"on":"off";
 const t=lang();
 switches.forEach(button=>{
  button.setAttribute("aria-pressed",String(enabled));
  button.setAttribute("aria-label",enabled?t.disable:t.enable);
  button.title=enabled?t.disable:t.enable;
  const label=button.querySelector(".vice-toggle-text");
  if(label)label.textContent=enabled?t.on:t.off;
 });
 const promo=document.querySelector(".theory-promo-host");
 promo?.classList.toggle("vice-mode-on",enabled);
 if(!silent){
  note.textContent=enabled?t.liveOn:t.liveOff;
  note.classList.add("is-visible");
  clearTimeout(announceTimeout);
  announceTimeout=setTimeout(()=>note.classList.remove("is-visible"),1800);
 }
 window.dispatchEvent(new CustomEvent("neoline:vice-theme",{detail:{enabled}}));
}
function toggle(){
 enabled=!enabled;
 try{localStorage.setItem(STORAGE,enabled?ACTIVE:"classic")}catch(_){}
 update();
}
switches.forEach(button=>button.addEventListener("click",toggle));
window.addEventListener("neoline:toggle-vice-theme",toggle);
window.addEventListener("storage",e=>{
 if(e.key!==STORAGE)return;
 const next=e.newValue===ACTIVE;
 if(enabled!==next){enabled=next;update(true)}
});
new MutationObserver(mutations=>{
 if(mutations.some(x=>x.attributeName==="lang"))update(true);
}).observe(html,{attributes:true,attributeFilter:["lang"]});
update(true);
})();

;

/* SOURCE: teoria-vice-cinematic.js */
;
/* NEOLINE · Vice Sunset cinematic carousel + optional entrance effects.
   Reuses the existing five-slide carousel, targets and timer.
   Images are original SVG assets bundled with the site. */
(()=>{
"use strict";
const host=document.querySelector(".theory-promo-host");
// Progressive enhancement: only use screenshot-faithful reference artwork
// when this browser actually decodes the local AVIF. Other languages retain
// editable translated headings and the original multi-layer poster.
const refPoster=new Image();
refPoster.onload=()=>document.documentElement.classList.add("vice-reference-ready");
refPoster.onerror=()=>document.documentElement.classList.remove("vice-reference-ready");
refPoster.src="./assets/teoria/vice-hero-reference.avif";
const cardPoster=new Image();
cardPoster.onload=()=>document.documentElement.classList.add("vice-reference-cards-ready");
cardPoster.onerror=()=>document.documentElement.classList.remove("vice-reference-cards-ready");
cardPoster.src="./assets/teoria/vice-reference-card-sprite.avif";
if(!host || host.querySelector(".vice-cinema-stage"))return;
const existing=[...host.querySelectorAll(".hero-studio-svg,.theory-promo-slide")];
const dots=[...host.querySelectorAll(".theory-promo-dot")];
if(existing.length!==5||dots.length!==5)return;
const i18n={
 ru:[
  {tag:"ИЗРАИЛЬ · ИГРА",headline:"НОВЫЙ СЕЗОН ИГРЫ",body:"Проходи задания · Получай XP · Открывай подарки"},
  {tag:"ПЯТЬ РЕЖИМОВ",headline:"ТВОЙ МАРШРУТ",body:"Выбирай задания · Играй каждый день"},
  {tag:"XP И НАГРАДЫ",headline:"НОВЫЙ СЕЗОН ИГРЫ",body:"Проходи задания · Получай XP · Открывай подарки"},
  {tag:"КАК НА ЭКЗАМЕНЕ",headline:"ПРОВЕРЬ СЕБЯ",body:"30 вопросов · 40 минут · Настоящие правила"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"Включи неоновый мир · Верни обычный стиль"}
 ],
 en:[
  {tag:"ISRAEL · GAME",headline:"NEW GAME SEASON",body:"Complete missions · Earn XP · Unlock rewards"},
  {tag:"FIVE GAME MODES",headline:"YOUR ROUTE",body:"Choose a mission · Earn experience"},
  {tag:"XP & REWARDS",headline:"A NEW GAME SEASON",body:"Complete missions · Earn XP · Unlock gifts"},
  {tag:"EXAM TRAINING",headline:"TEST YOUR SKILLS",body:"30 questions · 40 minutes · Real rules"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"Enter the neon world · Switch back at any time"}
 ],
 he:[
  {tag:"ישראל · משחק",headline:"עונת משחק חדשה",body:"משלימים משימות · צוברים XP · פותחים פרסים"},
  {tag:"חמישה מצבי משחק",headline:"המסלול שלך",body:"בוחרים משימות · לומדים כל יום"},
  {tag:"XP ופרסים",headline:"עונת משחק חדשה",body:"משלימים משימות · צוברים XP · פותחים מתנות"},
  {tag:"הכנה למבחן",headline:"בוחנים את עצמכם",body:"30 שאלות · 40 דקות · חוקי תנועה"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"מצב ניאון · חזרה לעיצוב המקורי"}
 ],
 ar:[
  {tag:"إسرائيل · لعبة",headline:"موسم لعب جديد",body:"أكمل المهام · اكسب XP · افتح الهدايا"},
  {tag:"خمسة أنماط",headline:"طريقك الخاص",body:"اختر المهام · واكتسب الخبرة"},
  {tag:"نقاط XP والهدايا",headline:"موسم لعبة جديد",body:"أكمل المهام · اكسب XP · افتح الهدايا"},
  {tag:"الامتحان التجريبي",headline:"اختبر مهاراتك",body:"30 سؤالًا · 40 دقيقة · قوانين المرور"},
  {tag:"NEOLINE · VICE SUNSET",headline:"GTA VI STYLE",body:"عالم النيون · يمكنك العودة للوضع العادي"}
 ]
};
const artClasses=["city","signs","rewards","exam","duo"];
const sceneURLs=[
 "./assets/teoria/vice-cinematic-duo.svg",
 "./assets/teoria/vice-card-marathon.svg",
 "./assets/teoria/vice-approved-protagonists.webp",
 "./assets/teoria/vice-card-exam.svg",
 "./assets/teoria/vice-approved-protagonists.webp"
];
const stage=document.createElement("div");
stage.className="vice-cinema-stage";
stage.setAttribute("aria-hidden","true");
const frames=sceneURLs.map((url,index)=>{
 const frame=document.createElement("div");
 frame.className="vice-cinema-frame vice-cinema-frame--"+artClasses[index];
 frame.dataset.slide=String(index);
 const scene=document.createElement("div");
 scene.className="vice-cinema-scene";
 scene.style.backgroundImage='url("'+url+'")';
 const mask=document.createElement("span");
 mask.className="vice-cinema-mask";
 const words=document.createElement("div");
 words.className="vice-cinema-story";
 const tag=document.createElement("span");tag.className="vice-cinema-tag";
 const headline=document.createElement("strong");headline.className="vice-cinema-headline";
 const body=document.createElement("span");body.className="vice-cinema-sub";
 words.append(tag,headline,body);
 frame.append(scene,mask,words);
 stage.appendChild(frame);
 return {frame,tag,headline,body};
});
host.appendChild(stage);
// Original slide navigation stays in charge of timers, dots and destinations.
const previous=document.createElement("button"),next=document.createElement("button");
for(const [button,direction]of [[previous,-1],[next,1]]){
 button.type="button";
 button.className="vice-cinema-arrow vice-cinema-arrow--"+(direction<0?"prev":"next");
 button.setAttribute("aria-label",direction<0?"Предыдущий слайд":"Следующий слайд");
 button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg>';
 button.addEventListener("click",event=>{
  event.preventDefault();event.stopPropagation();
  const current=dots.findIndex(dot=>dot.getAttribute("aria-current")==="true");
  const target=(Math.max(current,0)+direction+dots.length)%dots.length;
  dots[target].click();
 });
 host.appendChild(button);
}
let current=-1;
function active(){
 let now=dots.findIndex(dot=>dot.getAttribute("aria-current")==="true");
 if(now<0)now=0;
 if(now===current)return;
 current=now;
 host.dataset.viceActiveSlide=String(now);
 document.querySelector(".game-hero.theory-dashboard")?.setAttribute("data-vice-promo-slide",String(now));
 for(let i=0;i<frames.length;i++){
  const el=frames[i].frame;
  el.classList.toggle("is-active",i===now);
  el.setAttribute("aria-hidden",i===now?"false":"true");
 }
}
new MutationObserver(active).observe(host,{subtree:true,attributes:true,attributeFilter:["aria-current"]});
function localize(){
 const locale=document.documentElement.lang.split("-")[0];
 const entries=i18n[locale]||i18n.ru;
 frames.forEach((p,i)=>{
  p.tag.textContent=entries[i].tag;
  p.headline.textContent=entries[i].headline;
  p.body.textContent=entries[i].body;
 });
 previous.setAttribute("aria-label",({ru:"Предыдущий рекламный слайд",en:"Previous promotional slide",he:"שקופית קודמת",ar:"الشريحة السابقة"})[locale]||"Предыдущий рекламный слайд");
 next.setAttribute("aria-label",({ru:"Следующий рекламный слайд",en:"Next promotional slide",he:"שקופית הבאה",ar:"الشريحة التالية"})[locale]||"Следующий рекламный слайд");
}
new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
localize();
active();
// Expose a truthful description for screen readers; all real actions stay on
// the existing promotional button and dots.
host.setAttribute("aria-roledescription","карусель");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let showTimeout=0;
function entrance(){
 if(reduce||document.documentElement.dataset.viceTheme!=="on")return;
 for(const [i,elem]of [...document.querySelectorAll("#gameLobby .route-card,.game-hero.theory-dashboard,.theory-daily")].entries()){
  elem.style.setProperty("--vice-reveal-order",String(Math.min(i,6)));
  elem.classList.remove("vice-is-entering");
  void elem.offsetWidth;
  elem.classList.add("vice-is-entering");
 }
 clearTimeout(showTimeout);
 showTimeout=setTimeout(()=>{
  document.querySelectorAll(".vice-is-entering").forEach(el=>el.classList.remove("vice-is-entering"));
 },1000);
}
function welcome(){
 // Open the cinematic protagonist poster as the FIRST slide of the neon mode.
 // The regular five-slide timer continues rotating afterwards.
 if(dots[0]?.getAttribute("aria-current")!=="true")dots[0]?.click();
 entrance();
}
let wasEnabled=document.documentElement.dataset.viceTheme==="on";
window.addEventListener("neoline:vice-theme",event=>{
 const nowEnabled=Boolean(event.detail?.enabled);
 // Localization refreshes this event too. Do not reset an open carousel slide
 // just because the visitor switched Russian, English, Hebrew or Arabic.
 if(nowEnabled&&!wasEnabled)welcome();
 wasEnabled=nowEnabled;
});
if(wasEnabled)requestAnimationFrame(welcome);
})();

;

/* SOURCE: teoria-vice-radar-wasted.js */
;
/* NEOLINE / Circular radar + cinematic failure; visual-only enhancement.
   Quiz events remain the single source of progress, XP and remaining hearts. */
(()=>{
 "use strict";
 const root=document.documentElement;
 const progress=document.getElementById("dock4Progress");
 const overlay=document.getElementById("gameOver");
 const title=document.getElementById("gameOverTitle");
 if(!progress||!overlay||!title)return;
 const quizHeader=document.querySelector("#gamePlaying .quiz-hud");
 const backButton=document.getElementById("exitQuiz");
 const modeTitle=document.createElement("span");
 modeTitle.className="vice-hud-title";
 const modeNames={
  ru:{route:"Поездка по городу",signs:"Охота за знаками",exam:"Экзамен",mistakes:"Исправь ошибки",marathon:"Путь по всем билетам",daily:"Задание дня"},
  en:{route:"City drive",signs:"Road signs",exam:"Driving exam",mistakes:"Review mistakes",marathon:"All tickets",daily:"Daily challenge"},
  he:{route:"נסיעה בעיר",signs:"תמרורים",exam:"מבחן",mistakes:"תיקון טעויות",marathon:"כל השאלות",daily:"אתגר יומי"},
  ar:{route:"قيادة في المدينة",signs:"إشارات المرور",exam:"الامتحان",mistakes:"راجع الأخطاء",marathon:"كل الأسئلة",daily:"تحدي اليوم"}
 };
 let currentMode="route";
 const updateTitle=()=>{const lang=(root.lang||"ru").split("-")[0],d=modeNames[lang]||modeNames.ru;modeTitle.textContent=d[currentMode]||d.route};
 if(quizHeader&&backButton){backButton.insertAdjacentElement("afterend",modeTitle);updateTitle()}

 // Exam countdown continues to be controlled by the existing game engine.
 // Its original DOM remains in the hidden top HUD; this is display-only.
 const clockBox=document.getElementById("timerBox");
 const clockText=document.getElementById("timer");
 const questionEye=document.querySelector("#gamePlaying .question-eyebrow");
 const clockMirror=document.createElement("span");
 clockMirror.className="vice-quiz-timer";
 clockMirror.hidden=true;
 clockMirror.setAttribute("aria-live","off");
 if(questionEye&&clockBox&&clockText){
  const id=document.getElementById("questionId");
  if(id&&id.parentElement===questionEye)questionEye.insertBefore(clockMirror,id);
  else questionEye.append(clockMirror);
  const syncClock=()=>{
   clockMirror.hidden=clockBox.hidden;
   clockMirror.textContent="◷ "+clockText.textContent.trim();
  };
  new MutationObserver(syncClock).observe(clockBox,{attributes:true,attributeFilter:["hidden"]});
  new MutationObserver(syncClock).observe(clockText,{childList:true,subtree:true,characterData:true});
  syncClock();
 }


 // A real vector route with a moving location marker. It is intentionally
 // aria-hidden because the parent progressbar already announces done / total.
 const ns="http://www.w3.org/2000/svg";
 const svg=document.createElementNS(ns,"svg");
 svg.classList.add("vice-radar-map");
 svg.setAttribute("viewBox","0 0 100 100");
 svg.setAttribute("aria-hidden","true");
 svg.setAttribute("focusable","false");
 svg.innerHTML=`
  <defs>
   <clipPath id="viceRadarClip"><circle cx="50" cy="50" r="48"/></clipPath>
   <radialGradient id="viceRadarSea"><stop stop-color="#294f61"/><stop offset="1" stop-color="#152237"/></radialGradient>
   <linearGradient id="viceRadarBlue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b0fff3"/><stop offset=".6" stop-color="#52e8ff"/><stop offset="1" stop-color="#83adff"/></linearGradient>
   <filter id="viceRadarGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8"/></filter>
  </defs>
  <g clip-path="url(#viceRadarClip)">
   <circle cx="50" cy="50" r="50" fill="url(#viceRadarSea)"/>
   <g fill="none" stroke="#a3b0bb" stroke-opacity=".26" stroke-width="3.2" stroke-linecap="round">
    <path d="M-10 20 110 39M-5 79 105 65M8-5 31 109M66-5 82 107"/>
    <path d="M0 44 Q35 53 68 25 T108 6M2 94 Q48 88 58 107"/>
   </g>
   <g fill="none" stroke="#7f98a6" stroke-opacity=".2" stroke-width="1.4">
    <path d="M10 0V100M42 0V100M74 0V100M0 17H100M0 49H100M0 82H100"/>
   </g>
   <g fill="#406273" fill-opacity=".62" stroke="#93a6ad" stroke-opacity=".26" stroke-width=".6">
    <rect x="14" y="5" width="13" height="13" rx="2"/>
    <rect x="46" y="9" width="20" height="12" rx="2"/>
    <rect x="78" y="44" width="15" height="14" rx="2"/>
    <rect x="7" y="54" width="15" height="12" rx="2"/>
    <rect x="38" y="72" width="15" height="16" rx="2"/>
   </g>
   <path id="viceRadarRoute" d="M14 74 Q22 70 27 61 L40 59 Q47 57 47 46 L60 37 Q67 31 79 25" fill="none" stroke="#9a6fbc" stroke-opacity=".6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
   <path id="viceRadarFill" d="M14 74 Q22 70 27 61 L40 59 Q47 57 47 46 L60 37 Q67 31 79 25" fill="none" stroke="url(#viceRadarBlue)" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#viceRadarGlow)"/>
   <circle cx="79" cy="25" r="5.8" fill="#172a42" stroke="#98f6ff" stroke-width="2.2"/>
   <circle cx="79" cy="25" r="1.9" fill="#fffbe9"/>
   <g id="viceRadarMarker" transform="translate(14 74)">
    <circle r="7" fill="#60faff" opacity=".24"/>
    <circle r="4.1" fill="#54dcff" stroke="#f7fbff" stroke-width="1.7"/>
    <circle r="1.35" fill="#fff"/>
   </g>
  </g>`;
 progress.insertBefore(svg,progress.firstChild);
 const path=svg.querySelector("#viceRadarRoute");
 const fill=svg.querySelector("#viceRadarFill");
 const marker=svg.querySelector("#viceRadarMarker");
 const length=path.getTotalLength();
 fill.style.strokeDasharray=length+" "+length;
 let currentRatio=-1;
 function paintRoute(done,total){
  const n=Math.max(1,Number(total)||1);
  const ratio=Math.max(0,Math.min(1,(Number(done)||0)/n));
  if(ratio===currentRatio)return;
  currentRatio=ratio;
  fill.style.strokeDashoffset=String(length*(1-ratio));
  const point=path.getPointAtLength(length*ratio);
  marker.setAttribute("transform","translate("+point.x.toFixed(2)+" "+point.y.toFixed(2)+")");
  svg.dataset.progress=Math.round(ratio*100);
 }
 window.addEventListener("neoline:theory-quiz",e=>{
  const d=e.detail||{};
  if(d.mode){currentMode=d.mode;updateTitle()}
  paintRoute(d.done,d.total);
 });
 const initial=(document.getElementById("dock4Count")?.textContent||"0/10").split("/");
 paintRoute(initial[0],initial[1]);

 const headings={ru:"ПОТРАЧЕНО",en:"WASTED",he:"נגמר המשחק",ar:"انتهت المحاولات"};
 const label=()=>headings[(root.lang||"ru").split("-")[0]]||headings.ru;
 function syncWasted(){
  const neon=root.dataset.viceTheme==="on";
  const gameOverVisible=!overlay.hidden;
  title.textContent=neon?label():"GAME OVER";
  overlay.classList.toggle("vice-wasted",neon&&gameOverVisible);
 }
 new MutationObserver(syncWasted).observe(overlay,{attributes:true,attributeFilter:["hidden"]});
 new MutationObserver(()=>{updateTitle();syncWasted()}).observe(root,{attributes:true,attributeFilter:["lang","data-vice-theme"]});
 window.addEventListener("neoline:vice-theme",syncWasted);
 window.addEventListener("neoline:theory-finish",syncWasted);
 syncWasted();
})();

;

/* SOURCE: teoria-pt3-decoder.js */
;
/* NEOLINE original PT3 playback support
 * ProTracker 3 replay engine: JavaScript adaptation of em00k's TS port
 * (https://github.com/em00k/TS-Pt3player/src/pt3player.ts),
 * based on Bulba's/Volutar's MIT-licensed pt3player.c.
 * MIT C source and licensing included at tools/pt3/.
 * Please retain upstream attribution.
 * Actual user-supplied tracker files are not embedded in this engine.
 */
(()=>{"use strict";
// PT3 Player engine - TypeScript port of pt3player.c by Volutar (C version of PT3 player by Bulba)

// Volume tables
const PT3VolumeTable_33_34 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
  [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4],
  [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
  [0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6],
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8],
  [0, 0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9],
  [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10],
  [0, 0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11],
  [0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 11, 11, 12],
  [0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13],
  [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
];

const PT3VolumeTable_35 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3],
  [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4],
  [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
  [0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6],
  [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
  [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8],
  [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8, 8, 9],
  [0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10],
  [0, 1, 1, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 10, 10, 11],
  [0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12],
  [0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13],
  [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
];

// Note frequency tables
const PT3NoteTable_PT_33_34r = new Uint16Array([
  0xC21,0xB73,0xACE,0xA33,0x9A0,0x916,0x893,0x818,0x7A4,0x736,0x6CE,0x66D,
  0x610,0x5B9,0x567,0x519,0x4D0,0x48B,0x449,0x40C,0x3D2,0x39B,0x367,0x336,
  0x308,0x2DC,0x2B3,0x28C,0x268,0x245,0x224,0x206,0x1E9,0x1CD,0x1B3,0x19B,
  0x184,0x16E,0x159,0x146,0x134,0x122,0x112,0x103,0x0F4,0x0E6,0x0D9,0x0CD,
  0x0C2,0x0B7,0x0AC,0x0A3,0x09A,0x091,0x089,0x081,0x07A,0x073,0x06C,0x066,
  0x061,0x05B,0x056,0x051,0x04D,0x048,0x044,0x040,0x03D,0x039,0x036,0x033,
  0x030,0x02D,0x02B,0x028,0x026,0x024,0x022,0x020,0x01E,0x01C,0x01B,0x019,
  0x018,0x016,0x015,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,0x00C,
]);

const PT3NoteTable_PT_34_35 = new Uint16Array([
  0xC22,0xB73,0xACF,0xA33,0x9A1,0x917,0x894,0x819,0x7A4,0x737,0x6CF,0x66D,
  0x611,0x5BA,0x567,0x51A,0x4D0,0x48B,0x44A,0x40C,0x3D2,0x39B,0x367,0x337,
  0x308,0x2DD,0x2B4,0x28D,0x268,0x246,0x225,0x206,0x1E9,0x1CE,0x1B4,0x19B,
  0x184,0x16E,0x15A,0x146,0x134,0x123,0x112,0x103,0x0F5,0x0E7,0x0DA,0x0CE,
  0x0C2,0x0B7,0x0AD,0x0A3,0x09A,0x091,0x089,0x082,0x07A,0x073,0x06D,0x067,
  0x061,0x05C,0x056,0x052,0x04D,0x049,0x045,0x041,0x03D,0x03A,0x036,0x033,
  0x031,0x02E,0x02B,0x029,0x027,0x024,0x022,0x020,0x01F,0x01D,0x01B,0x01A,
  0x018,0x017,0x016,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,0x00C,
]);

const PT3NoteTable_ST = new Uint16Array([
  0xEF8,0xE10,0xD60,0xC80,0xBD8,0xB28,0xA88,0x9F0,0x960,0x8E0,0x858,0x7E0,
  0x77C,0x708,0x6B0,0x640,0x5EC,0x594,0x544,0x4F8,0x4B0,0x470,0x42C,0x3FD,
  0x3BE,0x384,0x358,0x320,0x2F6,0x2CA,0x2A2,0x27C,0x258,0x238,0x216,0x1F8,
  0x1DF,0x1C2,0x1AC,0x190,0x17B,0x165,0x151,0x13E,0x12C,0x11C,0x10A,0x0FC,
  0x0EF,0x0E1,0x0D6,0x0C8,0x0BD,0x0B2,0x0A8,0x09F,0x096,0x08E,0x085,0x07E,
  0x077,0x070,0x06B,0x064,0x05E,0x059,0x054,0x04F,0x04B,0x047,0x042,0x03F,
  0x03B,0x038,0x035,0x032,0x02F,0x02C,0x02A,0x027,0x025,0x023,0x021,0x01F,
  0x01D,0x01C,0x01A,0x019,0x017,0x016,0x015,0x013,0x012,0x011,0x010,0x00F,
]);

const PT3NoteTable_ASM_34r = new Uint16Array([
  0xD3E,0xC80,0xBCC,0xB22,0xA82,0x9EC,0x95C,0x8D6,0x858,0x7E0,0x76E,0x704,
  0x69F,0x640,0x5E6,0x591,0x541,0x4F6,0x4AE,0x46B,0x42C,0x3F0,0x3B7,0x382,
  0x34F,0x320,0x2F3,0x2C8,0x2A1,0x27B,0x257,0x236,0x216,0x1F8,0x1DC,0x1C1,
  0x1A8,0x190,0x179,0x164,0x150,0x13D,0x12C,0x11B,0x10B,0x0FC,0x0EE,0x0E0,
  0x0D4,0x0C8,0x0BD,0x0B2,0x0A8,0x09F,0x096,0x08D,0x085,0x07E,0x077,0x070,
  0x06A,0x064,0x05E,0x059,0x054,0x050,0x04B,0x047,0x043,0x03F,0x03C,0x038,
  0x035,0x032,0x02F,0x02D,0x02A,0x028,0x026,0x024,0x022,0x020,0x01E,0x01D,
  0x01B,0x01A,0x019,0x018,0x015,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,
]);

const PT3NoteTable_ASM_34_35 = new Uint16Array([
  0xD10,0xC55,0xBA4,0xAFC,0xA5F,0x9CA,0x93D,0x8B8,0x83B,0x7C5,0x755,0x6EC,
  0x688,0x62A,0x5D2,0x57E,0x52F,0x4E5,0x49E,0x45C,0x41D,0x3E2,0x3AB,0x376,
  0x344,0x315,0x2E9,0x2BF,0x298,0x272,0x24F,0x22E,0x20F,0x1F1,0x1D5,0x1BB,
  0x1A2,0x18B,0x174,0x160,0x14C,0x139,0x128,0x117,0x107,0x0F9,0x0EB,0x0DD,
  0x0D1,0x0C5,0x0BA,0x0B0,0x0A6,0x09D,0x094,0x08C,0x084,0x07C,0x075,0x06F,
  0x069,0x063,0x05D,0x058,0x053,0x04E,0x04A,0x046,0x042,0x03E,0x03B,0x037,
  0x034,0x031,0x02F,0x02C,0x029,0x027,0x025,0x023,0x021,0x01F,0x01D,0x01C,
  0x01A,0x019,0x017,0x016,0x015,0x014,0x012,0x011,0x010,0x00F,0x00E,0x00D,
]);

const PT3NoteTable_REAL_34r = new Uint16Array([
  0xCDA,0xC22,0xB73,0xACF,0xA33,0x9A1,0x917,0x894,0x819,0x7A4,0x737,0x6CF,
  0x66D,0x611,0x5BA,0x567,0x51A,0x4D0,0x48B,0x44A,0x40C,0x3D2,0x39B,0x367,
  0x337,0x308,0x2DD,0x2B4,0x28D,0x268,0x246,0x225,0x206,0x1E9,0x1CE,0x1B4,
  0x19B,0x184,0x16E,0x15A,0x146,0x134,0x123,0x113,0x103,0x0F5,0x0E7,0x0DA,
  0x0CE,0x0C2,0x0B7,0x0AD,0x0A3,0x09A,0x091,0x089,0x082,0x07A,0x073,0x06D,
  0x067,0x061,0x05C,0x056,0x052,0x04D,0x049,0x045,0x041,0x03D,0x03A,0x036,
  0x033,0x031,0x02E,0x02B,0x029,0x027,0x024,0x022,0x020,0x01F,0x01D,0x01B,
  0x01A,0x018,0x017,0x016,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,
]);

const PT3NoteTable_REAL_34_35 = new Uint16Array([
  0xCDA,0xC22,0xB73,0xACF,0xA33,0x9A1,0x917,0x894,0x819,0x7A4,0x737,0x6CF,
  0x66D,0x611,0x5BA,0x567,0x51A,0x4D0,0x48B,0x44A,0x40C,0x3D2,0x39B,0x367,
  0x337,0x308,0x2DD,0x2B4,0x28D,0x268,0x246,0x225,0x206,0x1E9,0x1CE,0x1B4,
  0x19B,0x184,0x16E,0x15A,0x146,0x134,0x123,0x112,0x103,0x0F5,0x0E7,0x0DA,
  0x0CE,0x0C2,0x0B7,0x0AD,0x0A3,0x09A,0x091,0x089,0x082,0x07A,0x073,0x06D,
  0x067,0x061,0x05C,0x056,0x052,0x04D,0x049,0x045,0x041,0x03D,0x03A,0x036,
  0x033,0x031,0x02E,0x02B,0x029,0x027,0x024,0x022,0x020,0x01F,0x01D,0x01B,
  0x01A,0x018,0x017,0x016,0x014,0x013,0x012,0x011,0x010,0x00F,0x00E,0x00D,
]);

// Helper functions for reading from Uint8Array
function readU16(data, offset) {
  return data[offset] | (data[offset + 1] << 8);
}

function readI16(data, offset) {
  const v = data[offset] | (data[offset + 1] << 8);
  return v >= 0x8000 ? v - 0x10000 : v;
}

function readI8(data, offset) {
  const v = data[offset];
  return v >= 0x80 ? v - 0x100 : v;
}

// Channel parameters






function makeChannelParams() {
  return {
    Address_In_Pattern: 0,
    OrnamentPointer: 0,
    SamplePointer: 0,
    Ton: 0,
    Loop_Ornament_Position: 0,
    Ornament_Length: 0,
    Position_In_Ornament: 0,
    Loop_Sample_Position: 0,
    Sample_Length: 0,
    Position_In_Sample: 0,
    Volume: 15,
    Number_Of_Notes_To_Skip: 0,
    Note: 0,
    Slide_To_Note: 0,
    Amplitude: 0,
    Envelope_Enabled: false,
    Enabled: false,
    SimpleGliss: false,
    Current_Amplitude_Sliding: 0,
    Current_Noise_Sliding: 0,
    Current_Envelope_Sliding: 0,
    Ton_Slide_Count: 0,
    Current_OnOff: 0,
    OnOff_Delay: 0,
    OffOn_Delay: 0,
    Ton_Slide_Delay: 0,
    Current_Ton_Sliding: 0,
    Ton_Accumulator: 0,
    Ton_Slide_Step: 0,
    Ton_Delta: 0,
    Note_Skip_Counter: 1,
  };
}

function getNoteFreq(j, inst) {
  switch (inst.tonTableId) {
    case 0:
      if (inst.version <= 3) return PT3NoteTable_PT_33_34r[j];
      else return PT3NoteTable_PT_34_35[j];
    case 1:
      return PT3NoteTable_ST[j];
    case 2:
      if (inst.version <= 3) return PT3NoteTable_ASM_34r[j];
      else return PT3NoteTable_ASM_34_35[j];
    default:
      if (inst.version <= 3) return PT3NoteTable_REAL_34r[j];
      else return PT3NoteTable_REAL_34_35[j];
  }
}

function patternInterpreter(chan, inst) {
  const idx = inst.data;
  let Flag1 = 0, Flag2 = 0, Flag3 = 0, Flag4 = 0, Flag5 = 0, Flag8 = 0, Flag9 = 0;
  let counter = 0;

  const PrNote = chan.Note;
  const PrSliding = chan.Current_Ton_Sliding;
  let quit = false;

  while (!quit) {
    const op = idx[chan.Address_In_Pattern];

    if (op >= 0xf0) {
      // Set ornament + sample
      chan.OrnamentPointer = inst.ornamentPointers[op - 0xf0];
      chan.Loop_Ornament_Position = idx[chan.OrnamentPointer++];
      chan.Ornament_Length = idx[chan.OrnamentPointer++];
      chan.Position_In_Ornament = 0;
      chan.Address_In_Pattern++;
      chan.SamplePointer = inst.samplePointers[idx[chan.Address_In_Pattern] >> 1];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
      chan.Envelope_Enabled = false;
    } else if (op >= 0xd1) {
      // Set sample
      chan.SamplePointer = inst.samplePointers[op - 0xd0];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
    } else if (op === 0xd0) {
      quit = true;
    } else if (op >= 0xc1) {
      chan.Volume = op - 0xc0;
    } else if (op === 0xc0) {
      chan.Position_In_Sample = 0;
      chan.Current_Amplitude_Sliding = 0;
      chan.Current_Noise_Sliding = 0;
      chan.Current_Envelope_Sliding = 0;
      chan.Position_In_Ornament = 0;
      chan.Ton_Slide_Count = 0;
      chan.Current_Ton_Sliding = 0;
      chan.Ton_Accumulator = 0;
      chan.Current_OnOff = 0;
      chan.Enabled = false;
      quit = true;
    } else if (op >= 0xb2) {
      // Set envelope
      chan.Envelope_Enabled = true;
      inst.ay[13] = op - 0xb1;
      chan.Address_In_Pattern++;
      const hi = idx[chan.Address_In_Pattern];
      chan.Address_In_Pattern++;
      const lo = idx[chan.Address_In_Pattern];
      inst.pt3.Env_Base = (hi << 8) | lo;
      chan.Position_In_Ornament = 0;
      inst.pt3.Cur_Env_Slide = 0;
      inst.pt3.Cur_Env_Delay = 0;
    } else if (op === 0xb1) {
      chan.Address_In_Pattern++;
      chan.Number_Of_Notes_To_Skip = idx[chan.Address_In_Pattern];
    } else if (op === 0xb0) {
      chan.Envelope_Enabled = false;
      chan.Position_In_Ornament = 0;
    } else if (op >= 0x50) {
      // Set note and quit
      chan.Note = op - 0x50;
      chan.Position_In_Sample = 0;
      chan.Current_Amplitude_Sliding = 0;
      chan.Current_Noise_Sliding = 0;
      chan.Current_Envelope_Sliding = 0;
      chan.Position_In_Ornament = 0;
      chan.Ton_Slide_Count = 0;
      chan.Current_Ton_Sliding = 0;
      chan.Ton_Accumulator = 0;
      chan.Current_OnOff = 0;
      chan.Enabled = true;
      quit = true;
    } else if (op >= 0x40) {
      // Set ornament (envelope not disabled)
      chan.OrnamentPointer = inst.ornamentPointers[op - 0x40];
      chan.Loop_Ornament_Position = idx[chan.OrnamentPointer++];
      chan.Ornament_Length = idx[chan.OrnamentPointer++];
      chan.Position_In_Ornament = 0;
    } else if (op >= 0x20) {
      inst.pt3.Noise_Base = op - 0x20;
    } else if (op >= 0x11) {
      // Set envelope + sample
      inst.ay[13] = op - 0x10;
      chan.Address_In_Pattern++;
      const hi = idx[chan.Address_In_Pattern];
      chan.Address_In_Pattern++;
      const lo = idx[chan.Address_In_Pattern];
      inst.pt3.Env_Base = (hi << 8) | lo;
      inst.pt3.Cur_Env_Slide = 0;
      inst.pt3.Cur_Env_Delay = 0;
      chan.Envelope_Enabled = true;
      chan.Address_In_Pattern++;
      chan.SamplePointer = inst.samplePointers[idx[chan.Address_In_Pattern] >> 1];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
      chan.Position_In_Ornament = 0;
    } else if (op === 0x10) {
      // Disable envelope, set ornament=0, set sample
      chan.Envelope_Enabled = false;
      chan.Address_In_Pattern++;
      chan.SamplePointer = inst.samplePointers[idx[chan.Address_In_Pattern] >> 1];
      chan.Loop_Sample_Position = idx[chan.SamplePointer++];
      chan.Sample_Length = idx[chan.SamplePointer++];
      chan.Position_In_Ornament = 0;
    } else if (op === 9) { Flag9 = ++counter; }
    else if (op === 8) { Flag8 = ++counter; }
    else if (op === 5) { Flag5 = ++counter; }
    else if (op === 4) { Flag4 = ++counter; }
    else if (op === 3) { Flag3 = ++counter; }
    else if (op === 2) { Flag2 = ++counter; }
    else if (op === 1) { Flag1 = ++counter; }

    chan.Address_In_Pattern++;
  }

  // Process effect parameters in reverse counter order
  while (counter > 0) {
    if (counter === Flag1) {
      // Gliss
      chan.Ton_Slide_Delay = idx[chan.Address_In_Pattern++];
      chan.Ton_Slide_Count = chan.Ton_Slide_Delay;
      chan.Ton_Slide_Step = readI16(idx, chan.Address_In_Pattern);
      chan.SimpleGliss = true;
      chan.Current_OnOff = 0;
      if (chan.Ton_Slide_Count === 0 && inst.version >= 7) {
        chan.Ton_Slide_Count++;
      }
      chan.Address_In_Pattern += 2;
    } else if (counter === Flag2) {
      // Tone portamento
      chan.SimpleGliss = false;
      chan.Current_OnOff = 0;
      chan.Ton_Slide_Delay = idx[chan.Address_In_Pattern++];
      chan.Ton_Slide_Count = chan.Ton_Slide_Delay;
      // Skip lmax/hmax (2 bytes), read slide step
      chan.Ton_Slide_Step = Math.abs(readI16(idx, chan.Address_In_Pattern + 2));
      chan.Ton_Delta = getNoteFreq(chan.Note, inst) - getNoteFreq(PrNote, inst);
      chan.Slide_To_Note = chan.Note;
      chan.Note = PrNote;
      if (inst.version >= 6) {
        chan.Current_Ton_Sliding = PrSliding;
      }
      if (chan.Ton_Delta - chan.Current_Ton_Sliding < 0) {
        chan.Ton_Slide_Step = -chan.Ton_Slide_Step;
      }
      chan.Address_In_Pattern += 4;
    } else if (counter === Flag3) {
      chan.Position_In_Sample = idx[chan.Address_In_Pattern++];
    } else if (counter === Flag4) {
      chan.Position_In_Ornament = idx[chan.Address_In_Pattern++];
    } else if (counter === Flag5) {
      // Vibrato/gate
      chan.OnOff_Delay = idx[chan.Address_In_Pattern++];
      chan.OffOn_Delay = idx[chan.Address_In_Pattern++];
      chan.Current_OnOff = chan.OnOff_Delay;
      chan.Ton_Slide_Count = 0;
      chan.Current_Ton_Sliding = 0;
    } else if (counter === Flag8) {
      // Envelope slide
      inst.pt3.Env_Delay = idx[chan.Address_In_Pattern++];
      inst.pt3.Cur_Env_Delay = inst.pt3.Env_Delay;
      inst.pt3.Env_Slide_Add = readI16(idx, chan.Address_In_Pattern);
      chan.Address_In_Pattern += 2;
    } else if (counter === Flag9) {
      // Tempo change
      inst.pt3.Delay = idx[chan.Address_In_Pattern++];
    }
    counter--;
  }

  chan.Note_Skip_Counter = chan.Number_Of_Notes_To_Skip;
}

// Module-level temporaries used across ChangeRegisters calls within a single tick
let TempMixer = 0;
let AddToEnv = 0;

function changeRegisters(chan, inst) {
  const idx = inst.data;

  if (chan.Enabled) {
    chan.Ton = readU16(idx, chan.SamplePointer + chan.Position_In_Sample * 4 + 2);
    chan.Ton += chan.Ton_Accumulator;
    const b0 = idx[chan.SamplePointer + chan.Position_In_Sample * 4 + 0];
    const b1 = idx[chan.SamplePointer + chan.Position_In_Sample * 4 + 1];
    if (b1 & 0x40) chan.Ton_Accumulator = chan.Ton;

    let j = chan.Note + readI8(idx, chan.OrnamentPointer + chan.Position_In_Ornament);
    if (j >= 128) j = 0;
    else if (j > 95) j = 95;
    if (j < 0) j = 0;
    const w = getNoteFreq(j, inst);
    chan.Ton = (chan.Ton + chan.Current_Ton_Sliding + w) & 0xfff;

    if (chan.Ton_Slide_Count > 0) {
      chan.Ton_Slide_Count--;
      if (chan.Ton_Slide_Count === 0) {
        chan.Current_Ton_Sliding += chan.Ton_Slide_Step;
        chan.Ton_Slide_Count = chan.Ton_Slide_Delay;
        if (!chan.SimpleGliss) {
          if ((chan.Ton_Slide_Step < 0 && chan.Current_Ton_Sliding <= chan.Ton_Delta) ||
              (chan.Ton_Slide_Step >= 0 && chan.Current_Ton_Sliding >= chan.Ton_Delta)) {
            chan.Note = chan.Slide_To_Note;
            chan.Ton_Slide_Count = 0;
            chan.Current_Ton_Sliding = 0;
          }
        }
      }
    }

    chan.Amplitude = b1 & 15;
    if (b0 & 0x80) {
      if (b0 & 0x40) {
        if (chan.Current_Amplitude_Sliding < 15) chan.Current_Amplitude_Sliding++;
      } else {
        if (chan.Current_Amplitude_Sliding > -15) chan.Current_Amplitude_Sliding--;
      }
    }
    chan.Amplitude += chan.Current_Amplitude_Sliding;
    if (chan.Amplitude >= 128) chan.Amplitude = 0; // signed < 0
    else if (chan.Amplitude > 15) chan.Amplitude = 15;

    if (inst.version <= 4) {
      chan.Amplitude = PT3VolumeTable_33_34[chan.Volume][chan.Amplitude];
    } else {
      chan.Amplitude = PT3VolumeTable_35[chan.Volume][chan.Amplitude];
    }

    if (!(b0 & 1) && chan.Envelope_Enabled) {
      chan.Amplitude = chan.Amplitude | 0x10;
    }

    if (b1 & 0x80) {
      // Envelope period shift
      let envAdd;
      if (b0 & 0x20) {
        envAdd = ((b0 >> 1) | 0xF0) + chan.Current_Envelope_Sliding;
      } else {
        envAdd = ((b0 >> 1) & 0x0F) + chan.Current_Envelope_Sliding;
      }
      if (b1 & 0x20) chan.Current_Envelope_Sliding = envAdd;
      AddToEnv += envAdd;
    } else {
      // Noise
      inst.pt3.AddToNoise = (b0 >> 1) + chan.Current_Noise_Sliding;
      if (b1 & 0x20) chan.Current_Noise_Sliding = inst.pt3.AddToNoise;
    }

    TempMixer = ((b1 >> 1) & 0x48) | TempMixer;
    chan.Position_In_Sample++;
    if (chan.Position_In_Sample >= chan.Sample_Length) {
      chan.Position_In_Sample = chan.Loop_Sample_Position;
    }
    chan.Position_In_Ornament++;
    if (chan.Position_In_Ornament >= chan.Ornament_Length) {
      chan.Position_In_Ornament = chan.Loop_Ornament_Position;
    }
  } else {
    chan.Amplitude = 0;
  }

  TempMixer >>= 1;

  if (chan.Current_OnOff > 0) {
    chan.Current_OnOff--;
    if (chan.Current_OnOff === 0) {
      chan.Enabled = !chan.Enabled;
      if (chan.Enabled) chan.Current_OnOff = chan.OnOff_Delay;
      else chan.Current_OnOff = chan.OffOn_Delay;
    }
  }
}

function pt3_play_tick(inst) {
  const idx = inst.data;

  inst.ay[13] = 0xff;
  inst.pt3.DelayCounter--;

  if (inst.pt3.DelayCounter === 0) {
    inst.channels[0].Note_Skip_Counter--;
    if (inst.channels[0].Note_Skip_Counter === 0) {
      if (idx[inst.channels[0].Address_In_Pattern] === 0) {
        // End of pattern - advance position
        inst.pt3.CurrentPosition++;
        if (inst.pt3.CurrentPosition === inst.numPositions) {
          inst.pt3.CurrentPosition = inst.loopPosition;
          inst.looped = true;
        }
        const posIdx = idx[201 + inst.pt3.CurrentPosition];
        let i = posIdx;
        if (inst.ts !== 0x20) i = inst.ts * 3 - 3 - i;
        for (let abc = 0; abc < 3; abc++) {
          inst.channels[abc].Address_In_Pattern =
            readU16(idx, inst.patternsPointer + (i + abc) * 2);
        }
        inst.pt3.Noise_Base = 0;
      }
      patternInterpreter(inst.channels[0], inst);
    }
    for (let abc = 1; abc < 3; abc++) {
      inst.channels[abc].Note_Skip_Counter--;
      if (inst.channels[abc].Note_Skip_Counter === 0) {
        patternInterpreter(inst.channels[abc], inst);
      }
    }
    inst.pt3.DelayCounter = inst.pt3.Delay;
  }

  AddToEnv = 0;
  TempMixer = 0;
  changeRegisters(inst.channels[0], inst);
  changeRegisters(inst.channels[1], inst);
  changeRegisters(inst.channels[2], inst);

  inst.ay[0] = inst.channels[0].Ton & 0xff;
  inst.ay[1] = (inst.channels[0].Ton >> 8) & 0xff;
  inst.ay[2] = inst.channels[1].Ton & 0xff;
  inst.ay[3] = (inst.channels[1].Ton >> 8) & 0xff;
  inst.ay[4] = inst.channels[2].Ton & 0xff;
  inst.ay[5] = (inst.channels[2].Ton >> 8) & 0xff;
  inst.ay[6] = (inst.pt3.Noise_Base + inst.pt3.AddToNoise) & 0x1f;
  inst.ay[7] = TempMixer;
  inst.ay[8] = inst.channels[0].Amplitude;
  inst.ay[9] = inst.channels[1].Amplitude;
  inst.ay[10] = inst.channels[2].Amplitude;
  const env = (inst.pt3.Env_Base + AddToEnv + inst.pt3.Cur_Env_Slide) & 0xffff;
  inst.ay[11] = env & 0xff;
  inst.ay[12] = (env >> 8) & 0xff;

  if (inst.pt3.Cur_Env_Delay > 0) {
    inst.pt3.Cur_Env_Delay--;
    if (inst.pt3.Cur_Env_Delay === 0) {
      inst.pt3.Cur_Env_Delay = inst.pt3.Env_Delay;
      inst.pt3.Cur_Env_Slide += inst.pt3.Env_Slide_Add;
    }
  }

  inst.globalTickCounter++;
}

function pt3_setup_music(fileData) {
  if (fileData.length > 65536 || fileData.length < 202) return null;

  // Copy data so we don't modify the original
  const data = new Uint8Array(65536);
  data.set(fileData);

  // Parse version from header byte 13
  let version = 6;
  const versionChar = data[13];
  if (versionChar >= 0x30 && versionChar <= 0x39) { // '0'-'9'
    version = versionChar - 0x30;
  }

  const tonTableId = data[99];
  const delay = data[100];
  const loopPosition = data[102];
  const patternsPointer = readU16(data, 103);

  // Sample pointers (32 entries at offset 105)
  const samplePointers = new Uint16Array(32);
  for (let i = 0; i < 32; i++) {
    samplePointers[i] = readU16(data, 105 + i * 2);
  }

  // Ornament pointers (16 entries at offset 169)
  const ornamentPointers = new Uint16Array(16);
  for (let i = 0; i < 16; i++) {
    ornamentPointers[i] = readU16(data, 169 + i * 2);
  }

  // Count positions (position list starts at offset 201, terminated by 0xFF)
  let numPositions = 0;
  while (numPositions < fileData.length && data[201 + numPositions] !== 0xFF) {
    numPositions++;
    if (numPositions > 255) { numPositions = 255; break; }
  }

  const ts = data[98]; // TS marker (0x20 = not TS)

  const inst = {
    data,
    version,
    ts,
    globalTickCounter: 0,
    looped: false,
    numPositions,
    loopPosition,
    patternsPointer,
    samplePointers,
    ornamentPointers,
    tonTableId,
    pt3: {
      Env_Base: 0,
      Cur_Env_Slide: 0,
      Env_Slide_Add: 0,
      Cur_Env_Delay: 0,
      Env_Delay: 0,
      Noise_Base: 0,
      Delay: delay,
      AddToNoise: 0,
      DelayCounter: 1,
      CurrentPosition: 0,
    },
    channels: [makeChannelParams(), makeChannelParams(), makeChannelParams()],
    ay: new Uint8Array(14),
  };

  // Set up initial pattern addresses
  let positionIdx = data[201]; // first position
  let i = positionIdx;
  if (ts !== 0x20) i = ts * 3 - 3 - i;

  for (let abc = 0; abc < 3; abc++) {
    inst.channels[abc].Address_In_Pattern =
      readU16(data, patternsPointer + (i + abc) * 2);

    // Set ornament 0
    inst.channels[abc].OrnamentPointer = ornamentPointers[0];
    inst.channels[abc].Loop_Ornament_Position = data[inst.channels[abc].OrnamentPointer++];
    inst.channels[abc].Ornament_Length = data[inst.channels[abc].OrnamentPointer++];

    // Set sample 1
    inst.channels[abc].SamplePointer = samplePointers[1];
    inst.channels[abc].Loop_Sample_Position = data[inst.channels[abc].SamplePointer++];
    inst.channels[abc].Sample_Length = data[inst.channels[abc].SamplePointer++];

    inst.channels[abc].Volume = 15;
    inst.channels[abc].Note_Skip_Counter = 1;
    inst.channels[abc].Enabled = false;
    inst.channels[abc].Envelope_Enabled = false;
    inst.channels[abc].Note = 0;
    inst.channels[abc].Ton = 0;
  }

  return inst;
}

function pt3_restart(inst) {
  inst.pt3.DelayCounter = 1;
  inst.pt3.Delay = inst.data[100]; // original delay from header
  inst.pt3.Noise_Base = 0;
  inst.pt3.AddToNoise = 0;
  inst.pt3.Cur_Env_Slide = 0;
  inst.pt3.Cur_Env_Delay = 0;
  inst.pt3.Env_Base = 0;
  inst.pt3.CurrentPosition = 0;
  inst.globalTickCounter = 0;
  inst.looped = false;

  let positionIdx = inst.data[201];
  let i = positionIdx;
  if (inst.ts !== 0x20) i = inst.ts * 3 - 3 - i;

  for (let abc = 0; abc < 3; abc++) {
    inst.channels[abc].Address_In_Pattern =
      readU16(inst.data, inst.patternsPointer + (i + abc) * 2);

    inst.channels[abc].OrnamentPointer = inst.ornamentPointers[0];
    inst.channels[abc].Loop_Ornament_Position = inst.data[inst.channels[abc].OrnamentPointer];
    inst.channels[abc].OrnamentPointer++;
    inst.channels[abc].Ornament_Length = inst.data[inst.channels[abc].OrnamentPointer];
    inst.channels[abc].OrnamentPointer++;

    inst.channels[abc].SamplePointer = inst.samplePointers[1];
    inst.channels[abc].Loop_Sample_Position = inst.data[inst.channels[abc].SamplePointer];
    inst.channels[abc].SamplePointer++;
    inst.channels[abc].Sample_Length = inst.data[inst.channels[abc].SamplePointer];
    inst.channels[abc].SamplePointer++;

    inst.channels[abc].Volume = 15;
    inst.channels[abc].Note_Skip_Counter = 1;
    inst.channels[abc].Enabled = false;
    inst.channels[abc].Envelope_Enabled = false;
    inst.channels[abc].Note = 0;
    inst.channels[abc].Ton = 0;
    inst.channels[abc].Current_Amplitude_Sliding = 0;
    inst.channels[abc].Current_Noise_Sliding = 0;
    inst.channels[abc].Current_Envelope_Sliding = 0;
    inst.channels[abc].Ton_Slide_Count = 0;
    inst.channels[abc].Current_Ton_Sliding = 0;
    inst.channels[abc].Ton_Accumulator = 0;
    inst.channels[abc].Current_OnOff = 0;
    inst.channels[abc].Position_In_Sample = 0;
    inst.channels[abc].Position_In_Ornament = 0;
  }
}

function pt3_get_regs(inst) {
  return inst.ay;
}

function pt3_get_title(data) {
  // Title is at bytes 30-61
  const bytes = data.slice(30, 62);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 0) break;
    str += String.fromCharCode(bytes[i]);
  }
  return str.trim();
}

function pt3_get_author(data) {
  // Author is at bytes 66-97
  const bytes = data.slice(66, 98);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] === 0) break;
    str += String.fromCharCode(bytes[i]);
  }
  return str.trim();
}

/** Dry-run the PT3 engine to count ticks until the song loops. Returns total ticks. */
function pt3_get_song_length(fileData) {
  const inst = pt3_setup_music(fileData);
  if (!inst) return 0;
  const maxTicks = 50 * 60 * 30; // safety limit: 30 minutes
  while (!inst.looped && inst.globalTickCounter < maxTicks) {
    pt3_play_tick(inst);
  }
  return inst.globalTickCounter;
}

/** Check if fileData is a TurboSound file (2 or 3 chips). */
function pt3_is_turbosound(fileData) {
  if (fileData.length < 22) return 0;
  const len = fileData.length;
  const id = String.fromCharCode(fileData[len - 4], fileData[len - 3], fileData[len - 2], fileData[len - 1]);
  if (id === '02TS') return 2;
  if (id === '03TS') return 3;
  return 0;
}

/**
 * Set up music for TurboSound files. Returns an array of PT3Instance (one per chip).
 * For non-TS files, returns a single-element array.
 */
function pt3_setup_music_ts(fileData) {
  const numChips = pt3_is_turbosound(fileData);
  if (numChips === 0) {
    const inst = pt3_setup_music(fileData);
    return inst ? [inst] : null;
  }

  const len = fileData.length;
  // Read footer (22 bytes before end)
  // type0[4] size0[2] type1[4] size1[2] type2[4] size2[2] TSID[4]
  const footerStart = len - 22;
  const size0 = readU16(fileData, footerStart + 4);
  const size1 = readU16(fileData, footerStart + 10);
  const size2 = readU16(fileData, footerStart + 16);

  const instances = [];

  if (numChips === 2) {
    // 02TS: module0 at [0..size1], module1 at [size1..size1+size2]
    const mod0 = fileData.slice(0, size1);
    const mod1 = fileData.slice(size1, size1 + size2);
    const inst0 = pt3_setup_music(mod0);
    const inst1 = pt3_setup_music(mod1);
    if (!inst0 || !inst1) return null;
    instances.push(inst0, inst1);
  } else {
    // 03TS: module0 at [0..size0], module1 at [size0..size0+size1], module2 at [size0+size1..+size2]
    const mod0 = fileData.slice(0, size0);
    const mod1 = fileData.slice(size0, size0 + size1);
    const mod2 = fileData.slice(size0 + size1, size0 + size1 + size2);
    const inst0 = pt3_setup_music(mod0);
    const inst1 = pt3_setup_music(mod1);
    const inst2 = pt3_setup_music(mod2);
    if (!inst0 || !inst1 || !inst2) return null;
    instances.push(inst0, inst1, inst2);
  }

  return instances;
}

/** Get song length for TS or regular files. Uses first chip's loop point for TS. */
function pt3_get_song_length_ts(fileData) {
  const instances = pt3_setup_music_ts(fileData);
  if (!instances || instances.length === 0) return 0;
  // Song length is determined by the first chip (all tick in lockstep)
  const inst = instances[0];
  const maxTicks = 50 * 60 * 30;
  while (!inst.looped && inst.globalTickCounter < maxTicks) {
    pt3_play_tick(inst);
  }
  return inst.globalTickCounter;
}


window.NEOLINE_PT3={pt3_setup_music,pt3_play_tick,pt3_get_regs,pt3_restart,pt3_get_song_length};
})();

;

/* SOURCE: teoria-vice-ay128-psg.js */
;
/* NEOLINE Theory GTA VI Style — register-controlled AY-3-8912 audio.
   Music: 50 Hz R0–R13 PSG register frames. Effects steal channel C,
   using the same 3-tone + shared-noise virtual chip. NO MP3/MIDI playback.
   Original notes, no copyrighted Ocean or Rockstar recordings. */
(()=>{
"use strict";
if(window.__neolineViceAudio)return;
window.__neolineViceAudio=true;
const root=document.documentElement;
const Ctx=window.AudioContext||window.webkitAudioContext;
const KEY_MUSIC="neoline.vice.ay128.music.v1", KEY_SFX="neoline.vice.ay128.sfx.v1";
const byId=id=>document.getElementById(id);
const isVice=()=>root.dataset.viceTheme==="on";
const getSaved=(key,defaultValue)=>{try{const s=localStorage.getItem(key);return s===null?defaultValue:s!=="0"}catch(_){return defaultValue}};
const save=(key,on)=>{try{localStorage.setItem(key,on?"1":"0")}catch(_){}};
let musicOn=getSaved(KEY_MUSIC,true),sfxOn=getSaved(KEY_SFX,true);
let ctx=null,node=null,boot=null,audioError=false;
let scene="menu",currentMode=null,loadedScene=null;
let lastDone=-1,lastHover=0,lastClick=0,lastTheme=isVice();
const CLOCK=1773400,FPS=50;
const names={
 ru:{music:"Музыка",effects:"Эффекты",on:"вкл.",off:"выкл.",tap:"Нажмите, чтобы включить звук",unavailable:"AY недоступен"},
 en:{music:"Music",effects:"Effects",on:"on",off:"off",tap:"Tap to enable AY",unavailable:"AY not available"},
 he:{music:"מוזיקה",effects:"אפקטים",on:"פעיל",off:"כבוי",tap:"לחץ להפעלת צליל",unavailable:"AY לא זמין"},
 ar:{music:"موسيقى",effects:"مؤثرات",on:"تشغيل",off:"إيقاف",tap:"اضغط لتشغيل الصوت",unavailable:"AY غير متاح"}
};
const labels=()=>names[(root.lang||"ru").split("-")[0]]||names.ru;
const semitones={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function notePeriod(note){
 if(!note||note==="-")return 0;
 if(typeof note==="number")return Math.max(1,Math.min(4095,Math.round(note)));
 const m=/^([A-G])([#b]?)([0-8])$/.exec(note);
 if(!m)return 0;
 const midi=(+m[3]+1)*12+semitones[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0);
 const hz=440*Math.pow(2,(midi-69)/12);
 return Math.min(4095,Math.max(1,Math.round(CLOCK/(16*hz))));
}
// Tracker originals replay through an AY register stream, never synthesized.
const GAME_MODES=new Set(["route","signs","exam","mistakes","marathon","daily"]);
const GAME_IDS=["mary_jane","x_files","zoolook","downtown","behind_the_walls","magnetic_fields","robocop","axel_force_remix"];
const PLAYER_TRACKS=[
 {id:"sonya",name:"Sonya VTX",kind:"intro"},
 {id:"mary_jane",name:"Mary Jane",kind:"game"},
 {id:"x_files",name:"X-Files",kind:"game"},
 {id:"zoolook",name:"Zoolook",kind:"game"},
 {id:"downtown",name:"Downtown",kind:"game"},
 {id:"behind_the_walls",name:"Behind The Walls",kind:"game"},
 {id:"magnetic_fields",name:"Magnetic Fields",kind:"game"},
 {id:"robocop",name:"RoboCop",kind:"game"},
 {id:"axel_force_remix",name:"Axel Force Remix",kind:"game"}
];
let preview=null,previewSerial=0;
let originalPlayerOpen=false;
const SHUFFLE_KEY="neoline.vice.pt3.shuffle.v2"; // refresh bag for 8 distinct PT3 songs
let manifestPromise=null,requestSerial=0,selectedGameSong=null,activeSong=null;
const songBuffers=new Map();
const songLoads=new Map(); // Deduplicate PT3 warm-up vs first visible scene
let shuffled;
try{shuffled=JSON.parse(localStorage.getItem(SHUFFLE_KEY)||"null")}catch(_){}
if(!shuffled||!Array.isArray(shuffled.bag)||shuffled.bag.some(id=>!GAME_IDS.includes(id))||
   new Set(shuffled.bag).size!==shuffled.bag.length){
 let oldLast=null;
 try{oldLast=JSON.parse(localStorage.getItem("neoline.vice.pt3.shuffle.v1")||"null")?.last}catch(_){}
 shuffled={bag:[],last:GAME_IDS.includes(oldLast)?oldLast:null};
}
const rand=max=>{
 if(max<=1)return 0;
 const a=new Uint32Array(1);
 if(window.crypto?.getRandomValues){window.crypto.getRandomValues(a);return a[0]%max}
 return Math.floor(Math.random()*max);
};
function nextGameTrack(){
 if(!shuffled.bag.length){
  shuffled.bag=GAME_IDS.slice();
  for(let i=shuffled.bag.length-1;i>0;i--){
   const j=rand(i+1);
   [shuffled.bag[i],shuffled.bag[j]]=[shuffled.bag[j],shuffled.bag[i]];
  }
  if(shuffled.bag[0]===shuffled.last&&shuffled.bag.length>1)
   [shuffled.bag[0],shuffled.bag[1]]=[shuffled.bag[1],shuffled.bag[0]];
 }
 const id=shuffled.bag.shift();shuffled.last=id;
 try{localStorage.setItem(SHUFFLE_KEY,JSON.stringify(shuffled))}catch(_){}
 return id;
}
// Lossless tracker loader. Decompress the user's original PT3 module
// and run its original note/sample/ornament commands through a PT3 player.
// Then deliver 14 AY registers x 50 Hz to the existing AY chip emulator.
// No synthesized melody, MIDI, MP3, samples or changes to the PT3 arrangement.
async function pt3Bytes(id){
 if(songBuffers.has(id))return songBuffers.get(id);
 if(!songLoads.has(id)){
  const promise=decodePT3Original(id).finally(()=>songLoads.delete(id));
  songLoads.set(id,promise);
 }
 return songLoads.get(id);
}
async function decodePT3Original(id){
 if(!["sonya",...GAME_IDS].includes(id))throw Error("Unrecognized PT3 soundtrack "+id);
 if(!window.NEOLINE_PT3)throw Error("PT3 decoder unavailable");
 if(typeof DecompressionStream!=="function")throw Error("Browser cannot decode lossless PT3 archive");
 const file="./assets/teoria/pt3-src/"+id+".z64";
 const response=await fetch(file,{cache:"force-cache"});
 if(!response.ok)throw Error("Original PT3 "+id+" HTTP "+response.status);
 const text=(await response.text()).trim();
 if(text.length<100||text.length>90000||!/^[A-Za-z0-9+/=\s]+$/.test(text))
  throw Error("Invalid PT3 compressed source "+id);
 const base64=text.replace(/\s/g,"");
 const decoded=atob(base64);
 const zipped=new Uint8Array(decoded.length);
 for(let i=0;i<decoded.length;i++)zipped[i]=decoded.charCodeAt(i);
 const decompressed=new Blob([zipped]).stream().pipeThrough(new DecompressionStream("deflate"));
 const raw=new Uint8Array(await new Response(decompressed).arrayBuffer());
 if(raw.length<201||raw.length>65536||
    String.fromCharCode(...raw.subarray(0,13))!=="ProTracker 3.")
  throw Error("Invalid ProTracker module "+id);
 const pt3=window.NEOLINE_PT3;
 const instance=pt3.pt3_setup_music(raw);
 if(!instance)throw Error("PT3 engine rejected "+id);
 const result=new Uint8Array(14*50*600);
 let count=0;
 try {
  while(count<50*600&&!instance.looped){
   pt3.pt3_play_tick(instance);
   const r=pt3.pt3_get_regs(instance);
   if(!r||r.length<14)throw Error("Corrupt PT3 registers "+id);
   result.set(r.subarray(0,14),count*14);
   count++;
  }
 }catch(error){throw new Error("PT3 tracker decoding failed for "+id+": "+error.message)}
 if(count<50*3||!instance.looped)throw Error("Invalid or nonlooping original PT3 "+id);
 const frames=result.slice(0,count*14);
 songBuffers.set(id,frames);
 return frames;
}
async function loadScene(force=false){
 if(!node||preview)return;
 const token=++requestSerial,requested=scene;
 if(requested==="fail"){msg({type:"clearSong"});loadedScene="fail";activeSong=null;stateToChip();return}
 const id=requested==="menu"?"sonya":requested==="result"?(selectedGameSong||"sonya"):
          selectedGameSong||nextGameTrack();
 if(GAME_MODES.has(requested))selectedGameSong=id;
 if(!force&&loadedScene===requested&&activeSong===id){stateToChip();return}
 try{
  const frames=await pt3Bytes(id);
  if(token!==requestSerial||!node||!isVice()||scene!==requested)return;
  loadedScene=requested;activeSong=id;
  msg({type:"song",frames});stateToChip();updateControls();
 }catch(err){
  if(token!==requestSerial)return;
  console.warn("NEOLINE original PT3 unavailable",id,err);
  msg({type:"clearSong"});loadedScene=null;activeSong=null;stateToChip();updateControls();
 }
}
// SFX sequences are also AY register values, not synthesized outside the chip.
// Note + length in 20ms frames + loudness (0..15) + noise period (0=no noise).
const FX={
 ui:[["G5",2,12],["D6",2,9]],back:[["E5",3,11],["C5",4,9]],
 slide:[["C6",2,10],["G5",2,8]],enable:[["A4",4,12],["E5",4,13],["A5",5,14],["C6",7,9]],
 start:[["A4",4,12],["C5",4,12],["E5",4,12],["A5",9,14]],
 question:[["E5",3,10],["A5",4,9]],
 confirm:[["C5",4,9],["G5",5,9]],
 correct:[["C5",4,11],["E5",5,12],["G5",5,13],["C6",11,15]],
 wrong:[["B4",5,12],["F4",7,13],["NOISE",4,11,11]],
 hint:[["D6",5,11],["A5",4,10],["F5",6,10]],
 xp:[["G5",3,11],["C6",7,12]],
 open:[["F5",3,10],["A5",6,11]],
 shake:[["A3",2,9,15]],burst:[["NOISE",7,14,6],["C5",5,12],["G5",7,12]],
 reveal:[["C6",4,11],["E6",5,13],["G6",14,14]],
 countdown:[["A5",3,10]],
 finale:[["NOISE",5,12,7],["A5",5,11],["C6",5,12],["E6",5,12],["A6",10,14]],
 victory:[["C5",5,12],["E5",5,13],["G5",6,13],["C6",6,14],["E6",8,14],["G6",11,15]],
 finish:[["E5",5,11],["A5",7,12],["C6",12,13]],
 "exam-fail":[["E5",8,12],["C5",9,12],["A4",17,12]],
 wasted:[["E5",11,12],["B4",13,11],["G4",16,12],["NOISE",10,11,17],["E3",30,10]]
};
const fxCache=new Map();
function compileFx(name){
 if(fxCache.has(name))return fxCache.get(name);
 const segments=FX[name]||FX.ui;
 const total=segments.reduce((sum,s)=>sum+s[1],0);
 const data=new Uint8Array(total*5);
 let frame=0;
 for(const [name,length,volume,noisep=0] of segments){
  const note=name==="NOISE"?0:notePeriod(name);
  for(let i=0;i<length;i++){
   const j=(frame++)*5;
   data[j]=note&255;data[j+1]=(note>>8)&15;
   data[j+2]=Math.max(0,Math.min(15,Math.round(volume*(1-.60*i/length))));
   data[j+3]=noisep||1;
   data[j+4]=name==="NOISE"?2:noisep?3:1;
  }
 }
 fxCache.set(name,data);
 return data;
}
function guessScene(){
 if(byId("gameOver")&&!byId("gameOver").hidden)return "fail";
 if(byId("gameResult")&&!byId("gameResult").hidden)return "result";
 if(byId("gamePlaying")&&!byId("gamePlaying").hidden)
  return currentMode&&GAME_MODES.has(currentMode)?currentMode:"route";
 return "menu";
}
const msg=data=>{if(node)node.port.postMessage(data)};
function stateToChip(){
 msg({type:"switch",music:musicOn&&isVice()&&!document.hidden&&!originalPlayerOpen&&(preview?!preview.paused:scene!=="fail"),
  effects:sfxOn&&isVice()&&!document.hidden&&!originalPlayerOpen});
 reportAudio();
}
function syncScene(){
 const next=guessScene();
 if(scene!==next){
  if(preview)stopPreview(false);
  scene=next;loadScene(true);
 }
}
// Browser sound policy: decode and initialize the PSG early. Try autoplay,
// but do not wait for a blocked ctx.resume() promise: on mobile it may remain
// pending until an actual user gesture. The very first tap resumes the chip.
function audioSnapshot(){
 return {
  playing:!!(ctx&&ctx.state==="running"&&node&&musicOn&&isVice()&&!document.hidden&&(!preview||!preview.paused)),
  ready:!!node,
  blocked:!!(ctx&&ctx.state!=="running"&&isVice()&&musicOn),
  musicOn,sfxOn,error:audioError
 };
}
function reportAudio(){
 window.dispatchEvent(new CustomEvent("neoline:ay-status",{detail:audioSnapshot()}));
}
window.neolineGetAYAudioState=audioSnapshot;
function prepareAudio(){
 if(!isVice()||!Ctx||audioError)return null;
 if(boot)return boot;
 try{
  ctx=new Ctx({latencyHint:"interactive"});
  ctx.addEventListener("statechange",()=>{updateControls();reportAudio()});
  boot=ctx.audioWorklet.addModule("./teoria-ay8912-worklet.js?v=20261122-library-progress-v6")
   .then(()=>{
    node=new AudioWorkletNode(ctx,"neoline-ay8912",{
     numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]
    });
    node.port.onmessage=event=>{
     const m=event.data||{};
     if(m.type==="song-progress"){
      if(preview&&!preview.loading){
       preview.frame=Math.max(0,Math.min(preview.frames,m.frame||0));
       notifyPreview();
      }
      return;
     }
     if(m.type!=="song-loop"||!isVice()||!musicOn)return;
     if(preview){
      if(!preview.paused&&!preview.loading)void shiftPreview(1);
      return;
     }
     if(!GAME_MODES.has(scene))return;
     selectedGameSong=nextGameTrack();
     void loadScene(true);
    };
    const master=ctx.createGain();
    master.gain.value=.80;
    node.connect(master);master.connect(ctx.destination);
    scene=guessScene();
    void loadScene(true);
    updateControls();reportAudio();
    return true;
   }).catch(error=>{
    audioError=true;console.warn("NEOLINE AY8912 startup:",error);
    updateControls();reportAudio();return false;
   });
  // Decode the original lobby tracker ahead of time, without starting sound.
  // A user gesture can then resume already-prepared chip audio immediately.
  void pt3Bytes("sonya").catch(err=>console.warn("NEOLINE Sonya PT3 preload:",err));
  return boot;
 }catch(error){
  audioError=true;console.warn("NEOLINE AY8912 setup:",error);
  updateControls();reportAudio();return null;
 }
}
function requestResume(){
 if(!ctx||ctx.state==="running")return;
 try{
  // Must be invoked synchronously inside pointerdown/click to retain
  // browser's transient user activation on Chrome/Safari/Android.
  void ctx.resume().then(()=>{
   if(isVice()){stateToChip();updateControls();reportAudio()}
  }).catch(err=>console.warn("NEOLINE audio blocked by browser:",err));
 }catch(error){console.warn("NEOLINE audio gesture:",error)}
}
async function unlock(){
 if(!isVice()||!Ctx||audioError)return false;
 const ready=prepareAudio();
 if(!ready)return false;
 requestResume(); // Called BEFORE first await, while gesture is active.
 const prepared=await ready;
 if(!prepared)return false;
 updateControls();reportAudio();
 return ctx?.state==="running";
}
window.neolineStartAYAudio=unlock;
// One player and one physical AY emulation: previews replace the current
// register stream, never create a second AudioContext or synth.
function previewState(){
 return {
  id:preview?.id||null,
  loading:!!preview?.loading,
  paused:!!preview?.paused,
  frame:preview?.frame||0,
  frames:preview?.frames||0,
  error:preview?.error||null,
  musicOn,
  ready:!!node,
  blocked:!!ctx&&ctx.state!=="running",
  enabled:isVice()
 };
}
function notifyPreview(){
 window.dispatchEvent(new CustomEvent("neoline:ay-player",{detail:previewState()}));
}
function stopPreview(restore=true){
 if(!preview)return;
 preview=null;previewSerial++;requestSerial++;
 if(restore&&isVice()&&node)void loadScene(true);
 else if(node){msg({type:"clearSong"});stateToChip()}
 notifyPreview();
}
async function playPreview(id){
 if(!isVice()||!PLAYER_TRACKS.some(track=>track.id===id))return false;
 if(preview?.id===id&&!preview.loading){
  if(preview.paused||!musicOn){
   if(!musicOn){musicOn=true;save(KEY_MUSIC,true);updateControls()}
   preview.paused=false;stateToChip();requestResume();notifyPreview();
  }else{preview.paused=true;stateToChip();notifyPreview()}
  return true;
 }
 const token=++previewSerial;
 preview={id,loading:true,paused:false,frame:0,frames:0,error:null};
 requestSerial++; // cancel any queued background soundtrack
 if(!musicOn){musicOn=true;save(KEY_MUSIC,true);updateControls()}
 notifyPreview();
 // unlock invokes resume() synchronously during the originating click.
 const initialized=unlock();
 try{
  await initialized;
  if(token!==previewSerial||preview?.id!==id)return false;
  if(!node)throw Error("AY-3-8912 audio unavailable");
  const frames=await pt3Bytes(id);
  if(token!==previewSerial||preview?.id!==id||!isVice())return false;
  preview.frames=frames.length/14;preview.frame=0;preview.loading=false;
  msg({type:"song",frames});
  stateToChip();notifyPreview();
  return true;
 }catch(error){
  if(token!==previewSerial||preview?.id!==id)return false;
  preview.loading=false;preview.paused=true;
  preview.error=String(error.message||error);
  console.warn("NEOLINE AY library:",id,error);
  msg({type:"clearSong"});stateToChip();notifyPreview();
  return false;
 }
}
function shiftPreview(offset){
 const idx=preview?PLAYER_TRACKS.findIndex(t=>t.id===preview.id):-1;
 const at=(idx+offset+PLAYER_TRACKS.length)%PLAYER_TRACKS.length;
 return playPreview(PLAYER_TRACKS[at].id);
}
function seekPreview(sec){
 if(!preview||preview.loading||!preview.frames)return false;
 const f=Math.max(0,Math.min(preview.frames-1,Math.floor(Number(sec)*50)||0));
 preview.frame=f;
 msg({type:"seek",frame:f});notifyPreview();
 return true;
}
window.neolineAYPlayer={
 tracks:PLAYER_TRACKS.map(t=>({...t})),
 suspendForOriginalPlayer(open){
  originalPlayerOpen=!!open;
  stateToChip();
  return originalPlayerOpen;
 },
 play:playPreview,
 next:()=>shiftPreview(1),
 previous:()=>shiftPreview(-1),
 toggle:()=>{
  if(!preview)return playPreview("sonya");
  return playPreview(preview.id);
 },
 stop:()=>stopPreview(true),
 seek:seekPreview,
 state:previewState
};

function playFx(name){
 if(!isVice()||!sfxOn||!node||ctx?.state!=="running"||document.hidden)return;
 msg({type:"fx",frames:compileFx(name)});
}
const bars=[];
function makeBar(host){
 if(!host)return;
 const wrap=document.createElement("div");
 wrap.className="vice-ay-controls";wrap.setAttribute("role","group");
 wrap.setAttribute("aria-label","ZX Spectrum AY-3-8912 sound");
 const music=document.createElement("button"),sound=document.createElement("button");
 for(const [button,kind] of [[music,"music"],[sound,"sfx"]]){
  button.type="button";button.className="vice-ay-button";button.dataset.audio=kind;
  const icon=document.createElement("span");icon.className="vice-ay-icon";
  icon.setAttribute("aria-hidden","true");
  icon.innerHTML=kind==="music"
    ?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V5l11-2v12"/><circle cx="6.2" cy="18.2" r="3.2"/><circle cx="17.2" cy="16.2" r="3.2"/></svg>'
    :'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12"/></svg>';
  const label=document.createElement("span");label.className="vice-ay-label";
  button.append(icon,label);
  button.addEventListener("click",()=>{
   if(kind==="music"){musicOn=!musicOn;save(KEY_MUSIC,musicOn)}
   else{sfxOn=!sfxOn;save(KEY_SFX,sfxOn)}
   stateToChip();updateControls();notifyPreview();
   if(isVice()&&(musicOn||sfxOn))void unlock().then(ok=>{if(ok&&kind==="sfx"&&sfxOn)playFx("ui")});
  });
  wrap.append(button);
 }
 const status=document.createElement("span");
 status.className="vice-ay-state";status.setAttribute("aria-live","polite");
 wrap.append(status);host.append(wrap);bars.push({music,sound,status});
}
makeBar(document.querySelector(".neoline-site-header__actions"));
makeBar(document.querySelector("#gamePlaying .question-eyebrow"));
makeBar(byId("gameResult"));
makeBar(document.querySelector("#gameOver .gameover-card"));
function updateControls(){
 const t=labels();
 for(const bar of bars){
  for(const [button,on,label] of [[bar.music,musicOn,t.music],[bar.sound,sfxOn,t.effects]]){
   button.setAttribute("aria-pressed",String(on));
   button.setAttribute("aria-label",label+" — "+(on?t.on:t.off));
   button.title=label+" — "+(on?t.on:t.off);
   button.querySelector(".vice-ay-label").textContent=label;
   button.classList.toggle("is-off",!on);
   button.disabled=!Ctx||audioError;
  }
  bar.status.textContent=audioError||!Ctx?t.unavailable:node&&ctx?.state==="running"?"AY-3-8912 · 3CH":t.tap;
 }
}
document.addEventListener("pointerdown",()=>{
 if(isVice()&&ctx?.state!=="running")void unlock();
},{capture:true,passive:true});
document.addEventListener("keydown",e=>{
 if(isVice()&&!e.repeat&&e.key!=="Shift"&&e.key!=="Control"&&e.key!=="Alt"&&e.key!=="Meta"&&ctx?.state!=="running")void unlock();
},{capture:true});
document.addEventListener("click",e=>{
 if(!isVice())return;
 const b=e.target.closest("button,a,[role='button']");
 if(!b||b.closest(".vice-ay-controls,.vice-soundtrack")||b.matches("[data-vice-theme-toggle],.answer,[data-mode]"))return;
 const now=performance.now();if(now-lastClick<55)return;lastClick=now;
 if(b.matches(".theory-promo-dot,.vice-cinema-arrow"))playFx("slide");
 else if(b.matches("#exitQuiz,#dock4Modes,#backToModes,#gameOverModes,#gameOverClose"))playFx("back");
 else if(b.matches("[data-gift-preview]"))playFx("open");
 else playFx("ui");
},{capture:true});
document.addEventListener("pointerover",e=>{
 if(!isVice()||e.pointerType!=="mouse"||!sfxOn)return;
 const b=e.target.closest("button");
 if(!b||b.closest(".vice-soundtrack")||b.contains(e.relatedTarget)||performance.now()-lastHover<125)return;
 lastHover=performance.now();if(!b.disabled)playFx("ui");
},{passive:true});
window.addEventListener("neoline:vice-theme",e=>{
 const enabled=!!e.detail?.enabled;
 if(enabled&&!lastTheme){
  scene=guessScene();
  void unlock().then(ok=>{if(ok)playFx("enable")});
 }
 if(!enabled){
  if(preview)stopPreview(false);
  requestSerial++;stateToChip();
 }else{syncScene();loadScene(true);stateToChip()}
 lastTheme=enabled;updateControls();
});
window.addEventListener("neoline:theory-quiz",e=>{
 if(preview)stopPreview(false);
 const d=e.detail||{};
 if(d.mode&&GAME_MODES.has(d.mode))currentMode=d.mode;
 const previous=scene;
  const next=guessScene();
  if(next!==previous&&GAME_MODES.has(next))selectedGameSong=nextGameTrack();
  syncScene();
 if(!isVice())return;
 if(previous!==scene){lastDone=0;playFx("start");return;}
 if(scene!=="menu"&&scene!=="result"&&scene!=="fail"&&!d.answered&&Number.isFinite(d.done)&&d.done>lastDone){
  if(lastDone>=0)playFx("question");lastDone=d.done;
 }
});
window.addEventListener("neoline:theory-answer",e=>{
 if(isVice())playFx(e.detail?.mode==="exam"?"confirm":e.detail?.correct?"correct":"wrong");
});
window.addEventListener("neoline:theory-hint",()=>{if(isVice())playFx("hint")});
window.addEventListener("neoline:theory-finish",e=>{
 syncScene();
 if(!isVice())return;
 const d=e.detail||{};
 if(d.gameOver)playFx("wasted");
 else if(d.mode==="exam")playFx(d.correct>=26?"victory":"exam-fail");
 else playFx(d.total>0&&d.correct/d.total>=.8?"victory":"finish");
});
const gift=byId("gameGiftReveal"),dialog=byId("gameGiftDialog");
if(gift&&dialog){
 new MutationObserver(()=>{
  if(!isVice()||!dialog.open)return;
  const phase=gift.dataset.phase;
  if(phase==="shake")playFx("shake");
  else if(phase==="burst")playFx("burst");
  else if(phase==="revealed")playFx("reveal");
 }).observe(gift,{attributes:true,attributeFilter:["data-phase"]});
}
const burst=byId("gameGiftScreenBurst");
if(burst){
 let hadRing=false;
 new MutationObserver(()=>{
  const ring=!!burst.querySelector(".gift-burst-ring");
  if(!hadRing&&ring&&dialog?.open)playFx("finale");
  hadRing=ring;
 }).observe(burst,{childList:true});
}
const clock=byId("timer");
if(clock){
 let lastSec=null;
 new MutationObserver(()=>{
  if(!isVice()||scene!=="exam"||byId("timerBox")?.hidden)return;
  const match=/^(\d\d):(\d\d)$/.exec(clock.textContent.trim());
  if(!match)return;
  const sec=+match[1]*60+(+match[2]);
  if(sec>0&&sec<=10&&sec!==lastSec)playFx("countdown");
  lastSec=sec;
 }).observe(clock,{childList:true,characterData:true,subtree:true});
}
for(const id of ["gamePlaying","gameResult","gameOver"]){
 const panel=byId(id);
 if(panel)new MutationObserver(()=>{if(isVice())syncScene()}).observe(panel,{attributes:true,attributeFilter:["hidden"]});
}
document.addEventListener("visibilitychange",()=>{
 if(!ctx)return;
 if(document.hidden){
  stateToChip();void ctx.suspend().catch(()=>{});
 }else if(isVice()){
  void ctx.resume().then(()=>{syncScene();stateToChip()}).catch(()=>{});
 }
});
window.addEventListener("pagehide",()=>{stateToChip();if(ctx)void ctx.suspend().catch(()=>{})});
window.addEventListener("pageshow",()=>{if(ctx&&isVice()&&!document.hidden)void ctx.resume().then(()=>{syncScene();stateToChip()}).catch(()=>{})});
window.addEventListener("storage",e=>{
 if(e.key!==KEY_MUSIC&&e.key!==KEY_SFX)return;
 musicOn=getSaved(KEY_MUSIC,true);sfxOn=getSaved(KEY_SFX,true);
 stateToChip();updateControls();notifyPreview();
});
new MutationObserver(updateControls).observe(root,{attributes:true,attributeFilter:["lang"]});
updateControls();
// On reload in saved GTA mode, prepare the entire sound engine right away.
// Browsers that permit autoplay will play immediately; others can start it
// with the first tap anywhere or the prominent sound start button.
if(isVice()&&musicOn&&Ctx){
 prepareAudio();
 requestResume();
}
})();
;

/* SOURCE: teoria-vice-soundtrack.js */
;
/* NEOLINE ZX Spectrum 128K original PT3 sound library.
   View only: all playback goes through the existing neolineAYPlayer chip API. */
(()=>{
"use strict";
if(window.__neolineAYLibraryUI)return;
const root=document.getElementById("viceSoundtrackPanel");
const api=window.neolineAYPlayer;
if(!root||!api)return;
window.__neolineAYLibraryUI=true;
const doc=document.documentElement;
const $=id=>document.getElementById(id);
const title=$("viceSoundtrackTitle");
const eyebrow=$("viceSoundtrackEyebrow");
const count=$("viceSoundtrackCount");
const nowLabel=$("viceSoundtrackNowLabel");
const name=$("viceSoundtrackNow");
const status=$("viceSoundtrackStatus");
const range=$("viceSoundtrackSeek");
const elapsed=$("viceSoundtrackElapsed");
const duration=$("viceSoundtrackDuration");
const list=$("viceSoundtrackList");
const btnPrev=$("viceSoundtrackPrev");
const btnPlay=$("viceSoundtrackPlay");
const btnStop=$("viceSoundtrackStop");
const btnNext=$("viceSoundtrackNext");
const btnList=$("viceSoundtrackListLabel");
const foot=$("viceSoundtrackFoot");
const fold=$("viceSoundtrackFold");
if(![title,eyebrow,count,nowLabel,name,status,range,elapsed,duration,list,btnPrev,btnPlay,btnStop,btnNext,btnList,foot,fold].every(Boolean))return;
const LANG={
 ru:{
  eyebrow:"NEOLINE · АУДИОТЕКА 128K",
  title:"Музыка из игры",
  count:"{n} треков · PT3",
  now:"СЕЙЧАС ИГРАЕТ",
  idle:"Выбери трек из списка",
  info:"ZX Spectrum 128K · AY-3-8912",
  loading:"Загружаем оригинальный PT3…",
  paused:"Пауза · нажми ▶, чтобы продолжить",
  playing:"Звучит через AY-3-8912",
  blocked:"Нажми ▶, чтобы разрешить звук",
  error:"Не удалось прочитать этот PT3-файл",
  list:"ВСЕ КОМПОЗИЦИИ",
  intro:"ЗАСТАВКА",
  game:"ИГРОВАЯ",
  play:"Прослушать",
  pause:"Пауза",
  prev:"Предыдущая композиция",
  next:"Следующая композиция",
  stop:"Остановить и вернуть музыку игры",
  seek:"Перемотать композицию",
  foot:"Оригинальные PT3 · 3 канала AY · без MP3. При прослушивании игровая музыка временно заменяется выбранным треком."
 },
 en:{
  eyebrow:"NEOLINE · 128K AUDIO LIBRARY",title:"Game soundtrack",
  count:"{n} tracks · PT3",now:"NOW PLAYING",idle:"Choose a track below",
  info:"ZX Spectrum 128K · AY-3-8912",loading:"Loading original PT3…",
  paused:"Paused · tap ▶ to resume",playing:"Playing through AY-3-8912",
  blocked:"Tap ▶ to enable audio",error:"Unable to load this PT3 module",
  list:"ALL TRACKS",intro:"TITLE SCREEN",game:"GAMEPLAY",
  play:"Play",pause:"Pause",prev:"Previous track",next:"Next track",
  stop:"Stop and restore game soundtrack",seek:"Seek",
  foot:"Original PT3 · 3-channel AY · no MP3. Preview temporarily replaces the game's music."
 },
 he:{
  eyebrow:"NEOLINE · ספריית 128K",title:"מוזיקה מהמשחק",count:"{n} קטעים · PT3",
  now:"מושמע כעת",idle:"בחרו קטע מהרשימה",info:"ZX Spectrum 128K · AY-3-8912",
  loading:"טוען קובץ PT3 מקורי…",paused:"מושהה · לחצו ▶ להמשך",
  playing:"מושמע דרך AY-3-8912",blocked:"לחצו ▶ להפעלת צליל",
  error:"לא ניתן לטעון את הקובץ",list:"כל הקטעים",intro:"מסך פתיחה",game:"משחק",
  play:"נגן",pause:"השהה",prev:"הקודם",next:"הבא",
  stop:"עצור וחזור למוזיקת המשחק",seek:"מיקום השמעה",
  foot:"PT3 מקורי · שלושה ערוצי AY · ללא MP3. ההאזנה מחליפה זמנית את מוזיקת המשחק."
 },
 ar:{
  eyebrow:"NEOLINE · مكتبة 128K",title:"موسيقى اللعبة",count:"{n} مقاطع · PT3",
  now:"يعمل الآن",idle:"اختر مقطعًا من القائمة",info:"ZX Spectrum 128K · AY-3-8912",
  loading:"تحميل PT3 الأصلي…",paused:"متوقف مؤقتًا · اضغط ▶ للمتابعة",
  playing:"يعمل عبر AY-3-8912",blocked:"اضغط ▶ لتفعيل الصوت",
  error:"تعذّر تحميل ملف PT3",list:"جميع المقاطع",intro:"شاشة البداية",game:"اللعب",
  play:"تشغيل",pause:"إيقاف مؤقت",prev:"السابق",next:"التالي",
  stop:"إيقاف واستعادة موسيقى اللعبة",seek:"تقديم وتأخير",
  foot:"PT3 أصلي · ثلاث قنوات AY · دون MP3. التشغيل يستبدل موسيقى اللعبة مؤقتًا."
 }
};
const translations=()=>LANG[(doc.lang||"ru").split("-")[0]]||LANG.ru;
const fmt=sec=>{
 const n=Math.max(0,Math.floor(Number(sec)||0));
 return Math.floor(n/60)+":"+String(n%60).padStart(2,"0");
};

const pendingSongs=[
 {name:"Ghostbusters 2",format:"AY",file:"Ghostbusters_2.ay"},
 {name:"Jurassic Park",format:"ASC",file:"Jurassic_Park.asc"},
 {name:"Lyra II 3",format:"STC",file:"LyraII3.stc"},
 {name:"Lyra II 4",format:"STC",file:"LyraII4.stc"},
 {name:"Navy Seals",format:"AY",file:"Navy_Seals.ay"},
 {name:"Paradise",format:"STC",file:"PARADISE.stc"},
 {name:"Shock 3",format:"STC",file:"Shock3.stc"},
 {name:"Shock 6",format:"STC",file:"Shock6.stc"},
 {name:"The NeverEnding Story",format:"STC",file:"the_neverending_story.stc"},
 {name:"Tim Follin",format:"SQT",file:"Tim_Follin.sqt"},
 {name:"Voyage",format:"ASC",file:"VOYAGE.asc"},
 {name:"4×4 Puzzle",format:"PT2",file:"4x4_puzzle_Hi_.pt2"},
 {name:"TDM Schiva Part 2",format:"SQT",file:"63a_tdm-TDMSchivaPart2.sqt"},
 {name:"Batman: The Movie",format:"AY",file:"Batman_The_Movie.ay"},
 {name:"Hung Up — 2×AY cover",format:"SQT · 2×AY",file:"Cover_of_Hung_Up_by_Madonna_2xAY_ACB_.sqt"},
 {name:"Twin Peaks",format:"STP",file:"dado_s_twin_peaks.stp"},
 {name:"Electric City",format:"SQT",file:"Electric_city.sqt"},
 {name:"Galactic",format:"PT2",file:"Galactic.pt2"},
 {name:"Galaxy 2",format:"ASC",file:"GALAXY2.asc"}
];
// One identical Batman_The_Movie_3.ay duplicate intentionally omitted.
const extra={
 ru:{drawer:"Музыкальная коллекция ZX 128K",subtitle:"Плеер и вся музыка · нажми, чтобы открыть",ready:"ДОСТУПНО ДЛЯ ПРОСЛУШИВАНИЯ",waiting:"ИЗ АРХИВА · ОЖИДАЮТ ПЕРЕВОДА В PT3",state:"Ещё не конвертировано",count:"{a} PT3 · {b} ожидают",foot:"Оригинальные PT3 воспроизводятся через AY-3-8912. Остальные композиции из архива показаны для учёта; воспроизведение включим после проверенной конвертации в PT3. Дубликаты удалены."},
 en:{drawer:"ZX 128K Music Collection",subtitle:"Player and complete list · tap to expand",ready:"READY TO LISTEN",waiting:"FROM THE ARCHIVE · AWAITING PT3 CONVERSION",state:"Not converted yet",count:"{a} PT3 · {b} pending",foot:"Original PT3 modules play through AY-3-8912. Other archive songs are listed but disabled until verified PT3 conversion. Duplicates omitted."},
 he:{drawer:"אוסף מוזיקה ZX 128K",subtitle:"נגן וכל המוזיקה · לחצו לפתיחה",ready:"מוכן להאזנה",waiting:"מהארכיון · ממתין להמרה ל-PT3",state:"טרם הומר",count:"{a} PT3 · {b} בהמתנה",foot:"קובצי PT3 מקוריים מנוגנים באמצעות AY-3-8912. שאר הקטעים ממתינים להמרה מאומתת. כפילויות הוסרו."},
 ar:{drawer:"مجموعة موسيقى ZX 128K",subtitle:"المشغل وكل المقاطع · اضغط للفتح",ready:"جاهز للاستماع",waiting:"من الأرشيف · في انتظار التحويل إلى PT3",state:"لم يُحوّل بعد",count:"{a} PT3 · {b} قيد الانتظار",foot:"يتم تشغيل PT3 الأصلي عبر AY-3-8912. بقية المقاطع تظهر في القائمة حتى التحقق من تحويلها إلى PT3. أزيلت الملفات المكررة."}
};
const extraLabels=()=>extra[(doc.lang||"ru").split("-")[0]]||extra.ru;
const drawerTitle=$("viceSoundtrackDrawerTitle"),drawerSubtitle=$("viceSoundtrackDrawerSubtitle"),drawerStat=$("viceSoundtrackDrawerStat");
const listHeader=()=>{const item=document.createElement("li");item.className="vice-soundtrack__group";list.append(item);return item};
const playableHeader=listHeader();

const trackButtons=new Map();
for(const [index,track] of api.tracks.entries()){
 const li=document.createElement("li");li.className="vice-soundtrack__item";
 const button=document.createElement("button");
 button.type="button";
 button.className="vice-soundtrack__track";button.dataset.pt3=track.id;
 button.setAttribute("aria-pressed","false");
 const number=document.createElement("span");
 number.className="vice-soundtrack__index";number.textContent=String(index+1).padStart(2,"0");
 const copy=document.createElement("span");copy.className="vice-soundtrack__trackname";
 const label=document.createElement("b");label.textContent=track.name;
 const kind=document.createElement("small");
 const action=document.createElement("span");action.className="vice-soundtrack__playicon";
 action.textContent="▶";action.setAttribute("aria-hidden","true");
 copy.append(label,kind);button.append(number,copy,action);
 button.addEventListener("click",()=>{void api.play(track.id)});
 li.append(button);list.append(li);
 trackButtons.set(track.id,{button,kind,action});
}

const pendingHeader=listHeader();
const pendingButtons=[];
for(const track of pendingSongs){
 const li=document.createElement("li");li.className="vice-soundtrack__item vice-soundtrack__item--pending";
 const button=document.createElement("button");
 button.type="button";button.disabled=true;
 button.className="vice-soundtrack__track";
 button.dataset.original=track.file;
 button.setAttribute("aria-disabled","true");
 const number=document.createElement("span");number.className="vice-soundtrack__index";
 number.textContent=String(api.tracks.length+pendingButtons.length+1).padStart(2,"0");
 const copy=document.createElement("span");copy.className="vice-soundtrack__trackname";
 const label=document.createElement("b");label.textContent=track.name;
 const kind=document.createElement("small");
 const action=document.createElement("span");action.className="vice-soundtrack__playicon";
 action.textContent="⌛";action.setAttribute("aria-hidden","true");
 copy.append(label,kind);button.append(number,copy,action);
 li.append(button);list.append(li);
 pendingButtons.push({button,kind,track});
}

function translate(){
 const t=translations(),x=extraLabels();
 if(drawerTitle)drawerTitle.textContent=x.drawer;
 if(drawerSubtitle)drawerSubtitle.textContent=x.subtitle;
 if(drawerStat)drawerStat.textContent=x.count.replace("{a}",api.tracks.length).replace("{b}",pendingSongs.length);
 playableHeader.textContent=x.ready+" · "+api.tracks.length;
 pendingHeader.textContent=x.waiting+" · "+pendingSongs.length;
 for(const {button,kind,track} of pendingButtons){
  kind.textContent=track.format+" · "+x.state;
  button.setAttribute("aria-label",track.name+" — "+track.format+" — "+x.state);
  button.title=track.file+" · "+x.state;
 }
 eyebrow.textContent=t.eyebrow;
 title.textContent=t.title;
 count.textContent=x.count.replace("{a}",api.tracks.length).replace("{b}",pendingSongs.length);
 nowLabel.textContent=t.now;
 btnList.textContent=t.list;
 foot.textContent=x.foot;
 btnPrev.setAttribute("aria-label",t.prev);btnPrev.title=t.prev;
 btnNext.setAttribute("aria-label",t.next);btnNext.title=t.next;
 btnStop.setAttribute("aria-label",t.stop);btnStop.title=t.stop;
 range.setAttribute("aria-label",t.seek);
 for(const track of api.tracks){
  const {button,kind}=trackButtons.get(track.id);
  kind.textContent=track.kind==="intro"?t.intro:t.game;
  button.setAttribute("aria-label",t.play+" — "+track.name);
 }
 draw();
}
function draw(){
 const t=translations(),state=api.state();
 const current=api.tracks.find(song=>song.id===state.id)||null;
 const busy=!!state.loading,paused=!!state.paused;
 const playing=!!current&&!busy&&!paused&&state.musicOn&&!state.blocked&&!state.error;
 const sec=state.frame/50,total=state.frames/50;
 root.classList.toggle("is-playing",playing);
 root.setAttribute("aria-busy",String(busy));
 name.textContent=current?current.name:t.idle;
 status.textContent=state.error?t.error:busy?t.loading:current&&state.blocked?t.blocked:
   current&&paused?t.paused:current&&playing?t.playing:current?t.info:t.info;
 range.disabled=!current||busy||!state.frames;
 range.max=String(Math.max(1,Math.floor(total)));
 range.value=String(Math.min(Number(range.max),Math.floor(sec)));
 range.style.setProperty("--vs-progress",total?Math.min(100,100*sec/total).toFixed(2)+"%":"0%");
 elapsed.textContent=fmt(sec);
 duration.textContent=total?fmt(total):"0:00";
 btnPlay.textContent=playing?"Ⅱ":"▶";
 btnPlay.setAttribute("aria-label",playing?t.pause:t.play);
 btnPlay.title=playing?t.pause:t.play;
 btnPlay.disabled=busy;
 btnStop.disabled=!current;
 for(const track of api.tracks){
  const x=trackButtons.get(track.id);
  const selected=!!current&&track.id===current.id;
  x.button.setAttribute("aria-pressed",String(selected));
  x.action.textContent=selected&&playing?"Ⅱ":"▶";
  x.button.classList.toggle("is-playing",selected&&playing);
  x.button.setAttribute("aria-label",(selected&&playing?t.pause:t.play)+" — "+track.name);
 }
}
btnPrev.addEventListener("click",()=>{void api.previous()});
btnNext.addEventListener("click",()=>{void api.next()});
btnPlay.addEventListener("click",()=>{void api.toggle()});
btnStop.addEventListener("click",()=>api.stop());
range.addEventListener("input",()=>{
 elapsed.textContent=fmt(range.value);
 const max=Number(range.max)||1;
 range.style.setProperty("--vs-progress",((Number(range.value)/max)*100).toFixed(2)+"%");
});
range.addEventListener("change",()=>api.seek(Number(range.value)));
// Keep the full music-library player ONLY on the mode-selection screen.
// Active questions, results and GAME OVER need maximum room for gameplay.
// The AY music engine and its small music/SFX toggles remain unaffected.
const lobby=document.getElementById("gameLobby");
const activePanels=["gamePlaying","gameResult","gameOver"]
 .map(id=>document.getElementById(id)).filter(Boolean);
const drawer=document.getElementById("viceSoundtrackDrawer");
function syncLibraryPlacement(){
 const inSession=activePanels.some(panel=>!panel.hidden);
 const showInMenu=!!lobby&&!lobby.hidden&&!inSession;
 root.hidden=!showInMenu;
 if(!showInMenu){
  if(drawer)drawer.open=false;
  // Release library preview if player was open when a quiz began.
  // The ordinary game soundtrack continues via the same AY emulator.
  if(api.state().id)api.stop();
 }
}
for(const panel of [lobby,...activePanels]){
 if(panel)new MutationObserver(syncLibraryPlacement)
  .observe(panel,{attributes:true,attributeFilter:["hidden"]});
}
syncLibraryPlacement();

window.addEventListener("neoline:ay-player",draw);
window.addEventListener("neoline:ay-status",draw);
window.addEventListener("neoline:vice-theme",draw);
new MutationObserver(translate).observe(doc,{attributes:true,attributeFilter:["lang"]});
translate();
})();

;

/* SOURCE: teoria-vice-boot.js */
;
/* NEOLINE · original Vice Mode cinematic system-start overlay.
   Visual only; lets AY audio wake on a tap if autoplay is restricted. */
(()=>{
"use strict";
if(window.__neolineViceBoot)return;
window.__neolineViceBoot=true;
const root=document.documentElement;
const language=()=>String(root.lang||"ru").split("-")[0];
const copy={
 ru:{kicker:"ВОСЬМИБИТНЫЙ ГОРОД • 1988",deck:"Система готовится к поездке",loading:"ЗАГРУЗКА ГОРОДА · AY-3-8912",ready:"СИСТЕМА ЗАПУЩЕНА",start:"♫ НАЖМИ, ЧТОБЫ ВКЛЮЧИТЬ МУЗЫКУ",dismiss:"Продолжить без звука"},
 en:{kicker:"8-BIT CITY • 1988",deck:"Preparing your next drive",loading:"LOADING CITY · AY-3-8912",ready:"SYSTEM ONLINE",start:"♫ TAP TO START MUSIC",dismiss:"Continue without audio"},
 he:{kicker:"עיר 8 ביט • 1988",deck:"מתכוננים לנסיעה",loading:"טעינת העיר · AY-3-8912",ready:"המערכת מוכנה",start:"♫ לחצו להפעלת מוזיקה",dismiss:"להמשיך בלי שמע"},
 ar:{kicker:"مدينة 8 بت • 1988",deck:"الاستعداد للقيادة",loading:"تحميل المدينة · AY-3-8912",ready:"النظام جاهز",start:"♫ اضغط لتشغيل الموسيقى",dismiss:"المتابعة بلا صوت"}
};
const t=()=>copy[language()]||copy.ru;
const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||false;
const overlay=document.createElement("div");
overlay.className="vice-boot-overlay";
overlay.setAttribute("aria-hidden","true");
overlay.innerHTML=[
 '<img class="vice-boot-art" src="./assets/teoria/vice-boot-sunset-city.svg?v=20261122-approved-neon-art-v1" alt="" aria-hidden="true" decoding="async">',
 '<div class="vice-boot-grain"></div>',
 '<div class="vice-boot-topline"><span><b>NEOLINE</b> // ARCADE SYSTEM</span><span>128K · AY-3-8912</span></div>',
 '<div class="vice-boot-body">',
 '<div class="vice-boot-icon" aria-hidden="true"><svg class="vice-boot-cassette" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 101" role="presentation" focusable="false"><defs><linearGradient id="neolineTapeBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f8c5d7"/><stop offset=".25" stop-color="#ff9cc9"/><stop offset=".65" stop-color="#c26fa9"/><stop offset="1" stop-color="#7a438d"/></linearGradient><linearGradient id="neolineTapeLabel" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe6ed"/><stop offset="1" stop-color="#f6a5cd"/></linearGradient></defs><path d="M14 9H140Q147 9 147 17V86Q147 94 139 94H15Q7 94 7 86V17Q7 9 14 9Z" fill="url(#neolineTapeBody)" stroke="#fff0f3" stroke-width="2"/><path d="M17 16H137V74H17Z" fill="#211638" stroke="#efb7d5" stroke-width="1.5"/><path d="M23 19H131V38H23Z" fill="url(#neolineTapeLabel)"/><text x="29" y="31.5" fill="#5e2459" font-family="Arial, sans-serif" font-weight="900" font-size="10" letter-spacing="1">ZX SPECTRUM</text><text x="129" y="31.5" fill="#872d68" font-family="Arial, sans-serif" text-anchor="end" font-weight="900" font-size="9">128K</text><path d="M23 42H131V72H23Z" fill="#130f2b" stroke="#ffc6e6" stroke-width=".7"/><path d="M39 56H115" stroke="#c05a98" stroke-width="2.6"/><circle cx="49" cy="56" r="13.5" fill="#e5b9d4" stroke="#fff5f4" stroke-width="1.3"/><circle cx="105" cy="56" r="13.5" fill="#e5b9d4" stroke="#fff5f4" stroke-width="1.3"/><g class="vice-boot-reel vice-boot-reel--left" fill="#74356c"><path d="M46 45h6v7h-6zM40 57l4-4 5 5-5 4zM50 60l6-5 4 4-6 6z"/></g><g class="vice-boot-reel vice-boot-reel--right" fill="#74356c"><path d="M102 45h6v7h-6zM96 57l4-4 5 5-5 4zM106 60l6-5 4 4-6 6z"/></g><circle cx="49" cy="56" r="3.2" fill="#17102f"/><circle cx="105" cy="56" r="3.2" fill="#17102f"/><path d="M40 79H114L123 90H31Z" fill="#532a67" stroke="#f6c0dd" stroke-width="1.3"/><path d="M59 79L62 85H92L95 79" stroke="#fae5e7" fill="none" stroke-width="1.2"/><circle cx="18" cy="84" r="2.6" fill="#d4ecf0"/><circle cx="136" cy="84" r="2.6" fill="#d4ecf0"/></svg></div>',
 '<div class="vice-boot-kicker"></div>',
 '<div class="vice-boot-title"><span>VICE</span> <em>MODE</em></div>',
 '<p class="vice-boot-deck"></p>',
 '<div class="vice-boot-meter"><span></span></div>',
 '<div class="vice-boot-status" role="presentation"></div>',
 '</div>',
 '<div class="vice-boot-bottomline"><span>NEON CITY  //  ZX 128K</span><span>EST. <b>1988</b></span></div>'
].join("");
document.body.append(overlay);
const kicker=overlay.querySelector(".vice-boot-kicker");
const deck=overlay.querySelector(".vice-boot-deck");
const status=overlay.querySelector(".vice-boot-status");
const wake=document.createElement("div");
wake.className="vice-audio-wake";
wake.setAttribute("role","group");
wake.innerHTML='<button type="button" class="vice-audio-wake-start"></button><button type="button" class="vice-audio-wake-dismiss" aria-label="Dismiss" title="Dismiss">×</button>';
document.body.append(wake);
const startButton=wake.querySelector(".vice-audio-wake-start");
const dismissButton=wake.querySelector(".vice-audio-wake-dismiss");
let entering=false,shown=false,dismissed=false,shortTimer=0,clearTimer=0,lastStatus=null;
let prevOn=root.dataset.viceTheme==="on";
const isOn=()=>root.dataset.viceTheme==="on";
function translate(){
 const x=t();
 kicker.textContent=x.kicker;
 deck.textContent=x.deck;
 status.textContent=x.loading;
 startButton.textContent=x.start;
 dismissButton.setAttribute("aria-label",x.dismiss);
 dismissButton.title=x.dismiss;
}
function hideWake(){wake.classList.remove("is-visible")}
function refreshWake(){
 if(shown||!isOn()||dismissed){hideWake();return}
 const info=window.neolineGetAYAudioState?.()||lastStatus;
 if(!info||!info.musicOn||info.error||!info.blocked){hideWake();return}
 wake.classList.add("is-visible");
}
function finish(){
 if(!entering)return;
 entering=false;
 overlay.classList.add("is-ready");
 status.textContent=t().ready;
 clearTimeout(clearTimer);
 clearTimer=setTimeout(()=>{
  overlay.classList.remove("is-active","is-ready");
  shown=false;
  refreshWake();
 },reduce?40:260);
}
function begin(initial=false){
 if(document.hidden)return;
 clearTimeout(shortTimer);clearTimeout(clearTimer);
 hideWake();
 entering=true;shown=true;
 translate();
 overlay.classList.remove("is-active","is-ready");
 void overlay.offsetHeight;
 overlay.classList.add("is-active");
 shortTimer=setTimeout(finish,reduce?210:initial?1180:1510);
}
function cancel(){
 clearTimeout(shortTimer);clearTimeout(clearTimer);
 entering=false;shown=false;dismissed=false;
 overlay.classList.remove("is-active","is-ready");
 hideWake();
}
function switchTheme(enabled){
 if(enabled&&!prevOn){dismissed=false;begin(false)}
 else if(!enabled&&prevOn)cancel();
 prevOn=enabled;
}
startButton.addEventListener("click",()=>{
 dismissed=true;hideWake();
 if(typeof window.neolineStartAYAudio==="function"){
  void window.neolineStartAYAudio().then(ok=>{
   if(!ok&&isOn()&&window.neolineGetAYAudioState?.().blocked){
    dismissed=false;refreshWake();
   }
  }).catch(()=>{dismissed=false;refreshWake()});
 }
});
dismissButton.addEventListener("click",()=>{dismissed=true;hideWake()});
window.addEventListener("neoline:vice-theme",e=>switchTheme(!!e.detail?.enabled));
window.addEventListener("neoline:ay-status",e=>{
 lastStatus=e.detail||null;
 refreshWake();
});
new MutationObserver(translate).observe(root,{attributes:true,attributeFilter:["lang"]});
translate();
if(prevOn)begin(true);
})();
;
