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
  count:"{n} треков · PT3 + AY",
  now:"СЕЙЧАС ИГРАЕТ",
  idle:"Выбери трек из списка",
  info:"ZX Spectrum 128K · AY-3-8912",
  loading:"Загружаем оригинальную AY-композицию…",
  paused:"Пауза · нажми ▶, чтобы продолжить",
  playing:"Звучит через AY-3-8912",
  blocked:"Нажми ▶, чтобы разрешить звук",
  error:"Не удалось прочитать этот аудиофайл",
  list:"ВСЕ КОМПОЗИЦИИ",
  intro:"ЗАСТАВКА",
  game:"ИГРОВАЯ",
  play:"Прослушать",
  pause:"Пауза",
  prev:"Предыдущая композиция",
  next:"Следующая композиция",
  stop:"Остановить и вернуть музыку игры",
  seek:"Перемотать композицию",
  foot:"Оригинальные PT3 и AY · 3 канала AY · без MP3. При прослушивании игровая музыка временно заменяется выбранным треком."
 },
 en:{
  eyebrow:"NEOLINE · 128K AUDIO LIBRARY",title:"Game soundtrack",
  count:"{n} tracks · PT3 + AY",now:"NOW PLAYING",idle:"Choose a track below",
  info:"ZX Spectrum 128K · AY-3-8912",loading:"Loading original AY composition…",
  paused:"Paused · tap ▶ to resume",playing:"Playing through AY-3-8912",
  blocked:"Tap ▶ to enable audio",error:"Unable to load the AY music file",
  list:"ALL TRACKS",intro:"TITLE SCREEN",game:"GAMEPLAY",
  play:"Play",pause:"Pause",prev:"Previous track",next:"Next track",
  stop:"Stop and restore game soundtrack",seek:"Seek",
  foot:"Original PT3 and AY · 3-channel AY · no MP3. Preview temporarily replaces the game's music."
 },
 he:{
  eyebrow:"NEOLINE · ספריית 128K",title:"מוזיקה מהמשחק",count:"{n} קטעים · PT3 + AY",
  now:"מושמע כעת",idle:"בחרו קטע מהרשימה",info:"ZX Spectrum 128K · AY-3-8912",
  loading:"טוען מוזיקה מקורית AY…",paused:"מושהה · לחצו ▶ להמשך",
  playing:"מושמע דרך AY-3-8912",blocked:"לחצו ▶ להפעלת צליל",
  error:"לא ניתן לטעון את הקובץ",list:"כל הקטעים",intro:"מסך פתיחה",game:"משחק",
  play:"נגן",pause:"השהה",prev:"הקודם",next:"הבא",
  stop:"עצור וחזור למוזיקת המשחק",seek:"מיקום השמעה",
  foot:"PT3 ו-AY מקוריים · שלושה ערוצי AY · ללא MP3. ההאזנה מחליפה זמנית את מוזיקת המשחק."
 },
 ar:{
  eyebrow:"NEOLINE · مكتبة 128K",title:"موسيقى اللعبة",count:"{n} مقاطع · PT3 + AY",
  now:"يعمل الآن",idle:"اختر مقطعًا من القائمة",info:"ZX Spectrum 128K · AY-3-8912",
  loading:"تحميل مقطع AY الأصلي…",paused:"متوقف مؤقتًا · اضغط ▶ للمتابعة",
  playing:"يعمل عبر AY-3-8912",blocked:"اضغط ▶ لتفعيل الصوت",
  error:"تعذّر تحميل ملف PT3",list:"جميع المقاطع",intro:"شاشة البداية",game:"اللعب",
  play:"تشغيل",pause:"إيقاف مؤقت",prev:"السابق",next:"التالي",
  stop:"إيقاف واستعادة موسيقى اللعبة",seek:"تقديم وتأخير",
  foot:"PT3 وAY أصليان · ثلاث قنوات AY · دون MP3. التشغيل يستبدل موسيقى اللعبة مؤقتًا."
 }
};
const translations=()=>LANG[(doc.lang||"ru").split("-")[0]]||LANG.ru;
const fmt=sec=>{
 const n=Math.max(0,Math.floor(Number(sec)||0));
 return Math.floor(n/60)+":"+String(n%60).padStart(2,"0");
};

const pendingSongs=[
 {name:"Ghostbusters 2",format:"AY",file:"Ghostbusters_2.ay"},
 {name:"Beverly Hills Cop",format:"AY",file:"Beverly_Hills_Cop.ay"},
 {name:"CJ in USA",format:"AY",file:"Cj_In_Usa.ay"},
 {name:"Golden Axe",format:"AY",file:"Golden_Axe.ay"},
 {name:"Rambo 3",format:"AY",file:"Rambo_3.ay"},
 {name:"Back to the Future 2",format:"AY",file:"Back_To_The_Future_2.ay"},
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
 ru:{drawer:"Музыкальная коллекция ZX 128K",subtitle:"Плеер и вся музыка · нажми, чтобы открыть",ready:"ИГРОВАЯ МУЗЫКА",waiting:"ОРИГИНАЛЫ · ▶ ВОСПРОИЗВЕДЕНИЕ",state:"НАШ ПЛЕЕР · AY",count:"{a} PT3 · {n} AY · {e} 2×AY",foot:"{n} оригиналов работают напрямую в NEOLINE через AY-3-8912. Для недоступных пока композиций нет внешнего плеера — они будут активированы только после подготовки оригинальных регистров."},
 en:{drawer:"ZX 128K Music Collection",subtitle:"Player and complete list · tap to expand",ready:"READY TO LISTEN",waiting:"ORIGINALS · AY / STC / SQT / ASC / STP / PT2",state:"NEOLINE AY player",count:"{a} PT3 · {n} AY · {e} 2×AY",foot:"{n} original modules play through NEOLINE AY-3-8912. Unsupported modules stay disabled until their native engine is ready; no external player is used."},
 he:{drawer:"אוסף מוזיקה ZX 128K",subtitle:"נגן וכל המוזיקה · לחצו לפתיחה",ready:"מוכן להאזנה",waiting:"פורמטים מקוריים · AY / STC / SQT",state:"נגן AY מקורי",count:"{a} PT3 · {n} AY · {e} 2×AY",foot:"{n} שירים פועלים ישירות בנגן NEOLINE AY. לא נפתח נגן חיצוני."},
 ar:{drawer:"مجموعة موسيقى ZX 128K",subtitle:"المشغل وكل المقاطع · اضغط للفتح",ready:"جاهز للاستماع",waiting:"الملفات الأصلية · AY / STC / SQT",state:"مشغّل AY الأصلي",count:"{a} PT3 · {n} AY · {e} 2×AY",foot:"يعمل {n} مقطعًا في مشغّل AY الخاص بنا. لا يوجد مشغّل خارجي."}
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

// Native PSG register streams use our actual AY-3-8912 chip.
 // Z80 code-based AY and dual-chip SQT modules need full Z80 / 2×AY:
 // load the compatible ZXTune WebAssembly player INSIDE the game.
 // All supported originals are played by NEOLINE's own AY-3-8912
// AudioWorklet via the native AY14 register streams. No external iframe,
// ZXTune popup or remote audio player is ever instantiated.
const pendingHeader=listHeader();
const pendingButtons=[];
for(const track of pendingSongs){
 const li=document.createElement("li");li.className="vice-soundtrack__item vice-soundtrack__item--original";
 const button=document.createElement("button");
 button.type="button";button.className="vice-soundtrack__track";
 button.dataset.original=track.file;
 const number=document.createElement("span");
 number.className="vice-soundtrack__index";
 number.textContent=String(api.tracks.filter(t=>t.kind!=="original").length+pendingButtons.length+1).padStart(2,"0");
 const copy=document.createElement("span");copy.className="vice-soundtrack__trackname";
 const label=document.createElement("b");label.textContent=track.name;
 const kind=document.createElement("small");
 const action=document.createElement("span");action.className="vice-soundtrack__playicon";
 action.textContent="▶";action.setAttribute("aria-hidden","true");
 copy.append(label,kind);button.append(number,copy,action);
 button.addEventListener("click",()=>{
  if(api.originalReady?.(track.file))void api.playOriginal(track.file);
 });
 li.append(button);list.append(li);
 pendingButtons.push({button,kind,action,track});
}
function availableCounts(){
 const a=api.tracks.filter(t=>t.kind!=="original").length;
 const n=pendingSongs.filter(t=>api.originalReady?.(t.file)).length;
 return {a,n,e:pendingSongs.length-n};
}
function countsLabel(pattern){
 const {a,n,e}=availableCounts();
 return pattern.replaceAll("{a}",String(a)).replaceAll("{n}",String(n))
  .replaceAll("{e}",String(e)).replaceAll("{b}",String(pendingSongs.length));
}

function translate(){
 const t=translations(),x=extraLabels();
 if(drawerTitle)drawerTitle.textContent=x.drawer;
 if(drawerSubtitle)drawerSubtitle.textContent=x.subtitle;
 if(drawerStat)drawerStat.textContent=countsLabel(x.count);
 playableHeader.textContent=x.ready+" · "+availableCounts().a;
 pendingHeader.textContent=x.waiting+" · "+pendingSongs.length;
 for(const {button,kind,action,track} of pendingButtons){
  const native=!!api.originalReady?.(track.file);
  const lang=(doc.lang||"ru").split("-")[0];
  const copy={
   ru:{ready:"В НАШЕМ ПЛЕЕРЕ · AY",waiting:"ГОТОВИТСЯ Z80",dual:"2 ЧИПА · ПОКА НЕДОСТУПНО"},
   en:{ready:"IN OUR PLAYER · AY",waiting:"Z80 PREPARING",dual:"2 CHIPS · NOT READY"},
   he:{ready:"בנגן שלנו · AY",waiting:"הכנת Z80",dual:"2 שבבים · לא זמין"},
   ar:{ready:"في مشغّلنا · AY",waiting:"تجهيز Z80",dual:"شريحتان · غير جاهز"}
  }[lang]||{ready:"AY",waiting:"Z80",dual:"2×AY"};
  const label=native?copy.ready:track.file.includes("2xAY")?copy.dual:copy.waiting;
  button.disabled=!native;
  button.dataset.player=native?"ay":"unavailable";
  button.removeAttribute("aria-haspopup");
  kind.textContent=track.format+" · "+label;
  action.textContent=native?"▶":"◌";
  button.setAttribute("aria-label",track.name+" — "+label);
  button.title=track.name+" · "+label;
  button.closest(".vice-soundtrack__item")?.classList.toggle("vice-soundtrack__item--pending",!native);
 }
 eyebrow.textContent=t.eyebrow;
 title.textContent=t.title;
 count.textContent=countsLabel(x.count);
 nowLabel.textContent=t.now;
 btnList.textContent=t.list;
 foot.textContent=countsLabel(x.foot);
 btnPrev.setAttribute("aria-label",t.prev);btnPrev.title=t.prev;
 btnNext.setAttribute("aria-label",t.next);btnNext.title=t.next;
 btnStop.setAttribute("aria-label",t.stop);btnStop.title=t.stop;
 range.setAttribute("aria-label",t.seek);
 for(const track of api.tracks){
  const entry=trackButtons.get(track.id);
  if(!entry)continue;
  const {button,kind}=entry;
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
  if(!x)continue;
  const selected=!!current&&track.id===current.id;
  x.button.setAttribute("aria-pressed",String(selected));
  x.action.textContent=selected&&playing?"Ⅱ":"▶";
  x.button.classList.toggle("is-playing",selected&&playing);
  x.button.setAttribute("aria-label",(selected&&playing?t.pause:t.play)+" — "+track.name);
 }
 for(const {button,kind,action,track} of pendingButtons){
  const selected=!!current&&current.file===track.file;
  const native=!!api.originalReady?.(track.file);
  button.disabled=!native;button.dataset.player=native?"ay":"unavailable";
  button.setAttribute("aria-pressed",String(selected));
  button.classList.toggle("is-playing",selected&&playing);
  action.textContent=selected&&playing?"Ⅱ":native?"▶":"◌";
  if(native&&selected)kind.textContent=track.format+" · "+(playing?"ИГРАЕТ":paused?"ПАУЗА":"AY");
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

window.addEventListener("neoline:ay-originals-ready",()=>{
 translate();draw();
});
window.addEventListener("neoline:ay-player",draw);
window.addEventListener("neoline:ay-status",draw);
window.addEventListener("neoline:vice-theme",draw);
new MutationObserver(translate).observe(doc,{attributes:true,attributeFilter:["lang"]});
translate();
})();
