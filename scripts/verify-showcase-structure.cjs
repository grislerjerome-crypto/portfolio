const fs=require('node:fs');
const vm=require('node:vm');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8').replace(/\r\n/g,'\n');
let scriptsParsed=0;
for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  if(m[1].includes('ld+json')) JSON.parse(m[2]); else {new vm.Script(m[2]);scriptsParsed++;}
}
const base=cp.execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8'}).replace(/\r\n/g,'\n');
function config(s){const start=s.indexOf('const CONFIG');const end=s.indexOf('\n};',start);assert(start>=0&&end>start);return vm.runInNewContext(s.slice(start,end+3)+';CONFIG');}
const before=config(base),after=config(html);
assert.equal(JSON.stringify(before),JSON.stringify(after),'CONFIG and all project records must remain identical');
assert.equal(after.projects.length,44);

const bookingStart=html.indexOf('<!-- Booking Popup -->');
const bookingEnd=html.indexOf('<footer',bookingStart);
if(bookingEnd>bookingStart)assert.equal(html.slice(bookingStart,bookingEnd),base.slice(base.indexOf('<!-- Booking Popup -->'),base.indexOf('<footer',base.indexOf('<!-- Booking Popup -->'))));
assert.equal(html.slice(html.indexOf('function bkOpen()')),base.slice(base.indexOf('function bkOpen()')),'Booking functions unchanged');

for(const id of ['ecom-starter','ecom-premium','ecommerce-operations','logistics-operations'])assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id+' must be unique');
assert.equal((html.match(/data-ecom-view=/g)||[]).length,3,'Three Premium preview tabs');
assert.equal((html.match(/data-starter-view=/g)||[]).length,0,'Starter has only one featured homepage image');
assert(html.includes('https://threadlab.agentrome.site'),'ThreadLab Starter store is linked');
assert(html.includes('View Starter Store'),'Starter CTA label updated');
assert(html.includes('Up to $499')&&html.includes('Up to $799 + $15/mo care'),'Plan pricing is visible');
assert(!/Is Starter right for me\?|What would my store include\?/.test(html),'Old detail accordions removed');
assert(html.includes("customer:{src:'apparel-lab-customer.png'"),'Customer preview is wired');
assert(html.includes('https://apparel.agentrome.site/customer-login'),'Customer dashboard is linked');
assert(html.includes('View Premium Store')&&html.includes('Customer Dashboard')&&html.includes('Admin Dashboard'),'Premium CTA labels updated');
assert(!/ecom-book|ecom-turn|data-ecom-page|data-plan-page/.test(html),'Page turn controls and fold state removed');
assert(html.includes('customer@apparellab.com')&&html.includes('admin@apparellab.com'),'Demo dashboard credentials are shown');
assert(html.includes('Login using Demo dashboards access:')&&!html.includes('Demo dashboard access</strong>'),'Demo dashboard access label updated');
assert(!html.includes('Customer and admin areas use demo sign in flows'),'Old demo availability sentence removed');
assert(!html.includes('Explore Craftee Sites'),'Explore Craftee Sites chip removed');

const desktopNav=html.match(/<ul>[\s\S]*?<\/ul>/)[0];
const mobileNav=html.match(/<div class="mobile-menu"[\s\S]*?<\/div>/)[0];
for(const nav of [desktopNav,mobileNav]){
  assert(!/How I work|>Ava</.test(nav),'Removed links stay out of navigation');
  for(const href of ['#services','#craftee','#ecommerce-operations','#logistics-operations','#projects','#roi','#contact'])assert(nav.includes(`href="${href}"`),`Missing ${href}`);
}
assert(html.includes('timeZone:"America/New_York"'),'Clock uses America/New_York');
assert(html.includes('<span class="clock-label">EST USA</span>'),'Clock has exact EST USA label');
assert(html.includes('@media(max-width:980px){.nav ul{display:none}.hud .clock{display:none}.menu-btn{display:block}}'),'No responsive nav dead zone');

assert.equal((html.match(/data-commerce-view=/g)||[]).length,3,'Three ecommerce time ranges');
assert.equal((html.match(/data-log-filter=/g)||[]).length,4,'Four logistics filters');
assert.equal((html.match(/class="route-node/g)||[]).length,4,'Four selectable shipment records');
for(const marker of ['sales-chart','commerce-donut','inventory-panel','status-donut','throughput-chart','lane-panel','data-table'])assert(html.includes(marker),marker+' missing');
assert((html.match(/Illustrative sample data/g)||[]).length>=2,'Both dashboards label sample data');
assert(html.includes('@media(prefers-reduced-motion:reduce)'),'Reduced motion fallback exists');
assert(html.includes('function setupOperationsVisuals()')&&html.includes('setupOperationsVisuals();'),'Interactive controller boots');

const added=cp.execFileSync('git',['diff','--unified=0'],{encoding:'utf8'}).split('\n').filter(x=>x.startsWith('+')&&!x.startsWith('+++')).join('\n');
assert(!/(?:ghp_|github_pat_|sk_live_)[A-Za-z0-9_]{12,}/.test(added),'No credential tokens in additions');
assert(!/innerHTML\s*=\s*(?:q|input\.value|data\.reply)/.test(added),'No visitor HTML injection');
const newSections=html.slice(html.indexOf('<section id="craftee"'),html.indexOf('<section id="projects"'));
assert(!/[\u2013\u2014]/.test(newSections),'New visible sections have no en or em dashes');
for(const asset of ['apparel-lab-storefront.png','apparel-lab-customer.png','apparel-lab-admin.png'])assert(fs.existsSync(asset),asset+' missing');
console.log(JSON.stringify({scriptsParsed,configUnchanged:true,projects:after.projects.length,bookingFunctionsUnchanged:true,premiumTabs:3,navLinks:7,clock:'America/New_York / EST USA',ecommerceRanges:3,logisticsFilters:4,managementDashboardMarkers:true,reducedMotionFallback:true,addedSecretScan:'passed',newCopyDashScan:'passed'}));
