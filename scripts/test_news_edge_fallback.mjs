import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
// Node 24 already exposes globalThis.crypto as a read-only WebCrypto getter.

// The project is a static site without package.json / ESM flags.
const src=readFileSync("functions/api/news.js","utf8");
const {__test,onRequestGet}=await import("data:text/javascript;base64,"+Buffer.from(src).toString("base64"));
const now=Date.now();
const timestamp=new Date(now-20*60_000).toUTCString();
const rss='<rss><channel><item><title><![CDATA[תאונת דרכים בכביש 6: נהג נפצע]]></title>'+
 '<link>https://www.walla.co.il/item/example-123</link><pubDate>'+timestamp+'</pubDate></item>'+
 '<item><title>תאונת דרכים בקנדה</title><link>https://attacker.invalid/fake</link><pubDate>'+timestamp+'</pubDate></item>'+
 '</channel></rss>';
const srcInfo={name:"Walla · Безопасность",domain:"walla.co.il"};
assert.equal(__test.parseRss(rss,srcInfo,now).length,1,"Only authentic allowed publisher URLs");
assert.equal(__test.category("תאונת דרכים בכביש 6"),"accidents");
assert.equal(__test.category("חמאס תאונת דרכים"),null);
assert.equal(__test.isAllowedLink("https://www.walla.co.il.evil.example/post","walla.co.il"),false);
assert.equal(__test.isAllowedLink("https://www.walla.co.il/item/example-123","walla.co.il"),true);
const archive={version:1,retentionDays:30,lawsRetentionMonths:6,
 updated:new Date(now-4*3600000).toISOString(),items:[{
 id:"0123456789abcdef1234",titleOriginal:"תאונה ישנה בכביש",
 date:new Date(now-6*3600000).toISOString(),
 title:"Old story",summary:"",publisher:"Walla",url:"https://www.walla.co.il/item/old-story",
 category:"accidents",translations:{ru:{title:"Авария",summary:""}}}]};
const response=()=>new Response(JSON.stringify(archive),{headers:{"content-type":"application/json"}});
const ctx={request:new Request("https://neoline-israel.pages.dev/api/news"),
 env:{ASSETS:{fetch:async()=>response()}},waitUntil:()=>{}};
const realFetch=globalThis.fetch;
try{
 globalThis.caches={default:{match:async()=>null,put:async()=>{}}};
 globalThis.fetch=async url=>String(url).includes("rss.walla.co.il/feed/4734")?
  new Response(rss,{status:200}):new Response("Forbidden",{status:403});
 const out=await onRequestGet(ctx);
 assert.equal(out.status,200);
 const result=await out.json();
 assert.equal(result.items.length,2);
 assert.equal(result.mode,"on-demand-rss");
 assert.equal(result.newSinceArchive,1);
 assert.equal(result.workingSources,1);
 assert.equal(result.items[0].category,"accidents");
 assert.equal(result.items[0].image,undefined);
 assert.equal(result.items[0].sourceLanguage,"he");
 assert.ok(Date.parse(result.updated)>Date.parse(archive.updated));
 globalThis.fetch=async()=>new Response("Forbidden",{status:403});
 const oldOut=await onRequestGet(ctx);
 const oldData=await oldOut.json();
 assert.equal(oldData.updated,archive.updated,"On upstream failures never fake an update");
 assert.equal(oldData.items.length,1,"Archive must remain usable");
 console.log("PASS: live RSS only from real sources, text-only cards, fallback and honest timestamps");
}finally{globalThis.fetch=realFetch}
