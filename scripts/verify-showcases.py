from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys, tempfile

artifacts=Path(tempfile.gettempdir())
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8099/'
report={'url':url,'projectCount':44,'viewports':[],'themes':['dark','light'],'interactions':{},'animations':{},'pageErrors':[]}

with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
    page=context.new_page(); errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(url,wait_until='domcontentloaded')
    page.wait_for_function("document.querySelectorAll('.proj-card').length===44")
    page.wait_for_timeout(1900)

    assert page.locator('.proj-card').count()==44
    assert page.locator('#ecom-starter a').evaluate_all('(els)=>els.map(e=>e.href)')==['https://threadlab.agentrome.site/']
    starter_text=page.locator('#ecom-starter').inner_text()
    assert all(x in starter_text for x in ['Starter','Up to $499','Professional storefront','View Starter Store'])
    assert 'Shop' not in page.locator('#ecom-starter .ecom-switch').inner_text() if page.locator('#ecom-starter .ecom-switch').count() else True
    assert page.locator('#ecom-starter details').count()==0
    starter=page.locator('#starter-preview-image')
    assert starter.get_attribute('src')=='starter-ecom-homepage.png'
    assert starter.evaluate('(e)=>getComputedStyle(e).objectFit==="contain"')
    assert page.locator('[data-ecom-page], .ecom-book, .ecom-book-controls, .ecom-turn').count()==0

    premium=page.locator('#ecom-premium')
    premium_text=premium.inner_text().lower()
    assert all(x in premium_text for x in ['storefront','customer dashboard','admin dashboard'])
    assert premium.locator('[data-ecom-view]').count()==3
    assert premium.locator('a').evaluate_all('(els)=>els.map(e=>e.href)')==['https://apparel.agentrome.site/','https://apparel.agentrome.site/customer-login','https://apparel.agentrome.site/admin-login']
    assert premium.locator('a').evaluate_all('(els)=>els.map(e=>e.textContent.trim())')==['View Premium Store ↗','Customer Dashboard ↗','Admin Dashboard ↗']
    assert 'customer@apparellab.com' in premium_text and 'admin@apparellab.com' in premium_text
    assert 'Login using Demo dashboards access:' in premium.inner_text()
    assert 'Demo dashboard access' not in premium.inner_text()
    assert 'Customer and admin areas use demo sign in flows' not in premium.inner_text()
    assert page.get_by_text('Explore Craftee Sites').count()==0
    assert premium.locator('details').count()==0
    preview=page.locator('#ecom-preview-image')
    for tab,src,caption in [('customer','apparel-lab-customer.png','Customer Dashboard preview'),('admin','apparel-lab-admin.png','Admin Dashboard preview'),('store','apparel-lab-storefront.png','Storefront preview')]:
        page.locator(f'[data-ecom-view="{tab}"]').click(); assert preview.get_attribute('src')==src; assert caption in page.locator('#ecom-preview-caption').inner_text()
    assert preview.evaluate('(e)=>getComputedStyle(e).objectFit==="cover"')

    desktop_nav=page.locator('.nav ul a').evaluate_all('(els)=>els.map(e=>[e.textContent.trim(),e.getAttribute("href")])')
    mobile_nav=page.locator('#mobile-menu a').evaluate_all('(els)=>els.map(e=>[e.textContent.trim(),e.getAttribute("href")])')
    expected=[['Services','#services'],['Web Dev','#craftee'],['Ecommerce','#ecommerce-operations'],['Logistics','#logistics-operations'],['Projects','#projects'],['ROI','#roi'],['Contact','#contact']]
    assert desktop_nav==expected and mobile_nav==expected
    assert page.locator('.nav ul').get_by_text('How I work').count()==0 and page.locator('.nav ul').get_by_text('Ava',exact=True).count()==0
    assert page.locator('.clock-label').inner_text()=='EST USA'
    assert page.evaluate("new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())")[:5]==page.locator('#clock').inner_text()[:5]

    assert page.locator('#ecommerce-operations .donut').count()==1
    assert page.locator('#ecommerce-operations .sales-chart').count()==1
    assert page.locator('#ecommerce-operations .data-table tbody tr').count()==4
    assert page.locator('#logistics-operations .status-donut').count()==1
    assert page.locator('#logistics-operations .throughput-chart').count()==1
    assert page.locator('#logistics-operations .data-table tbody tr').count()==4
    assert page.locator('#ecommerce-operations .ops-sample-label').text_content()=='Illustrative sample data'
    assert page.locator('#logistics-operations .ops-sample-label').text_content()=='Illustrative sample data'

    page.locator('[data-commerce-view="month"]').click()
    assert page.locator('#commerce-kpi-a').inner_text()=='$186K'
    assert page.locator('#commerce-chart-title').inner_text()=='SALES TREND / 30 DAYS'
    assert page.locator('[data-commerce-view="month"]').get_attribute('aria-pressed')=='true'
    month_points=page.locator('#sales-line').get_attribute('points')
    page.locator('[data-commerce-view="quarter"]').click()
    assert page.locator('#commerce-kpi-b').inner_text()=='14,806'
    assert page.locator('#sales-line').get_attribute('points')!=month_points
    report['interactions']['ecommerce']='time ranges update KPI, area chart and donut data'

    page.locator('[data-log-filter="road"]').click()
    assert page.locator('#logistics-operations tbody tr:visible').count()==2
    assert page.locator('#lane-count').inner_text()=='2 RECORDS'
    page.locator('.route-node[data-node="delivery"]').click()
    assert page.locator('#shipment-title').inner_text()=='Final mile handoff'
    assert page.locator('#shipment-owner').inner_text()=='Receiving team'
    assert page.locator('#throughput-value').inner_text()=='3,480'
    report['interactions']['logistics']='lane filters and selected shipment detail verified'

    page.locator('#ecommerce-operations').scroll_into_view_if_needed()
    line_anim=page.locator('.sales-line').evaluate('e=>getComputedStyle(e).animationName')
    page.locator('#logistics-operations').scroll_into_view_if_needed()
    bar_anim=page.locator('.throughput-chart i').first.evaluate('e=>getComputedStyle(e).animationName')
    assert line_anim=='lineDraw' and bar_anim=='throughput'
    report['animations']['normalMotion']={'salesLine':line_anim,'throughputBars':bar_anim}

    for width,height,label in [(1440,1000,'desktop'),(768,1024,'tablet'),(375,812,'mobile')]:
        page.set_viewport_size({'width':width,'height':height})
        if width<981:
            page.locator('#menu-open').click(); assert page.locator('#mobile-menu').is_visible()
            page.locator('#mobile-menu a').first.click(); assert page.locator('#mobile-menu').is_hidden()
        for theme in ['dark','light']:
            page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
            for section in ['#craftee','#ecommerce-operations','#logistics-operations']:
                page.locator(section).scroll_into_view_if_needed(); page.wait_for_timeout(70)
                assert page.locator(section).is_visible()
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,theme,section,page.evaluate('document.documentElement.scrollWidth'),page.evaluate('innerWidth'))
        page.evaluate("document.documentElement.dataset.theme='dark'")
        shot=artifacts/f'portfolio-management-dashboards-{label}.png'
        page.locator('#ecommerce-operations').scroll_into_view_if_needed(); page.screenshot(path=str(shot),full_page=False)
        report['viewports'].append({'name':label,'width':width,'height':height,'darkAndLight':'passed','overflow':'none','screenshot':str(shot)})

    page.route('**/api/ava',lambda route:route.abort())
    page.locator('#ava-launch').click(); page.locator('#ava-input').fill('Tell me about Premium ecommerce'); page.locator('#ava-input').press('Enter')
    page.wait_for_function("!Array.from(document.querySelectorAll('#ava-messages .bot')).some(e=>e.textContent==='…')")
    answer=page.locator('#ava-messages .bot').last.inner_text().lower()
    assert all(x in answer for x in ['storefront','customer dashboard','admin dashboard'])
    report['interactions']['avaFallback']='Premium three-view answer verified'

    reduced=browser.new_context(viewport={'width':375,'height':812},reduced_motion='reduce')
    rpage=reduced.new_page(); reduced_errors=[]; rpage.on('pageerror',lambda e:reduced_errors.append(str(e)))
    rpage.goto(url,wait_until='domcontentloaded'); rpage.wait_for_selector('.sales-line'); rpage.wait_for_timeout(1900)
    names=rpage.locator('.sales-line, .throughput-chart i').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).animationName)')
    assert names and all(name=='none' for name in names),names
    assert rpage.locator('#ecommerce-operations .data-table').is_visible() and rpage.locator('#logistics-operations .data-table').is_visible()
    assert rpage.evaluate('document.documentElement.scrollWidth<=innerWidth')
    report['animations']['reducedMotion']={'animationNames':sorted(set(names)),'contentVisible':True,'mobileOverflow':'none'}
    report['pageErrors']=errors+reduced_errors; assert not report['pageErrors'],report['pageErrors']
    print(json.dumps(report,indent=2))
    reduced.close(); context.close(); browser.close()
