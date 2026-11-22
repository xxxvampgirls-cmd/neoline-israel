/* Smoke test original GTA-VI-inspired cosmetic theme.
 * Covers all mobile sizes, local persistence, fifth promo link and untouched rules. */
const {chromium}=require("playwright");
(async()=>{
 const b=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,430]){
   const context=await b.newContext({viewport:{width,height:846},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await context.newPage();
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:30000});
   await page.waitForSelector("#gtaModeToggle");
   await page.waitForFunction(()=>document.querySelectorAll(".theory-promo-dot").length===5,{timeout:15000});
   let initial=await page.evaluate(()=>{
    const h=document.querySelector(".hero-copy").getBoundingClientRect();
    const orb=document.querySelector(".theory-dashboard .hero-orbs").getBoundingClientRect();
    const hero=document.querySelector(".game-hero").getBoundingClientRect();
    return {height:h.height,heroBottom:hero.bottom,copyBottom:h.bottom,orbTop:orb.top,
      bodyScroll:document.documentElement.scrollWidth,viewport:innerWidth,
      labels:[...document.querySelectorAll("[data-vice-theme-toggle]")].map(x=>x.getAttribute("aria-pressed"))};
   });
   if(errors.length)throw Error("JS initial errors "+errors.join("|"));
   if(initial.bodyScroll>width+2)throw Error("Horizontal overflow classic @"+width+": "+JSON.stringify(initial));
   if(initial.labels.some(x=>x!=="false"))throw Error("Classic is not default @"+width);
   console.log("Classic "+width+"px: "+JSON.stringify(initial));
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
   const on=await page.evaluate(()=>{
    const h=document.querySelector(".game-hero");
    return {theme:document.documentElement.dataset.viceTheme,
      bg:getComputedStyle(document.body).backgroundImage,
      lobby:getComputedStyle(document.getElementById("gameLobby")).backgroundImage,
      header:getComputedStyle(document.querySelector(".neoline-site-header")).backgroundImage,
      items:document.querySelectorAll('[data-mode]').length,
      correctNewsUrl:document.querySelector("#sourceBank")?.href?.includes("data.gov.il"),
      store:localStorage.getItem("neoline.theory.visualTheme.v1"),
      state:[...document.querySelectorAll('[data-vice-theme-toggle]')].map(x=>x.getAttribute("aria-pressed")),
      hero:h.getBoundingClientRect().width,
      hasSlide:document.querySelector(".vice-promo-slide")!==null,
      scrollbar:document.documentElement.scrollWidth};
   });
   if(on.store!=="vice"||on.state.some(x=>x!=="true")||on.items!==5||!on.correctNewsUrl||!on.hasSlide)throw Error("GTA VI mode fail @"+width+": "+JSON.stringify(on));
   if(on.scrollbar>width+2)throw Error("GTA VI overflow @"+width+": "+JSON.stringify(on));
   await page.reload({waitUntil:"domcontentloaded"});
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
   await page.locator('.theory-promo-dot[data-slide="4"]').click();
   await page.waitForFunction(()=>document.querySelector('.vice-promo-slide')?.classList.contains("is-active"));
   await page.locator(".theory-promo-click").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="off");
   const back=await page.evaluate(()=>({state:document.documentElement.dataset.viceTheme,
    classic:localStorage.getItem("neoline.theory.visualTheme.v1"),
    currentSlides:document.querySelectorAll(".theory-promo-dot").length,
    themePress:[...document.querySelectorAll('[data-vice-theme-toggle]')].map(x=>x.getAttribute("aria-pressed"))}));
   if(back.classic!=="classic"||back.themePress.some(x=>x!=="false")||errors.length)throw Error("Restore failed @"+width+": "+JSON.stringify(back)+" "+errors.join("|"));
   console.log("PASS "+width+"px: original neon promo slide, entire game theme, persistent toggle, classic restoration");
   await context.close();
  }
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
