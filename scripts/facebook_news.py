#!/usr/bin/env python3
"""Read authorized Facebook Page posts via the official Meta Graph API.

Facebook is NOT openly scrapeable here. Collection is disabled until a token
approved for Page Public Content Access (or authorized managed Pages) AND a
curated page list have been configured. No credentials go to the browser,
repository, public reports, or logs. No user profiles, friends or groups.
"""
from __future__ import annotations
import datetime as dt
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse
import requests

PAGES_FILE=Path("scripts/facebook_pages.json")
MAX_PAGES_PER_ACCOUNT=3
MAX_POSTS_PER_ACCOUNT=80
GRAPH_API="https://graph.facebook.com/v27.0"

def _safe_pages():
    try:
        data=json.loads(PAGES_FILE.read_text(encoding="utf-8"))
    except (OSError,ValueError,TypeError):
        return []
    pages=[]
    for entry in data.get("pages",[]):
        if not isinstance(entry,dict) or not entry.get("enabled"):continue
        id=str(entry.get("id","")).strip()
        label=str(entry.get("name","")).strip()[:80]
        # Usernames are supported by Meta on some routes; numeric ID preferred.
        if not (re.fullmatch(r"[0-9]{5,24}",id) or re.fullmatch(r"[A-Za-z][A-Za-z0-9_.]{3,70}",id)):continue
        if not label:continue
        pages.append((id,label))
    return pages[:15]

def _headline(message):
    """Take an original, brief report headline, never the full post."""
    rows=[re.sub(r"\s+"," ",row).strip() for row in message.splitlines()]
    rows=[x for x in rows if x and not re.match(r"^(?:https?://|#|⚡|➡|לפרטים|שתפו|הצטרפו|подписывайтесь)",x,re.I)]
    if not rows:return ""
    # Preview title is a short excerpt, not a claim to have read the whole post.
    first=rows[0]
    return first[:205].rsplit(" ",1)[0]+"…" if len(first)>210 else first

def collect(session:requests.Session,cutoff:dt.datetime,now:dt.datetime):
    """Return (publisher, RSS-like entry) pairs, successful-page counts, errors."""
    token=os.getenv("FACEBOOK_GRAPH_TOKEN","").strip()
    pages=_safe_pages()
    status={}
    errors={}
    if not token or not pages:
        return [],status,{"Facebook / Meta Graph API":"Нет настроенных разрешений Meta и списка подтверждённых страниц; сбор Facebook не активирован"}
    output=[]
    for page_id,label in pages:
        seen=set()
        count=0
        before=None
        try:
            for page_no in range(MAX_PAGES_PER_ACCOUNT):
                params={"fields":"id,created_time,message,permalink_url",
                        "limit":70,"access_token":token}
                if before:params["after"]=before
                url=f"{GRAPH_API}/{page_id}/posts"
                response=session.get(url,params=params,timeout=(8,22))
                response.raise_for_status()
                data=response.json()
                if "error" in data:
                    raise RuntimeError(str(data["error"].get("message","Meta API denied request"))[:120])
                posts=data.get("data",[])
                if not isinstance(posts,list):break
                all_old=True
                for post in posts:
                    timestamp=post.get("created_time")
                    try:
                        t=dt.datetime.fromisoformat(str(timestamp).replace("Z","+00:00"))
                        t=t.astimezone(dt.timezone.utc) if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)
                    except (ValueError,TypeError):continue
                    if t>=cutoff:all_old=False
                    if not cutoff<=t<=now+dt.timedelta(hours=6):continue
                    message=str(post.get("message",""))
                    title=_headline(message)
                    link=str(post.get("permalink_url",""))
                    if not (15<len(title)<250):continue
                    if not link.startswith("https://www.facebook.com/") and not link.startswith("https://facebook.com/"):continue
                    if link in seen:continue
                    seen.add(link)
                    output.append((label+" · Facebook",{
                        "title":title,"link":link,"published":t.isoformat(),
                    }))
                    count+=1
                    if count>=MAX_POSTS_PER_ACCOUNT:break
                if count>=MAX_POSTS_PER_ACCOUNT or all_old:break
                paging=data.get("paging") or {}
                next_link=paging.get("next")
                cursor=(paging.get("cursors") or {}).get("after")
                # Don't follow server-supplied next URLs; stay on fixed Graph host.
                if not next_link or not cursor or cursor==before:break
                before=cursor
            status[label]=count
        except (requests.RequestException,ValueError,KeyError,RuntimeError) as e:
            errors[label+" · Facebook"]=type(e).__name__+" (request blocked or permission missing)"
    return output,status,errors
