"""Browser-only Ava transport fixtures, never calls the live provider."""
from playwright.sync_api import sync_playwright
import json,sys
with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    page=browser.new_page(reduced_motion='reduce')
    page.goto(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8099/',wait_until='domcontentloaded')
    page.wait_for_function("document.querySelectorAll('.proj-card').length===44")
    page.evaluate("""() => {window.avaRequests=[];window.fetch=async(url,options)=>{avaRequests.push({url,body:JSON.parse(options.body)});return {ok:true,json:async()=>({reply:'Test fixture response'})};};}""")
    page.locator('#ava-launch').click()
    for i in range(24):
        page.locator('#ava-input').fill('界'*2000)
        page.locator('#ava-input').press('Enter')
        page.wait_for_function("!Array.from(document.querySelectorAll('#ava-messages .bot')).some(e=>e.textContent==='…')")
    requests=page.evaluate('avaRequests')
    assert len(requests)==24
    assert all(len(r['body']['messages'])<=20 for r in requests),'History grows unbounded'
    assert all(len(json.dumps(r['body'],ensure_ascii=False).encode())<=32768 for r in requests),'Payload exceeds worker byte budget'
    assert all(r['url']=='https://ava-chat-worker.ava-chat-rome-grisler.workers.dev/api/ava' for r in requests)
    page.evaluate("() => {window.fetch=()=>new Promise(resolve=>window.resolveAva=resolve);}")
    page.locator('#ava-input').fill('Hello');page.locator('#ava-input').press('Enter')
    page.locator('#ava-input').fill('Second');page.locator('#ava-input').press('Enter')
    assert page.locator('#ava-messages .bot').all_text_contents().count('…')==1,'Concurrent messages reorder history'
    page.evaluate("resolveAva({ok:false,json:async()=>({offline:true})})")
    page.wait_for_function("!Array.from(document.querySelectorAll('#ava-messages .bot')).some(e=>e.textContent==='…')")
    print(json.dumps({'longConversation':'24 Unicode turns within byte and message limits','transport':'existing Worker URL preserved','concurrency':'one request at a time','offlineFallback':'passed'}))
    browser.close()
