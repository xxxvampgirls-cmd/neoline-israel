/* NEOLINE — last 30 days of REAL Israeli road videos, no invented thumbnails.
   Metadata comes only from the trusted official YouTube Atom feeds indexed by
   scripts/sync_road_videos.py. Playing uses YouTube's privacy-mode embed. */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const section=$("newsVideoLibrary"),grid=$("newsVideoGrid");
if(!section||!grid)return;
const DAY=86400000,WINDOW=30*DAY;
const SOURCES={
 news13:{name:"חדשות 13",url:"https://www.youtube.com/channel/UCvQmPpU20hw1Trss_CVwaew"},
 kan11:{name:"כאן חדשות",url:"https://www.youtube.com/channel/UC_HwfTAcjBESKZRJq6BTCpg"},
 police:{name:"משטרת ישראל",url:"https://www.youtube.com/channel/UCrwyHUb4iIrpknhP6MTvnww"}
};
const langPack={
 ru:{label:"ВИДЕОХРОНИКА · ИЗРАИЛЬ",title:"Видео с дорог",period:"За последние 30 дней",
  about:"Аварии, наезды, записи видеорегистраторов, курьёзы, радары и репортажи — видео с YouTube по Израилю.",
  all:"Все",accidents:"ДТП",dashcam:"Регистраторы",funny:"Курьёзы",radars:"Радары и камеры",reports:"Репортажи",police:"Полиция",
  archiveHeading:"Радары и камеры · Архив 13 канала",archiveLabel:"Архив",
  archiveDescription:"Отдельные репортажи прошлых месяцев, не входят в подборку за 30 дней.",
  archiveMore:"Другие сюжеты 13 канала ↗",loading:"Собираем видео за месяц…",
  empty:"За последние 30 дней пока нет подтверждённых роликов по этой теме.",
  unavailable:"Подборка обновляется из YouTube. Пока можно открыть проверенные каналы ниже.",
  watch:"Смотреть",youtube:"Открыть на YouTube ↗",sources:"В том числе каналы:",
  expand:"Показать ещё видео",count:n=>n+" видео",notice:"Видео размещены авторами на YouTube; могут содержать кадры происшествий.",
  close:"Закрыть видео",player:"Видеорепортаж"},
 en:{label:"ROAD FOOTAGE · ISRAEL",title:"Videos from the roads",period:"Last 30 days",
  about:"Crashes, pedestrian incidents, dashcam footage, unusual driving, speed cameras and news from Israel.",
  all:"All",accidents:"Crashes",dashcam:"Dashcams",funny:"Road fails",radars:"Radars & cameras",reports:"Reports",police:"Police",
  archiveHeading:"Radar & camera reports · News 13 archive",archiveLabel:"Archive",
  archiveDescription:"Older features, separate from the rolling last-30-days collection.",
  archiveMore:"More News 13 coverage ↗",loading:"Loading this month's videos…",
  empty:"No verified clips for this topic were found in the last 30 days.",
  unavailable:"This playlist is built from YouTube feeds. Browse the verified channels below.",
  watch:"Watch",youtube:"Open on YouTube ↗",sources:"Including channels:",
  expand:"More videos",count:n=>n+" videos",notice:"Videos remain on YouTube; some may show sensitive crash footage.",
  close:"Close video",player:"Video report"},
 he:{label:"וידאו מהכבישים · ישראל",title:"סרטונים מהכבישים",period:"30 הימים האחרונים",
  about:"תאונות, פגיעות הולכי רגל, מצלמות רכב, נהיגה הזויה, רדארים וכתבות מיוטיוב בישראל.",
  all:"הכול",accidents:"תאונות",dashcam:"מצלמות רכב",funny:"נהיגה הזויה",radars:"רדארים ומצלמות",reports:"כתבות",police:"משטרה",
  archiveHeading:"רדארים ומצלמות · ארכיון חדשות 13",archiveLabel:"ארכיון",
  archiveDescription:"כתבות מחודשים קודמים, בנפרד מאוסף 30 הימים האחרונים.",
  archiveMore:"עוד כתבות בחדשות 13 ↗",loading:"טוענים סרטונים מהחודש…",
  empty:"אין סרטונים מאומתים בנושא זה ב־30 הימים האחרונים.",
  unavailable:"האוסף מתעדכן מיוטיוב. אפשר לבקר בערוצים הרשמיים בהמשך.",
  watch:"צפייה",youtube:"לצפייה ביוטיוב ↗",sources:"בין היתר ערוצים:",
  expand:"עוד סרטונים",count:n=>n+" סרטונים",notice:"הסרטונים מתארחים ביוטיוב ועלולים להכיל תיעוד תאונות.",
  close:"סגירת הסרטון",player:"כתבת וידאו"},
 ar:{label:"فيديو الطرق · إسرائيل",title:"فيديوهات الطرق",period:"آخر 30 يومًا",
  about:"حوادث ودهس ومقاطع كاميرات السيارات ومواقف طريفة ورادارات وتقارير من يوتيوب في إسرائيل.",
  all:"الكل",accidents:"حوادث",dashcam:"كاميرات السيارات",funny:"مواقف طريفة",radars:"الرادارات والكاميرات",reports:"تقارير",police:"الشرطة",
  archiveHeading:"الرادارات والكاميرات · أرشيف أخبار 13",archiveLabel:"الأرشيف",
  archiveDescription:"تقارير أقدم، منفصلة عن مجموعة آخر 30 يومًا.",
  archiveMore:"المزيد من أخبار 13 ↗",loading:"جار تحميل فيديوهات الشهر…",
  empty:"لا توجد مقاطع موثقة عن هذا الموضوع خلال آخر 30 يومًا.",
  unavailable:"تُحدّث المجموعة من يوتيوب. يمكنك زيارة القنوات الرسمية أدناه.",
  watch:"مشاهدة",youtube:"فتح على يوتيوب ↗",sources:"من القنوات:",
  expand:"مزيد من الفيديوهات",count:n=>n+" فيديو",notice:"الفيديوهات مستضافة على يوتيوب وقد تتضمن مشاهد حوادث.",
  close:"إغلاق الفيديو",player:"تقرير مصور"}
};
const CATS=["all","accidents","dashcam","funny","radars","reports","police"];
// Two verified news reports on News 13's official YouTube channel.
// Both predate the rolling 30-day period; neither is falsely counted as a
// current-month publication. No artificial dates or thumbnail assets.
const ARCHIVE=[
 {id:"c4tTPoVYwws",title:"החידוש באגף התנועה: מצלמות המהירות משנות את כללי האכיפה",
  source:"news13",publisher:SOURCES.news13.name,category:"radars",archive:true,
  url:"https://www.youtube.com/watch?v=c4tTPoVYwws"},
 {id:"gPkpDS04sjA",title:"קנס ישר הביתה: המדריך למצלמות החדשות של המשטרה",
  source:"news13",publisher:SOURCES.news13.name,category:"radars",archive:true,
  url:"https://www.youtube.com/watch?v=gPkpDS04sjA"}
];
const state={all:[],social:[],cat:"all",visible:6,ready:false,updated:0};
const tr=()=>langPack[document.documentElement.lang]||langPack.ru;
const safe=str=>String(str??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const validID=id=>typeof id==="string"&&/^[A-Za-z0-9_-]{11}$/.test(id);
const validDate=x=>Number.isFinite(Date.parse(x))&&Date.parse(x)>=Date.now()-WINDOW&&Date.parse(x)<=Date.now()+12*3600000;
function sanitize(data){
 if(!data||data.version!==1||data.retentionDays!==30||!Array.isArray(data.items))return null;
 const seen=new Set(),rows=[];
 for(const item of data.items){
  const official=!!SOURCES[item?.source];
  const community=item?.source==="youtube" &&
    typeof item.channelId==="string" &&
    /^UC[A-Za-z0-9_-]{22}$/.test(item.channelId) &&
    item.localVerified===true && typeof item.publisher==="string" &&
    item.publisher.trim().length>0;
  if(!item||!validID(item.id)||!validDate(item.date)||!(official||community)||
     typeof item.title!=="string"||!item.title.trim()||seen.has(item.id))continue;
  seen.add(item.id);
  const allowedTags=Array.isArray(item.tags)?item.tags.filter(cat=>
    CATS.includes(cat)&&cat!=="all"):[];
  rows.push({
   id:item.id,title:item.title.trim(),date:item.date,
   source:item.source,
   publisher:official?SOURCES[item.source].name:item.publisher.trim().slice(0,100),
   channelId:community?item.channelId:null,
   tags:allowedTags.length?allowedTags:
     [CATS.includes(item.category)&&item.category!=="all"?item.category:"reports"],
   category:CATS.includes(item.category)&&item.category!=="all"?item.category:"reports",
   url:"https://www.youtube.com/watch?v="+item.id
  });
 }
 rows.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
 return {rows,updated:Date.parse(data.updated)||0};
}
// Public short-video links have their own index: dated source posts, not
// guessed upload dates. Only safe, platform-specific URLs are accepted.
const SOCIAL_HOSTS={
 telegram:/^(?:t\.me|www\.t\.me)$/,
 facebook:/^(?:www\.|m\.)?facebook\.com$/,
 instagram:/^(?:www\.)?instagram\.com$/,
 tiktok:/^(?:www\.)?tiktok\.com$/,
 x:/^(?:www\.)?(?:x|twitter)\.com$/,
 vk:/^(?:www\.)?vk\.com$/
};
function sanitizeSocial(data){
 if(!data||data.version!==1||data.retentionDays!==30||!Array.isArray(data.items))return null;
 const seen=new Set(),rows=[];
 for(const item of data.items){
  if(!item||typeof item.id!=="string"||!/^[a-f0-9]{20}$/.test(item.id)||
     !validDate(item.date)||item.localVerified!==true||
     !["accidents","reports"].includes(item.category)||
     !SOCIAL_HOSTS[item.platform]||typeof item.title!=="string"||
     !item.title.trim()||typeof item.publisher!=="string"||!item.publisher.trim())continue;
  let u;
  try{u=new URL(item.url)}catch(_){continue}
  if(u.protocol!=="https:"||!SOCIAL_HOSTS[item.platform].test(u.hostname)||
     seen.has(u.href))continue;
  if(item.platform==="telegram"&&!/^\/[A-Za-z0-9_]+\/\d+$/.test(u.pathname))continue;
  if(item.platform==="instagram"&&!/^\/reel\/[\w-]+/.test(u.pathname))continue;
  if(item.platform==="tiktok"&&!/^\/@[\w.-]+\/video\/\d+/.test(u.pathname))continue;
  if(item.platform==="facebook"&&!/\/videos\/\d+|\/watch\//.test(u.pathname))continue;
  if(item.platform==="x"&&!/^\/[A-Za-z0-9_]+\/status\/\d+/.test(u.pathname))continue;
  if(item.platform==="vk"&&!/^\/video-?\d+_\d+/.test(u.pathname))continue;
  seen.add(u.href);
  rows.push({id:item.id,title:item.title.trim(),publisher:item.publisher,
   date:item.date,category:item.category,tags:[item.category],
   platform:item.platform,url:u.href,social:true});
 }
 rows.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
 return {rows,updated:Date.parse(data.updated)||0};
}
async function fetchSocialIndex(url){
 try{
  const res=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8500)});
  if(!res.ok)return null;
  return sanitizeSocial(await res.json());
 }catch(_){return null}
}
async function fetchIndex(url){
 try{
  const res=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8500)});
  if(!res.ok)return null;
  return sanitize(await res.json());
 }catch(_){return null;}
}
async function refresh(){
 const urls=[
  "./assets/news/road-videos.json?ts="+Date.now(),
  "https://raw.githubusercontent.com/xxxvampgirls-cmd/neoline-israel/main/assets/news/road-videos.json?ts="+Date.now()
 ];
 const socialUrls=[
  "./assets/news/social-road-videos.json?ts="+Date.now(),
  "https://raw.githubusercontent.com/xxxvampgirls-cmd/neoline-israel/main/assets/news/social-road-videos.json?ts="+Date.now()
 ];
 const [youtubeResults,socialResults]=await Promise.all([
  Promise.all(urls.map(fetchIndex)),Promise.all(socialUrls.map(fetchSocialIndex))
 ]);
 const found=youtubeResults.filter(Boolean),social=socialResults.filter(Boolean);
 found.sort((a,b)=>b.updated-a.updated);
 social.sort((a,b)=>b.updated-a.updated);
 if(found.length){state.all=found[0].rows;state.updated=found[0].updated}
 if(social.length){
  state.social=social[0].rows;
  state.updated=Math.max(state.updated,social[0].updated);
 }
 state.ready=true;
 draw();
}
function filtered(){
 return [...state.all,...state.social].filter(item=>state.cat==="all"||item.category===state.cat||
   item.tags.includes(state.cat)).filter(item=>validDate(item.date))
   .sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
}
function when(date){
 const lang=document.documentElement.lang||"ru";
 return new Intl.DateTimeFormat({ru:"ru-RU",en:"en-GB",he:"he-IL",ar:"ar-IL"}[lang]||"ru-RU",
   {day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Jerusalem"}).format(new Date(date));
}
function card(item){
 const t=tr();
 if(item.social){
  const title=safe(item.title);
  const cat=safe(t[item.category]||t.reports);
  const site=safe(item.platform==="x"?"X":item.platform.charAt(0).toUpperCase()+item.platform.slice(1));
  const label=({ru:"Открыть видео",he:"פתיחת סרטון",en:"Open video",ar:"فتح الفيديو"}[document.documentElement.lang]||"Открыть видео");
  return '<a class="news-video-card news-video-card--social" href="'+safe(item.url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+safe(label)+' · '+title+'">'+
   '<span class="news-video-art news-video-art--social">'+
     '<span class="news-video-social-mark" aria-hidden="true">'+site+'</span>'+
     '<span class="news-video-social-arrow" aria-hidden="true">↗</span>'+
     '<span class="news-video-category">'+cat+'</span>'+
   '</span><span class="news-video-card-body">'+
      '<strong class="news-video-card-title" dir="auto">'+title+'</strong>'+
      '<span class="news-video-card-meta" dir="auto">'+safe(item.publisher)+' · '+safe(when(item.date))+' · '+site+'</span>'+
   '</span></a>';
 }

 const thumbnail="https://i.ytimg.com/vi/"+item.id+"/hqdefault.jpg";
 const title=safe(item.title);
 const category=safe(t[item.category]||t.reports);
 return '<button type="button" class="news-video-card" data-video="'+item.id+'" aria-label="'+safe(t.watch)+': '+title+'">'+
  '<span class="news-video-art">'+
   '<img src="'+thumbnail+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">'+
   '<span class="news-video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 6 10 6-10 6z" fill="currentColor"/></svg></span>'+
   '<span class="news-video-category">'+category+'</span>'+
  '</span><span class="news-video-card-body">'+
   '<strong class="news-video-card-title" dir="auto">'+title+'</strong>'+
   '<span class="news-video-card-meta" dir="auto">'+safe(item.publisher)+' · '+safe(item.archive?t.archiveLabel:when(item.date))+'</span>'+
  '</span></button>';
}
function draw(){
 const t=tr();
 $("newsVideoEyebrow").textContent=t.label;
 $("newsVideoTitle").textContent=t.title;
 $("newsVideoPeriod").textContent=t.period;
 $("newsVideoDescription").textContent=t.about;
 $("newsVideoNotice").textContent=t.notice;
 $("newsVideoSourcesLabel").textContent=t.sources;
 const archive=$("newsVideoArchive");
 archive.hidden=state.cat!=="all"&&state.cat!=="radars";
 $("newsVideoArchiveTitle").textContent=t.archiveHeading;
 $("newsVideoArchiveDescription").textContent=t.archiveDescription;
 $("newsVideoArchiveMore").textContent=t.archiveMore;
 if(!archive.hidden)$("newsVideoArchiveGrid").innerHTML=ARCHIVE.map(card).join("");
 const chips=$("newsVideoFilters");
 chips.replaceChildren();
 for(const cat of CATS){
  const btn=document.createElement("button");
  btn.type="button";
  btn.className="news-video-chip"+(state.cat===cat?" is-active":"");
  btn.dataset.videoCat=cat;
  btn.textContent=t[cat];
  btn.setAttribute("aria-pressed",String(state.cat===cat));
  chips.appendChild(btn);
 }
 const rows=filtered();
 const count=$("newsVideoCount");
 count.textContent=t.count(rows.length);
 grid.replaceChildren();
 const status=$("newsVideoStatus");
 status.textContent="";
 if(!state.ready){status.textContent=t.loading;}
 else if(!state.all.length&&!state.social.length){
  status.textContent=t.unavailable;
 }else if(!rows.length){
  status.textContent=t.empty;
 }else{
  grid.innerHTML=rows.slice(0,state.visible).map(card).join("");
 }
 const more=$("newsVideoMore");
 more.hidden=rows.length<=state.visible;
 more.textContent=t.expand+" ↓";
 $("newsVideoClose").setAttribute("aria-label",t.close);
 $("newsVideoExternal").textContent=t.youtube;
 $("newsVideoDialog").setAttribute("aria-label",t.player);
}
function openVideo(id){
 const row=state.all.find(x=>x.id===id)||ARCHIVE.find(x=>x.id===id);
 if(!row||(!row.archive&&!validDate(row.date)))return;
 const dialog=$("newsVideoDialog");
 $("newsVideoExternal").href=row.url;
 $("newsVideoPlayerTitle").textContent=row.title;
 const embed="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(id)+"?autoplay=1&rel=0";
 // Only instantiate an iframe once the viewer actively requests playback.
 $("newsVideoEmbed").replaceChildren();
 const frame=document.createElement("iframe");
 frame.src=embed;
 frame.title=row.title;
 frame.setAttribute("allow","autoplay; encrypted-media; picture-in-picture; fullscreen");
 frame.setAttribute("allowfullscreen","");
 frame.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
 frame.loading="eager";
 $("newsVideoEmbed").appendChild(frame);
 if(dialog.showModal)dialog.showModal();
 else dialog.setAttribute("open","");
 document.body.classList.add("news-video-modal-open");
}
function closeVideo(){
 $("newsVideoEmbed").replaceChildren();
 const dialog=$("newsVideoDialog");
 if(dialog.open&&dialog.close)dialog.close();
 else dialog.removeAttribute("open");
 document.body.classList.remove("news-video-modal-open");
}
$("newsVideoFilters").addEventListener("click",event=>{
 const cat=event.target.closest("[data-video-cat]")?.dataset.videoCat;
 if(!CATS.includes(cat))return;
 state.cat=cat;state.visible=6;draw();
});
grid.addEventListener("click",event=>{
 const id=event.target.closest("[data-video]")?.dataset.video;
 if(id)openVideo(id);
});
$("newsVideoArchiveGrid").addEventListener("click",event=>{
 const id=event.target.closest("[data-video]")?.dataset.video;
 if(id&&ARCHIVE.some(x=>x.id===id))openVideo(id);
});
$("newsVideoMore").addEventListener("click",()=>{state.visible+=6;draw();});
$("newsVideoClose").addEventListener("click",closeVideo);
$("newsVideoDialog").addEventListener("close",closeVideo);
$("newsVideoDialog").addEventListener("click",event=>{
 if(event.target===$("newsVideoDialog"))closeVideo();
});
window.addEventListener("neoline:news-language",draw);
document.addEventListener("visibilitychange",()=>{
 if(document.hidden)closeVideo();
 else if(state.updated&&Date.now()-state.updated>2*3600000)refresh();
});
draw();
refresh();
})();
