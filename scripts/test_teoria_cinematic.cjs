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
      livePosterCssLoaded:[...document.styleSheets].some(x=>x.href?.includes("teoria-vice-live-reference.css")),
      refReady:document.documentElement.classList.contains("vice-reference-ready"),
      cardRefReady:document.documentElement.classList.contains("vice-reference-cards-ready"),
      activePosterSlide:document.querySelector(".game-hero.theory-dashboard")?.dataset.vicePromoSlide,
      titleVisibility:getComputedStyle(document.querySelector("#heroTitle")).visibility,
      finalPolishCssLoaded:[...document.styleSheets].some(x=>x.href?.includes("teoria-vice-final-polish.css")),
      promoStage:inspect(document.querySelector(".vice-cinema-stage")),
      heroFont:getComputedStyle(document.querySelector("#heroTitle")).fontStyle,
      heroTextFill:getComputedStyle(document.querySelector("#heroTitle")).webkitTextFillColor,
      firstPosterImage:getComputedStyle(document.querySelector('.vice-cinema-frame[data-slide="0"] .vice-cinema-scene')).backgroundImage,
      firstPosterPhoto:getComputedStyle(document.querySelector('.vice-cinema-frame[data-slide="0"] .vice-cinema-scene'),"::before").backgroundImage,
      firstPosterAccents:getComputedStyle(document.querySelector('.vice-cinema-frame[data-slide="0"] .vice-cinema-scene'),"::after").backgroundImage,
      lang:document.documentElement.lang
    };
   });
   const fail=why=>{throw Error(why+" at "+width+"px: "+JSON.stringify(status))};
   if(errors.length)fail("Browser errors: "+errors.join("|"));
   if(!status.premiumCssLoaded||!status.approvedLayoutCssLoaded||!status.finalPolishCssLoaded||!status.livePosterCssLoaded)fail("Final cinematic stylesheet was not served");
   if(status.documentWidth>width+2)fail("Horizontal overflow");
   if(Math.abs(status.navHeight-62)>2)fail("Approved 62px navigation changed");
   if(status.cards.length!==5)fail("Not five real game modes");
   if(!status.cardRefReady||status.cards.some(x=>!x.background.includes("vice-reference-card-sprite.avif")))fail("Approved photographic game cards did not load");
   if(status.imageLinks.length!==5||status.imageLinks.some(x=>!x.includes("vice-card-")&&!x.includes("vice-approved-protagonists")&&!x.includes("vice-cinematic-duo")&&!x.includes("vice-cinematic-backdrop")&&!x.includes("vice-hero-reference")&&!x.includes("vice-hd-")&&!x.includes("vice-sunset-boulevard.svg")))fail("Missing cinematic carousel artwork");
   if(!status.imageLinks[1]?.includes("vice-sunset-boulevard.svg"))
    fail("Second neon slide still shows old giant route instead of the redesigned boulevard");
   if(![...status.imageLinks].every(Boolean))fail("At least one promotional slide has no artwork");
   if(status.promoStage.display==="none"||status.promoStage.rect.height<110)fail("Cinema stage hidden");
   if(status.heroStats.rect.top<status.heroCopy.rect.bottom-4)fail("Top title overlaps the medal HUD");
   if(Math.abs(status.heroArt.rect.width-status.hero.rect.width)>8)fail("Cinema is not a full-width hero banner");
   if(Math.abs(status.heroArt.rect.top-status.heroCopy.rect.top)>30)fail("Hero title isn't layered on the cinematic banner");
   if(status.heroStats.rect.top<status.heroArt.rect.bottom+4)fail("Separate medal strip overlaps the cinematic hero");

   if(status.cards.some(x=>x.rect.height<(x.mode==="marathon"?80:95)))fail("Game card height too short");
   if(status.cards.some(x=>x.mode!=="marathon"&&x.rect.height>145))fail("Mode cards are too tall for the approved mobile layout");
   if(status.heroFont!=="italic")fail("Headline not upgraded");
   if(status.heroTextFill==="rgba(0, 0, 0, 0)"||status.heroTextFill==="transparent")fail("Hero title is transparent, cannot be read");
   if(!status.refReady||!status.firstPosterImage.includes("vice-hero-reference.avif")||status.activePosterSlide!=="0"||status.titleVisibility!=="hidden")fail("Original reference hero did not replace redundant layers");
   if(width===390){
    await page.setViewportSize({width,height:780});
    await page.waitForTimeout(110);
    const compact=await page.evaluate(()=>{
     const last=document.querySelector('#gameLobby .routes .route-full').getBoundingClientRect();
     const dock=document.querySelector('.theory-bottom').getBoundingClientRect();
     const first=document.querySelector('#gameLobby .routes .route-card:not(.route-full)').getBoundingClientRect();
     return {lastBottom:last.bottom,dockTop:dock.top,cardHeight:first.height,scroll:document.documentElement.scrollWidth};
    });
    if(compact.scroll>width+2||compact.cardHeight>103||compact.lastBottom>compact.dockTop+3)fail("Short Android phone cannot view all five modes before navigation: "+JSON.stringify(compact));
    await page.setViewportSize({width,height:940});
   }
   if(status.activeFrame!=="0")fail("The neon experience must open on the spectacular first scene");
   const artFiles=[
    "vice-card-city.svg","vice-card-signs.svg","vice-card-exam.svg",
    "vice-card-mistakes.svg","vice-card-marathon.svg","vice-cinematic-duo.svg","vice-cinematic-backdrop.svg","vice-hero-highlights.svg","vice-hd-city.svg","vice-hd-signs.svg","vice-hd-exam.svg","vice-hd-mistakes.svg","vice-hd-marathon.svg","vice-sunset-boulevard.svg"
   ];
   const cardsReference=await page.request.get("http://127.0.0.1:8765/assets/teoria/vice-reference-card-sprite.avif");
   if(!cardsReference.ok()||(await cardsReference.body()).length<5000)fail("Approved interactive card image sheet missing");
   const originalPoster=await page.request.get("http://127.0.0.1:8765/assets/teoria/vice-hero-reference.avif");
   if(!originalPoster.ok()||(await originalPoster.body()).length<4500)fail("Approved local AVIF artwork is missing");
   const duoPhoto=await page.request.get("http://127.0.0.1:8765/assets/teoria/vice-approved-protagonists.webp");
   if(!duoPhoto.ok()||(await duoPhoto.body()).length<2300)fail("Missing original approved hero duo artwork");
   for(const asset of artFiles){
    const response=await page.request.get("http://127.0.0.1:8765/assets/teoria/"+asset);
    if(!response.ok())fail("Missing art asset "+asset);
    const content=await response.text();
    if(!content.startsWith("<svg")||!content.endsWith("</svg>"))fail("Malformed SVG "+asset);
    if(asset.startsWith("vice-hd-")&&!content.includes("data:image/webp;base64,"))fail("HD composite lacks its local photo: "+asset);
   }
   // The screenshot-faithful gift glyph still has an actual transparent
   // button over its exact position: it must work without force-clicks.
   await page.locator("#gameGiftTrigger").click();
   await page.waitForFunction(()=>document.querySelector("#gameGiftDialog")?.open===true);
   await page.locator("#gameGiftClose").click();
   await page.locator(".theory-promo-click").click();
   await page.waitForFunction(()=>document.querySelector("#gameGiftDialog")?.open===true);
   await page.locator("#gameGiftClose").click();
   // Verify the revised second frame is selectable with the same real dots.
   await page.locator('.theory-promo-dot[data-slide="1"]').click();
   await page.waitForFunction(()=>document.querySelector('.vice-cinema-frame.is-active')?.dataset.slide==="1");
   if(width===390 && process.env.SAVE_BOULEVARD_SCREENSHOTS){
     await page.waitForTimeout(700);
     const jpg=(await page.screenshot({type:"jpeg",quality:67,fullPage:false})).toString("base64");
     console.log("NEOLINE_BOULEVARD_SCREEN_PARTS_TOTAL:"+Math.ceil(jpg.length/4800));
     for(let i=0;i<jpg.length;i+=4800)console.log("NEOLINE_BOULEVARD_SCREEN_PART_"+(i/4800)+":"+jpg.slice(i,i+4800));
   }
   // The existing carousel remains interactive, the original dot click drives
   // both the new cinematic frame and previous slide destination.
   await page.locator('.theory-promo-dot[data-slide="2"]').click();
   await page.waitForFunction(()=>document.querySelector('.vice-cinema-frame.is-active')?.dataset.slide==="2");
   await page.waitForTimeout(850); // finish the carousel mask and text entrance before screenshot
   if(width===390 && process.env.SAVE_CINEMATIC_SCREENSHOTS){
     await page.locator('.theory-promo-dot[data-slide="0"]').click();
     await page.setViewportSize({width,height:780});
     await page.waitForTimeout(850);
     // Chunked log is review-only; no public media or personal data uploaded.
     await page.screenshot({type:"jpeg",quality:70,path:"/tmp/neoline-vice-390.jpg",fullPage:false});
     const fs=require("node:fs"),jpg=fs.readFileSync("/tmp/neoline-vice-390.jpg").toString("base64");
     console.log("NEOLINE_SCREEN_PARTS_TOTAL:"+Math.ceil(jpg.length/4800));
     for(let i=0;i<jpg.length;i+=4800)console.log("NEOLINE_SCREEN_PART_"+(i/4800)+":"+jpg.slice(i,i+4800));
     await page.setViewportSize({width,height:940});
     await page.locator('.theory-promo-dot[data-slide="2"]').click();
   }
   const snapshots=[];
   for(const lang of ["ru","en","he","ar"]){
    await page.evaluate(l=>document.documentElement.lang=l,lang);
    await page.waitForTimeout(80); // MutationObserver localization is asynchronous
    snapshots.push(await page.locator('.vice-cinema-frame[data-slide="2"] .vice-cinema-headline').textContent());
   }
   if(new Set(snapshots).size!==4)fail("Missing four-language cinematic copy "+JSON.stringify(snapshots));
   await page.evaluate(()=>document.documentElement.lang="en");
   const nonRussian=await page.evaluate(()=>({
     heroImage:getComputedStyle(document.querySelector('.vice-cinema-frame[data-slide="0"] .vice-cinema-scene')).backgroundImage,
     titleVisible:getComputedStyle(document.querySelector('#heroTitle')).visibility
   }));
   if(nonRussian.heroImage.includes("vice-hero-reference.avif")||nonRussian.titleVisible!=="visible")fail("Translated text is hidden behind Russian-only poster");
   const otherCards=await page.evaluate(()=>getComputedStyle(document.querySelector('#gameLobby .route-blue .game-mode-photo')).backgroundImage);
   if(otherCards.includes("vice-reference-card-sprite.avif"))fail("Russian-only exam prop leaked into translated mode");
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
