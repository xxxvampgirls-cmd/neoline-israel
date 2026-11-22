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
