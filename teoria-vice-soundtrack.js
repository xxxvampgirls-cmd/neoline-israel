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
 ru:{drawer:"Музыкальная коллекция ZX 128K",subtitle:"Плеер и вся музыка · нажми, чтобы открыть",ready:"ИГРОВАЯ МУЗЫКА",waiting:"ОРИГИНАЛЫ · ▶ ВОСПРОИЗВЕДЕНИЕ",state:"ВСТРОЕННЫЙ ПЛЕЕР ▶",count:"{a} PT3 · {n} AY · {e} Z80",foot:"{n} оригиналов играют здесь на AY-3-8912. Остальные {e} файла Z80 / 2×AY запускаются во встроенном проигрывателе. Все исходные записи сохранены."},
 en:{drawer:"ZX 128K Music Collection",subtitle:"Player and complete list · tap to expand",ready:"READY TO LISTEN",waiting:"ORIGINALS · AY / STC / SQT / ASC / STP / PT2",state:"Embedded player ▶",count:"{a} PT3 · {n} AY · {e} Z80",foot:"{n} originals play natively through the AY-3-8912 chip. The remaining {e} Z80 / dual-chip files use the embedded player."},
 he:{drawer:"אוסף מוזיקה ZX 128K",subtitle:"נגן וכל המוזיקה · לחצו לפתיחה",ready:"מוכן להאזנה",waiting:"פורמטים מקוריים · AY / STC / SQT",state:"נגן משובץ ▶",count:"{a} PT3 · {n} AY · {e} Z80",foot:"{n} שירים פועלים דרך AY. שאר {e} השירים פועלים בנגן משובץ."},
 ar:{drawer:"مجموعة موسيقى ZX 128K",subtitle:"المشغل وكل المقاطع · اضغط للفتح",ready:"جاهز للاستماع",waiting:"الملفات الأصلية · AY / STC / SQT",state:"مشغّل مدمج ▶",count:"{a} PT3 · {n} AY · {e} Z80",foot:"تعمل {n} مقاطع عبر AY. تعمل {e} مقاطع أخرى في مشغّل مدمج."}
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
 const ZXTUNE_URL="https://zxtune.com/player.html";
 const originalDialog=document.createElement("dialog");
 originalDialog.className="vice-soundtrack-original-dialog";
 originalDialog.setAttribute("aria-label","ZX original music player");
 const originalBox=document.createElement("div");
 originalBox.className="vice-soundtrack-original";
 const modalTitle=document.createElement("strong");
 const modalClose=document.createElement("button");
 modalClose.type="button";modalClose.textContent="×";
 modalClose.className="vice-soundtrack-original__close";
 modalClose.setAttribute("aria-label","Close");
 const modalTop=document.createElement("div");
 modalTop.className="vice-soundtrack-original__top";
 modalTop.append(modalTitle,modalClose);
 const modalMessage=document.createElement("p");
 modalMessage.className="vice-soundtrack-original__message";
 modalMessage.setAttribute("role","status");
 const modalLink=document.createElement("a");
 modalLink.target="_blank";modalLink.rel="noopener noreferrer";
 modalLink.className="vice-soundtrack-original__link";
 modalLink.hidden=true;
 const modalFrame=document.createElement("iframe");
 modalFrame.className="vice-soundtrack-original__frame";
 modalFrame.title="ZXTune Web: original ZX Spectrum modules";
 modalFrame.loading="eager";modalFrame.allow="autoplay";
 modalFrame.referrerPolicy="strict-origin-when-cross-origin";
 modalFrame.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms allow-downloads allow-popups");
 originalBox.append(modalTop,modalMessage,modalFrame,modalLink);
 originalDialog.append(originalBox);document.body.append(originalDialog);
 let originalSelected=null,modalSequence=0,modalFallback=0,modalLoaded=false;
 const EMBED_COPY={
  ru:{loading:"Загружаем встроенный Z80 / 2×AY плеер…",ready:"Нажми ▶ в проигрывателе ниже. Страница игры остаётся открытой.",external:"Открыть отдельно ↗"},
  en:{loading:"Loading embedded Z80 / 2×AY player…",ready:"Tap ▶ inside the player below. You stay on the game page.",external:"Open separately ↗"},
  he:{loading:"טוען נגן Z80 / 2×AY משובץ…",ready:"לחצו ▶ בנגן למטה, בלי לעזוב את המשחק.",external:"פתיחה בנפרד ↗"},
  ar:{loading:"تحميل مشغّل Z80 / 2×AY المدمج…",ready:"اضغط ▶ في المشغّل أدناه دون مغادرة اللعبة.",external:"فتح منفصل ↗"}
 };
 const embedCopy=()=>EMBED_COPY[(doc.lang||"ru").split("-")[0]]||EMBED_COPY.ru;
 function closeOriginalDialog(){
  ++modalSequence;originalSelected=null;
  clearTimeout(modalFallback);modalFallback=0;
  modalFrame.removeAttribute("src");modalLoaded=false;
  if(originalDialog.open)originalDialog.close();
  api.suspendForOriginalPlayer?.(false);
  draw();
 }
 modalClose.addEventListener("click",closeOriginalDialog);
 originalDialog.addEventListener("cancel",e=>{e.preventDefault();closeOriginalDialog()});
 originalDialog.addEventListener("click",e=>{if(e.target===originalDialog)closeOriginalDialog()});
 modalFrame.addEventListener("load",()=>{
  if(!originalDialog.open||!originalSelected)return;
  modalLoaded=true;clearTimeout(modalFallback);modalFallback=0;
  modalMessage.textContent=embedCopy().ready;
 });
 function openOriginalTrack(track){
  const fileURL=new URL("./assets/teoria/originals/"+encodeURIComponent(track.file),location.href).href;
  const playerURL=ZXTUNE_URL+"?url="+encodeURIComponent(fileURL);
  const token=++modalSequence;
  originalSelected=track.file;modalLoaded=false;modalTitle.textContent=track.name+" · "+track.format;
  modalMessage.textContent=embedCopy().loading;
  modalLink.href=playerURL;modalLink.textContent=embedCopy().external;modalLink.hidden=true;
  api.suspendForOriginalPlayer?.(true);
  if(!originalDialog.open)originalDialog.showModal();
  modalFrame.src=playerURL;
  clearTimeout(modalFallback);
  modalFallback=setTimeout(()=>{
   if(token===modalSequence&&originalDialog.open&&!modalLoaded)modalLink.hidden=false;
  },10000);
  draw();
 }

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
  if(api.originalReady?.(track.file)){
   if(originalDialog.open)closeOriginalDialog();
   void api.playOriginal(track.file);
  }else openOriginalTrack(track);
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
  const language=(doc.lang||"ru").split("-")[0];
  const inGame={ru:"В ИГРЕ · AY",en:"IN GAME · AY",he:"במשחק · AY",ar:"داخل اللعبة · AY"};
  const label=native?(inGame[language]||inGame.ru):x.state;
  button.disabled=false;button.dataset.player=native?"ay":"zxtune";
  if(native)button.removeAttribute("aria-haspopup");
  else button.setAttribute("aria-haspopup","dialog");
  kind.textContent=track.format+" · "+label;
  action.textContent="▶";
  button.setAttribute("aria-label",t.play+" — "+track.name+" — "+label);
  button.title=track.name+" · "+label;
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
  const embedded=originalDialog.open&&originalSelected===track.file;
  button.disabled=false;button.dataset.player=native?"ay":"zxtune";
  button.setAttribute("aria-pressed",String(selected||embedded));
  button.classList.toggle("is-playing",(selected&&playing)||embedded);
  action.textContent=embedded||(selected&&playing)?"Ⅱ":"▶";
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
  if(originalDialog.open)closeOriginalDialog();
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
