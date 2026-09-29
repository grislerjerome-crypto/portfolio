"""Verify the compact portfolio funnel book and linked experiences."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, sys, tempfile

url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8121/"
report = {"url": url, "viewports": [], "pageErrors": [], "routes": {}, "book": {}}

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda error: report["pageErrors"].append(f"portfolio: {error}"))
    page.goto(url, wait_until="domcontentloaded")
    page.locator("#funnels").scroll_into_view_if_needed()
    page.wait_for_timeout(900)

    assert page.locator("#craftee + #funnels").count() == 1
    book = page.locator("#funnel-book")
    pages = page.locator("#funnel-book [data-book-page]")
    visuals = page.locator("#funnel-book .book-visual")
    images = page.locator("#funnel-book img")
    assert book.count() == 1
    assert pages.count() == 3
    assert page.locator("#funnel-book .book-page.active").count() == 1
    assert page.locator("#book-page-count").inner_text() == "01 / 03"
    page.wait_for_function("() => [...document.querySelectorAll('#funnel-book img')].every(img => img.complete)", timeout=15000)
    assert images.evaluate_all("imgs => imgs.every(img => img.complete && img.naturalWidth > 0)")
    assert visuals.nth(0).get_attribute("href") == "airbnb/"
    assert visuals.nth(1).get_attribute("href") == "lemonjuice/"
    assert visuals.nth(0).get_attribute("target") == "_blank"
    assert visuals.nth(1).get_attribute("target") == "_blank"
    duration = pages.nth(0).evaluate("el => getComputedStyle(el).transitionDuration")
    assert ".6s" in duration or "0.6s" in duration

    start_height = book.bounding_box()["height"]
    with page.expect_popup() as popup_info:
        visuals.nth(0).click()
    airbnb = popup_info.value
    airbnb.wait_for_load_state("domcontentloaded")
    assert "/airbnb/" in airbnb.url
    assert airbnb.title() == "The Threshold | Private stay in Joshua Tree"
    report["routes"]["airbnb"] = airbnb.url
    airbnb.close()

    page.locator("#book-next").click()
    page.wait_for_timeout(700)
    assert page.locator("#book-page-count").inner_text() == "02 / 03"
    assert "Limone Sanctuary" in page.locator("#funnel-book .book-page.active h3").inner_text()
    assert abs(book.bounding_box()["height"] - start_height) < 1
    with page.expect_popup() as popup_info:
        visuals.nth(1).click()
    lemon = popup_info.value
    lemon.on("pageerror", lambda error: report["pageErrors"].append(f"lemon: {error}"))
    lemon.wait_for_load_state("domcontentloaded")
    assert "/lemonjuice/" in lemon.url
    assert lemon.title() == "Limone Sanctuary | Taste the First Light"
    lemon.locator('[data-flavor="2"]').click(force=True)
    assert "Blood Orange" in lemon.locator("#flavorTitle").inner_text()
    report["routes"]["lemonjuice"] = lemon.url
    lemon.close()

    page.locator("#book-next").click()
    page.wait_for_timeout(700)
    assert page.locator("#book-page-count").inner_text() == "03 / 03"
    assert page.locator("#book-next").is_disabled()
    page.locator("#book-prev").click()
    page.wait_for_timeout(700)
    assert page.locator("#book-page-count").inner_text() == "02 / 03"
    page.locator('[data-book-go="0"]').click()
    page.wait_for_timeout(700)
    assert page.locator("#book-page-count").inner_text() == "01 / 03"
    assert page.locator("#book-prev").is_disabled()
    report["book"] = {"pages": 3, "next": "passed", "previous": "passed", "dots": "passed", "heightStable": True, "transition": duration}

    for width, height, label in [(1440, 1000, "desktop"), (390, 844, "mobile")]:
        page.set_viewport_size({"width": width, "height": height})
        page.locator("#funnels").scroll_into_view_if_needed()
        page.wait_for_timeout(900)
        overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        assert overflow == 0, (label, overflow)
        if label == "mobile":
            visual_box = page.locator("#funnel-book .book-page.active .book-visual").bounding_box()
            copy_box = page.locator("#funnel-book .book-page.active .book-copy").bounding_box()
            assert visual_box["y"] < copy_box["y"]
            for index in (1, 2):
                page.locator(f'[data-book-go="{index}"]').click()
                page.wait_for_timeout(700)
                fits = page.locator("#funnel-book .book-page.active").evaluate("el => el.scrollHeight <= el.clientHeight + 2")
                assert fits, f"mobile page {index + 1} exceeds the fixed book viewport"
            page.locator('[data-book-go="0"]').click()
            page.wait_for_timeout(700)
        path = Path(tempfile.gettempdir()) / f"portfolio-funnel-book-{label}.png"
        page.locator("#funnels").screenshot(path=str(path))
        report["viewports"].append({"name": label, "overflow": overflow, "screenshot": str(path)})

    assert not report["pageErrors"], report["pageErrors"]
    browser.close()

print(json.dumps(report, indent=2))
