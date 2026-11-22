/* Test actual 40-minute exam countdown and both visible time indicators,
   avoiding a second timer or changes to the question bank. */
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,430]){
   const context=await browser.newContext({viewport:{width,height:780},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:35000});
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="off"&&document.getElementById("dock4Hearts"),{timeout:15000});
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
   await page.waitForFunction(()=>document.querySelector('[data-mode="exam"]')&&!document.querySelector('[data-mode="exam"]').disabled,{timeout:20000});
   await page.locator('[data-mode="exam"]').click();
   await page.waitForFunction(()=>!document.getElementById("gamePlaying").hidden && document.getElementById("dock4Hearts").dataset.exam==="true",{timeout:15000});
   await page.waitForFunction(()=>!!document.querySelector("#dock4Hearts .vice-exam-clock")&&!!document.querySelector("#gamePlaying .vice-quiz-timer.is-live"),{timeout:8000});
   const state=await page.evaluate(()=>{
     const heart=document.getElementById("dock4Hearts"),clock=heart.querySelector(".vice-exam-clock");
     const chip=document.querySelector(".vice-quiz-timer");
     const map=document.getElementById("dock4Progress");
     const d=clock.getBoundingClientRect(),m=map.getBoundingClientRect();
     return {
      current:document.getElementById("timer").textContent.trim(),
      mirror:chip.textContent.trim(),
      width:d.width,height:d.height,level:heart.dataset.timeLevel,
      angle:heart.style.getPropertyValue("--vice-clock-angle"),
      ui:getComputedStyle(clock).display,chipDisplay:getComputedStyle(chip).display,
      dockWidth:document.getElementById("theoryGameDock").getBoundingClientRect().width,
      navWidth:document.documentElement.scrollWidth,
      mapCenter:(m.left+m.right)/2,viewport:innerWidth,
      title:heart.getAttribute("aria-label")
     }
   });
   if(!/^\d{2}:\d{2}$/.test(state.current)||!state.mirror.includes(state.current)||state.width<35||state.height<35||state.ui==="none"||state.chipDisplay==="none"||state.navWidth>width+2||Math.abs(state.mapCenter-width/2)>4)
    throw Error("Exam timer indicators failed "+width+" "+JSON.stringify(state));
   if(!state.title?.includes(state.current)||state.level!=="normal")throw Error("Timer must report real remaining seconds "+width+" "+JSON.stringify(state));
   // Timer already runs in the game engine; watch its authoritative 1-second tick.
   const before=state.current;
   await page.waitForFunction(before=>document.getElementById("timer").textContent.trim()!==before,{timeout:2300},before);
   await page.waitForFunction(()=>document.querySelector(".vice-quiz-timer")?.textContent.includes(document.getElementById("timer").textContent.trim()),{timeout:1500});
   // Exercise warning levels using DOM display text only, NOT engine deadlines.
   await page.evaluate(()=>{document.getElementById("timer").textContent="04:59"});
   await page.waitForFunction(()=>document.getElementById("dock4Hearts").dataset.timeLevel==="warning"&&document.querySelector(".vice-quiz-timer").dataset.timeLevel==="warning");
   await page.evaluate(()=>{document.getElementById("timer").textContent="00:45"});
   await page.waitForFunction(()=>document.getElementById("dock4Hearts").dataset.timeLevel==="critical"&&document.querySelector(".vice-quiz-timer").dataset.timeLevel==="critical");
   await page.evaluate(()=>{document.getElementById("timer").textContent="21:07"});
   await page.waitForFunction(()=>document.getElementById("dock4Hearts").dataset.timeLevel==="normal");
   // Switch visual theme mid-exam: classic presentation must return untouched.
   await page.evaluate(()=>{document.documentElement.dataset.viceTheme="off"});
   await page.waitForFunction(()=>document.querySelector("#dock4Hearts > span").textContent==="⏱"&&!document.querySelector(".vice-quiz-timer").classList.contains("is-live"));
   await page.evaluate(()=>{document.documentElement.dataset.viceTheme="on"});
   await page.waitForFunction(()=>!!document.querySelector("#dock4Hearts .vice-exam-clock"));
   if(errors.length)throw Error("Javascript "+width+": "+errors.join(" | "));
   console.log("PASS active-exam-clock "+width+"px — large live dial, original ticking timer, 5m/1m warnings, classic restoration");
   await context.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
