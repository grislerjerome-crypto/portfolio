from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys, tempfile

# Requires Playwright and Microsoft Edge. All displayed operational figures are illustrative.
artifacts=Path(tempfile.gettempdir())
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8099/'
report={'url':url,'projectCount':44,'viewports':[],'themes':['dark','light'],'interactions':{},'animations':{},'pageErrors':[]}

with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(url,wait_until='domcontentloaded')
    page.wait_for_function("document.querySelectorAll('.proj-card').length===44")
    page.wait_for_timeout(1900)

    # Existing protected content remains intact.
    assert page.locator('.proj-card').count()==44
    assert page.locator('#ecom-starter a').evaluate_all('(els)=>els.map(e=>e.href)')==['https://github.com/grislerjerome-crypto/starter-ecom-vibe-app']
    assert 'THREADLAB' in page.locator('#ecom-starter').inner_text()
    starter=page.locator('#starter-preview-image')
    assert starter.count()==1
    assert starter.get_attribute('src')=='starter-ecom-homepage.png'
    page.locator('[data-starter-view="shop"]').click()
    assert starter.get_attribute('src')=='starter-ecom-shop.png'
    assert 'Shop preview' in page.locator('#starter-preview-caption').inner_text()
    page.locator('[data-starter-view="home"]').click()
    assert starter.get_attribute('src')=='starter-ecom-homepage.png'
    assert 'Build preview. Hostinger hosting linkage' not in page.locator('#ecom-premium').inner_text()
    assert page.locator('#ecom-premium a').evaluate_all('(els)=>els.map(e=>e.href)')==['https://apparel.agentrome.site/','https://apparel.agentrome.site/admin-login']
    preview=page.locator('#ecom-preview-image')
    assert preview.count()==1
    assert preview.get_attribute('src')=='apparel-lab-storefront.png'
    assert preview.evaluate('(e)=>getComputedStyle(e).objectFit==="cover"')
    page.locator('[data-ecom-view="admin"]').click()
    assert preview.get_attribute('src')=='apparel-lab-admin.png'
    assert 'Dashboard preview' in page.locator('#ecom-preview-caption').inner_text()
    page.locator('[data-ecom-view="store"]').click()
    assert preview.get_attribute('src')=='apparel-lab-storefront.png'

    # New sections are separate and the old queue is gone.
    assert page.locator('#ecommerce-operations').count()==1
    assert page.locator('#logistics-operations').count()==1
    assert page.locator('#operations-samples, #ops-queue, #ops-output').count()==0
    assert page.locator('#ecommerce-operations .ops-sample-label').text_content()=='Illustrative sample data'
    assert page.locator('#logistics-operations .ops-sample-label').text_content()=='Illustrative sample data'

    # Ecommerce dashboard controls update KPIs, chart data and state.
    page.locator('#ecommerce-operations').scroll_into_view_if_needed()
    page.locator('[data-commerce-view="exceptions"]').click()
    assert page.locator('#commerce-kpi-a').inner_text()=='14'
    assert page.locator('#commerce-readout').inner_text()=='Exception view: address and stock checks lead the queue.'
    assert page.locator('[data-commerce-view="exceptions"]').get_attribute('aria-pressed')=='true'
    exception_height=page.locator('#commerce-chart i').first.evaluate("e=>e.style.getPropertyValue('--h')")
    exception_gradient=page.locator('#commerce-chart i').first.evaluate("e=>getComputedStyle(e).backgroundImage")
    assert exception_height=='72%'
    assert 'gradient' in exception_gradient,exception_gradient
    page.locator('[data-commerce-view="stock"]').click()
    assert page.locator('#commerce-kpi-c').inner_text()=='3'
    assert page.locator('#commerce-chart-title').inner_text()=='STOCK WATCH / SAMPLE LEVELS'
    report['interactions']['ecommerceViews']='flow, exceptions and stock update the dashboard'

    # Logistics node controls update the detail panel and throughput.
    page.locator('#logistics-operations').scroll_into_view_if_needed()
    page.locator('.route-node[data-node="origin"]').click()
    assert page.locator('#shipment-title').inner_text()=='Supplier confirmed.'
    assert page.locator('#shipment-owner').inner_text()=='Supplier team'
    assert page.locator('#throughput-value').inner_text()=='96%'
    page.locator('.route-node[data-node="delivery"]').click()
    assert page.locator('#shipment-title').inner_text()=='Delivery handoff planned.'
    assert page.locator('.route-node[data-node="delivery"]').get_attribute('aria-pressed')=='true'
    assert page.locator('#throughput-value').inner_text()=='71%'
    report['interactions']['logisticsNodes']='all route nodes are wired; origin and delivery detail states verified'

    # Motion exists in normal mode.
    page.locator('#ecommerce-operations').scroll_into_view_if_needed()
    order_anim=page.locator('.order-stream-track').evaluate("e=>getComputedStyle(e).animationName")
    order_t1=page.locator('.order-stream-track').evaluate("e=>getComputedStyle(e).transform")
    page.wait_for_timeout(500)
    order_t2=page.locator('.order-stream-track').evaluate("e=>getComputedStyle(e).transform")
    page.locator('#logistics-operations').scroll_into_view_if_needed()
    route_anim=page.locator('.route-runner').evaluate("e=>getComputedStyle(e).animationName")
    route_t1=page.locator('.route-runner').evaluate("e=>getComputedStyle(e).left+'|'+getComputedStyle(e).top")
    page.wait_for_timeout(500)
    route_t2=page.locator('.route-runner').evaluate("e=>getComputedStyle(e).left+'|'+getComputedStyle(e).top")
    assert order_anim=='orderDrift' and order_t1!=order_t2,(order_anim,order_t1,order_t2)
    assert route_anim=='routeTravel' and route_t1!=route_t2,(route_anim,route_t1,route_t2)
    report['animations']['normalMotion']={'orderStream':order_anim,'routeRunner':route_anim,'changed':True}

    # Desktop, tablet and mobile, both themes, with overflow and menu checks.
    for width,height,label in [(1440,1000,'desktop'),(768,1024,'tablet'),(375,812,'mobile')]:
        page.set_viewport_size({'width':width,'height':height})
        if width<981:
            page.locator('#menu-open').click()
            assert page.locator('#mobile-menu').is_visible()
            page.locator('#mobile-menu a').first.click()
            assert page.locator('#mobile-menu').is_hidden()
        for theme in ['dark','light']:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for section in ['#ecommerce-operations','#logistics-operations']:
                page.locator(section).scroll_into_view_if_needed()
                page.wait_for_timeout(80)
                assert page.locator(section).is_visible()
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,theme,section,page.evaluate('document.documentElement.scrollWidth'),page.evaluate('innerWidth'))
                box=page.locator(section).bounding_box()
                assert box and box['width']<=width+1,(width,theme,section,box)
        ecommerce_shot=artifacts/f'portfolio-ecommerce-operations-{label}.png'
        logistics_shot=artifacts/f'portfolio-logistics-operations-{label}.png'
        page.evaluate("document.documentElement.dataset.theme='dark'")
        page.locator('#ecommerce-operations').scroll_into_view_if_needed()
        page.locator('#ecommerce-operations').screenshot(path=str(ecommerce_shot))
        page.locator('#logistics-operations').scroll_into_view_if_needed()
        page.locator('#logistics-operations').screenshot(path=str(logistics_shot))
        report['viewports'].append({'name':label,'width':width,'height':height,'darkAndLight':'passed','overflow':'none','screenshots':[str(ecommerce_shot),str(logistics_shot)]})

    # Ava local fallback accurately describes the new sections.
    page.route('**/api/ava',lambda route:route.abort())
    page.locator('#ava-launch').click()
    page.locator('#ava-input').fill('What operations dashboards can I explore?')
    page.locator('#ava-input').press('Enter')
    page.wait_for_function("!Array.from(document.querySelectorAll('#ava-messages .bot')).some(e=>e.textContent==='…')")
    answer=page.locator('#ava-messages .bot').last.inner_text()
    assert 'Ecommerce Operations' in answer and 'Supply Chain and Logistics' in answer and 'illustrative sample data' in answer
    report['interactions']['avaFallback']='describes both new sections and sample data label'

    # Reduced motion freezes all new moving layers while preserving content.
    reduced=browser.new_context(viewport={'width':375,'height':812},reduced_motion='reduce')
    rpage=reduced.new_page()
    reduced_errors=[]
    rpage.on('pageerror',lambda e:reduced_errors.append(str(e)))
    rpage.goto(url,wait_until='domcontentloaded')
    rpage.wait_for_timeout(1900)
    rpage.locator('#ecommerce-operations').scroll_into_view_if_needed()
    reduced_names=rpage.locator('.order-stream-track, .chart-bars i, .route-runner, .throughput-bars i').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).animationName)')
    assert reduced_names and all(name=='none' for name in reduced_names),reduced_names
    assert rpage.locator('#commerce-readout').is_visible()
    rpage.locator('#logistics-operations').scroll_into_view_if_needed()
    assert rpage.locator('#shipment-title').is_visible()
    assert rpage.evaluate('document.documentElement.scrollWidth<=innerWidth')
    report['animations']['reducedMotion']={'animationNames':sorted(set(reduced_names)),'contentVisible':True,'mobileOverflow':'none'}
    report['pageErrors']=errors+reduced_errors
    assert not report['pageErrors'],report['pageErrors']
    print(json.dumps(report,indent=2))
    reduced.close()
    context.close()
    browser.close()
