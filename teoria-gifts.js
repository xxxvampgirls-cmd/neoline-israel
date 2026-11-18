/* NEOLINE: informational gift preview. No prizes, coupons, cart updates or XP thresholds. */
(()=>{
"use strict";
const dialog=document.getElementById("gameGiftDialog");
const triggers=[...document.querySelectorAll("[data-gift-preview]")];
if(!dialog||triggers.length===0)return;
const $=id=>document.getElementById(id);
const i18n={
 ru:{
  label:"Подарки",result:"Какие подарки?",
  eyebrow:"NEOLINE · ИГРОВЫЕ НАГРАДЫ",title:"Подарки за игру 🎁",
  intro:"Играй в «Теорию вождения», изучай правила и собирай достижения. Мы готовим приятные бонусы, которые в будущем можно будет использовать при покупках в NEOLINE.",
  subtitle:"Что можно будет получить",
  discount:"Дополнительная скидка",discountAbout:"Возможный бонус к покупке товаров NEOLINE.",
  accessory:"Автоаксессуар в подарок",accessoryAbout:"Полезная вещь для автомобиля вместе с заказом.",
  surprise:"Специальный бонус",surpriseAbout:"Дополнительная выгода или приятный сюрприз при покупке.",
  pending:"Пока это примеры будущих наград, а не действующая акция. Какие подарки будут доступны, за что их выдавать и сколько понадобится очков — определим позже. Сейчас XP — только игровые очки: подарки не начисляются и в корзину не отправляются.",
  close:"Понятно",closeButton:"Закрыть описание подарков"
 },
 en:{
  label:"Gifts",result:"What gifts?",
  eyebrow:"NEOLINE · GAME REWARDS",title:"Gifts for playing 🎁",
  intro:"Play Driving Theory, learn the rules and earn achievements. We're considering future bonuses you could use with NEOLINE purchases.",
  subtitle:"Potential gifts",
  discount:"Extra discount",discountAbout:"A possible bonus on a NEOLINE purchase.",
  accessory:"Car accessory gift",accessoryAbout:"A useful item included with an order.",
  surprise:"Special bonus",surpriseAbout:"An extra benefit or surprise with an order.",
  pending:"These are ideas, not an active offer. We'll decide which rewards to offer, what earns them and how many points are needed later. For now, XP is only an in-game score: no rewards are issued or added to the cart.",
  close:"Got it",closeButton:"Close gift information"
 },
 he:{
  label:"מתנות",result:"אילו מתנות?",
  eyebrow:"NEOLINE · פרסים במשחק",title:"מתנות על משחק 🎁",
  intro:"שחקו בתאוריה לנהיגה, למדו את החוקים ואספו הישגים. אנחנו בוחנים הטבות עתידיות לקניות ב-NEOLINE.",
  subtitle:"אילו מתנות ייתכנו?",
  discount:"הנחה נוספת",discountAbout:"הטבה אפשרית בקניית מוצרי NEOLINE.",
  accessory:"אביזר לרכב במתנה",accessoryAbout:"אביזר שימושי שאולי יצורף להזמנה.",
  surprise:"בונוס מיוחד",surpriseAbout:"הטבה נוספת או הפתעה בקנייה.",
  pending:"אלה רעיונות בלבד, לא מבצע פעיל. סוגי המתנות, התנאים ומספר הנקודות הדרוש ייקבעו בהמשך. כרגע XP הוא ניקוד במשחק בלבד: אין חלוקת פרסים ואין הוספת מתנות לסל הקניות.",
  close:"הבנתי",closeButton:"סגירת פרטי המתנות"
 },
 ar:{
  label:"هدايا",result:"ما الهدايا؟",
  eyebrow:"NEOLINE · مكافآت اللعبة",title:"هدايا اللعب 🎁",
  intro:"تعلّم قواعد القيادة واجمع الإنجازات. ندرس مزايا مستقبلية يمكن استخدامها مع مشتريات NEOLINE.",
  subtitle:"الهدايا المحتملة",
  discount:"خصم إضافي",discountAbout:"ميزة محتملة عند شراء منتجات NEOLINE.",
  accessory:"إكسسوار للسيارة",accessoryAbout:"هدية مفيدة قد تُرفق مع الطلب.",
  surprise:"مكافأة خاصة",surpriseAbout:"ميزة إضافية أو مفاجأة مع الشراء.",
  pending:"هذه مجرد أفكار وليست عرضًا فعالًا. سنحدد لاحقًا نوع الجوائز وشروطها وعدد النقاط اللازمة. XP حاليًا نقاط داخل اللعبة فقط، ولا تُمنح جوائز أو تُضاف إلى السلة.",
  close:"فهمت",closeButton:"إغلاق معلومات الهدايا"
 }
};
const mapping={
 gameGiftTriggerLabel:"label",gameGiftResultLabel:"result",
 gameGiftEyebrow:"eyebrow",gameGiftTitle:"title",gameGiftIntro:"intro",
 gameGiftOptionsTitle:"subtitle",gameGiftDiscountTitle:"discount",
 gameGiftDiscountDescription:"discountAbout",gameGiftAccessoryTitle:"accessory",
 gameGiftAccessoryDescription:"accessoryAbout",gameGiftSurpriseTitle:"surprise",
 gameGiftSurpriseDescription:"surpriseAbout",gameGiftNotice:"pending",
 gameGiftOK:"close"
};
function currentLanguage(){
 const lang=String(document.documentElement.lang||"ru").toLowerCase().split("-")[0];
 return i18n[lang]?lang:"ru";
}
function updateText(){
 const labels=i18n[currentLanguage()];
 for(const [id,key] of Object.entries(mapping)){
  const element=$(id);if(element)element.textContent=labels[key];
 }
 const close=$("gameGiftClose");if(close)close.setAttribute("aria-label",labels.closeButton);
 for(const trigger of triggers)trigger.setAttribute("aria-label",labels.title);
 dialog.setAttribute("lang",currentLanguage());
 dialog.dir=currentLanguage()==="he"||currentLanguage()==="ar"?"rtl":"ltr";
}
function open(trigger){
 updateText();
 if(typeof dialog.showModal==="function"){
  if(!dialog.open)dialog.showModal();
 }else{
  dialog.setAttribute("open","");
 }
 for(const item of triggers)item.setAttribute("aria-expanded","true");
 dialog.dataset.openedBy=trigger.id||"";
 $("gameGiftClose")?.focus();
}
function close(){
 if(typeof dialog.close==="function"&&dialog.open)dialog.close();
 else dialog.removeAttribute("open");
 for(const item of triggers)item.setAttribute("aria-expanded","false");
}
for(const trigger of triggers){
 trigger.addEventListener("click",()=>open(trigger));
 trigger.setAttribute("aria-expanded","false");
}
$("gameGiftClose")?.addEventListener("click",close);
$("gameGiftOK")?.addEventListener("click",close);
dialog.addEventListener("close",()=>{
 for(const item of triggers)item.setAttribute("aria-expanded","false");
 const origin=$(dialog.dataset.openedBy||"");
 if(origin&&document.contains(origin))origin.focus({preventScroll:true});
});
dialog.addEventListener("click",event=>{if(event.target===dialog)close()});
document.addEventListener("keydown",event=>{
 if(event.key==="Escape"&&dialog.open&&typeof dialog.close!=="function")close();
});
new MutationObserver(updateText).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
updateText();
})();