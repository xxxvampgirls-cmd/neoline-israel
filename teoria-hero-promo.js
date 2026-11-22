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
  clearInterval(timer);
  if(document.hidden||!onScreen||hovering||focusWithin||motionReduced)return;
  timer=window.setInterval(()=>select(current+1,1),5600);
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
