/* NEOLINE / THEORY — three automatic cinematic gift reveals (illustration only).
   Each round accelerates for 2.35 seconds with tiny stars and a gold reward frame.
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
 const dust=stage.querySelector(".gift-reveal-spark-dust");
 const burstOverlay=document.getElementById("gameGiftScreenBurst");
 const giftBox=stage.querySelector(".gift-reveal-box");
 // More varied particles on all three openings, built once for mobile performance.
 const flyingStars=stage.querySelector(".gift-reveal-stars");
 if(flyingStars){
  const extra=document.createDocumentFragment();
  const forms=["✦","✧","★","✶"];
  for(let i=0;i<20;i++){
   const star=document.createElement("i");
   const angle=(i*137.508+18)*Math.PI/180;
   const reach=65+(i*29)%100;
   star.textContent=forms[i%forms.length];
   star.style.setProperty("--x",Math.round(Math.cos(angle)*reach)+"px");
   star.style.setProperty("--y",Math.round(Math.sin(angle)*reach-26)+"px");
   star.style.setProperty("--r",(-160+(i*47)%320)+"deg");
   star.style.setProperty("--delay","0ms");
   star.style.setProperty("--size",(9+(i*7)%16)+"px");
   extra.appendChild(star);
  }
  flyingStars.appendChild(extra);
 }

 // Fixed-size, deterministic small sparkles: limited DOM work on mobile.
 if(dust){
  const fragment=document.createDocumentFragment();
  for(let i=0;i<22;i++){
   const star=document.createElement("i");
   const side=i%2===0?-1:1;
   star.textContent=i%4===0?"✧":"✦";
   star.style.setProperty("--dust-x",(side*(55+(i*19)%56))+"px");
   star.style.setProperty("--dust-y",(-30+(i*17)%84)+"px");
   star.style.setProperty("--dust-size",(6+i%5)+"px");
   star.style.setProperty("--dust-delay",(-((i*7)%19)*.047).toFixed(2)+"s");
   star.style.setProperty("--dust-speed",(.42+(i%4)*.085).toFixed(2)+"s");
   star.style.setProperty("--dust-color",i%3===0?"#fffefa":"#ffe49c");
   fragment.appendChild(star);
  }
  dust.appendChild(fragment);
 }
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
 function clearStarFinale(){
  if(!burstOverlay)return;
  if(typeof burstOverlay.hidePopover==="function"){
   try{if(burstOverlay.matches(":popover-open"))burstOverlay.hidePopover();}catch(e){}
  }
  burstOverlay.classList.remove("is-fallback");
  burstOverlay.replaceChildren();
 }
 function starFinale(){
  if(!burstOverlay||!giftBox||!dialog.open||reduced.matches||document.hidden)return;
  clearStarFinale();
  const rect=giftBox.getBoundingClientRect();
  const originX=rect.left+rect.width/2;
  const originY=rect.top+rect.height*.52;
  let fallback=false;
  if(typeof burstOverlay.showPopover==="function"){
   try{burstOverlay.showPopover();}catch(e){fallback=true;}
  }else fallback=true;
  const frame=fallback?dialog.getBoundingClientRect():{left:0,top:0,width:innerWidth,height:innerHeight};
  if(fallback)burstOverlay.classList.add("is-fallback");
  const ox=originX-frame.left,oy=originY-frame.top;
  burstOverlay.style.setProperty("--origin-x",ox+"px");
  burstOverlay.style.setProperty("--origin-y",oy+"px");
  const fragment=document.createDocumentFragment();
  const ring=document.createElement("span");
  ring.className="gift-burst-ring";
  ring.setAttribute("aria-hidden","true");
  fragment.appendChild(ring);
  const icons=["✦","✧","✶","★","✧"];
  const total=44;
  const reach=Math.hypot(frame.width,frame.height);
  for(let i=0;i<total;i++){
   const star=document.createElement("span");
   star.className="gift-full-star"+(i%7===0?" star-white":i%13===0?" star-cyan":i%17===0?" star-red":"");
   star.textContent=icons[i%icons.length];
   const angle=(2*Math.PI*(i+(i%7)*.24)/total);
   const radius=reach*(.23+((i*31)%59)/100);
   const dx=Math.cos(angle)*radius;
   const dy=Math.sin(angle)*radius;
   star.style.setProperty("--star-dx",dx.toFixed(0)+"px");
   star.style.setProperty("--star-dy",dy.toFixed(0)+"px");
   star.style.setProperty("--star-size",(8+(i*11)%12)+"px");
   star.style.setProperty("--star-speed",(.78+(i%6)*.065).toFixed(2)+"s");
   star.style.setProperty("--star-delay",(i%8*16)+"ms");
   star.style.setProperty("--star-rotate",(-240+(i*37)%480)+"deg");
   star.style.setProperty("--star-end-scale",(.3+(i%5)*.18).toFixed(2));
   fragment.appendChild(star);
  }
  burstOverlay.appendChild(fragment);
  after(clearStarFinale,1280);
 }
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
  },2350);
  after(()=>{
   if(token!==sequence||!dialog.open)return;
   fillCard(index);
   setPhase("revealed");
   if(index===2)after(()=>{if(token===sequence&&dialog.open)starFinale();},360);
  },2960);
  after(()=>{
   if(token!==sequence||!dialog.open)return;
   if(index<2){
    setPhase("idle");
    after(()=>round(index+1,token),290);
   }else{
    finished=true;
    setStatus();
    replay.hidden=false;
   }
  },4720);
 }
 function play(){
  clearTimers();
  clearStarFinale();
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
  clearStarFinale();
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
 // Open the existing real three-round preview after clicking the new
 // homepage gift-campaign slide; no prizes or XP are credited.
 if(new URLSearchParams(location.search).get("gift")==="preview"){
  requestAnimationFrame(()=>{
   const giftButton=document.getElementById("gameGiftTrigger")||triggers[0];
   giftButton?.click();
   // Consume the campaign query so refreshing the game doesn't pop up a
   // promotional modal repeatedly. Preserve any unrelated query params.
   try{
    const next=new URL(location.href);
    next.searchParams.delete("gift");
    history.replaceState(history.state,"",next.pathname+next.search+next.hash);
   }catch(e){}
  });
 }
})();
