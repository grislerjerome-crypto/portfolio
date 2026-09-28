"""Local browser regression checks. No live AI requests or external writes."""
from playwright.sync_api import sync_playwright
import json, sys
url = sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8099/'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
    errors=[]
    page.on('pageerror',lambda error: errors.append(str(error)))
    page.goto(url,wait_until='domcontentloaded')
    page.wait_for_function("document.querySelectorAll('.proj-card').length===44")
    assert page.locator('#commerce-simulation-toggle').count()==1, 'Missing simulation pause control'
    assert page.locator('#commerce-simulation-status').inner_text()=='SIMULATION PAUSED'
    page.locator('#commerce-simulation-toggle').click()
    assert page.locator('#commerce-simulation-status').inner_text()=='SIMULATION ACTIVE'
    before=page.evaluate('commerceSimulation.snapshot()')
    page.wait_for_timeout(7200)
    after=page.evaluate('commerceSimulation.snapshot()')
    assert after['orders']==before['orders']+1
    assert 5 <= after['sales']-before['sales'] <= 50
    assert all(abs(a-b)<=1 and a>=0 for a,b in zip(after['stock'],before['stock']))
    page.locator('#commerce-simulation-toggle').click()
    frozen=page.evaluate('commerceSimulation.snapshot()')
    page.wait_for_timeout(7100)
    assert page.evaluate('commerceSimulation.snapshot()')==frozen
    for key in ['month','quarter','week']:
        page.locator(f'[data-commerce-view="{key}"]').click()
        assert page.locator('#mix-total').inner_text()==page.locator('#commerce-kpi-b').inner_text()+' TOTAL'
        assert page.locator('#commerce-readout').inner_text()==page.locator('#commerce-kpi-a').inner_text()+' SAMPLE NET SALES'
        numbers=page.evaluate("['a','b','c'].map(k=>Number(document.getElementById('commerce-kpi-'+k).textContent.replace(/[$,]/g,'')))")
        assert abs(numbers[2]-numbers[0]/numbers[1])<=0.0051
    assert page.locator('#commerce-kpi-a').inner_text()==f"${after['sales']:,.2f}"
    page.locator('#roi').scroll_into_view_if_needed()
    page.wait_for_timeout(650)
    assert page.locator('#roi-money').inner_text()=='$25,900'
    for values in [(20,100,15,70,50),(60,250,8,95,52),(1,10,15,10,10),(20,45,8,70,50)]:
        page.evaluate("values=>['hours','rate','myrate','cov','weeks'].forEach((id,i)=>{const el=document.getElementById('r-'+id);el.value=values[i];el.dispatchEvent(new Event('input',{bubbles:true}));})",values)
        page.wait_for_timeout(650)
        hours,rate,myrate,cov,weeks=values
        assert page.locator('#roi-money').inner_text()==f'${round(hours*cov/100*weeks*(rate-myrate)):,}'
    page.locator('#cmd-open').focus()
    for shortcut in ['Control+k','Meta+k']:
        page.keyboard.press(shortcut)
        assert page.locator('#palette-input').evaluate('(el)=>el===document.activeElement')
        page.keyboard.press('Tab')
        assert page.locator('#palette').evaluate('(el)=>el.contains(document.activeElement)')
        page.keyboard.press('Escape')
        assert not page.locator('#palette').is_visible()
        assert page.locator('#cmd-open').evaluate('(el)=>el===document.activeElement')
    page.keyboard.press('Control+k');page.keyboard.press('Control+k')
    assert not page.locator('#palette').is_visible()
    page.keyboard.press('Control+k');page.locator('#palette-input').fill('ROI');page.keyboard.press('Enter')
    assert not page.locator('#palette').is_visible()
    zone=page.evaluate("new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',timeZoneName:'short'}).formatToParts(new Date()).find(p=>p.type==='timeZoneName').value")
    assert page.locator('.clock-label').inner_text()==zone+' USA'
    page.keyboard.press('Control+k');page.locator('#palette-input').fill('no such command xyz')
    assert page.locator('#palette-list').inner_text()=='No matching commands'
    page.keyboard.press('ArrowDown');page.keyboard.press('Enter')
    assert page.locator('#palette').is_visible()
    page.keyboard.press('Shift+Tab')
    assert page.locator('#palette-input').evaluate('(el)=>el===document.activeElement')
    page.keyboard.press('Escape')
    for category,count in [('all',44),('GHL',20),('Make.com',6),('Zapier',7),('n8n',11)]:
        page.locator(f'[data-filter="{category}"]').click()
        assert page.locator('.proj-card[data-visible="true"]').count()==count
        assert page.locator('.proj-card.active:not(.hide)').count()==1
    page.evaluate('bkOpen()')
    assert page.locator('#bkOverlay').get_attribute('aria-hidden')=='false'
    page.evaluate('bkClose()')
    assert page.locator('#bkOverlay').get_attribute('aria-hidden')=='true'
    page.locator('#marquee').scroll_into_view_if_needed()
    # Duplicate marquee images can be outside the lazy-loading viewport.
    failed_logos=page.locator('#marquee img').evaluate_all('async els=>{const failed=[];await Promise.all(els.map(async e=>{e.loading="eager";try{await e.decode();}catch{failed.push(e.getAttribute("src"));}}));return failed;}')
    assert not failed_logos,failed_logos
    assert not errors,errors
    print(json.dumps({'simulation':'one real 5 to 7 second tick, pause, range consistency, reduced motion passed','roi':'initial and four input combinations passed','palette':'Ctrl/Cmd K, toggle, Escape, focus containment and restoration, search selection passed','clock':zone,'pageErrors':errors},indent=2))
    browser.close()
