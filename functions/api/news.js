/**
 * NEOLINE Israel: on-demand text-only RSS backup for missed GitHub schedules.
 * Cloudflare Pages Functions invokes this only when a visitor requests news.
 * Independently published GitHub snapshots remain the canonical archive.
 *
 * No copied photos, no simulated articles, no translated/altered timestamps.
 * Working RSS responses receive a real checkedAt timestamp; an inaccessible
 * upstream never changes the displayed feed's update time.
 */
const SOURCES=[
 {name:"Walla · Безопасность",url:"https://rss.walla.co.il/feed/4734",domain:"walla.co.il"},
 {name:"Walla · Авто",url:"https://rss.walla.co.il/feed/4705",domain:"walla.co.il"},
 {name:"Maariv · Новости",url:"https://www.maariv.co.il/rss/rssfeedsmivzakichadashot",domain:"maariv.co.il"},
 {name:"Ynet · Новости",url:"https://www.ynet.co.il/Integration/StoryRss2.xml",domain:"ynet.co.il"},
 {name:"Mako · Израиль",url:"https://rcs.mako.co.il/rss/news-israel.xml",domain:"mako.co.il"}
];
const DAY=86400000,MAX_ITEMS=300,MAX_BYTES=800000;
const MATCH={
 accidents:/תאונ|התנגש|נדרס|דריס|פגע וברח|התהפך הרכב|נפגע מרכב|crash|collision|road accident|traffic accident|дтп|авари|наезд на пешеход|حادث سير|حوادث طرق|تصادم|دهس/i,
 speed:/מצלמות מהירות|אכיפת מהירות|נהיגה במהירות|מהירות מופרזת|ממל.ז|speed camera|speeding fine|скоростн.{0,12}камера|штраф за скорость|كاميرات السرعة/i,
 laws:/תקנות התעבורה|חוקי תנועה|רישיון נהיגה|רשיון נהיגה|קנסות תנועה|driving law|traffic law|driving licence|правила дорожного движения|رخصة قيادة/i,
 roads:/חסימות כבישים|סגירת כביש|כביש נחסם|כביש חסום|עומס תנועה|עומסי תנועה|פקק|מחלף|נתיבי איילון|road closure|traffic jam|highway closure|перекрыт.{0,12}дорог|пробк|إغلاق طريق/i,
 cars:/רכב חשמלי|רכבים חשמליים|רכב חדש|מכונית חדשה|מכוניות חדשות|יצרנית הרכב|מכוניות|רכבי|רכבים|electric vehicle|automotive|new car|автомобил|электромобил|سيارات كهربائية/i
};
const EXCLUDE=/חמאס|מלחמה|פיגוע|מחבל|איראן|לבנון|טילים|תאונת עבודה|terror|missile|industrial accident|теракт|ракета|работе|حماس|صاروخ|هجوم إرهابي/i;
const CDN_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=0, s-maxage=480","x-content-type-options":"nosniff"};

function decodeXml(raw){
 return String(raw||"")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")
  .replace(/&#(x[0-9a-f]+|\d+);/gi,(_m,n)=>{try{
    const v=n[0].toLowerCase()==="x"?parseInt(n.slice(1),16):parseInt(n,10);
    return v>=32&&v<=0x10ffff?String.fromCodePoint(v):"";
  }catch(_){return ""}})
  .replace(/&(amp|quot|apos|lt|gt|nbsp);/gi,(_m,n)=>({amp:"&",quot:'"',apos:"'",lt:"<",gt:">",nbsp:" "}[n.toLowerCase()]||""))
  .replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim();
}
function tag(xml,name){
 const m=xml.match(new RegExp("<"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/"+name+"\\s*>","i"));
 return m?decodeXml(m[1]):"";
}
function cutoff(category,now){
 if(category!=="laws")return now-30*DAY;
 const d=new Date(now),year=d.getUTCFullYear(),month=d.getUTCMonth();
 const target=new Date(Date.UTC(year,month-6,1));
 const maxDay=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();
 return Date.UTC(target.getUTCFullYear(),target.getUTCMonth(),Math.min(maxDay,d.getUTCDate()),d.getUTCHours(),d.getUTCMinutes());
}
function category(title){
 if(EXCLUDE.test(title))return null;
 for(const group of ["accidents","speed","laws","roads","cars"])if(MATCH[group].test(title))return group;
 return null;
}
function isAllowedLink(value,domain){
 try{
  const u=new URL(value);
  return u.protocol==="https:"&& (u.hostname===domain||u.hostname.endsWith("."+domain))&&
   u.pathname!=="/" && !/\/(rss|feed)(?:\/|$)/i.test(u.pathname)&&!u.username&&!u.password;
 }catch(_){return false}
}
function parseRss(xml,source,now){
 if(typeof xml!=="string"||xml.length>MAX_BYTES)return [];
 const blocks=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item\s*>/gi)||[];
 const items=[];
 for(const block of blocks.slice(0,75)){
  const title=tag(block,"title"),url=tag(block,"link");
  const rawDate=tag(block,"pubDate")||tag(block,"dc:date")||tag(block,"published");
  const stamp=Date.parse(rawDate),group=category(title);
  if(!group||title.length<15||title.length>250||!isAllowedLink(url,source.domain)||
   !Number.isFinite(stamp)||stamp>now+6*3600000||stamp<cutoff(group,now))continue;
  items.push({titleOriginal:title,title,summary:"",
   publisher:source.name.split(" · ")[0],date:new Date(stamp).toISOString(),
   url,category:group,official:false,
   sourceLanguage:/[\u0590-\u05ff]/.test(title)?"he":/[\u0600-\u06ff]/.test(title)?"ar":/[\u0400-\u04ff]/.test(title)?"ru":"en",
   translations:{}});
 }
 return items;
}
async function shaId(url){
 const clean=url.split("?")[0];
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(clean));
 return Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,"0")).join("").slice(0,20);
}
function archiveValid(x){
 return x?.version===1&&x.retentionDays===30&&x.lawsRetentionMonths===6&&
  Array.isArray(x.items)&&Number.isFinite(Date.parse(x.updated));
}
async function getStatic(env,url){
 try{
  const base=new URL("/assets/news/news.json",url);
  const res=await env.ASSETS.fetch(new Request(base,{method:"GET"}));
  if(!res.ok)return null;
  const json=await res.json();
  return archiveValid(json)?json:null;
 }catch(_){return null}
}
async function fetchFeed(source,now){
 try{
  const res=await fetch(source.url,{headers:{"accept":"application/rss+xml,application/xml,text/xml",
    "user-agent":"NEOLINE-Israel-News-Headlines/1.0"},signal:AbortSignal.timeout(6500)});
  if(!res.ok)throw new Error("HTTP "+res.status);
  const xml=await res.text();
  if(!/<(?:rss|rdf:RDF|feed)\b/i.test(xml))throw new Error("Not RSS XML");
  return {ok:true,items:parseRss(xml,source,now)};
 }catch(_){return {ok:false,items:[]}}
}
function asResponse(payload,checked,status=200){
 return new Response(JSON.stringify(payload),{status,headers:{...CDN_HEADERS,
  "x-neoline-news-source":checked?"live-rss-backup":"static-archive"}});
}
export async function onRequestGet(context){
 const now=Date.now();
 const cache=typeof caches!=="undefined"?caches.default:null;
 // Cache key ignores random browser parameters so requests share a 8-min
 // response, avoiding a fetch storm on otherwise idle news days.
 const key=new Request(new URL("/api/news",context.request.url),{method:"GET"});
 try{
  const hit=cache&&await cache.match(key);
  if(hit)return hit;
 }catch(_){}
 const staticNews=await getStatic(context.env,context.request.url);
 if(!staticNews)return asResponse({error:"Static news archive unavailable"},false,503);
 const age=now-Date.parse(staticNews.updated);
 if(age<35*60000&&age>=0){
  const result=asResponse(staticNews,false);
  if(cache&&context.waitUntil)context.waitUntil(cache.put(key,result.clone()).catch(()=>{}));
  return result;
 }
 const results=await Promise.all(SOURCES.map(src=>fetchFeed(src,now)));
 const working=results.filter(x=>x.ok).length;
 if(!working){
  // Crucial: do NOT lie about freshness on network failures.
  const fallback=asResponse(staticNews,false);
  if(cache&&context.waitUntil)context.waitUntil(cache.put(key,fallback.clone()).catch(()=>{}));
  return fallback;
 }
 // Preserve canonical translations and historical 30-day/six-month items.
 const merged=new Map();
 for(const row of staticNews.items){
  if(!row||typeof row.url!=="string")continue;
  const when=Date.parse(row.date);
  if(!Number.isFinite(when)||when>now+6*3600000||when<cutoff(row.category,now))continue;
  merged.set(row.url.split("?")[0],row);
 }
 const incoming=results.flatMap(x=>x.items);
 let added=0;
 for(const item of incoming){
  const clean=item.url.split("?")[0];
  if(merged.has(clean))continue;
  item.id=await shaId(item.url);
  merged.set(clean,item);added++;
 }
 const items=Array.from(merged.values()).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).slice(0,MAX_ITEMS);
 const latest=items.length?items[0].date:null;
 const data={version:1,retentionDays:30,lawsRetentionMonths:6,
  updated:new Date(now).toISOString(),checkedAt:new Date(now).toISOString(),
  mode:"on-demand-rss",workingSources:working,newSinceArchive:added,
  newestSourcePublishedAt:latest,items};
 const response=asResponse(data,true);
 if(cache&&context.waitUntil)context.waitUntil(cache.put(key,response.clone()).catch(()=>{}));
 return response;
}
export const __test={parseRss,category,cutoff,decodeXml,isAllowedLink,archiveValid};
