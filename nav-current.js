/* Keep the same active blue navigation tile on every NEOLINE section.
 * Landing page changes between Home and Catalog by scroll position.
 * The fifth tab is Game / Theory, and basket stays available in header.
 */
(function () {
  "use strict";
  const nav = document.querySelector(".mobile-nav,.news-bottom,.delivery-nav,.theory-bottom");
  if (!nav) return;
  // Cloudflare Pages serves clean URLs (/delivery, /news) as well as
  // their .html counterparts. Compare the normalized route, not just .html.
  const pathname = location.pathname.replace(/\/+$/,"").toLowerCase();
  const filename = pathname.split("/").pop() || "index";
  const page = filename.replace(/\.html?$/,"");
  // Nav structure is a safe fallback when a page uses a clean/rewrite URL.
  const mainPage = page === "index" || nav.classList.contains("mobile-nav");
  const newsPage = page === "news" || nav.classList.contains("news-bottom");
  const deliveryPage = page === "delivery" || nav.classList.contains("delivery-nav");
  const theoryPage = page === "teoria" || nav.classList.contains("theory-bottom");
  const selectors = nav.classList.contains("mobile-nav") ? {
    home: '[data-scroll="top"]',
    catalog: '[data-scroll="catalog"]',
    news: "#openNewsMobile",
    delivery: "#mobileDelivery",
    game: "#mobileGame"
  } : nav.classList.contains("news-bottom") ? {
    home:"#newsHome",catalog:"#newsCatalog",news:"#newsNews",delivery:"#newsDelivery",game:"#newsGame"
  } : nav.classList.contains("delivery-nav") ? {
    home:"#deliveryNavHome",catalog:"#deliveryNavCatalog",news:"#deliveryNavNews",delivery:"#deliveryNavDelivery",game:"#deliveryNavGame"
  } : {
    home:"#theoryNavHome",catalog:"#theoryNavCatalog",news:"#theoryNavNews",
    delivery:"#theoryNavDelivery",game:"#theoryNavGame"
  };
  const items={};
  for (const [name,selector] of Object.entries(selectors)) {
    const item=nav.querySelector(selector);
    if (item) items[name]=item;
  }
  let current=null;
  let lastClick=0;
  let preferred=null;
  function activate(name) {
    if (!items[name]) return;
    current=name;
    for (const [key,item] of Object.entries(items)) {
      const selected=key===name;
      item.classList.toggle("neoline-current",selected);
      item.classList.toggle("active",selected);
      if (selected) item.setAttribute("aria-current",
        ((mainPage && name==="home") || (newsPage&&name==="news") ||
         (deliveryPage&&name==="delivery")||(theoryPage&&name==="game"))?"page":"location");
      else item.removeAttribute("aria-current");
    }
  }
  function activeOnLanding() {
    const catalog=document.getElementById("catalog");
    const viewportMarker=Math.min(155,window.innerHeight*.28);
    if (catalog) {
      const rect=catalog.getBoundingClientRect();
      if (rect.top<=viewportMarker && rect.bottom>viewportMarker) return "catalog";
    }
    return "home";
  }
  function refresh() {
    if (mainPage) {
      if (preferred && Date.now()-lastClick<1050) {
        activate(preferred);
        return;
      }
      preferred=null;
      activate(activeOnLanding());
    } else activate(newsPage?"news":deliveryPage?"delivery":theoryPage?"game":"home");
  }
  nav.addEventListener("click",event=>{
    const target=event.target.closest("a,button");
    if (!target || !nav.contains(target)) return;
    const key=Object.keys(items).find(k=>items[k]===target);
    if(!key)return;
    preferred=key;
    lastClick=Date.now();
    activate(key);
    if (mainPage && (key==="catalog"||key==="home"))
      window.setTimeout(refresh,1150);
  },true);
  if(mainPage){
    let scrollQueued=false;
    window.addEventListener("scroll",()=>{
      if(scrollQueued)return;
      scrollQueued=true;
      requestAnimationFrame(()=>{scrollQueued=false;refresh()});
    },{passive:true});
    window.addEventListener("hashchange",()=>{
      if(location.hash==="#catalog"){preferred="catalog";lastClick=Date.now()}
      refresh();
    });
    const drawer=document.getElementById("drawer");
    if(drawer) new MutationObserver(()=>{preferred=null;refresh()})
      .observe(drawer,{attributes:true,attributeFilter:["class"]});
    // Links to "cart" from other sections must open the actual drawer.
    if(new URLSearchParams(location.search).get("panel")==="cart") {
      window.setTimeout(()=>{
        if(typeof window.openDrawer==="function" && !drawer?.classList.contains("open"))
          window.openDrawer("cart");
        preferred=null;
        refresh();
      },0);
    }
    if(location.hash==="#catalog"){
      preferred="catalog";lastClick=Date.now();
    }
  }
  window.addEventListener("pageshow",refresh);
  refresh();
})();
