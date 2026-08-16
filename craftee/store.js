/* Apparel Web Studio . Demo store: full customer store SPA (home/shop/cats/collections/search/wishlist/product/cart/checkout/track) */
(function () {
  // tier:'starter' = available on BOTH plans; others are Premium-only (greyed in Starter)
  const PRODUCTS = [
    { id:'tee',     name:'Crew Tee',       cat:'Tops',      price:42,  was:55,  img:'tee_white.jpg',     sizes:['S','M','L','XL'], colors:['White','Black','Sand'], best:true, tier:'starter' },
    { id:'shirt',   name:'Linen Shirt',    cat:'Tops',      price:68,  was:0,   img:'shirt_linen.jpg',   sizes:['S','M','L','XL'], colors:['White','Sky'], new:true, tier:'starter' },
    { id:'hoodie',  name:'Boxy Hoodie',    cat:'Tops',      price:88,  was:110, img:'hoodie_grey.jpg',   sizes:['S','M','L','XL'], colors:['Black','Grey','Sand'], featured:true, best:true, tier:'starter' },
    { id:'trousers',name:'Wide Trousers',  cat:'Bottoms',   price:74,  was:0,   img:'trousers_wide.jpg', sizes:['S','M','L','XL'], colors:['Black','Stone'], best:true, tier:'starter' },
    { id:'cargo',   name:'Cargo Pants',    cat:'Bottoms',   price:82,  was:99,  img:'pants_cargo.jpg',   sizes:['S','M','L','XL'], colors:['Black','Olive'], featured:true, tier:'starter' },

    { id:'jacket',  name:'Denim Jacket',   cat:'Outerwear', price:140, was:0,   img:'jacket_denim.jpg',  sizes:['S','M','L','XL'], colors:['Blue'], featured:true },
    { id:'coat',    name:'Wool Coat',      cat:'Outerwear', price:199, was:240, img:'coat_wool.jpg',     sizes:['S','M','L'],      colors:['Black','Camel'], new:true },
    { id:'trench',  name:'Trench',         cat:'Outerwear', price:185, was:0,   img:'trench.jpg',        sizes:['S','M','L'],      colors:['Stone','Black'], featured:true },
    { id:'bomber',  name:'Bomber Jacket',  cat:'Outerwear', price:165, was:0,   img:'bomber.jpg',        sizes:['S','M','L','XL'], colors:['Black','Green'] },
    { id:'vest',    name:'Padded Vest',    cat:'Outerwear', price:120, was:0,   img:'vest.jpg',          sizes:['S','M','L','XL'], colors:['Olive','Black'] },
    { id:'skirt',   name:'Pleated Skirt',  cat:'Bottoms',   price:58,  was:0,   img:'skirt_pleat.jpg',   sizes:['S','M','L'],      colors:['Blue','Black'], new:true },
    { id:'joggers', name:'Fleece Joggers', cat:'Bottoms',   price:64,  was:0,   img:'joggers.jpg',       sizes:['S','M','L','XL'], colors:['Grey','Black'] },
    { id:'chino',   name:'Tailored Chino', cat:'Bottoms',   price:78,  was:0,   img:'chino.jpg',         sizes:['S','M','L','XL'], colors:['Stone','Navy'] },
    { id:'polo',    name:'Pique Polo',     cat:'Tops',      price:54,  was:0,   img:'polo.jpg',          sizes:['S','M','L','XL'], colors:['White','Navy','Green'] },
    { id:'sweater', name:'Knit Sweater',   cat:'Tops',      price:96,  was:0,   img:'sweater.jpg',       sizes:['S','M','L','XL'], colors:['Camel','Grey'] },
    { id:'flannel', name:'Flannel Shirt',  cat:'Tops',      price:72,  was:0,   img:'flannel.jpg',       sizes:['S','M','L','XL'], colors:['Red','Blue'] },
    { id:'graphic', name:'Graphic Tee',    cat:'Tops',      price:46,  was:0,   img:'graphic_tee.jpg',   sizes:['S','M','L','XL'], colors:['Black','White'] },
    { id:'scarf',   name:'Wool Scarf',     cat:'Accessories',price:36, was:0,   img:'scarf.jpg',         sizes:['One size'],      colors:['Camel','Grey'] },
    { id:'capr',    name:'Red Cap',        cat:'Caps',      price:32,  was:0,   img:'cap_red.jpg',       sizes:['One size'],      colors:['Red','Black'], best:true },
    { id:'capb',    name:'Black Cap',      cat:'Caps',      price:32,  was:0,   img:'cap_black.jpg',     sizes:['One size'],      colors:['Black','Navy'] },
    { id:'capk',    name:'Knit Beanie',    cat:'Caps',      price:28,  was:0,   img:'cap_knit.jpg',      sizes:['One size'],      colors:['Black','Grey','Camel'], new:true }
  ];
  const CATEGORIES = [
    { name:'Tops',      img:'hoodie_grey.jpg', tier:'starter' },
    { name:'Bottoms',   img:'trousers_wide.jpg', tier:'starter' },
    { name:'Outerwear', img:'jacket_denim.jpg' },
    { name:'Caps',      img:'cap_red.jpg' },
    { name:'Accessories',img:'scarf.jpg' },
    { name:'New',       img:'coat_wool.jpg' },
    { name:'Sale',      img:'pants_cargo.jpg' }
  ];
  const COLLECTIONS = [
    { name:'SS26 Drop',     img:'tee_white.jpg', tier:'starter' },
    { name:'Monochrome',   img:'hoodie_grey.jpg', tier:'starter' },
    { name:'Street Caps',  img:'cap_red.jpg' },
    { name:'Tailored',     img:'trench.jpg' },
    { name:'Earth Tones',  img:'coat_wool.jpg' },
    { name:'Denim Club',   img:'jacket_denim.jpg' },
    { name:'Knit Edit',    img:'sweater.jpg' },
    { name:'Layer Up',     img:'bomber.jpg' }
  ];

  const $ = (s) => document.querySelector(s);
  let cart = JSON.parse(localStorage.getItem('craftee_cart') || '[]');
  let saved = JSON.parse(localStorage.getItem('craftee_wishlist') || '[]');
  let current = null, qty = 1, selSize = '', selColor = '';

  function save(){ localStorage.setItem('craftee_cart', JSON.stringify(cart)); localStorage.setItem('craftee_wishlist', JSON.stringify(saved)); }
  function cartCount(){ $('#cartCount').textContent = cart.reduce((n,i)=>n+i.qty,0); }

  /* ---- plan toggle (Starter vs Premium demo difference) ---- */
  let PLAN = 'starter';
  document.getElementById('planToggle').addEventListener('click', e => {
    const b = e.target.closest('button[data-plan]'); if (!b) return;
    PLAN = b.dataset.plan;
    document.querySelectorAll('#planToggle button').forEach(x=>x.classList.toggle('active', x===b));
    document.body.classList.toggle('plan-premium', PLAN==='premium');
    $('#planHint').textContent = PLAN==='premium' ? 'Showing Premium features' : 'Showing Starter features';
    if ($('#v-shop').classList.contains('active')) renderShop();
    if ($('#v-home').classList.contains('active')) renderHome();
    if ($('#v-categories').classList.contains('active')) renderTiles('#catTiles', CATEGORIES);
    if ($('#v-collections').classList.contains('active')) renderTiles('#colTiles', COLLECTIONS);
    if ($('#v-wishlist').classList.contains('active')) renderWishlist();
    renderPremiumExtras();
  });
  const isPremium = () => PLAN === 'premium';
  const lockedP = (p) => !isPremium() && p.tier !== 'starter';
  const card = (p) => {
    const locked = lockedP(p);
    return `
    <div class="store-prod ${locked?'locked':''}" data-id="${p.id}">
      <div class="store-prod__img" style="background-image:url('assets/${p.img}')"></div>
      <button class="store-prod__save ${saved.includes(p.id)?'saved':''}" data-save="${p.id}">♡</button>
      <div class="store-prod__body">
        <div class="store-prod__name">${p.name}</div>
        <div class="store-prod__price">$${p.price}${p.was?` <s>$${p.was}</s>`:''}</div>
        <button class="store-prod__btn" data-view="product" data-id="${p.id}">${locked?'🔒 Premium only':'View product'}</button>
      </div>
    </div>`;
  };

  /* ---- views / routing ---- */
  function showView(name){
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const v = $('#v-' + name); if (v) v.classList.add('active');
    document.querySelectorAll('.store-nav a').forEach(a => a.classList.toggle('active', a.dataset.view === name));
    if (name === 'shop') renderShop();
    if (name === 'categories') renderTiles('#catTiles', CATEGORIES);
    if (name === 'collections') renderTiles('#colTiles', COLLECTIONS);
    if (name === 'wishlist') renderWishlist();
    if (name === 'cart') renderCart();
    if (name === 'checkout') renderCheckout();
    if (name === 'home') { renderHome(); }
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.addEventListener('hashchange', () => {
    const h = (location.hash || '#home').slice(1);
    if (['home','shop','categories','collections','search','wishlist','product','cart','checkout','done','track'].includes(h)) showView(h);
    else showView('home');
  });

  /* ---- home ---- */
  function renderHome(){
    const avail = PRODUCTS.filter(p => !lockedP(p));
    $('#homeFeatured').innerHTML = avail.filter(p=>p.featured).slice(0,3).map(card).join('') || avail.slice(0,3).map(card).join('');
    $('#homeNew').innerHTML = avail.filter(p=>p.new).slice(0,3).map(card).join('') || avail.slice(3,6).map(card).join('');
    $('#homeBest').innerHTML = avail.filter(p=>p.best).slice(0,3).map(card).join('') || avail.slice(6,9).map(card).join('');
  }

  /* ---- shop ---- */
  function renderShop(){
    const q = ($('#shopSearch').value || '').toLowerCase();
    const sort = $('#shopSort').value, size = $('#shopSize').value, color = $('#shopColor').value;
    let cat = ($('#shopCats').dataset.cat) || '';
    let list = PRODUCTS.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)) &&
      (!size || p.sizes.includes(size)) &&
      (!color || p.colors.includes(color)) &&
      (!cat || p.cat === cat));
    if (sort === 'low') list = [...list].sort((a,b)=>a.price-b.price);
    if (sort === 'high') list = [...list].sort((a,b)=>b.price-a.price);
    $('#storeGrid').innerHTML = list.map(card).join('') || '<p style="color:var(--ink-soft)">No products match your filters.</p>';
  }
  const cats = ['All',...new Set(PRODUCTS.map(p=>p.cat))];
  $('#shopCats').innerHTML = cats.map((c,i)=>`<span class="chip ${i===0?'active':''}" data-cat="${c}">${c}</span>`).join('');
  $('#shopCats').addEventListener('click', e => { const c=e.target.closest('.chip'); if(!c)return;
    $('#shopCats').querySelectorAll('.chip').forEach(x=>x.classList.remove('active')); c.classList.add('active');
    $('#shopCats').dataset.cat = c.dataset.cat==='All'?'':c.dataset.cat; renderShop(); });
  ['#shopSearch','#shopSort','#shopSize','#shopColor'].forEach(sel => $(sel).addEventListener('input', renderShop));

  /* ---- tiles ---- */
  function renderTiles(target, items){
    $(target).innerHTML = items.map(t => {
      const locked = !isPremium() && !t.tier;
      return `<div class="tile ${locked?'locked':''}" style="background-image:url('assets/${t.img}')" data-name="${t.name}"><span>${t.name}${locked?' • 🔒 Premium':''}</span></div>`;
    }).join('');
  }

  /* ---- search ---- */
  $('#searchBtn').addEventListener('click', doSearch);
  $('#searchInput').addEventListener('input', doSearch);
  function doSearch(){
    const q = ($('#searchInput').value || '').toLowerCase();
    if (!q) { $('#searchResults').innerHTML = ''; return; }
    const list = PRODUCTS.filter(p => (!lockedP(p)) && (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)));
    $('#searchResults').innerHTML = list.map(card).join('') || '<p style="color:var(--ink-soft)">No matches for “'+q+'”.</p>';
  }

  /* ---- wishlist ---- */
  function renderWishlist(){
    $('#wishCount').textContent = saved.length ? `(${saved.length})` : '';
    const list = PRODUCTS.filter(p => saved.includes(p.id) && !lockedP(p));
    $('#wishGrid').innerHTML = list.map(card).join('');
    $('#wishEmpty').style.display = list.length ? 'none' : 'block';
  }


  /* ---- product detail ---- */
  function openPDP(id){
    current = PRODUCTS.find(p=>p.id===id); qty=1; selSize=current.sizes[0]; selColor=current.colors[0];
    $('#pdpImg').style.backgroundImage = `url('assets/${current.img}')`;
    $('#pdpName').textContent = current.name;
    $('#pdpPrice').innerHTML = `$${current.price}${current.was?`<s>$${current.was}</s>`:''}`;
    $('#pdpSizes').innerHTML = current.sizes.map(s=>`<button data-s="${s}" class="${s===selSize?'sel':''}">${s}</button>`).join('');
    $('#pdpColors').innerHTML = current.colors.map(c=>`<button data-c="${c}" class="${c===selColor?'sel':''}">${c}</button>`).join('');
    $('#qVal').textContent = qty;
    $('#pdpMeta').innerHTML = `<b>Material:</b> Premium cotton blend.<br><b>Size guide:</b> True to size . Size up for oversized fit.<br><b>Shipping:</b> 2 to 4 days local, tracking emailed.<br><b>Reviews:</b> ★★★★★ (128)`;
    $('#pdpRelated').innerHTML = PRODUCTS.filter(p=>p.id!==id).slice(0,4).map(p=>`<button data-view="product" data-id="${p.id}">${p.name}</button>`).join('');
    showView('product');
  }
  $('#pdpBack').addEventListener('click', () => { location.hash = '#shop'; });
  $('#pdpSizes').addEventListener('click', e=>{ const b=e.target.closest('[data-s]'); if(!b)return; selSize=b.dataset.s;
    [...$('#pdpSizes').children].forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); });
  $('#pdpColors').addEventListener('click', e=>{ const b=e.target.closest('[data-c]'); if(!b)return; selColor=b.dataset.c;
    [...$('#pdpColors').children].forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); });
  $('#pdpRelated').addEventListener('click', e=>{ const b=e.target.closest('[data-view]'); if(b) openPDP(b.dataset.id); });
  $('#qPlus').addEventListener('click', ()=>{ qty++; $('#qVal').textContent=qty; });
  $('#qMinus').addEventListener('click', ()=>{ if(qty>1){qty--; $('#qVal').textContent=qty;} });
  function addToCart(){ cart.push({id:current.id,name:current.name,price:current.price,qty,size:selSize,color:selColor}); save(); cartCount();
    flash('#cartBtn'); }
  $('#addCart').addEventListener('click', addToCart);
  $('#buyNow').addEventListener('click', ()=>{ addToCart(); location.hash='#checkout'; });

  /* ---- cart ---- */
  function renderCart(){
    $('#cartLines').innerHTML = cart.map((i,idx)=>`
      <div class="cart-line">
        <img src="assets/${PRODUCTS.find(p=>p.id===i.id).img}" alt="${i.name}">
        <div><b>${i.name}</b><br><small style="color:var(--ink-soft)">${i.size} · ${i.color} · ×${i.qty}</small></div>
        <div>$${i.price*i.qty}</div>
        <button class="btn btn--ghost" style="padding:.3rem .7rem" data-rm="${idx}">Remove</button>
      </div>`).join('') || '<p style="color:var(--ink-soft)">Your cart is empty.</p>';
  }
  $('#cartLines').addEventListener('click', e=>{ const b=e.target.closest('[data-rm]'); if(!b)return; cart.splice(+b.dataset.rm,1); save(); cartCount(); renderCart(); });
  $('#cartBtn').addEventListener('click', ()=> location.hash='#cart');

  /* ---- checkout ---- */
  function renderCheckout(){
    const sub = cart.reduce((n,i)=>n+i.price*i.qty,0);
    const ship = 4.99 + sub; // default; recomputed on change
    $('#coSummary').innerHTML = `<h3 style="margin-bottom:.8rem">Order summary</h3>
      ${cart.map(i=>`<div style="display:flex;justify-content:space-between;padding:.3rem 0"><span>${i.name} ×${i.qty}</span><span>$${i.price*i.qty}</span></div>`).join('') || '<p>Your cart is empty.</p>'}
      <hr style="border-color:var(--line);margin:.6rem 0">
      <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>$${sub}</span></div>
      <div style="display:flex;justify-content:space-between;color:var(--ink-soft)"><span>Shipping</span><span id="coShipTxt">$4.99</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:.4rem"><span>Total</span><span id="coTotal">$${ship}</span></div>`;
  }
  $('#coShip').addEventListener('change', ()=>{ if(!document.querySelector('#v-checkout').classList.contains('active'))return;
    const sub = cart.reduce((n,i)=>n+i.price*i.qty,0);
    const free = $('#coShip').value.includes('Free'); const cost = free?0:(parseFloat($('#coShip').value.match(/[\d.]+/))||0);
    $('#coShipTxt').textContent = free?'Free':('$'+cost);
    $('#coTotal').textContent = '$'+(sub+cost);
  });
  $('#placeOrder').addEventListener('click', ()=>{
    const sub = cart.reduce((n,i)=>n+i.price*i.qty,0);
    const free = $('#coShip').value.includes('Free'); const cost = free?0:(parseFloat($('#coShip').value.match(/[\d.]+/))||0);
    const num = 'NL-' + (10480 + Math.floor(Math.random()*900));
    $('#doneText').textContent = `Thanks! Your order of $${(sub+cost).toFixed(2)} is confirmed. A confirmation email is on its way (demo).`;
    $('#doneNum').textContent = num;
    localStorage.setItem('craftee_lastorder', JSON.stringify({num, items:cart, total:+(sub+cost).toFixed(2)}));
    cart = []; save(); cartCount();
    location.hash = '#done';
  });

  /* ---- order tracking ---- */
  $('#trackBtn').addEventListener('click', ()=>{
    const v = ($('#trackInput').value || '').trim();
    if (!v) { $('#trackResult').innerHTML = '<p style="color:var(--ink-soft)">Enter an order number.</p>'; return; }
    const last = JSON.parse(localStorage.getItem('craftee_lastorder') || 'null');
    const match = last && last.num.toLowerCase() === v.toLowerCase();
    const steps = ['Order placed','Processing','Shipped','Out for delivery','Delivered'];
    const doneUpto = match ? 3 : 1; // demo: show progress
    $('#trackResult').innerHTML = `<p style="color:var(--ink-soft);margin-bottom:.5rem">${match?'Live status for '+last.num+' (demo).':'Sample status for '+v+' . Place a test order to see your own.'}</p>
      <ul class="track-steps">${steps.map((s,i)=>`<li class="${i<doneUpto?'done':''} ${i===doneUpto?'current':''}">${i<doneUpto?'✓ ':''}${s}</li>`).join('')}</ul>`;
  });

  /* ---- nav + grid delegation ---- */
  $('#storeNav').addEventListener('click', e => { const a=e.target.closest('[data-view]'); if(!a)return; e.preventDefault(); location.hash = '#'+a.dataset.view; });
  document.querySelector('.store-main').addEventListener('click', e => {
    const nav = e.target.closest('[data-view]'); if (nav && nav.dataset.view!=='product') { e.preventDefault(); location.hash='#'+nav.dataset.view; }
    const v = e.target.closest('[data-view="product"]'); if (v) { e.preventDefault(); openPDP(v.dataset.id); }
    const s = e.target.closest('[data-save]'); if (s) { const id=s.dataset.save; if(!saved.includes(id))saved.push(id); else saved=saved.filter(x=>x!==id); save();
      const card=s.closest('.store-prod'); if(card) card.querySelector('.store-prod__save').classList.toggle('saved'); renderWishlist(); }
  });

  /* newsletter */
  $('#newsForm').addEventListener('submit', e => { e.preventDefault(); $('#newsMsg').style.display='block'; });

  function flash(sel){ const el=$(sel); el.style.transform='scale(1.08)'; setTimeout(()=>el.style.transform='',200); }

  /* ---- plan-aware extras: feature strip, bundle builder, analytics (Premium-only sections) ---- */
  const ALL_FEATS = ['Up to 50 products','Variants & inventory','Customer accounts','Reviews','Discount codes','Wishlist','Search','Order tracking','Bundle builder','Customer segmentation','Advanced analytics','Automated flows'];
  function renderPremiumExtras(){
    // feature strip reflects current plan
    const strip = $('#featStrip');
    if (strip){
      const onCount = isPremium() ? ALL_FEATS.length : 7; // Starter shows first 7 as included, rest struck through
      strip.innerHTML = ALL_FEATS.map((f,i)=>`<span class="${i<onCount?'on':'off'}">${f}</span>`).join('');
    }
    // bundle builder (only meaningful on premium, but render so it's ready)
    const bItems = $('#bundleItems');
    if (bItems){
      const picks = PRODUCTS.filter(p=>!lockedP(p)).slice(0,8);
      bItems.innerHTML = picks.map(p=>`<button data-bid="${p.id}">${p.name} · $${p.price}</button>`).join('');
    }
    const bOut = $('#bundleOut');
    if (bOut && !bOut.dataset.bound){
      bOut.dataset.bound = '1';
      bItems.addEventListener('click', e=>{
        const b=e.target.closest('button[data-bid]'); if(!b)return;
        b.classList.toggle('sel');
        const sel = [...bItems.querySelectorAll('button.sel')].map(x=>PRODUCTS.find(p=>p.id===x.dataset.bid));
        if (!sel.length){ bOut.textContent='Select items above ↑'; return; }
        const sub = sel.reduce((n,p)=>n+p.price,0);
        const disc = sel.length>=3?0.15:sel.length===2?0.10:0;
        bOut.textContent = `${sel.length} items · Subtotal $${sub} → Bundle price $${(sub*(1-disc)).toFixed(0)} (${disc?Math.round(disc*100):0}% off)`;
      });
    }
    // analytics panel
    const an = $('#analyticsPanel');
    if (an){
      const data = [42,55,48,67,72,61,88,94,80,102];
      an.innerHTML = `<div class="analytics__row">
        <div class="analytics__kpi"><b>$12.4k</b><span>Revenue (30d)</span></div>
        <div class="analytics__kpi"><b>318</b><span>Orders</span></div>
        <div class="analytics__kpi"><b>4.6%</b><span>Conversion</span></div>
        <div class="analytics__kpi"><b>+22%</b><span>Repeat rate</span></div></div>
        <div class="analytics__bars">${data.map(v=>`<i style="height:${v}%"></i>`).join('')}</div>`;
    }
  }

  /* ---- AI live agent (Premium) ---- */
  function aiReply(q){
    const s = q.toLowerCase();
    if (s.includes('return')) return 'Easy returns within 30 days . Unworn tags on, and we email a prepaid label. 💌';
    if (s.includes('restock') || s.includes('denim')) return 'Good news . The Denim Jacket is restocking next Tuesday. Want me to notify you when it drops? 🔔';
    if (s.includes('gift') || s.includes('under')) return 'Under $60: the Crew Tee ($42), Graphic Tee ($46), Pleated Skirt ($58), or a Knit Beanie ($28). 🎁';
    if (s.includes('ship')) return 'We ship in 2 to 4 days local with tracking by email. Free shipping over $150 (code FREESHIP). 🚚';
    if (s.includes('size') || s.includes('fit')) return 'True to size . Size up one for an oversized fit. Need a specific item’s measurements?';
    if (s.includes('discount') || s.includes('code') || s.includes('promo')) return 'Active code FREESHIP = free shipping over $150. Premium stores also run bundle + seasonal promos. 🏷️';
    if (s.includes('ai') || s.includes('agent')) return 'That’s me! On Premium I answer 24/7, recover carts, and upsell automatically. 🤖';
    return 'Got it . I can help with sizing, shipping, returns, restocks and gifting. Ask me anything! ✨';
  }
  const aiChat = $('#aiChat'), aiForm = $('#aiForm'), aiInput = $('#aiInput');
  function aiSend(q){
    if (!q.trim()) return;
    const u = document.createElement('div'); u.className='ai-msg ai-msg--user'; u.textContent=q; aiChat.appendChild(u);
    const t = document.createElement('div'); t.className='ai-msg ai-msg--bot ai-msg--typing'; t.textContent='typing…'; aiChat.appendChild(t);
    aiChat.scrollTop = aiChat.scrollHeight;
    setTimeout(()=>{ t.classList.remove('ai-msg--typing'); t.textContent = aiReply(q); aiChat.scrollTop = aiChat.scrollHeight; }, 650);
  }
  if (aiForm) aiForm.addEventListener('submit', e => { e.preventDefault(); const v=aiInput.value; aiInput.value=''; aiSend(v); });
  document.querySelectorAll('.aiagent__quick button').forEach(b => b.addEventListener('click', () => aiSend(b.dataset.q)));

  /* init */
  renderPremiumExtras();
  cartCount();
  const start = (location.hash || '#home').slice(1);
  showView(['home','shop','categories','collections','search','wishlist','product','cart','checkout','done','track'].includes(start) ? start : 'home');
})();
