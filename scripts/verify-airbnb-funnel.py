"""Verify the portfolio funnel showcase and linked Airbnb experience."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, sys, tempfile

url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8121/"
report = {"url": url, "viewports": [], "pageErrors": []}

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda error: report["pageErrors"].append(str(error)))
    page.goto(url, wait_until="domcontentloaded")
    page.locator("#funnels").scroll_into_view_if_needed()
    page.wait_for_timeout(500)

    assert page.locator("#craftee + #funnels").count() == 1
    assert page.locator("#funnels .funnel-feature").count() == 1
    assert page.locator("#funnels .funnel-preview img").evaluate("img => img.complete && img.naturalWidth > 0")
    assert page.locator("#funnels .funnel-preview").get_attribute("href") == "airbnb/"
    assert page.locator("#funnels .funnel-preview").get_attribute("target") == "_blank"

    with page.expect_popup() as popup_info:
        page.locator("#funnels .funnel-preview").click()
    popup = popup_info.value
    popup.wait_for_load_state("domcontentloaded")
    assert "/airbnb/" in popup.url
    assert popup.title() == "The Threshold | Private stay in Joshua Tree"
    popup.close()

    for width, height, label in [(1440, 1000, "desktop"), (390, 844, "mobile")]:
        page.set_viewport_size({"width": width, "height": height})
        page.locator("#funnels").scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        assert overflow == 0, (label, overflow)
        path = Path(tempfile.gettempdir()) / f"portfolio-airbnb-funnel-{label}.png"
        page.locator("#funnels").screenshot(path=str(path))
        report["viewports"].append({"name": label, "overflow": overflow, "screenshot": str(path)})

    assert not report["pageErrors"], report["pageErrors"]
    browser.close()

print(json.dumps(report, indent=2))
