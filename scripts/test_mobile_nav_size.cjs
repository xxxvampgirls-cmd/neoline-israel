/* Check screenshot-sized five-tab dock on every existing NEOLINE page.
 * Uses local static server, no external feeds or Cloudflare deploy required. */
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const pages=[
   ["index.html",".mobile-nav"],["news.html",".news-bottom"],
   ["hot.html",".news-bottom"],["delivery.html",".delivery-nav"],
   ["teoria.html",".theory-bottom"]
  ];
  for(const width of [320,390,430]){
   for(const [path,selector] of pages){
    const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});
    try{
     await page.goto("http://127.0.0.1:8765/"+path,{waitUntil:"domcontentloaded",timeout:20000});
     await page.waitForFunction(selector=>{const n=document.querySelector(selector);return n&&Math.abs(n.getBoundingClientRect().height-62)<1.6},selector,{timeout:15000});
     const d=await page.evaluate(selector=>{
      const nav=document.querySelector(selector),r=nav.getBoundingClientRect(),nodes=[...nav.children].filter(n=>n.matches("a,button"));
      const items=nodes.map(n=>{
       const b=n.getBoundingClientRect(),svg=n.querySelector("svg"),icon=svg?.getBoundingClientRect();
       const span=[...n.children].find(el=>el.tagName==="SPAN"&&!el.classList.contains("mobile-icon"));
       return {width:b.width,height:b.height,top:b.top,svg:icon?.width,
        label:span?.textContent?.trim(),labelSize:span?getComputedStyle(span).fontSize:null,
        active:n.classList.contains("neoline-current")||n.classList.contains("active")||n.hasAttribute("aria-current")};
      });
      return {dockHeight:r.height,dockWidth:r.width,dockBottom:r.bottom,vh:innerHeight,
       cols:getComputedStyle(nav).gridTemplateColumns,items,
       cssLoaded:[...document.styleSheets].some(s=>s.href?.includes("nav-unified-size.css?v=20261122-news-bar-exact-v2"))};
     },selector);
     const fail=why=>{throw Error(path+" @"+width+"px "+why+"\n"+JSON.stringify(d))};
     if(!d.cssLoaded)fail("shared dock CSS not loaded");
     if(Math.abs(d.dockHeight-62)>1)fail("dock is not 62px");
     if(Math.abs(d.dockWidth-width)>2)fail("dock not full viewport width");
     if(Math.abs(d.dockBottom-d.vh)>2)fail("dock not fixed to bottom");
     if(d.items.length!==5)fail("expected exactly five menu actions");
     if(d.items.some(x=>Math.abs(x.height-46)>1))fail("different active/tap tile heights");
     if(d.items.some(x=>Math.abs(x.width-(width-8)/5)>2))fail("different menu column widths");
     if(d.items.some(x=>Math.abs(x.svg-26)>1))fail("different icon dimensions");
     if(d.items.some(x=>x.labelSize!=="11px"||!x.label))fail("different labels");
     if(d.items.filter(x=>x.active).length!==1)fail("exactly one active tab required");
     console.log("PASS "+path+" "+width+"px: 62px dock / 46px tile / 26px icon / 11px labels");
    }finally{await page.close()}
   }
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
