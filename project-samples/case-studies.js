(()=>{
const root=document.getElementById("sample-projects");
const $=s=>root.matches(s)?root:root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
/* Four-second rotation: hover the card, not the surrounding section. */
function setupShowcaseAutoplay(root, advance, hoverTarget){
  if(!root || !hoverTarget || root.showcaseAutoplay)return root && root.showcaseAutoplay;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false, hovering=hoverTarget.matches(':hover'), keyboard=true, timer=null;
  const blocked=()=>media.matches || document.hidden || !visible || hovering ||
    (keyboard && root.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) ||
    root.closest('[hidden]') || !!document.querySelector('dialog[open],#proj-lightbox,.bk-overlay.open,.ty-overlay.open,.palette-wrap.open,.ava-chat.open');
  function stop(){if(timer!==null){clearTimeout(timer);timer=null;}}
  function sync(){
    stop();
    if(!blocked())timer=setTimeout(()=>{timer=null;if(!blocked())advance();sync();},4000);
  }
  hoverTarget.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovering=true;sync();}});
  hoverTarget.addEventListener('pointerleave',()=>{hovering=false;sync();});
  hoverTarget.addEventListener('pointercancel',()=>{hovering=false;sync();});
  // Mouse clicks may retain focus, but only keyboard focus pauses rotation.
  // Never blur the user's control or move focus as part of automatic navigation.
  document.addEventListener('pointerdown',()=>{keyboard=false;sync();},true);
  document.addEventListener('keydown',()=>{keyboard=true;sync();},true);
  root.addEventListener('focusin',sync);
  root.addEventListener('focusout',()=>queueMicrotask(sync));
  root.addEventListener('click',sync);
  root.addEventListener('keydown',sync);
  document.addEventListener('visibilitychange',sync);
  media.addEventListener('change',sync);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});io.observe(hoverTarget);
  // Observe only modal state and ancestor visibility, never animated subtrees.
  const mo=new MutationObserver(sync);
  document.querySelectorAll('dialog,.bk-overlay,.ty-overlay,.palette-wrap,.ava-chat').forEach(el=>mo.observe(el,{attributes:true,attributeFilter:['open','class']}));
  mo.observe(document.body,{childList:true});
  for(let el=root;el&&el!==document.body;el=el.parentElement)mo.observe(el,{attributes:true,attributeFilter:['hidden']});
  root.showcaseAutoplay={reset:sync,get scheduled(){return timer!==null;}};
  sync();return root.showcaseAutoplay;
}
function openSampleProjectImage(e, el){
  if(e)e.preventDefault();
  const img=el&&el.querySelector('img');if(!img||document.getElementById('proj-lightbox'))return;
  const opener=document.activeElement,lb=document.createElement('dialog');
  lb.id='proj-lightbox';lb.setAttribute('aria-label',img.alt||'Workflow diagram');
  const close=document.createElement('button');close.className='lb-close';close.type='button';close.setAttribute('aria-label','Close diagram');close.textContent='×';
  const full=document.createElement('img');full.src=img.src;full.alt=img.alt;
  const caption=document.createElement('div');caption.className='lb-cap';caption.textContent=img.alt;
  lb.append(close,full,caption);document.body.append(lb);
  lb.addEventListener('close',()=>{lb.remove();if(opener&&opener.isConnected)opener.focus({preventScroll:true});},{once:true});
  close.onclick=()=>lb.close();lb.addEventListener('click',ev=>{if(ev.target===lb)lb.close();});
  lb.showModal();close.focus();
}
  var projIdx=0, projCards=[];
  var projCategoryCounts = {};
  PROJECTS.forEach(function(p){ projCategoryCounts[p.category]=(projCategoryCounts[p.category]||0)+1; });

  function buildFilters() {
    var container = $("#sample-proj-filters"); if (!container) return;
    var filters = [{label:"All",key:"all"}].concat(["GHL","Make.com","Zapier","n8n"].map(function(t){return {label:t,key:t};}));
    var html = '<div class="proj-filters">';
    html += '<button class="proj-filter-btn active" data-filter="all">All <span class="count">('+PROJECTS.length+')</span></button>';
    filters.slice(1).forEach(function(f) {
      html += '<button class="proj-filter-btn" data-filter="'+f.key+'">'+f.label+' <span class="count">('+(projCategoryCounts[f.key]||0)+')</span></button>';
    });
    html += '</div>';
    container.innerHTML = html;
    $$('.proj-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        $$('.proj-filter-btn').forEach(function(b){b.classList.remove('active')});
        btn.classList.add('active');
        filterProjects(btn.dataset.filter);
      });
    });
  }

  function filterProjects(filterKey) {
    if (!projCards || projCards.length === 0) return;
    projIdx = 0;
    var filteredIdx = 0;
    projCards.forEach(function(card, i) {
      var p = PROJECTS[i];
      if (!p) return;
      var matches = filterKey === 'all' || (p.category === filterKey);
      if (matches) {
        card.classList.remove('hide');
        card.dataset.visible = 'true';
        card.dataset.visibleIdx = filteredIdx;
        filteredIdx++;
      } else {
        card.classList.add('hide');
        card.dataset.visible = 'false';
        card.dataset.visibleIdx = '-1';
      }
    });
    // Re-index active state based on visible cards
    projCards.forEach(function(card) {
      if (card.dataset.visible === 'true') {
        var vi = +card.dataset.visibleIdx;
        card.classList.toggle('active', vi === projIdx);
      } else {
        card.classList.remove('active');
      }
    });
    $$('.proj-filter-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filterKey)));
    buildDots();
  }

  function buildProjects() {
    var track=$("#sample-proj-track"); if(!track)return;
    var html=PROJECTS.map(function(p,i){
      return '<div class="proj-card' + (i === 0 ? ' active' : ' hide') + '" data-proj="'+i+'">'
        +'<div class="proj-img" role="button" tabindex="0" aria-label="Expand workflow diagram"><img src="'+p.img+'" alt="'+p.title+' workflow"></div>'
        + '<div class="proj-content" tabindex="0" aria-label="Case study details">'
        +'<h3>'+p.title+'<a class="proj-ext" href="#" aria-label="External link">↗</a></h3>'
        +'<p class="proj-desc">'+p.desc+'</p>'
        +'<div class="proj-problem"><b>Problem:</b> <span class="proj-body">'+p.problem+'</span></div>'
        +'<div class="proj-solution"><b>Solution:</b> <span class="proj-body">'+p.solution+'</span></div>'
        +'<div class="proj-result"><b>Result:</b> <span class="proj-body">'+p.result+'</span></div>'
        +'<div class="proj-tags category-'+p.category+'"><span class="proj-category">'+p.category+'</span></div>'
        +'</div></div>';
    }).join("");
    track.innerHTML=html;
    // Add click handlers for lightbox on all project images
    $$("#sample-proj-track .proj-img").forEach(function(el) {
      el.onclick = function(e) { openSampleProjectImage(e, this); };
      el.onkeydown = function(e) { if(e.key==="Enter"||e.key===" "){e.preventDefault();openSampleProjectImage(e,this);} };
    });
    projCards=[...$$("#sample-proj-track .proj-card")];
    projIdx=0;
    // Mark all visible initially, set category
    projCards.forEach(function(c,i){ c.dataset.visible='true'; c.dataset.visibleIdx=i; c.dataset.category=PROJECTS[i].category; });
    buildDots();
    buildFilters();
    filterProjects('all'); // apply default filter and reset
    buildDots(); // update dots to reflect current filter state
    cycleProject(); // activate first visible card
    var prev=$("#sample-proj-prev"), next=$("#sample-proj-next");
    if(prev) prev.onclick=prevProject;
    if(next) next.onclick=nextProject;
    setupShowcaseAutoplay($("#sample-projects"),nextProject,$("#sample-proj-track"));
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.target.closest('.proj-card')) return;
      if (e.target.closest('#sample-projects')) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevProject(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); nextProject(); }
      }
    });

  }
  function cycleProject() {
    if (!projCards || projCards.length === 0) return;
    var visibleCards = projCards.filter(function(c){ return c.dataset.visible === 'true'; });
    if (visibleCards.length === 0) return;
    if (projIdx >= visibleCards.length) projIdx = 0;
    projCards.forEach(function(c){ c.classList.remove('active'); });
    visibleCards[projIdx].classList.add('active');
    updateDots();
  }
  function prevProject() {
    var visibleCards = projCards.filter(function(c){ return c.dataset.visible === 'true'; });
    if (visibleCards.length <= 1) return;
    projIdx = (projIdx - 1 + visibleCards.length) % visibleCards.length;
    cycleProject();
  }
  function nextProject() {
    var visibleCards = projCards.filter(function(c){ return c.dataset.visible === 'true'; });
    if (visibleCards.length <= 1) return;
    projIdx = (projIdx + 1) % visibleCards.length;
    cycleProject();
  }
  function buildDots() {
    var dots = $("#sample-proj-dots"); if (!dots) return;
    var visibleCount = projCards.filter(function(c){ return c.dataset.visible === 'true'; }).length;
    dots.innerHTML = '';
    for (var i = 0; i < visibleCount; i++) {
      dots.innerHTML += '<i class="' + (i === projIdx ? 'on' : '') + '" role="button" tabindex="0" aria-label="Show project ' + (i+1) + '" data-i="' + i + '"></i>';
    }
    $$('#sample-proj-dots i').forEach(function (d) {
      d.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();d.click();}};
      d.onclick = function () {
        var idx = +d.dataset.i;
        if (idx !== projIdx) { projIdx = idx; cycleProject(); }
      };
    });
  }
  function updateDots() {
    $$('#sample-proj-dots i').forEach(function (d, i) { d.classList.toggle('on', i === projIdx);d.setAttribute('aria-pressed',String(i===projIdx)); });
  }

buildProjects();
})();
