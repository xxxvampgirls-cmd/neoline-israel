(function(){
"use strict";
const words={
ru:["КАРТА ДОСТАВКИ","Где забрать товар","Постаматы и пункты самовывоза по Израилю. Выберите сеть и найдите ближайшую точку на карте.","Постаматы и пункты","Умные локеры","Почта и локеры","Локеры и магазины","UPS и партнёры","Открыть карту пунктов выдачи ↗","Справочник доступных сетей. NEOLINE пока не подключил доставку через эти компании — возможность получить здесь заказ будет подтверждена отдельно.","Также: магазины KSP — самовывоз только заказов KSP."],
en:["DELIVERY MAP","Where to pick up","Parcel lockers and pickup locations across Israel. Choose a network and find a nearby location on the map.","Lockers and pickup points","Smart lockers","Post offices and lockers","Lockers and shops","UPS and partners","Open pickup map ↗","Reference network directory. NEOLINE has not activated delivery through these partners. Actual NEOLINE pickup availability must be confirmed separately.","Also: KSP stores — pickup is for eligible KSP purchases only."],
he:["מפת משלוחים","איפה אוספים חבילה","לוקרים ונקודות איסוף ברחבי ישראל. בחרו רשת וחפשו נקודה קרובה במפה.","לוקרים ונקודות איסוף","לוקרים חכמים","דואר ולוקרים","לוקרים וחנויות","UPS ושותפים","פתיחת מפת נקודות האיסוף ↗","מדריך רשתות בלבד. NEOLINE טרם הפעילה משלוחים דרך חברות אלו. אפשרות איסוף הזמנות NEOLINE כפופה לאישור נפרד.","בנוסף: סניפי KSP — איסוף להזמנות KSP בלבד."],
ar:["خريطة التوصيل","أين تستلم طلبك","خزائن طرود ونقاط استلام في أنحاء إسرائيل. اختر شبكة وابحث عن أقرب نقطة على الخريطة.","خزائن ونقاط استلام","خزائن ذكية","البريد والخزائن","خزائن ومتاجر","UPS وشركاء","افتح خريطة نقاط الاستلام ↗","دليل شبكات للمرجعية فقط. لم يفعل NEOLINE خدمة التوصيل مع هذه الشركات بعد. توفر استلام طلبات NEOLINE يحتاج إلى تأكيد منفصل.","كذلك: متاجر KSP — الاستلام لطلبات KSP المؤهلة فقط."]
};
const shortPickup={ru:"Пункты выдачи",en:"Pickup points",he:"נקודות איסוף",ar:"نقاط الاستلام"};
function update(){
 const lang=localStorage.getItem("neoline-language")||"ru",l=words[lang]||words.ru;
 document.querySelectorAll("[data-pickup-copy]").forEach(el=>{
  const i=Number(el.getAttribute("data-pickup-copy"));el.textContent=l[i]
 });
 // The two CTA buttons in the road demo must fit on ONE mobile row.
 // Keep the full localized map label in aria-label for accessibility.
 document.querySelectorAll("[data-pickup-short]").forEach(el=>{
  const label=el.querySelector("[data-pickup-short-text]");
  if(label)label.textContent=shortPickup[lang]||shortPickup.ru;
  el.setAttribute("aria-label",l[8].replace(/\\s*↗$/,""));
 });
}
if(document.getElementById("pickup-preview")){
 update();
 document.querySelectorAll("[data-language]").forEach(el=>el.addEventListener("click",()=>setTimeout(update,0)));
 document.getElementById("lang")?.addEventListener("change",()=>setTimeout(update,0));
}
})();