from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).parent
OUT=ROOT/'qa-evidence';OUT.mkdir(exist_ok=True)
results=[]; errors=[];failed=[]
with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    page=browser.new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.on('response',lambda r:failed.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
    for width,height in [(1440,1100),(390,844)]:
        page.set_viewport_size({'width':width,'height':height})
        response=page.goto('http://127.0.0.1:8766/')
        assert response.status==200
        for mode in ['ai','web','ecom','logistics']:
            page.locator('#tab-'+mode).click()
            page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
            layout=page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth,logos:document.images.length,overflow:[...document.querySelectorAll(".glass,.layer,.controls,.branch")].filter(x=>x.scrollWidth>x.clientWidth+2).map(x=>x.className)})')
            assert layout['scroll']<=width,layout
            assert not layout['overflow'],layout
            if mode=='ecom':
                page.locator('#channel').select_option('Amazon')
                assert page.locator('#order-rows tr').count()==1
                assert 'Amazon' in page.locator('#order-rows').inner_text()
                page.locator('#channel').select_option('all')
                assert page.locator('#order-rows tr').count()==4
            page.locator('#run').click()
            page.locator('#pause').click()
            before=page.locator('#activity').inner_text()
            page.wait_for_timeout(1550)
            assert before==page.locator('#activity').inner_text(),'Pause did not freeze simulation'
            page.locator('#pause').click()
            page.wait_for_function('document.querySelector("#run-status").textContent==="Sample journey complete"',timeout=12000)
            final=page.locator('#activity').inner_text()
            if mode=='web': assert page.locator('#build-progress').evaluate('(el)=>el.style.width')=='100%'
            if mode=='ecom': assert page.locator('#review-count').inner_text()=='0'
            if mode=='logistics': assert page.locator('#shipment-status').inner_text()=='Delivered'
            page.evaluate('scrollTo(0,0)')
            page.screenshot(path=str(OUT/f'{mode}-{width}.png'),full_page=True)
            page.locator('#reset').click()
            assert 'READY' in page.locator('#activity').inner_text()
            assert page.locator('#run').is_enabled()
            if mode=='ecom': assert page.locator('#review-count').inner_text()=='1'
            if mode=='logistics': assert page.locator('#shipment-status').inner_text()=='Ready to pick'
            results.append({'mode':mode,'viewport':[width,height],'layout':layout,'run_pause_resume_reset':'passed','final_activity':final})
    page.emulate_media(reduced_motion='reduce')
    page.locator('#tab-ai').click()
    assert page.locator('.sat').first.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
    page.locator('#tab-ai').focus();page.keyboard.press('ArrowRight')
    assert page.locator('#tab-web').get_attribute('aria-selected')=='true'
    browser.close()
report={'results':results,'console_and_page_errors':errors,'failed_http':failed,'reduced_motion':'passed','keyboard_tabs':'passed'}
(OUT/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
assert len(results)==8 and not errors and not failed
