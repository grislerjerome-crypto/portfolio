from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys, tempfile
# Requires playwright and Microsoft Edge. Tests use only illustrative sample data.
artifacts=Path(tempfile.gettempdir())
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8099/'
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(url,wait_until='domcontentloaded')
    page.wait_for_function("document.querySelectorAll('#ops-queue button').length===3")
    page.wait_for_timeout(2000)
    assert page.locator('.proj-card').count()==44
    assert page.locator('#ecom-starter a').count()==0
    assert 'Sample coming soon' in page.locator('#ecom-starter').inner_text()
    assert page.locator('#ecom-premium a').evaluate_all('(els)=>els.map(e=>e.href)')==['https://apparel.agentrome.site/','https://apparel.agentrome.site/admin-login']
    page.locator('#craftee').scroll_into_view_if_needed()
    previews=page.locator('#ecom-premium .ecom-preview img')
    assert previews.count()==2
    srcs=previews.evaluate_all('(els)=>els.map(e=>e.getAttribute("src"))')
    assert srcs==['apparel-lab-storefront.png','apparel-lab-admin.png']
    assert previews.evaluate_all('(els)=>els.every(e=>e.complete&&e.naturalWidth>0)')
    fit=previews.first.evaluate("e=>getComputedStyle(e).objectFit")
    assert fit=='contain'
    assert 'entire storefront scaled down' in page.locator('#ecom-premium').inner_text().lower()
    assert 'entire admin view scaled down' in page.locator('#ecom-premium').inner_text().lower()
    page.locator('#ecom-starter summary').click()
    assert page.locator('#ecom-starter details').get_attribute('open') is not None
    page.screenshot(path=str(artifacts/'portfolio-ecommerce-desktop.png'))
    for mode in ['ecommerce','logistics']:
        page.locator('[data-ops-mode="'+mode+'"]').click()
        for i in range(3):
            page.locator('#ops-queue button').nth(i).click()
            assert page.locator('#ops-deliverable').is_hidden()
            assert page.locator('#ops-output li').count()==3
            page.locator('#ops-output button').click()
            assert page.locator('#ops-deliverable').is_visible()
            assert page.locator('#ops-output button').get_attribute('aria-expanded')=='true'
            results.append({'mode':mode,'title':page.locator('#ops-output h3').inner_text(),'deliverable':page.locator('#ops-deliverable').inner_text()})
            page.locator('#ops-output button').click()
            assert page.locator('#ops-deliverable').is_hidden()
    page.locator('#operations-samples').scroll_into_view_if_needed()
    page.screenshot(path=str(artifacts/'portfolio-operations-desktop.png'))
    for width in [375,768,1440]:
        page.set_viewport_size({'width':width,'height':1000})
        if width < 981:
            page.locator('#menu-open').click()
            assert page.locator('#mobile-menu').is_visible()
            page.locator('#mobile-menu a').first.click()
            assert page.locator('#mobile-menu').is_hidden()
        for theme in ['dark','light']:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            page.locator('#craftee').scroll_into_view_if_needed()
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,theme,'overflow')
            assert page.locator('#ecom-premium').is_visible()
            assert page.locator('#ecom-premium .ecom-preview img').first.evaluate('(e)=>e.complete&&e.naturalWidth>0')
            page.locator('#operations-samples').scroll_into_view_if_needed()
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,theme,'ops overflow')
        if width==375:
            page.screenshot(path=str(artifacts/'portfolio-operations-mobile.png'))
    page.evaluate("document.documentElement.dataset.theme='dark'")
    # Exercise real failure handling using an aborted network request, not a fake response.
    page.route('**/api/ava',lambda route:route.abort())
    for tier,phrase in [('starter','sample is coming soon'),('premium','hosting linkage is still in progress')]:
        page.locator('#ecom-'+tier+' [data-ava-question]').click()
        page.wait_for_function("!Array.from(document.querySelectorAll('#ava-messages .bot')).some(e=>e.textContent==='…')")
        assert phrase in page.locator('#ava-messages .bot').last.inner_text().lower()
        assert page.locator('#ava-suggest').is_hidden()
        page.locator('#ava-input').press('Escape')
        assert not page.locator('#ava-chat').evaluate("e=>e.classList.contains('open')")
    assert not errors,errors
    print(json.dumps({'url':url,'operations':results,'projectCount':44,'responsiveWidths':[375,768,1440],'themes':['dark','light'],'premiumMiniPreviews':'passed','details':'passed','avaNetworkFallback':'passed','pageErrors':errors},indent=2))
    browser.close()
