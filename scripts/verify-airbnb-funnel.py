"""Verify both portfolio conversion funnels and their linked experiences."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, sys, tempfile

url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8121/"
report = {"url": url, "viewports": [], "pageErrors": [], "routes": {}}

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda error: report["pageErrors"].append(f"portfolio: {error}"))
    page.goto(url, wait_until="domcontentloaded")
    page.locator("#funnels").scroll_into_view_if_needed()
    page.wait_for_timeout(900)

    assert page.locator("#craftee + #funnels").count() == 1
    features = page.locator("#funnels .funnel-feature")
    previews = page.locator("#funnels .funnel-preview")
    images = page.locator("#funnels .funnel-preview img")
    assert features.count() == 2
    assert previews.count() == 2
    page.wait_for_function("() => [...document.querySelectorAll('#funnels .funnel-preview img')].every(img => img.complete)", timeout=15000)
    assert images.evaluate_all("imgs => imgs.every(img => img.complete && img.naturalWidth > 0)")
    assert previews.nth(0).get_attribute("href") == "airbnb/"
    assert previews.nth(1).get_attribute("href") == "lemonjuice/"
    assert previews.nth(0).get_attribute("target") == "_blank"
    assert previews.nth(1).get_attribute("target") == "_blank"

    with page.expect_popup() as popup_info:
        previews.nth(0).click()
    airbnb = popup_info.value
    airbnb.wait_for_load_state("domcontentloaded")
    assert "/airbnb/" in airbnb.url
    assert airbnb.title() == "The Threshold | Private stay in Joshua Tree"
    report["routes"]["airbnb"] = airbnb.url
    airbnb.close()

    with page.expect_popup() as popup_info:
        previews.nth(1).click()
    lemon = popup_info.value
    lemon.on("pageerror", lambda error: report["pageErrors"].append(f"lemon: {error}"))
    lemon.wait_for_load_state("domcontentloaded")
    assert "/lemonjuice/" in lemon.url
    assert lemon.title() == "Limone Sanctuary | Taste the First Light"
    lemon.locator('[data-flavor="2"]').click()
    assert "Blood Orange" in lemon.locator("#flavorTitle").inner_text()
    report["routes"]["lemonjuice"] = lemon.url
    lemon.close()

    for width, height, label in [(1440, 1000, "desktop"), (390, 844, "mobile")]:
        page.set_viewport_size({"width": width, "height": height})
        page.locator("#funnels").scroll_into_view_if_needed()
        page.wait_for_timeout(900)
        overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        assert overflow == 0, (label, overflow)
        path = Path(tempfile.gettempdir()) / f"portfolio-conversion-funnels-{label}.png"
        page.locator("#funnels").screenshot(path=str(path))
        report["viewports"].append({"name": label, "overflow": overflow, "screenshot": str(path)})

    assert not report["pageErrors"], report["pageErrors"]
    browser.close()

print(json.dumps(report, indent=2))
