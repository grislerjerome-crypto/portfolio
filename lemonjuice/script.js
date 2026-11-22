const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const flavors = [
  { name:'Primofiore Classic', short:'PRI', color:'#f3db45', bottle:'#edd64d', brix:'8.2°', ring:'82%', acidity:94, hydration:100, botanical:42, description:'Clean Sicilian lemon with bright peel oils, mineral spring water, and a dry finish.', ritual:'Pour 120ml over one clear cube at sunrise. Finish with mineral water.' },
  { name:'Cucumber Mint', short:'MNT', color:'#9bd8b5', bottle:'#9fd7b7', brix:'4.1°', ring:'41%', acidity:62, hydration:100, botanical:96, description:'Cool cucumber, mountain mint, and Meyer lemon zest for a clean mineral reset.', ritual:'Serve ice cold after movement, heat, or a long afternoon in the sun.' },
  { name:'Moro Blood Orange', short:'MOR', color:'#ff7b45', bottle:'#cb5a43', brix:'11.5°', ring:'92%', acidity:78, hydration:85, botanical:55, description:'Deep citrus, soft bitterness, and natural ruby sweetness with an aperitif finish.', ritual:'Pour over sparkling mineral water with rosemary at sunset.' },
  { name:'Lavender Thyme', short:'LAV', color:'#c5adea', bottle:'#b9a4d7', brix:'5.6°', ring:'56%', acidity:68, hydration:92, botanical:100, description:'Primofiore lemon lifted with wild lavender and a clean thread of mountain thyme.', ritual:'Sip chilled in the evening for a softer botanical finish.' }
];
let activeFlavor = 0;
let crate = [0,1,2];
let toastTimer;
function showToast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3200);
}
function selectFlavor(index) {
  activeFlavor = Number(index);
  const f = flavors[activeFlavor];
  document.documentElement.style.setProperty('--flavor', f.color);
  $('#flavorTitle').textContent = f.name;
  $('#sceneFlavor').textContent = f.name;
  $('#flavorBatch').textContent = `BLEND 0${activeFlavor + 1} · TASTING NOTES`;
  $('#flavorDescription').textContent = f.description;
  $('#brixValue').textContent = f.brix;
  ['acidity','hydration','botanical'].forEach(key => {
    $(`#${key}Value`).textContent = `${f[key]}%`;
    $(`#${key}Bar`).style.width = `${f[key]}%`;
  });
  $('#sensoryRing').style.setProperty('--ring', f.ring);
  $('#ritualText').textContent = f.ritual;
  $('#activeMarker span').textContent = `0${activeFlavor + 1}`;
  $('#addFlavor').textContent = `Add ${f.name.split(' ')[0]} · $12`;
  $('#quickFlavor').value = String(activeFlavor);
  $('#flavorPanel').setAttribute('aria-labelledby', `flavorTab${activeFlavor}`);
  $$('.flavor-tab').forEach((tab,i) => {
    tab.classList.toggle('active', i === activeFlavor);
    tab.setAttribute('aria-selected', String(i === activeFlavor));
    tab.tabIndex = i === activeFlavor ? 0 : -1;
  });
}
const tabNames = ['Lemon','Mint','Blood orange','Lavender'];
$$('.flavor-tab').forEach((tab,i) => {
  tab.id = `flavorTab${i}`;
  tab.setAttribute('aria-controls', 'flavorPanel');
  tab.setAttribute('aria-label', flavors[i].name);
  tab.innerHTML = `<span style="--dot:${flavors[i].color}"></span>${tabNames[i]}`;
  tab.addEventListener('click', () => selectFlavor(i));
  tab.addEventListener('keydown', event => {
    let next;
    if(event.key === 'ArrowRight') next = (i+1)%4;
    if(event.key === 'ArrowLeft') next = (i+3)%4;
    if(event.key === 'Home') next = 0;
    if(event.key === 'End') next = 3;
    if(next === undefined) return;
    event.preventDefault(); selectFlavor(next); $$('.flavor-tab')[next].focus();
  });
});
function renderCrate() {
  $('#bottleSlots').innerHTML = Array.from({length:6}, (_,i) => {
    if(crate[i] === undefined) return `<div class="bottle-slot"><span class="empty-plus" aria-label="Empty space ${i+1}">${String(i+1).padStart(2,'0')}</span></div>`;
    const f = flavors[crate[i]];
    return `<div class="bottle-slot filled"><button type="button" data-remove="${i}" aria-label="Remove ${f.name}, bottle ${i+1}">×</button><div class="mini-bottle" data-code="${f.short}" style="--bottle:${f.bottle}" aria-hidden="true"></div><span class="slot-name">${tabNames[crate[i]]}</span></div>`;
  }).join('');
  const count = crate.length, total = count * 12;
  ['crateCount','navCount','dockCount'].forEach(id => $(`#${id}`).textContent = count);
  $('#crateTotal').textContent = `$${total.toFixed(2)}`;
  $('#dockTotal').textContent = `$${total}`;
  $('#crateProgress').style.width = `${count/6*100}%`;
  $('#crateStatus').textContent = count === 6 ? 'Six of six. Your flight is ready to review.' : `${6-count} space${count===5?'':'s'} left. Make ${count===5?'it':'them'} yours.`;
  $('#checkoutButton').textContent = count === 6 ? 'Review your flight ↗' : `Choose ${6-count} more`;
  $('#checkoutButton').disabled = count < 6;
  $('#quickAdd').disabled = count === 6;
  $('#quickAdd').textContent = count === 6 ? 'Crate full' : 'Add · $12';
  $('#addFlavor').disabled = count === 6;
  $('#resetCrate').disabled = count === 0;
  $('#crateReview').hidden = true;
  $('#dockSlots').innerHTML = Array.from({length:6}, (_,i) => `<i style="--mini:${crate[i]===undefined?'transparent':flavors[crate[i]].color}"></i>`).join('');
}
$('#bottleSlots').addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if(!button) return;
  const i = Number(button.dataset.remove), name = flavors[crate[i]].name;
  crate.splice(i,1); renderCrate();
  const buttons = $$('[data-remove]');
  (buttons[Math.min(i,buttons.length-1)] || $('#quickFlavor')).focus({preventScroll:true});
  showToast(`${name} removed. ${crate.length} of 6 bottles.`);
});
function addToCrate(index) {
  if(crate.length >= 6) { showToast('Your flight is full. Remove a bottle to change a blend.'); return; }
  const i = Number(index);
  if(!Number.isInteger(i) || !flavors[i]) return;
  crate.push(i); renderCrate();
  showToast(`${flavors[i].name} added. ${crate.length} of 6 bottles.`);
}
$('#addFlavor').addEventListener('click', () => addToCrate(activeFlavor));
$('#quickAdd').addEventListener('click', () => addToCrate($('#quickFlavor').value));
$('#resetCrate').addEventListener('click', () => { crate=[]; renderCrate(); $('#quickFlavor').focus({preventScroll:true}); showToast('Crate cleared. Start with your favorite blend.'); });
$('#checkoutButton').addEventListener('click', () => {
  if(crate.length !== 6) return;
  const rows = flavors.map((f,i) => ({name:f.name,count:crate.filter(v=>v===i).length})).filter(f=>f.count);
  $('#crateReview').innerHTML = `<strong>Your six bottle flight</strong><ul>${rows.map(f=>`<li>${f.count} × ${f.name}<span>$${f.count*12}</span></li>`).join('')}</ul><p>Demo total: $72.00. This is a preview, not an order.</p>`;
  $('#crateReview').hidden = false;
  $('#crateReview').focus();
});
const menuToggle = $('#menuToggle'), mobileMenu = $('#mobileMenu');
menuToggle.setAttribute('aria-controls','mobileMenu');
function closeMenu(restore=false) {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden','true');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Open menu');
  document.body.classList.remove('menu-open');
  $$('main,footer,.nav-cart,.brand').forEach(element => element.inert = false);
  if(restore) menuToggle.focus();
  updateScrollState();
}
menuToggle.addEventListener('click', () => {
  if(mobileMenu.classList.contains('open')) { closeMenu(true); return; }
  mobileMenu.classList.add('open'); mobileMenu.setAttribute('aria-hidden','false');
  menuToggle.setAttribute('aria-expanded','true'); menuToggle.setAttribute('aria-label','Close menu');
  document.body.classList.add('menu-open');
  $$('main,footer,.nav-cart,.brand').forEach(element => element.inert = true);
  $('#toast').classList.remove('show');
  $('#crateDock').classList.remove('show'); $('#crateDock').inert=true;
  $('a',mobileMenu).focus();
});
$$('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>{ closeMenu(); const target=$(link.hash); target.tabIndex=-1; target.focus({preventScroll:true}); }));
window.addEventListener('keydown', event => {
  if(!mobileMenu.classList.contains('open')) return;
  if(event.key==='Escape') {closeMenu(true); return;}
  if(event.key==='Tab') {
    const controls=[menuToggle,...$$('a,button',mobileMenu)];
    const first=controls[0], last=controls[controls.length-1];
    if(event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
  }
});
$$('.js-open-crate').forEach(button=>button.addEventListener('click',()=>{
  closeMenu(); $('.crate-builder').scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
  $('#quickFlavor').focus({preventScroll:true});
}));
function updateScrollState() {
  $('#siteHeader').classList.toggle('scrolled',scrollY>40);
  const rect=$('.crate-builder').getBoundingClientRect();
  const lab=$('#flavors').getBoundingClientRect();
  const show=scrollY>innerHeight*.8 && !(rect.top<innerHeight && rect.bottom>68) && !(lab.top<innerHeight && lab.bottom>68) && !document.body.classList.contains('menu-open');
  $('#crateDock').classList.toggle('show',show); $('#crateDock').inert=!show;
}
let scheduled=false;
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{updateScrollState();scheduled=false;});}},{passive:true});
window.addEventListener('resize',()=>{if(innerWidth>1050)closeMenu();updateScrollState();});
const stages=['DAWN HARVEST','WHOLE FRUIT PRESS','GLASS BOTTLING','COLD RELEASE'];
$$('.process-step').forEach((step,index)=>{
  step.setAttribute('aria-pressed',String(index===0));
  step.addEventListener('click',()=>{
    $$('.process-step').forEach(item=>{item.classList.toggle('active',item===step);item.setAttribute('aria-pressed',String(item===step));});
    $('.origin-bottle strong').textContent=stages[index];
  });
});
renderCrate(); selectFlavor(0); updateScrollState();
