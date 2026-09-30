"""Verify funnel typography, responsive fit, and Villa Tala PHP pricing."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlsplit
import json, sys, tempfile

input_url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8121/"
parts = urlsplit(input_url)
base = f"{parts.scheme}://{parts.netloc}{parts.path}".rstrip("/")
query = f"?{parts.query}" if parts.query else ""
out = Path(tempfile.gettempdir())
funnels = {
    "airbnb": {"nav": ".desktop-nav", "display": "Gilda Display", "body": "DM Sans"},
    "lemonjuice": {"nav": ".desktop-nav", "display": "Italiana", "body": "Outfit"},
    "solar": {"nav": ".site-header nav", "display": "Space Grotesk", "body": "IBM Plex Sans"},
    "villatala": {"nav": ".site-header nav", "display": "Cormorant Garamond", "body": "Montserrat"},
}
report = {"base": base, "funnels": {}, "errors": []}

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    bootstrap = context.new_page()
    bootstrap.goto(f"{base}/{query}", wait_until="domcontentloaded")
    bootstrap.wait_for_timeout(12000)
    bootstrap.close()
    for name, expected in funnels.items():
        page = context.new_page()
        page.on("pageerror", lambda error, n=name: report["errors"].append(f"{n}: {error}"))
        page.goto(f"{base}/{name}/{query}", wait_until="domcontentloaded")
        page.wait_for_selector("h1", timeout=20000)
        page.wait_for_function("() => !document.fonts || document.fonts.status === 'loaded'", timeout=15000)
        page.wait_for_timeout(350)
        metrics = page.evaluate("""navSel => {
          const px = el => parseFloat(getComputedStyle(el).fontSize);
          const fam = el => getComputedStyle(el).fontFamily;
          return {
            h1: px(document.querySelector('h1')),
            h2: px(document.querySelector('h2')),
            nav: px(document.querySelector(navSel)),
            eyebrow: px(document.querySelector('.eyebrow')),
            brand: px(document.querySelector('.brand')),
            headingFamily: fam(document.querySelector('h1')),
            bodyFamily: fam(document.body),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            tinyVisible: [...document.querySelectorAll('body *')].filter(e => {
              const s=getComputedStyle(e), r=e.getBoundingClientRect();
              return e.textContent.trim() && e.children.length===0 && s.display!=='none' && s.visibility!=='hidden' && +s.opacity>0 && r.width>0 && r.height>0 && px(e)<11;
            }).length
          };
        }""", expected["nav"])
        assert metrics["h1"] >= 68, (name, metrics)
        assert metrics["h2"] >= 48, (name, metrics)
        assert metrics["nav"] >= 13, (name, metrics)
        assert metrics["eyebrow"] >= 12, (name, metrics)
        assert expected["display"] in metrics["headingFamily"], (name, metrics)
        assert expected["body"] in metrics["bodyFamily"], (name, metrics)
        assert metrics["overflow"] == 0, (name, metrics)
        assert metrics["tinyVisible"] == 0, (name, metrics)
        desktop_shot = out / f"{name}-typography-desktop.png"
        page.screenshot(path=str(desktop_shot), full_page=False)

        page.set_viewport_size({"width": 390, "height": 844})
        page.reload(wait_until="domcontentloaded")
        page.wait_for_function("() => !document.fonts || document.fonts.status === 'loaded'", timeout=15000)
        page.wait_for_timeout(250)
        mobile = page.evaluate("""() => {
          const px = el => parseFloat(getComputedStyle(el).fontSize);
          return {
            h1: px(document.querySelector('h1')),
            h2: px(document.querySelector('h2')),
            brand: px(document.querySelector('.brand')),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            tinyVisible: [...document.querySelectorAll('body *')].filter(e => {
              const s=getComputedStyle(e), r=e.getBoundingClientRect();
              return e.textContent.trim() && e.children.length===0 && s.display!=='none' && s.visibility!=='hidden' && +s.opacity>0 && r.width>0 && r.height>0 && px(e)<11;
            }).length
          };
        }""")
        assert mobile["h1"] >= 60, (name, mobile)
        assert mobile["h2"] >= 54, (name, mobile)
        assert mobile["brand"] >= 11, (name, mobile)
        assert mobile["overflow"] == 0, (name, mobile)
        assert mobile["tinyVisible"] == 0, (name, mobile)
        mobile_shot = out / f"{name}-typography-mobile.png"
        page.screenshot(path=str(mobile_shot), full_page=False)

        villa_reserve_shot = None
        if name == "villatala":
            assert page.locator("#totalPrice").inner_text() == "₱145,300"
            assert "$" not in page.locator("#reserve").inner_text()
            page.locator("#reserve").scroll_into_view_if_needed()
            page.wait_for_timeout(250)
            villa_reserve_shot = out / "villatala-pricing-mobile.png"
            page.locator("#reserve").screenshot(path=str(villa_reserve_shot))
            page.locator('[data-nights="14"]').click()
            page.locator("#cellar").check()
            assert page.locator("#totalPrice").inner_text() == "₱237,500"

        shots = [str(desktop_shot), str(mobile_shot)]
        if villa_reserve_shot:
            shots.append(str(villa_reserve_shot))
        report["funnels"][name] = {
            "desktop": metrics,
            "mobile": mobile,
            "screenshots": shots,
        }
        page.close()
    context.close()
    browser.close()

assert not report["errors"], report["errors"]
print(json.dumps(report, indent=2, ensure_ascii=False))
