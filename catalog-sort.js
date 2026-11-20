/* NEOLINE catalog: custom accessible sort control.
   Avoids Android/Brave dark native-select popup and keeps the site's
   original #sort select as the single source of sorting logic. */
(function () {
  "use strict";

  function setupCatalogSort() {
    const select=document.getElementById("sort");
    const tools=select&&select.closest("#catalog .catalog-tools");
    if(!tools||select.dataset.catalogStyled==="1")return;
    select.dataset.catalogStyled="1";

    const wrap=document.createElement("div");
    wrap.className="catalog-sort-ui";
    select.parentNode.insertBefore(wrap,select);
    wrap.appendChild(select);

    const trigger=document.createElement("button");
    trigger.type="button";
    trigger.id="catalogSortButton";
    trigger.className="catalog-sort-trigger";
    trigger.setAttribute("aria-haspopup","listbox");
    trigger.setAttribute("aria-controls","catalogSortMenu");
    trigger.setAttribute("aria-expanded","false");
    const current=document.createElement("span");
    current.className="catalog-sort-current";
    trigger.appendChild(current);
    const arrow=document.createElementNS("http://www.w3.org/2000/svg","svg");
    arrow.setAttribute("viewBox","0 0 24 24");
    arrow.setAttribute("aria-hidden","true");
    arrow.classList.add("catalog-sort-chevron");
    const path=document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d","m6 9 6 6 6-6");
    arrow.appendChild(path);
    trigger.appendChild(arrow);

    const menu=document.createElement("div");
    menu.id="catalogSortMenu";
    menu.className="catalog-sort-menu";
    menu.setAttribute("role","listbox");
    menu.setAttribute("aria-labelledby","catalogSortButton");
    menu.hidden=true;

    for(const option of select.options){
      const row=document.createElement("button");
      row.type="button";
      row.className="catalog-sort-option";
      row.setAttribute("role","option");
      row.setAttribute("aria-selected","false");
      row.dataset.sortValue=option.value;
      const label=document.createElement("span");
      label.className="catalog-sort-option-label";
      row.appendChild(label);
      const check=document.createElement("span");
      check.className="catalog-sort-check";
      check.setAttribute("aria-hidden","true");
      row.appendChild(check);
      menu.appendChild(row);
    }
    wrap.append(trigger,menu);
    const rows=Array.from(menu.querySelectorAll(".catalog-sort-option"));
    const labels={ru:"Сортировка",en:"Sort",he:"מיון",ar:"ترتيب"};
    function sync(){
      const active=select.value;
      const lang=(document.documentElement.lang||"ru").split("-")[0];
      const label=(labels[lang]||labels.en);
      current.textContent=select.selectedOptions[0]?.textContent?.trim()||"";
      trigger.setAttribute("aria-label",label+": "+current.textContent);
      for(const row of rows){
        const value=row.dataset.sortValue;
        const native=Array.from(select.options).find(o=>o.value===value);
        row.querySelector(".catalog-sort-option-label").textContent=native?.textContent?.trim()||value;
        const on=value===active;
        row.setAttribute("aria-selected",String(on));
        row.classList.toggle("is-selected",on);
      }
    }
    function openMenu(focusOption){
      sync();
      menu.hidden=false;
      trigger.setAttribute("aria-expanded","true");
      wrap.classList.add("is-open");
      if(focusOption){
        const active=rows.find(row=>row.dataset.sortValue===select.value)||rows[0];
        active?.focus({preventScroll:true});
      }
    }
    function closeMenu(restoreFocus){
      menu.hidden=true;
      trigger.setAttribute("aria-expanded","false");
      wrap.classList.remove("is-open");
      if(restoreFocus)trigger.focus({preventScroll:true});
    }

    trigger.addEventListener("click",()=>{
      if(menu.hidden)openMenu(false);
      else closeMenu(false);
    });
    menu.addEventListener("click",e=>{
      const row=e.target.closest("[data-sort-value]");
      if(!row||!menu.contains(row))return;
      select.value=row.dataset.sortValue;
      // Existing renderProducts handler stays authoritative for filtering.
      select.dispatchEvent(new Event("change",{bubbles:true}));
      sync();
      closeMenu(true);
    });
    wrap.addEventListener("keydown",e=>{
      if(e.key==="Escape"&&!menu.hidden){
        e.preventDefault();e.stopPropagation();closeMenu(true);return;
      }
      if(e.key==="Tab"&&!menu.hidden){closeMenu(false);return;}
      const navigation=["ArrowDown","ArrowUp","Home","End"];
      if(!navigation.includes(e.key))return;
      e.preventDefault();
      if(menu.hidden){openMenu(true);return;}
      const index=rows.indexOf(document.activeElement);
      const active=rows.findIndex(row=>row.dataset.sortValue===select.value);
      const start=index<0?Math.max(0,active):index;
      let next=start;
      if(e.key==="ArrowDown")next=(start+1)%rows.length;
      if(e.key==="ArrowUp")next=(start-1+rows.length)%rows.length;
      if(e.key==="Home")next=0;
      if(e.key==="End")next=rows.length-1;
      rows[next]?.focus({preventScroll:true});
    });
    document.addEventListener("pointerdown",e=>{
      if(!menu.hidden&&!wrap.contains(e.target))closeMenu(false);
    });
    document.addEventListener("focusin",e=>{
      if(!menu.hidden&&!wrap.contains(e.target))closeMenu(false);
    });
    select.addEventListener("change",sync);
    // Existing language switch updates each native option's data-i text.
    // Observe those translations so every new label stays synchronized.
    const translations=new MutationObserver(sync);
    translations.observe(select,{subtree:true,childList:true,characterData:true});
    window.addEventListener("pageshow",sync);

    sync();
    // Only hide the platform select AFTER the custom control exists.
    select.classList.add("catalog-sort-native");
    select.tabIndex=-1;
    select.setAttribute("aria-hidden","true");
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",setupCatalogSort,{once:true});
  }else{
    setupCatalogSort();
  }
})();
