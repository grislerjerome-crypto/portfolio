# Rome: niche experience prototype

Standalone review artifact. This folder is isolated on `prototype/niche-experiences`. Do not merge or push to `main` without explicit approval. The main portfolio and Hostinger deployment are not part of this prototype.

## Local preview

From this folder:

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/. No build step, external scripts, API keys, or runtime network integrations. All company marks are local assets.

## Experiences

- **AI Automations:** GoHighLevel specialist positioning, dimensional radial orchestration hub, LLM/RAG/Agent/MCP stack, five stage lead journey and simulated agent decision trail.
- **Website Development:** frontend/backend/database/deployment architecture, genuine technology marks, progressive sample page assembly with local build progress.
- **Ecommerce:** illustrative multichannel workspace, channel filter, sample order reconciliation, exception count and order statuses.
- **Supply Chain & Logistics:** conceptual lane map, dimensional fulfillment stages, inventory reservation and sample delivery status.

Every mode has a working simulation, pause/resume and reset. Keyboard arrow/Home/End tab navigation and system reduced motion are supported. All activity and metrics are illustrative; no account connection, certification, carrier booking, deployment or real customer result is claimed.

## Brand assets

`logo-sources.json` records every downloaded asset and source URL. SVG marks come from [Simple Icons v13](https://github.com/simple-icons/simple-icons/tree/13.0.0), distributed through jsDelivr. These are real, monochrome brand marks, not invented letter badges. Simple Icons is CC0; trademarks and brand-use restrictions remain with their respective owners. The GoHighLevel official-domain favicon was obtained through Google's favicon cache after the direct website returned HTTP 403. Some collection marks may represent a historical brand version. No endorsement or affiliation is implied.

`download_logos.py` reproduces the local downloads. Python standard library only.

## Browser QA

```sh
python qa.py
```

Requires Python Playwright and Microsoft Edge. Tests the running local server in a real Chromium browser, at desktop 1440 × 1100 and mobile 390 × 844. Covers all four modes, actual logo loading, page and console errors, HTTP failures, page/container overflow, run/pause/resume/reset, ecommerce filters, final state assertions, reduced motion and keyboard tab navigation.

Evidence: `qa-evidence/report.json` and eight full-page screenshots. An additional manual browser layout sweep at widths 320, 360, 768 and 1024 found no overflowing metric, layer, control, branch or tab containers.

Reference direction: layered modern AI stack, branching web architecture, blue/gold dimensional workflow and a radial orchestrator. Styling uses Rome's dark glass, lime, cyan and magenta palette, plus warm gold for logistics.
