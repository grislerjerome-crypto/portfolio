from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request,json
ROOT=Path(__file__).parent
names='n8n zapier make openai anthropic googlegemini langchain supabase notion airtable slack twilio react nextdotjs typescript tailwindcss nodedotjs python laravel postgresql mongodb docker github vercel cloudflare figma shopify amazon woocommerce stripe ebay etsy zendesk googleanalytics dhl fedex ups sap odoo googlemaps googlesheets'.split()
def fetch(name):
    url=f'https://cdn.jsdelivr.net/npm/simple-icons@13/icons/{name}.svg'
    try:
        data=urllib.request.urlopen(url,timeout=30).read()
        assert b'<svg' in data
        (ROOT/'assets'/f'{name}.svg').write_bytes(data)
        return {'name':name,'file':f'assets/{name}.svg','source':url,'collection':'Simple Icons 13, original brand marks; trademarks belong to their owners'}
    except Exception as e:return {'name':name,'error':str(e)}
(ROOT/'assets').mkdir(exist_ok=True)
rows=list(ThreadPoolExecutor(12).map(fetch,names))
url='https://www.google.com/s2/favicons?domain=gohighlevel.com&sz=128'
try:
    data=urllib.request.urlopen(url,timeout=30).read();(ROOT/'assets'/'gohighlevel.png').write_bytes(data)
    rows.append({'name':'gohighlevel','file':'assets/gohighlevel.png','source':url,'collection':'Official GoHighLevel domain favicon via Google favicon cache'})
except Exception as e:rows.append({'name':'gohighlevel','error':str(e)})
(ROOT/'logo-sources.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
print(json.dumps(rows,indent=2))
