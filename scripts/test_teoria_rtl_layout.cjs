/* NEOLINE Israel: RTL (Hebrew + Arabic) visual safety on all five
 * GTA-style carousel slides and five live game cards. Chrome mobile. */
const {chromium}=require("playwright");
const widths=[320,390,430];
const langs=["he","ar"];
function overlap(a,b){
 return !!a&&!!b&&Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))>2
   &&Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top))>2;
}
async function capture(page,lang,name){
 if(!process.env.NEOLINE_RTL_SCREENSHOTS)return;
 const raw=(await page.screenshot({type:"jpeg",quality:62,fullPage:false})).toString("base64");
 const key="NEOLINE_RTL_"+lang.toUpperCase()+"_"+name.toUpperCase();
 console.log(key+"_TOTAL:"+Math.ceil(raw.length/4800));
 for(let i=0;i<raw.length;i+=4800)console.log(key+"_PART_"+(i/4800)+":"+raw.slice(i,i+4800));
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of widths){
   for(const lang of langs){
    const ctx=await browser.newContext({viewport:{width,height:852},isMobile:true,hasTouch:true,deviceScaleFactor:1});
    const page=await ctx.newPage(),errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto("http://127.0.0.1:8765/teoria.html",{waitUntil:"domcontentloaded",timeout:35000});
    await page.waitForFunction(()=>document.querySelectorAll(".theory-promo-dot").length===5,{timeout:20000});
    await page.locator('.neoline-site-header__flag[data-lang="'+lang+'"]').click();
    await page.waitForFunction(lang=>document.documentElement.lang===lang&&document.documentElement.dir==="rtl",lang);
    await page.locator("#gtaModeToggle").click();
    await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="on");
    await page.waitForFunction(()=>document.querySelector(".vice-cinema-frame.is-active .vice-cinema-story"),{timeout:20000});
    const source=await page.evaluate(()=>({
      loaded:[...document.styleSheets].some(s=>s.href?.includes("teoria-rtl-layout-fix.css")),
      rtl:document.documentElement.dir,lang:document.documentElement.lang,
      width:document.documentElement.scrollWidth
    }));
    if(!source.loaded||source.rtl!=="rtl"||source.lang!==lang)throw Error("RTL stylesheet/lang not loaded "+width+" "+lang+" "+JSON.stringify(source));
    for(let index=0;index<5;index++){
     await page.evaluate(index=>document.querySelector('.theory-promo-dot[data-slide="'+index+'"]')?.click(),index);
     await page.waitForFunction(index=>document.querySelector('.vice-cinema-frame.is-active')?.dataset.slide===String(index),index);
     const geometry=await page.evaluate(()=>{
      const rect=e=>{let r=e?.getBoundingClientRect();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null};
      const hero=document.querySelector(".game-hero.theory-dashboard");
      const title=document.getElementById("heroTitle");
      const story=document.querySelector(".vice-cinema-frame.is-active .vice-cinema-story");
      const label=story.querySelector(".vice-cinema-headline");
      const headline=document.querySelector(".hero-copy");
      const frame=document.querySelector(".hero-art.theory-promo-host");
      return {hero:rect(hero),title:rect(title),promo:rect(story),label:rect(label),
       headline:rect(headline),frame:rect(frame),titleText:title.innerText,
       promoText:label.innerText,scroll:document.documentElement.scrollWidth,
       promoClient:story.clientHeight,promoScroll:story.scrollHeight,
       titleClient:title.clientHeight,titleScroll:title.scrollHeight};
     });
     if(overlap(geometry.title,geometry.promo)||overlap(geometry.headline,geometry.promo))
       throw Error("RTL overlap hero title / promo "+width+" "+lang+" slide "+index+" "+JSON.stringify(geometry));
     if(geometry.scroll>width+2||geometry.titleScroll>geometry.titleClient+3||geometry.promoScroll>geometry.promoClient+5)
       throw Error("RTL title/slide clipped "+width+" "+lang+" slide "+index+" "+JSON.stringify(geometry));
     if(geometry.title.left<geometry.frame.left-3||geometry.title.right>geometry.frame.right+3)
       throw Error("Hero title outside banner "+width+" "+lang+" slide "+index+" "+JSON.stringify(geometry));
     if(index===0&&width===390)await capture(page,lang,"hero");
    }
    const cards=await page.evaluate(()=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
     return [...document.querySelectorAll("#gameLobby .route-card")].map(c=>{
      const t=c.querySelector(".route-top"),title=c.querySelector("strong"),
      description=c.querySelector(":scope > span:not(.game-mode-photo):not(.route-top):not(.route-cta)");
      return {card:rect(c),top:rect(t),title:rect(title),desc:rect(description),
       titleText:title.innerText,description:description?.innerText,
       titleClient:title.clientHeight,titleScroll:title.scrollHeight,
       descClient:description.clientHeight,descScroll:description.scrollHeight};
     });
    });
    if(cards.length!==5)throw Error("Expected five game modes");
    for(let i=0;i<cards.length;i++){
     const c=cards[i];
     if(overlap(c.title,c.top)||overlap(c.title,c.desc)||c.title.top<c.top.bottom+3||
       c.title.bottom>c.card.bottom+1||c.desc.bottom>c.card.bottom+1||
       c.titleScroll>c.titleClient+3)
       throw Error("RTL mode title overlaps icon, count or desc "+width+" "+lang+" card "+i+" "+JSON.stringify(c));
    }
    if(width===390){
     await page.locator("#gameLobby .route-card").first().scrollIntoViewIfNeeded();
     await capture(page,lang,"cards");
    }
    // Classic must remain usable after switching the skin off.
    await page.locator("#gtaModeToggle").click();
    await page.waitForFunction(()=>document.documentElement.dataset.viceTheme==="off");
    if(errors.length)throw Error("Page JS errors "+width+" "+lang+": "+errors.join(" | "));
    console.log("PASS RTL "+lang+" "+width+"px: all 5 slides + 5 card titles, no clipping/overlap, restored classic");
    await ctx.close();
   }
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
