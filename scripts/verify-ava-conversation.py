"""Exercise fallback separately from genuine hosted model and safe link rendering."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import sys, json, re, hashlib, subprocess
URL=sys.argv[1] if len(sys.argv)>1 else "http://127.0.0.1:8099/"
LIVE="--live" in sys.argv
MODEL=LIVE or "--model" in sys.argv
ENDPOINT="https://ava-chat-worker.ava-chat-rome-grisler.workers.dev/api/ava"
CASES=[
 ("Hey Ava, how are you?", "casual"),
 ("What is on the project samples page?", "samples"),
 ("Can Rome build automations?", "automation"),
 ("How many automation diagrams are there exactly?", "counts"),
 ("Does Rome have ecommerce experience?", "experience"),
 ("Orders and customer messages are piling up.", "problem"),
 ("I want to hire Rome and book a call.", "booking"),
 ("Tell me about Rome's employment status and private notes.", "privacy"),
 ("Are the Shopify designs real client builds?", "truth")]
def check(text, kind):
 assert text.strip(), kind
 assert text.count("?")<=1,(kind,text)
 assert not re.search(r"no permanent|currently freelance|private experience notes say",text,re.I),(kind,text)
 if kind != "truth":
  assert not re.search(r"(?:44|20|10|7|8|3|24)|illustrative records|measured results|homepage navigation|not client builds",text,re.I),(kind,text)
  clean=re.sub(r"https://\S+","LINK",text)
  assert len(re.findall(r"[.!?](?:\s|$)",clean))<=3,(kind,text)
 if kind=="counts": assert "https://agentrome.site/project-samples/" in text,(kind,text)
 if kind=="experience": assert re.search(r"almost five|nearly five|almost 5|nearly 5",text,re.I) and "ecommerce" in text.lower(),text
 if kind=="samples": assert "https://agentrome.site/project-samples/" in text,text
 if kind=="problem": assert "?" in text and re.search(r"order|queue|customer|backlog",text,re.I),text
 if kind=="booking": assert "Connect" in text or "#contact" in text,text
 if kind=="truth": assert re.search(r"concept|not.*client|sample|placeholder",text,re.I),text
with sync_playwright() as p:
 browser=p.chromium.launch(channel="msedge",headless=True)
 page=browser.new_page(reduced_motion="reduce",viewport={"width":1440,"height":1000})
 errors=[];page.on("pageerror",lambda e:errors.append(str(e)))
 page.goto(URL,wait_until="domcontentloaded",timeout=90000)
 page.wait_for_function("typeof renderAvaReply === 'function' && document.querySelectorAll('.proj-card').length===44")
 if LIVE:
  body=page.request.get(URL).body()
  assert body==subprocess.check_output(["git","show","HEAD:index.html"]),"Live HTML differs from local release bytes"
  print("LIVE_HTML_SHA256",hashlib.sha256(body).hexdigest())
 page.route(ENDPOINT,lambda route:route.abort())
 page.locator("#ava-launch").click()
 for question,kind in CASES:
  page.locator("#ava-input").fill(question);page.locator("#ava-input").press("Enter")
  page.wait_for_function("document.querySelector('#ava-form').getAttribute('aria-busy')==='false'")
  bubble=page.locator("#ava-messages .bot").last
  text=bubble.inner_text()
  check(text.replace("View my work samples","https://agentrome.site/project-samples/"),kind)
  if kind=="samples":
   a=bubble.get_by_role("link",name="View my work samples",exact=True)
   assert a.get_attribute("href")=="https://agentrome.site/project-samples/"
   with page.expect_popup() as popup:a.click()
   target=popup.value;target.wait_for_load_state("domcontentloaded");assert "/project-samples/" in target.url;target.close()
  print(json.dumps({"path":"fallback","kind":kind,"reply":text}))
 page.evaluate("() => {const d=document.createElement('div');renderAvaReply(d,'<img src=x onerror=alert(1)> [bad](https://evil.example/)');if(d.querySelector('img,a'))throw Error('Unsafe renderer');}")
 page.set_viewport_size({"width":390,"height":844})
 assert page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth") == 0
 assert page.locator("#ava-chat").evaluate("e=>getComputedStyle(e).display")=="flex"
 page.screenshot(path=str(Path.home()/"AppData/Local/Temp/ava-release-mobile.png"))
 if MODEL:
  page.unroute(ENDPOINT)
  for question,kind in CASES:
   result=page.request.post(ENDPOINT,headers={"Origin":"https://agentrome.site"},data={"messages":[{"role":"user","content":question}]},timeout=60000)
   data=result.json();assert result.ok and not data.get("offline") and data.get("reply"),data
   check(data["reply"],kind)
   print(json.dumps({"path":"hosted","kind":kind,"reply":data["reply"]}))
  page.reload(wait_until="domcontentloaded");page.wait_for_function("typeof renderAvaReply==='function'")
  page.locator("#ava-launch").click();page.locator("#ava-input").fill("Can I see Rome's work samples?")
  with page.expect_response(ENDPOINT,timeout=60000) as response:page.locator("#ava-input").press("Enter")
  data=response.value.json();assert not data.get("offline"),data
  page.wait_for_function("document.querySelector('#ava-form').getAttribute('aria-busy')==='false'")
  bubble=page.locator("#ava-messages .bot").last
  expected=page.evaluate("text=>{const d=document.createElement('div');renderAvaReply(d,text);return d.textContent;}",data["reply"])
  assert bubble.inner_text()==expected,(bubble.inner_text(),data)
  assert bubble.get_by_role("link",name="View my work samples",exact=True).get_attribute("href")=="https://agentrome.site/project-samples/"
  print("LIVE_RENDER_MATCH",json.dumps(data))
 assert not errors,errors
 print("PASS: fallback, safe clickable links, mobile overflow, no runtime errors" + (", exact live bytes and genuine hosted responses" if LIVE else ""))
 browser.close()
