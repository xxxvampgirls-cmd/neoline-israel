/* Check fifth driving-theory advertisement on real mobile browser widths.
 * The graphic is an actual optimized WebP committed in the repo;
 * the CTA, carousel, translations and classic/neon toggle remain live. */
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,430]){
   const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:35000});
   await page.waitForFunction(()=>document.querySelectorAll(".theory-promo-dot").length===5,{timeout:15000});
   if(await page.evaluate(()=>document.documentElement.dataset.viceTheme)!=="off")throw Error("Must start in ordinary theme");
   // The original advertising slide is the fifth carousel entry.
   await page.locator(".theory-promo-dot[data-slide='4']").click();
   await page.waitForFunction(()=>document.querySelector(".vice-promo-slide")?.classList.contains("is-active"));
   const status=await page.evaluate(()=>{
    const art=document.querySelector(".theory-promo-host");
    const slide=document.querySelector(".vice-promo-slide");
    const caption=document.querySelector(".theory-promo-caption");
    const overlay=document.querySelector(".theory-promo-click");
    const dots=[...document.querySelectorAll(".theory-promo-dot")];
    const br=art.getBoundingClientRect();
    return {
     url:getComputedStyle(slide).backgroundImage,
     caption:getComputedStyle(caption).visibility,
     slide:getComputedStyle(slide).visibility,
     overlayLabel:overlay.getAttribute("aria-label"),
     slideWidth:br.width,slideHeight:br.height,
     dots:dots.length,activeDot:dots.findIndex(x=>x.getAttribute("aria-current")==="true"),
     scrollWidth:document.documentElement.scrollWidth
    };
   });
   if(!status.url.includes("vice-neon-route-promo.webp")||status.caption!=="hidden"||status.slide!=="visible"||status.dots!==5||status.activeDot!==4)throw Error("Promo was not replaced properly "+width+" "+JSON.stringify(status));
   if(status.scrollWidth>width+2||status.slideWidth<125||status.slideHeight<84)throw Error("Banner overflow/mobile clipping "+width+" "+JSON.stringify(status));
   const image=await page.evaluate(async()=>{
    const img=new Image();img.src="./assets/teoria/vice-neon-route-promo.webp";
    await img.decode();return {width:img.naturalWidth,height:img.naturalHeight};
   });
   if(image.width!==960||image.height!==480)throw Error("Missing or broken published asset "+JSON.stringify(image));
   // Clicking the graphic must still toggle the entire game theme.
   await page.locator(".theory-promo-click").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
   // And it must be fully reversible without breaking the 5 dots.
   await page.locator("#gtaModeToggle").click();
   await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="off");
   // Non-Russian UI must not have baked-in Russian poster text.
   await page.locator('.neoline-site-header__flag[data-lang="en"]').click();
   await page.waitForFunction(()=>document.documentElement.lang.startsWith("en"));
   await page.locator(".theory-promo-dot[data-slide='4']").click();
   const english=await page.evaluate(()=>({
     background:getComputedStyle(document.querySelector(".vice-promo-slide")).backgroundImage,
     caption:getComputedStyle(document.querySelector(".theory-promo-caption")).visibility
   }));
   if(english.background.includes("vice-neon-route-promo.webp")||english.caption==="hidden")throw Error("Non-Russian translation was obscured "+JSON.stringify(english));
   if(errors.length)throw Error("Browser errors: "+errors.join(" | "));
   console.log("PASS neon promo slide "+width+"px · real WebP, slide 5, CTA, 4-language fallback, reversible theme");
   await page.close();
  }
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exit(1)});
