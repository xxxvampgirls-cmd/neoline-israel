/* NEOLINE / THEORY — three automatic cinematic gift reveals (illustration only).
   Each round shakes for roughly 3 seconds, then bursts with a gold bonus frame.
   No reward issuance, random odds, discounts, XP deductions or cart mutations. */
(()=>{
 "use strict";
 const dialog=document.getElementById("gameGiftDialog");
 const stage=document.getElementById("gameGiftReveal");
 const replay=document.getElementById("gameGiftRevealReplay");
 const status=document.getElementById("gameGiftRevealStatus");
 const badge=document.getElementById("gameGiftRevealNumber");
 const title=document.getElementById("gameGiftRevealTitle");
 const icon=document.getElementById("gameGiftRevealIcon");
 const slots=[...document.querySelectorAll("#gameGiftRevealSlots [data-reveal-slot]")];
 if(!dialog||!stage||!replay||!status||!badge||!title||!icon||slots.length!==3)return;
 const triggers=[...document.querySelectorAll("[data-gift-preview]")];
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
 const copy={
  ru:{
   label:"Демонстрация открытия трёх возможных бонусов",
   slots:"Примеры будущих бонусов",
   start:"Три подарка — три открытия",
   shake:"Подарок трясётся…",
   burst:"Открываем подарок…",
   reveal:"Пример бонуса",
   done:"Три примера показаны. Настоящие призы пока не выдаются.",
   replay:"Повторить ↻"
  },
  en:{
   label:"Three sample gift-box reveals",
   slots:"Examples of possible future rewards",
   start:"Three gift reveals",
   shake:"The gift is shaking…",
   burst:"Opening the gift…",
   reveal:"Sample bonus",
   done:"Three examples shown. No real prizes are awarded.",
   replay:"Watch again ↻"
  },
  he:{
   label:"הדגמה של פתיחת שלוש מתנות אפשריות",
   slots:"דוגמאות להטבות עתידיות",
   start:"שלוש פתיחות מתנה",
   shake:"המתנה רועדת…",
   burst:"פותחים את המתנה…",
   reveal:"דוגמה לבונוס",
   done:"הוצגו שלוש דוגמאות. כרגע אין חלוקת פרסים אמיתיים.",
   replay:"הפעל שוב ↻"
  },
  ar:{
   label:"عرض توضيحي لفتح ثلاث هدايا محتملة",
   slots:"أمثلة على المكافآت المستقبلية",
   start:"ثلاث هدايا توضيحية",
   shake:"الهدية تهتز…",
   burst:"جارٍ فتح الهدية…",
   reveal:"مثال على مكافأة",
   done:"عُرضت ثلاثة أمثلة. لا تُمنح جوائز حقيقية حاليًا.",
   replay:"شاهد مجددًا ↻"
  }
 };
 const symbols=["%","🎁","✦"];
 const currentCopy=()=>{
  const lng=String(document.documentElement.lang||"ru").toLowerCase().split("-")[0];
  return copy[lng]||copy.ru;
 };
 let timers=[];
 let sequence=0;
 let activeRound=0;
 let phase="idle";
 let finished=false;
 const after=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);};
 const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];sequence++;};
 function setStatus(){
  const c=currentCopy();
  stage.setAttribute("aria-label",c.label);
  document.getElementById("gameGiftRevealSlots")?.setAttribute("aria-label",c.slots);
  replay.textContent=c.replay;
  if(finished){status.textContent=c.done;return;}
  if(phase==="shake")status.textContent=c.shake+" "+(activeRound+1)+"/3";
  else if(phase==="burst")status.textContent=c.burst+" "+(activeRound+1)+"/3";
  else if(phase==="revealed")status.textContent=c.reveal+": "+getBonusTitle(activeRound);
  else status.textContent=c.start;
 }
 function getBonusTitle(index){
  const el=slots[index]?.querySelector("strong");
  return el?el.textContent.trim():"";
 }
 function setPhase(next){
  phase=next;
  stage.dataset.phase=next;
  setStatus();
 }
 function fillCard(index){
  const slot=slots[index];
  if(!slot)return;
  slot.classList.add("unlocked","is-current");
  title.textContent=getBonusTitle(index);
  icon.textContent=symbols[index];
 }
 function prepRound(index){
  activeRound=index;
  badge.textContent=String(index+1).padStart(2,"0")+" / 03";
  for(const slot of slots)slot.classList.remove("is-current");
  title.textContent=getBonusTitle(index);
  icon.textContent=symbols[index];
  // Reset lid and star keyframes before every new shake.
  stage.dataset.phase="idle";
  void stage.offsetWidth;
  setPhase("shake");
 }
 function round(index,token){
  if(token!==sequence||!dialog.open||document.hidden)return;
  prepRound(index);
  after(()=>{
   if(token!==sequence||!dialog.open)return;
   setPhase("burst");
  },3020);
  after(()=>{
   if(token!==sequence||!dialog.open)return;
   fillCard(index);
   setPhase("revealed");
  },3760);
  after(()=>{
   if(token!==sequence||!dialog.open)return;
   if(index<2){
    setPhase("idle");
    after(()=>round(index+1,token),360);
   }else{
    finished=true;
    setStatus();
    replay.hidden=false;
   }
  },5780);
 }
 function play(){
  clearTimers();
  if(!dialog.open)return;
  const token=sequence;
  finished=false;
  activeRound=0;
  badge.textContent="01 / 03";
  slots.forEach(slot=>slot.classList.remove("unlocked","is-current"));
  replay.hidden=true;
  stage.dataset.phase="idle";
  phase="idle";
  setStatus();
  if(reduced.matches){
   slots.forEach(slot=>slot.classList.add("unlocked"));
   fillCard(2);
   activeRound=2;
   badge.textContent="03 / 03";
   setPhase("revealed");
   finished=true;
   setStatus();
   replay.hidden=false;
   return;
  }
  round(0,token);
 }
 function stop(){
  clearTimers();
  phase="idle";
  stage.dataset.phase="idle";
 }
 for(const btn of triggers){
  // teoria-gifts.js opens the dialog synchronously on the same click.
  btn.addEventListener("click",()=>{
   if(dialog.open)play();
   else setTimeout(()=>{if(dialog.open)play()},0);
  });
 }
 replay.addEventListener("click",play);
 dialog.addEventListener("close",stop);
 dialog.addEventListener("cancel",stop);
 document.addEventListener("visibilitychange",()=>{
  if(document.hidden)stop();
  else if(dialog.open&&!finished)play();
 });
 new MutationObserver(()=>{
  if(dialog.open){
   if(phase==="revealed"){title.textContent=getBonusTitle(activeRound);}
   setStatus();
  }
 }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 setStatus();
})();
