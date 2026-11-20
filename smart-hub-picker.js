/* NEOLINE smart model chooser — light branded dialog instead of the Android
   native dropdown. Retains the underlying select and dispatches real change
   events, so comparison logic and automated tests stay the source of truth. */
(()=>{
"use strict";
const root=document.getElementById("smartHub");
if(!root)return;
const dictionary={
 ru:{heading:"Выберите модель NEOLINE",hint:"Нажмите на нужное устройство",close:"Закрыть",footer:"Список моделей из нашего каталога",used:"Уже участвует в сравнении"},
 en:{heading:"Select a NEOLINE model",hint:"Tap a device to select it",close:"Close",footer:"Models from our catalogue",used:"Already in comparison"},
 he:{heading:"בחירת דגם NEOLINE",hint:"בחרו את המכשיר המתאים",close:"סגירה",footer:"דגמים מהקטלוג שלנו",used:"כבר נמצא בהשוואה"},
 ar:{heading:"اختر طراز NEOLINE",hint:"اختر الجهاز المناسب",close:"إغلاق",footer:"الطرازات في الكتالوج",used:"موجود بالفعل في المقارنة"}
};
const currentLanguage=()=>dictionary[document.documentElement.lang]||dictionary.ru;
const dialog=document.createElement("dialog");
dialog.id="hubModelPicker";
dialog.className="hub-model-picker-dialog";
dialog.setAttribute("aria-labelledby","hubModelPickerTitle");
dialog.innerHTML='<header class="hub-model-picker-head"><div><h3 id="hubModelPickerTitle"></h3><small id="hubModelPickerHint"></small></div>'+
 '<button type="button" class="hub-model-picker-close" aria-label="Close">×</button></header>'+
 '<div class="hub-model-picker-options" role="radiogroup" aria-labelledby="hubModelPickerTitle"></div>'+
 '<footer class="hub-model-picker-foot"></footer>';
document.body.append(dialog);
const title=dialog.querySelector("#hubModelPickerTitle");
const hint=dialog.querySelector("#hubModelPickerHint");
const list=dialog.querySelector(".hub-model-picker-options");
const foot=dialog.querySelector(".hub-model-picker-foot");
let activeKey=null;
const keyFrom=select=>select.hasAttribute("data-hub-device")?"owner":"compare:"+select.dataset.hubCompare;
const selectorFrom=key=>key==="owner"?'[data-hub-device]':'[data-hub-compare="'+key.slice(8)+'"]';
const findControl=key=>root.querySelector(selectorFrom(key));
const trLabel=select=>{
 const label=select.closest("label");
 if(!label)return "";
 return [...label.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).filter(Boolean).join(" ");
};
function hydrate(){
 const selectors=root.querySelectorAll("select[data-hub-device],select[data-hub-compare]");
 for(const select of selectors){
  if(select.classList.contains("hub-model-native"))continue;
  const label=trLabel(select);
  const wrap=document.createElement("div");
  wrap.className="hub-model-control";
  select.parentNode.insertBefore(wrap,select);
  wrap.append(select);
  select.classList.add("hub-model-native");
  select.tabIndex=-1;
  select.setAttribute("aria-hidden","true");
  const btn=document.createElement("button");
  btn.type="button";
  btn.className="hub-model-trigger";
  btn.setAttribute("aria-haspopup","dialog");
  btn.setAttribute("aria-expanded","false");
  btn.dataset.hubPickerFor=keyFrom(select);
  btn.setAttribute("aria-label",label||currentLanguage().heading);
  const value=document.createElement("span");
  value.className="hub-model-trigger-value";
  const arrow=document.createElement("span");
  arrow.className="hub-model-chevron";
  arrow.setAttribute("aria-hidden","true");
  arrow.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg>';
  value.textContent=select.selectedOptions[0]?.textContent||"—";
  btn.append(value,arrow);
  wrap.append(btn);
  btn.addEventListener("click",()=>showPicker(btn.dataset.hubPickerFor));
 }
}
function showPicker(key){
 const select=findControl(key);
 if(!select)return;
 if(dialog.open)dialog.close();
 activeKey=key;
 const lang=document.documentElement.lang;
 const t=currentLanguage();
 dialog.lang=lang;
 dialog.dir=["he","ar"].includes(lang)?"rtl":"ltr";
 title.textContent=t.heading;
 hint.textContent=t.hint;
 foot.textContent=t.footer;
 dialog.querySelector(".hub-model-picker-close").setAttribute("aria-label",t.close);
 list.replaceChildren();
 const otherValues=key.startsWith("compare:")?
  [...root.querySelectorAll("select[data-hub-compare]")].filter(el=>el!==select).map(el=>el.value).filter(v=>v!=="0"):[];
 for(const option of select.options){
  const item=document.createElement("button");
  item.type="button";
  item.className="hub-model-picker-option";
  item.dataset.pickerValue=option.value;
  item.setAttribute("role","radio");
  const selected=option.value===select.value;
  const unavailable=!selected&&otherValues.includes(option.value)&&option.value!=="0";
  item.setAttribute("aria-checked",String(selected));
  item.disabled=unavailable;
  if(unavailable)item.title=t.used;
  const label=document.createElement("span");
  label.className="hub-model-picker-option-label";
  label.textContent=option.textContent;
  const marker=document.createElement("span");
  marker.className="hub-model-picker-radio";
  marker.setAttribute("aria-hidden","true");
  item.append(label,marker);
  list.append(item);
 }
 const trigger=root.querySelector('[data-hub-picker-for="'+key+'"]');
 if(trigger)trigger.setAttribute("aria-expanded","true");
 dialog.showModal();
 const active=list.querySelector('[aria-checked="true"]')||list.querySelector("button:not([disabled])");
 if(active){
  requestAnimationFrame(()=>{if(dialog.open){active.scrollIntoView({block:"nearest"});active.focus({preventScroll:true})}});
 }
}
dialog.querySelector(".hub-model-picker-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
list.addEventListener("click",event=>{
 const button=event.target.closest("button[data-picker-value]");
 if(!button||button.disabled||!activeKey)return;
 const select=findControl(activeKey);
 if(!select){dialog.close();return;}
 const next=button.dataset.pickerValue;
 if(![...select.options].some(opt=>opt.value===next)){dialog.close();return;}
 const changed=next!==select.value;
 dialog.close();
 if(changed){
  select.value=next;
  select.dispatchEvent(new Event("input",{bubbles:true}));
  select.dispatchEvent(new Event("change",{bubbles:true}));
 }
});
dialog.addEventListener("close",()=>{
 const key=activeKey;
 activeKey=null;
 root.querySelectorAll("[data-hub-picker-for]").forEach(b=>b.setAttribute("aria-expanded","false"));
 requestAnimationFrame(()=>{
  hydrate();
  const newTrigger=key?root.querySelector('[data-hub-picker-for="'+key+'"]'):null;
  if(newTrigger)newTrigger.focus({preventScroll:true});
 });
});
document.addEventListener("keydown",e=>{
 if(!dialog.open||!["ArrowDown","ArrowUp"].includes(e.key))return;
 const items=[...list.querySelectorAll("button:not(:disabled)")];
 const idx=items.indexOf(document.activeElement);
 if(!items.length)return;
 e.preventDefault();
 const next=items[(idx+(e.key==="ArrowDown"?1:-1)+items.length)%items.length];
 next.focus({preventScroll:true});
 next.scrollIntoView({block:"nearest"});
});
new MutationObserver(records=>{
 if(records.some(r=>r.attributeName==="lang")&&dialog.open)dialog.close();
}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
new MutationObserver(hydrate).observe(root,{childList:true,subtree:true});
hydrate();
window.NEOLINE_HUB_PICKER={open:showPicker,element:dialog};
})();
