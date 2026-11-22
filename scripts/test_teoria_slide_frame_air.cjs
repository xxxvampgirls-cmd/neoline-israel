/* NEOLINE — mobile carousel breathing-space regression.
   All five working slides keep an 6px+ inner gutter; no unrelated theme change. */
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,430]){
   const context=await browser.newContext({viewport:{width,height:800},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",err=>errors.push(err.message));
   await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:35000});
   await page.waitForFunction(()=>document.querySelector(".hero-art.theory-promo-host .theory-promo-dot[data-slide='4']")!==null,{timeout:14000});
   const base=await page.evaluate(()=>({
    css:[...document.styleSheets].some(s=>s.href?.includes("teoria-slide-frame-air.css")),
    theme:document.documentElement.dataset.viceTheme,
    dots:document.querySelectorAll(".theory-promo-host .theory-promo-dot").length
   }));
   if(!base.css||base.theme==="on"||base.dots!==5)
    throw Error("Classic five-slide carousel not ready at "+width+": "+JSON.stringify(base));
   for(let index=0;index<5;index++){
    await page.locator(".theory-promo-host .theory-promo-dot[data-slide='"+index+"']").click();
    await page.waitForTimeout(690);
    const out=await page.evaluate((index)=>{
     const rect=e=>{const a=e.getBoundingClientRect();return {left:a.left,right:a.right,top:a.top,bottom:a.bottom,width:a.width,height:a.height}};
     const host=document.querySelector(".game-hero.theory-dashboard .hero-art.theory-promo-host");
     const card=index===0?host.querySelector(".hero-studio-svg"):host.querySelectorAll(".theory-promo-slide")[index-1];
     const hero=document.querySelector(".game-hero.theory-dashboard");
     const title=document.querySelector("#heroTitle");
     const stats=document.querySelector(".game-hero.theory-dashboard .hero-orbs");
     const computed=getComputedStyle(card);
     return {
      host:rect(host),card:rect(card),stats:rect(stats),title:rect(title),hero:rect(hero),
      active:card.classList.contains("is-active"),image:computed.backgroundImage,
      overflow:document.documentElement.scrollWidth,viewport:innerWidth,
      visible:getComputedStyle(host).visibility
     };
    },index);
    const left=out.card.left-out.host.left,right=out.host.right-out.card.right;
    const top=out.card.top-out.host.top,bottom=out.host.bottom-out.card.bottom;
    if(!out.active||left<5||right<5||top<5||bottom<5)throw Error("No balanced internal padding "+width+" slide "+index+" "+JSON.stringify({left,right,top,bottom,...out}));
    if(out.host.width<Math.min(170,width*.5)||out.host.height<120)throw Error("Carousel frame not enlarged "+width+" slide "+index+" "+JSON.stringify(out));
    if(out.host.left<=out.title.right+3||out.stats.top<out.host.bottom-3)
      throw Error("Slide collides with title/stats "+width+" slide "+index+" "+JSON.stringify(out));
    if(index===4&&!out.image.includes("vice-neon-route-promo.webp"))
      throw Error("Approved neon artwork missing "+width+" "+JSON.stringify(out));
    if(out.overflow>width+3)throw Error("Carousel introduced horizontal scrolling "+width+" "+JSON.stringify(out));
   }
   if(errors.length)throw Error("Browser errors at "+width+": "+errors.join(" | "));
   console.log("PASS airy carousel "+width+"px: all five slides, 6px+ gutters, no title/stats collision");
   await context.close();
  }
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exit(1)});
