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
  about:"ДТП, радары, камеры контроля скорости, репортажи и дорожная полиция — только официальные источники.",
  all:"Все",accidents:"ДТП",radars:"Радары и камеры",reports:"Репортажи",police:"Полиция",
  archiveHeading:"Радары и камеры · Архив 13 канала",archiveLabel:"Архив",
  archiveDescription:"Отдельные репортажи прошлых месяцев, не входят в подборку за 30 дней.",
  archiveMore:"Другие сюжеты 13 канала ↗",loading:"Собираем видео за месяц…",
  empty:"За последние 30 дней пока нет подтверждённых роликов по этой теме.",
  unavailable:"Подборка обновляется из YouTube. Пока можно открыть проверенные каналы ниже.",
  watch:"Смотреть",youtube:"Открыть на YouTube ↗",sources:"Источники:",
  expand:"Показать ещё видео",count:n=>n+" видео",notice:"Видео размещены авторами на YouTube; могут содержать кадры происшествий.",
  close:"Закрыть видео",player:"Видеорепортаж"},
 en:{label:"VIDEO REPORTS · ISRAEL",title:"Road videos",period:"Last 30 days",
  about:"Crashes, radar, speed cameras, reports and police — official publishers only.",
  all:"All",accidents:"Crashes",radars:"Radars & cameras",reports:"Reports",police:"Police",
  archiveHeading:"Radar & camera reports · News 13 archive",archiveLabel:"Archive",
  archiveDescription:"Older features, separate from the rolling last-30-days collection.",
  archiveMore:"More News 13 coverage ↗",loading:"Loading this month's videos…",
  empty:"No verified clips for this topic were found in the last 30 days.",
  unavailable:"This playlist is built from YouTube feeds. Browse the verified channels below.",
  watch:"Watch",youtube:"Open on YouTube ↗",sources:"Sources:",
  expand:"More videos",count:n=>n+" videos",notice:"Videos remain on YouTube; some may show sensitive crash footage.",
  close:"Close video",player:"Video report"},
 he:{label:"וידאו מהכבישים · ישראל",title:"סרטונים מהכבישים",period:"30 הימים האחרונים",
  about:"תאונות, רדארים, מצלמות מהירות, כתבות ואכיפת תנועה — ערוצים רשמיים בלבד.",
  all:"הכול",accidents:"תאונות",radars:"רדארים ומצלמות",reports:"כתבות",police:"משטרה",
  archiveHeading:"רדארים ומצלמות · ארכיון חדשות 13",archiveLabel:"ארכיון",
  archiveDescription:"כתבות מחודשים קודמים, בנפרד מאוסף 30 הימים האחרונים.",
  archiveMore:"עוד כתבות בחדשות 13 ↗",loading:"טוענים סרטונים מהחודש…",
  empty:"אין סרטונים מאומתים בנושא זה ב־30 הימים האחרונים.",
  unavailable:"האוסף מתעדכן מיוטיוב. אפשר לבקר בערוצים הרשמיים בהמשך.",
  watch:"צפייה",youtube:"לצפייה ביוטיוב ↗",sources:"מקורות:",
  expand:"עוד סרטונים",count:n=>n+" סרטונים",notice:"הסרטונים מתארחים ביוטיוב ועלולים להכיל תיעוד תאונות.",
  close:"סגירת הסרטון",player:"כתבת וידאו"},
 ar:{label:"فيديو الطرق · إسرائيل",title:"فيديوهات الطرق",period:"آخر 30 يومًا",
  about:"حوادث ورادارات وكاميرات السرعة وتقارير المرور — من القنوات الرسمية فقط.",
  all:"الكل",accidents:"حوادث",radars:"الرادارات والكاميرات",reports:"تقارير",police:"الشرطة",
  archiveHeading:"الرادارات والكاميرات · أرشيف أخبار 13",archiveLabel:"الأرشيف",
  archiveDescription:"تقارير أقدم، منفصلة عن مجموعة آخر 30 يومًا.",
  archiveMore:"المزيد من أخبار 13 ↗",loading:"جار تحميل فيديوهات الشهر…",
  empty:"لا توجد مقاطع موثقة عن هذا الموضوع خلال آخر 30 يومًا.",
  unavailable:"تُحدّث المجموعة من يوتيوب. يمكنك زيارة القنوات الرسمية أدناه.",
  watch:"مشاهدة",youtube:"فتح على يوتيوب ↗",sources:"المصادر:",
  expand:"مزيد من الفيديوهات",count:n=>n+" فيديو",notice:"الفيديوهات مستضافة على يوتيوب وقد تتضمن مشاهد حوادث.",
  close:"إغلاق الفيديو",player:"تقرير مصور"}
};
const CATS=["all","accidents","radars","reports","police"];
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
const state={all:[],cat:"all",visible:6,ready:false,updated:0};
const tr=()=>langPack[document.documentElement.lang]||langPack.ru;
const safe=str=>String(str??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const validID=id=>typeof id==="string"&&/^[A-Za-z0-9_-]{11}$/.test(id);
const validDate=x=>Number.isFinite(Date.parse(x))&&Date.parse(x)>=Date.now()-WINDOW&&Date.parse(x)<=Date.now()+12*3600000;
function sanitize(data){
 if(!data||data.version!==1||data.retentionDays!==30||!Array.isArray(data.items))return null;
 const seen=new Set(),rows=[];
 for(const item of data.items){
  if(!item||!validID(item.id)||!validDate(item.date)||!SOURCES[item.source]||
     typeof item.title!=="string"||!item.title.trim()||seen.has(item.id))continue;
  seen.add(item.id);
  rows.push({
   id:item.id,title:item.title.trim(),date:item.date,
   source:item.source,publisher:SOURCES[item.source].name,
   category:CATS.includes(item.category)&&item.category!=="all"?item.category:"reports",
   url:"https://www.youtube.com/watch?v="+item.id
  });
 }
 rows.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
 return {rows,updated:Date.parse(data.updated)||0};
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
 const found=(await Promise.all(urls.map(fetchIndex))).filter(Boolean);
 if(!found.length){state.ready=true;draw();return;}
 found.sort((a,b)=>b.updated-a.updated);
 state.all=found[0].rows;
 state.updated=found[0].updated;
 state.ready=true;
 draw();
}
function filtered(){
 return state.all.filter(item=>state.cat==="all"||item.category===state.cat).filter(item=>validDate(item.date));
}
function when(date){
 const lang=document.documentElement.lang||"ru";
 return new Intl.DateTimeFormat({ru:"ru-RU",en:"en-GB",he:"he-IL",ar:"ar-IL"}[lang]||"ru-RU",
   {day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Jerusalem"}).format(new Date(date));
}
function card(item){
 const t=tr();
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
 else if(!state.all.length){
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
