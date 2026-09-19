const fs=require('node:fs');
const vm=require('node:vm');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8').replace(/\r\n/g,'\n');
let count=0;
for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
 if(m[1].includes('ld+json')) JSON.parse(m[2]); else {new vm.Script(m[2]);count++;}
}
const base=cp.execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8'});
function config(s){const start=s.indexOf('const CONFIG');const end=s.indexOf('\n};',start);assert(start>=0&&end>start);return vm.runInNewContext(s.slice(start,end+3)+';CONFIG');}
const before=config(base),after=config(html);
assert.equal(JSON.stringify(before),JSON.stringify(after),'CONFIG and all 44 project records must remain identical');
assert.equal(after.projects.length,44);

// Compare unchanged booking markup and inline booking functions.
const bookingStart=html.indexOf('<!-- Booking Popup -->');
const bookingEnd=html.indexOf('<footer',bookingStart);
if(bookingEnd>bookingStart)assert.equal(html.slice(bookingStart,bookingEnd),base.slice(base.indexOf('<!-- Booking Popup -->'),base.indexOf('<footer',base.indexOf('<!-- Booking Popup -->'))));
assert.equal(html.slice(html.indexOf('function bkOpen()')),base.slice(base.indexOf('function bkOpen()')),'Booking functions unchanged');
for(const id of ['ecom-starter','ecom-premium','ecommerce-operations','logistics-operations'])assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id+' must be unique');
assert(!html.includes('id="operations-samples"'),'Obsolete Operations in Practice section removed');
assert(!/ops-queue|ops-output|data-ops-mode|setupShowcases/.test(html),'Obsolete queue markup and JS removed');
assert.equal((html.match(/data-commerce-view=/g)||[]).length,3,'Three ecommerce dashboard views');
assert.equal((html.match(/class="route-node/g)||[]).length,4,'Four shipment nodes');
assert(html.includes('@media(prefers-reduced-motion:reduce)'),'Reduced motion fallback exists');
assert((html.match(/Illustrative sample data/g)||[]).length>=2,'Both visuals explicitly label illustrative sample data');
assert(html.toLowerCase().includes('illustrative sample data, not a client result'),'Ava distinguishes sample data from client results');
assert(html.includes('function setupOperationsVisuals()'),'New interactive controller exists');
assert(html.includes('setupOperationsVisuals();'),'New interactive controller boots');
const added=cp.execFileSync('git',['diff','--unified=0'],{encoding:'utf8'}).split('\n').filter(x=>x.startsWith('+')&&!x.startsWith('+++')).join('\n');
assert(!/(?:ghp_|github_pat_|sk_live_)[A-Za-z0-9_]{12,}/.test(added),'No credential tokens in additions');
assert(!/innerHTML\s*=\s*(?:q|input\.value|data\.reply)/.test(added),'No visitor HTML injection');
const newSections=html.slice(html.indexOf('<section id="craftee"'),html.indexOf('<section id="projects"'));
assert(!/[\u2013\u2014]/.test(newSections),'New visible sections have no en or em dashes');
console.log(JSON.stringify({scriptsParsed:count,configUnchanged:true,projects:after.projects.length,bookingFunctionsUnchanged:true,uniqueShowcases:true,obsoleteQueueRemoved:true,ecommerceViews:3,shipmentNodes:4,reducedMotionFallback:true,illustrativeLabels:true,addedSecretScan:'passed',newCopyDashScan:'passed'}));
