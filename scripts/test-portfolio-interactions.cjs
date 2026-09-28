const {readFileSync}=require('node:fs');
const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const html=readFileSync('index.html','utf8');
const simulation=html.slice(html.indexOf('function createCommerceSimulation('),html.indexOf('/* Interactive illustrative operations visuals.'));
const clock=html.slice(html.indexOf('function newYorkTime('),html.indexOf('function setupClock('));
const context=vm.createContext({Intl,Date,Math});vm.runInContext(simulation+'\n'+clock,context);
test('simulation endpoints, range totals and stock floors',()=>{
 for(const random of [0,.999999]){
  const model=context.createCommerceSimulation(()=>random),before=model.snapshot();
  assert.equal(model.delay(),random===0?5000:7000);model.tick();
  const after=model.snapshot();assert.equal(after.sales-before.sales,random===0?5:50);assert.equal(after.orders-before.orders,1);
  for(const key of ['week','month','quarter'])assert(Math.abs(model.snapshot(key).mix.reduce((a,b)=>a+b,0)-100)<1e-9);
  for(let i=0;i<200;i++)model.tick();
  assert(model.snapshot().stock.every(n=>n>=0));
  assert.equal(model.snapshot('month').sales-model.snapshot().sales,186000-48600);
  assert.equal(model.snapshot('quarter').orders-model.snapshot().orders,14806-1284);
  const copy=model.snapshot();copy.stock[0]=-999;assert(model.snapshot().stock[0]>=0);
 }
});
test('simulation scheduler pauses hidden, offscreen, reduced motion, and avoids duplicate loops',()=>{
 const handlers={},button={addEventListener:(k,fn)=>handlers.click=fn,setAttribute(){}},section={dataset:{}},status={};
 const motion={matches:false,addEventListener:(k,fn)=>handlers.motion=fn};let id=0,renders=0;const timers=new Map();
 const doc={hidden:false,getElementById:key=>({'ecommerce-operations':section,'commerce-simulation-toggle':button,'commerce-simulation-status':status}[key]),addEventListener:(k,fn)=>handlers.visibility=fn};
 const sandbox=vm.createContext({Math,document:doc,matchMedia:()=>motion,setTimeout:(fn,delay)=>{assert(delay>=5000&&delay<=7000);timers.set(++id,fn);return id;},clearTimeout:key=>timers.delete(key),IntersectionObserver:class{constructor(fn){handlers.intersection=fn;}observe(){}}});
 vm.runInContext(simulation,sandbox);sandbox.setupCommerceSimulation(()=>renders++);assert.equal(timers.size,0);
 handlers.intersection([{isIntersecting:true}]);assert.equal(timers.size,1);
 sandbox.setupCommerceSimulation(()=>renders++);assert.equal(timers.size,1);
 const callback=[...timers.values()][0];timers.clear();callback();assert.equal(renders,1);assert.equal(timers.size,1);
 doc.hidden=true;handlers.visibility();assert.equal(timers.size,0);
 doc.hidden=false;handlers.visibility();assert.equal(timers.size,1);
 handlers.intersection([{isIntersecting:false}]);assert.equal(timers.size,0);
 handlers.intersection([{isIntersecting:true}]);assert.equal(timers.size,1);
 motion.matches=true;handlers.motion();assert.equal(timers.size,0);
 handlers.click();assert.equal(timers.size,1);handlers.click();assert.equal(timers.size,0);
});
test('New York clock follows winter, summer and both DST transitions',()=>{
 const cases=[['2026-01-15T12:00:00Z','07:00:00','EST'],['2026-07-15T12:00:00Z','08:00:00','EDT'],['2026-03-08T06:59:59Z','01:59:59','EST'],['2026-03-08T07:00:00Z','03:00:00','EDT'],['2026-11-01T05:59:59Z','01:59:59','EDT'],['2026-11-01T06:00:00Z','01:00:00','EST'],['2026-01-15T05:00:00Z','00:00:00','EST']];
 for(const [date,time,zone] of cases){const result=context.newYorkTime(new Date(date));assert.equal(result.time,time);assert.equal(result.zone,zone);}
});
