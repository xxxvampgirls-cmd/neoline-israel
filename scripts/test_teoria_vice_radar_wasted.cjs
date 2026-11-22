/* Browser smoke test: the neon game HUD is live, compact and reversible.
   Tests final CSS plus real progress-event wiring on common Android widths. */
const {chromium}=require("playwright");
async function capture(page,label){
 if(!process.env.NEOLINE_RADAR_CAPTURE)return;
 const raw=(await page.screenshot({type:"jpeg",quality:65,fullPage:false})).toString("base64");
 console.log("NEOLINE_RADAR_"+label+"_TOTAL:"+Math.ceil(raw.length/4800));
 for(let i=0;i<raw.length;i+=4800)console.log("NEOLINE_RADAR_"+label+"_PART_"+(i/4800)+":"+raw.slice(i,i+4800));
}

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,430]){
   const ctx=await browser.newContext({viewport:{width,height:780},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await ctx.newPage();
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:35000});
   await page.waitForFunction(()=>document.getElementById("dock4Progress")?.querySelector(".vice-radar-map"),{timeout:15000});
   const classic=await page.evaluate(()=>({
    visible:getComputedStyle(document.querySelector("#dock4Progress .vice-radar-map")).display,
    classicTheme:document.documentElement.dataset.viceTheme
   }));
   if(classic.visible!=="none"||classic.classicTheme!=="off")throw Error("Classic radar must remain hidden "+JSON.stringify(classic));
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
   await page.waitForFunction(()=>document.querySelector('[data-mode="route"]')&&!document.querySelector('[data-mode="route"]').disabled,{timeout:18000});
   await page.locator('[data-mode="route"]').click();
   await page.waitForFunction(()=>!document.getElementById("gamePlaying").hidden && !document.getElementById("theoryGameDock").hidden,{timeout:10000});
   await page.waitForTimeout(180);
   let h=await page.evaluate(()=>{
    const box=el=>{let r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
    const dock=document.getElementById("theoryGameDock");
    const route=document.querySelector("#gamePlaying .quiz-hud .game-quiz-route.road9");
    const radar=document.querySelector("#dock4Progress .vice-radar-map");
    const topbar=document.querySelector("#gamePlaying .quiz-hud");
    const question=document.querySelector("#gamePlaying .question-card");
    return {
      dock:box(dock),radar:box(radar),topbar:box(topbar),question:box(question),
      heroVisible:getComputedStyle(document.querySelector(".game-hero.theory-dashboard")).display,
      modeTitle:document.querySelector(".vice-hud-title")?.textContent,
      dockVisible:getComputedStyle(dock).display,
      routeVisible:getComputedStyle(route).display,
      radarVisible:getComputedStyle(radar).display,
      siteNav:getComputedStyle(document.getElementById("theoryBottomNav")).display,
      scrollWidth:document.documentElement.scrollWidth,
      bodySession:document.body.classList.contains("theory-in-session"),
      hasXP:!!document.getElementById("dock4XP"),
      hasHearts:!!document.getElementById("dock4Hearts"),
      hasHint:!!document.getElementById("dock4Hint")
    };
   });
   if(errors.length)throw Error("Browser JS error "+errors.join("|"));
   if(h.scrollWidth>width+2||h.dock.left<0||h.dock.right>width+2)throw Error("HUD horizontal overflow "+width+" "+JSON.stringify(h));
   if(h.routeVisible!=="none"||h.radarVisible==="none"||h.topbar.height>47||h.dock.height<69||!h.bodySession)throw Error("Wrong in-game HUD "+width+" "+JSON.stringify(h));
   if(h.heroVisible!=="none"||h.question.top>160||!h.modeTitle)throw Error("Lobby dashboard leaked above an active question "+width+" "+JSON.stringify(h));
   if(!h.hasXP||!h.hasHearts||!h.hasHint||h.siteNav!=="none")throw Error("Lost working HUD buttons "+width+" "+JSON.stringify(h));
   // Actual quiz engine reports these values via neoline:theory-quiz.
   await page.evaluate(()=>window.dispatchEvent(new CustomEvent("neoline:theory-quiz",{
     detail:{done:4,total:10,earned:45,lives:1,hintsLeft:2,mode:"route"}
   })));
   let progress=await page.evaluate(()=>({
     map:document.querySelector("#dock4Progress .vice-radar-map").dataset.progress,
     num:document.getElementById("dock4Count").textContent,
     xp:document.getElementById("dock4XP").textContent,
     hearts:document.getElementById("dock4Hearts").textContent,
     hints:document.getElementById("dock4HintCount").textContent
   }));
   if(progress.map!=="40"||progress.num!=="4/10"||progress.xp!=="+45 XP"||!progress.hearts.includes("♥")||progress.hints!=="2")throw Error("HUD desynced "+width+" "+JSON.stringify(progress));
   if(width===390)await capture(page,"HUD");
   // Trigger existing overlay's public DOM state to check the cinematic
   // composition without modifying official question-bank progress.
   await page.evaluate(()=>{
    document.getElementById("gameOver").hidden=false;
    document.body.classList.add("game-over-open");
    window.dispatchEvent(new CustomEvent("neoline:theory-finish",{detail:{gameOver:true}}));
   });
   await page.waitForFunction(()=>document.getElementById("gameOverTitle").textContent==="ПОТРАЧЕНО");
   let wasted=await page.evaluate(()=>{
    const e=document.getElementById("gameOver");
    const css=getComputedStyle(e.querySelector(".gameover-backdrop"));
    const h=document.getElementById("gameOverTitle");
    return {title:h.textContent,headingHeight:h.getBoundingClientRect().height,blur:css.backdropFilter,
      bg:getComputedStyle(e.querySelector(".gameover-card")).backgroundColor,
      promo:getComputedStyle(e.querySelector(".gameover-promo")).display,
      retries:[document.getElementById("gameOverRetry").disabled,document.getElementById("gameOverModes").disabled],
      overflow:document.documentElement.scrollWidth};
   });
   if(!wasted.blur.includes("blur")||wasted.promo!=="none"||wasted.headingHeight<42||wasted.retries.includes(true)||wasted.overflow>width+2)
    throw Error("WASTED overlay check "+width+" "+JSON.stringify(wasted));
   await page.waitForTimeout(650); // Wait for cinematic headline to become visible before screenshot.
   if(width===390)await capture(page,"WASTED");
   await page.evaluate(()=>{document.documentElement.lang="en"});
   await page.waitForFunction(()=>document.getElementById("gameOverTitle").textContent==="WASTED");
   await page.locator("#gameOverModes").click();
   await page.waitForFunction(()=>document.getElementById("gameOver").hidden && document.getElementById("gamePlaying").hidden);
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="off"&&document.getElementById("gameOverTitle").textContent==="GAME OVER");
   if(errors.length)throw Error("JS errors "+width+": "+errors.join("|"));
   console.log("PASS vice-radar-wasted "+width+"px — GPS route+progress, XP/hearts/hints, WASTED blur, locale, classic restoration");
   await ctx.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
