/* Browser regression for the approved NEOLINE Vice Sunset mobile mockup.
   Checks images, premium hero slider, language and classic theme preservation. */
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,430]){
   const context=await browser.newContext({viewport:{width,height:940},isMobile:true,hasTouch:true});
   const page=await context.newPage();
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:35000});
   await page.waitForFunction(()=>document.querySelectorAll(".vice-cinema-frame").length===5,{timeout:12000});
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
   await page.waitForTimeout(950); // settle optional entrance transforms before measuring pixel dimensions
   const status=await page.evaluate(()=>{
    const inspect=e=>({display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility,
      rect:(()=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width,height:r.height}})()});
    const cards=[...document.querySelectorAll("#gameLobby .route-card")];
    return {
      width:innerWidth,documentWidth:document.documentElement.scrollWidth,
      hero:inspect(document.querySelector(".game-hero.theory-dashboard")),
      heroCopy:inspect(document.querySelector(".game-hero .hero-copy")),
      heroArt:inspect(document.querySelector(".game-hero .hero-art")),
      heroStats:inspect(document.querySelector(".game-hero .hero-orbs")),
      lobby:inspect(document.querySelector("#gameLobby")),
      navHeight:document.querySelector(".theory-bottom").getBoundingClientRect().height,
      cards:cards.map(c=>({mode:c.dataset.mode,
        background:getComputedStyle(c.querySelector(".game-mode-photo")).backgroundImage,
        label:c.querySelector("strong").textContent,
        rect:inspect(c).rect})),
      imageLinks:[...document.querySelectorAll(".vice-cinema-frame .vice-cinema-scene")].map(x=>getComputedStyle(x).backgroundImage),
      activeFrame:document.querySelector(".vice-cinema-frame.is-active")?.dataset.slide,
      premiumCssLoaded:[...document.styleSheets].some(x=>x.href?.includes("teoria-vice-cinematic.css")),
      approvedLayoutCssLoaded:[...document.styleSheets].some(x=>x.href?.includes("teoria-vice-reference-match.css")),
      promoStage:inspect(document.querySelector(".vice-cinema-stage")),
      heroFont:getComputedStyle(document.querySelector("#heroTitle")).fontStyle,
      heroTextFill:getComputedStyle(document.querySelector("#heroTitle")).webkitTextFillColor,
      firstPosterImage:getComputedStyle(document.querySelector('.vice-cinema-frame[data-slide="0"] .vice-cinema-scene')).backgroundImage,
      lang:document.documentElement.lang
    };
   });
   const fail=why=>{throw Error(why+" at "+width+"px: "+JSON.stringify(status))};
   if(errors.length)fail("Browser errors: "+errors.join("|"));
   if(!status.premiumCssLoaded||!status.approvedLayoutCssLoaded)fail("New cinematic CSS was not served");
   if(status.documentWidth>width+2)fail("Horizontal overflow");
   if(Math.abs(status.navHeight-62)>2)fail("Approved 62px navigation changed");
   if(status.cards.length!==5)fail("Not five real game modes");
   if(status.cards.some(x=>!x.background.includes("vice-card-")))fail("Any card has flat gradient instead of real illustration");
   if(status.imageLinks.length!==5||status.imageLinks.some(x=>!x.includes("vice-card-")&&!x.includes("vice-approved-protagonists")&&!x.includes("vice-cinematic-duo")))fail("Missing cinematic carousel artwork");
   if(status.promoStage.display==="none"||status.promoStage.rect.height<110)fail("Cinema stage hidden");
   if(status.heroStats.rect.top<status.heroCopy.rect.bottom-4)fail("Top title overlaps the medal HUD");
   if(Math.abs(status.heroArt.rect.width-status.hero.rect.width)>8)fail("Cinema is not a full-width hero banner");
   if(Math.abs(status.heroArt.rect.top-status.heroCopy.rect.top)>30)fail("Hero title isn't layered on the cinematic banner");
   if(status.heroStats.rect.top<status.heroArt.rect.bottom+4)fail("Separate medal strip overlaps the cinematic hero");

   if(status.cards.some(x=>x.rect.height<95))fail("Game card height too short");
   if(status.heroFont!=="italic")fail("Headline not upgraded");
   if(status.heroTextFill==="rgba(0, 0, 0, 0)"||status.heroTextFill==="transparent")fail("Hero title is transparent, cannot be read");
   if(!status.firstPosterImage.includes("vice-cinematic-duo.svg"))fail("First cinematic slide lost the original protagonist artwork");
   if(status.activeFrame!=="0")fail("The neon experience must open on the spectacular first scene");
   const artFiles=[
    "vice-card-city.svg","vice-card-signs.svg","vice-card-exam.svg",
    "vice-card-mistakes.svg","vice-card-marathon.svg","vice-cinematic-duo.svg"
   ];
   const duoPhoto=await page.request.get("http://127.0.0.1:8765/assets/teoria/vice-approved-protagonists.webp");
   if(!duoPhoto.ok()||(await duoPhoto.body()).length<2300)fail("Missing original approved hero duo artwork");
   for(const asset of artFiles){
    const response=await page.request.get("http://127.0.0.1:8765/assets/teoria/"+asset);
    if(!response.ok())fail("Missing art asset "+asset);
    const content=await response.text();
    if(!content.startsWith("<svg")||!content.endsWith("</svg>"))fail("Malformed SVG "+asset);
   }
   await page.locator(".theory-promo-click").click();
   await page.waitForFunction(()=>document.querySelector("#gameGiftDialog")?.open===true);
   await page.locator("#gameGiftClose").click();
   // The existing carousel remains interactive, the original dot click drives
   // both the new cinematic frame and previous slide destination.
   await page.locator('.theory-promo-dot[data-slide="2"]').click();
   await page.waitForFunction(()=>document.querySelector('.vice-cinema-frame.is-active')?.dataset.slide==="2");
   await page.waitForTimeout(850); // finish the carousel mask and text entrance before screenshot
   if(width===390 && process.env.SAVE_CINEMATIC_SCREENSHOTS){
     // Chunked log is review-only; no public media or personal data uploaded.
     await page.screenshot({type:"jpeg",quality:64,path:"/tmp/neoline-vice-390.jpg",fullPage:true});
     const fs=require("node:fs"),jpg=fs.readFileSync("/tmp/neoline-vice-390.jpg").toString("base64");
     console.log("NEOLINE_SCREEN_PARTS_TOTAL:"+Math.ceil(jpg.length/4800));
     for(let i=0;i<jpg.length;i+=4800)console.log("NEOLINE_SCREEN_PART_"+(i/4800)+":"+jpg.slice(i,i+4800));
   }
   const snapshots=[];
   for(const lang of ["ru","en","he","ar"]){
    await page.evaluate(l=>document.documentElement.lang=l,lang);
    await page.waitForTimeout(80); // MutationObserver localization is asynchronous
    snapshots.push(await page.locator('.vice-cinema-frame[data-slide="2"] .vice-cinema-headline').textContent());
   }
   if(new Set(snapshots).size!==4)fail("Missing four-language cinematic copy "+JSON.stringify(snapshots));
   await page.locator(".vice-cinema-arrow--next").click();
   await page.waitForFunction(()=>document.querySelector('.vice-cinema-frame.is-active')?.dataset.slide==="3");
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="off");
   const classic=await page.evaluate(()=>({
     stage:getComputedStyle(document.querySelector(".vice-cinema-stage")).display,
     body:getComputedStyle(document.body).backgroundImage,
     press:document.querySelector("#gtaModeToggle").getAttribute("aria-pressed")
   }));
   if(classic.stage!=="none"||classic.press!=="false")fail("Classic restoration broken");
   console.log("PASS cinematic "+width+"px · 5 illustrated game modes · duo and five slides · 4 languages · classic switch · no overlap");
   await context.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
