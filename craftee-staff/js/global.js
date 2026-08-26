/* =========================================================
   CRAFTEE STAFF — GLOBAL JS
   Paste ONCE in GoHighLevel (after global/sections CSS).
   Safe: vanilla JS, no external libs. No errors if a
   section is missing — every init guards its elements.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var set = function () { header.classList.toggle('scrolled', window.scrollY > 90); };
    set();
    window.addEventListener('scroll', set, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var mobile = document.querySelector('[data-mobile-menu]');
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!mobile || !toggle) return;
    toggle.addEventListener('click', function () {
      var open = !mobile.classList.contains('open');
      mobile.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Section in-view rails ---------- */
  function initSectionRails() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
    if (!sections.length || !('IntersectionObserver' in window)) { sections.forEach(function(s){s.classList.add('in-view');}); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold:.18 });
    sections.forEach(function(s){ io.observe(s); });
  }

  /* ---------- Magnetic/shimmer CTAs (Godly/21st style, subtle) ---------- */
  function initMagneticButtons() {
    if (reduce || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.querySelectorAll('.btn').forEach(function(btn){
      btn.addEventListener('pointermove', function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        btn.style.transform = 'translate(' + (x*8).toFixed(1) + 'px,' + (y*5-2).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function(){ btn.style.transform = ''; });
    });
  }

  /* ---------- Smooth anchor scroll with builder-safe offset ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top:y, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Metric count-up ---------- */
  function initCounters() {
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!counters.length) return;
    var animate = function (el) {
      var target = Number(el.dataset.count || 0);
      var suffix = el.dataset.suffix || '';
      var start = performance.now(), dur = 1300;
      var tick = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { counters.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Card spotlight (edge glow follows cursor) ---------- */
  function initSpotlight() {
    document.querySelectorAll('.panel').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Services console ---------- */
  var services = {
    admin: { code:'ADMIN', kicker:'Executive Assistance // Inbox // Research',
      title:'Keep the business organized without keeping everything on your plate.',
      body:'Executive assistance, inbox management, calendar management, scheduling, research, data entry, reporting, document organization, and general administration.',
      chips:['Executive Assistance','Inbox','Calendar','Research','Reporting'] },
    cx: { code:'CX', kicker:'Email // Live Chat // Orders // Helpdesk',
      title:'Give customers the responsive support they expect without stretching your internal team.',
      body:'Email support, live chat, customer inquiries, order management, helpdesk support, follow-ups, escalation coordination, and customer records.',
      chips:['Email Support','Live Chat','Orders','Escalations','Records'] },
    sales: { code:'SALES', kicker:'CRM // Lead Follow-Up // Appointment Setting',
      title:'Help your sales process move consistently from lead to conversation.',
      body:'CRM management, lead follow-up, appointment setting, pipeline updates, prospect research, sales administration, and database management.',
      chips:['CRM','Follow-Up','Appointments','Pipeline','Prospecting'] },
    marketing: { code:'MKTG', kicker:'Social // Design // Content // Campaigns',
      title:'Turn strategy into consistent execution.',
      body:'Social media assistance, graphic design, content support, campaign administration, scheduling, marketing coordination, and research.',
      chips:['Social','Graphic Design','Content','Scheduling','Campaigns'] },
    tech: { code:'TECH', kicker:'Website // GoHighLevel // CRM // Workflows',
      title:'Add operational support around the tools and systems your business depends on.',
      body:'Website support, GoHighLevel support, CRM systems, workflow assistance, automation support, and technical troubleshooting.',
      chips:['Website','GoHighLevel','CRM','Workflows','Automation'] }
  };
  function initServices() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-service]'));
    var code = document.getElementById('service-code');
    var kicker = document.getElementById('service-kicker');
    var title = document.getElementById('service-title');
    var body = document.getElementById('service-body');
    var list = document.getElementById('service-list');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var d = services[tab.dataset.service]; if (!d) return;
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected','true');
        [code,kicker,title,body,list].forEach(function (el) { if (el) el.style.opacity = '0'; });
        setTimeout(function () {
          if (code) code.textContent = d.code;
          if (kicker) kicker.textContent = d.kicker;
          if (title) title.textContent = d.title;
          if (body) body.textContent = d.body;
          if (list) list.innerHTML = d.chips.map(function (i) { return '<span>' + i + '</span>'; }).join('');
          [code,kicker,title,body,list].forEach(function (el) { if (el) el.style.opacity = '1'; });
        }, 140);
      });
    });
  }

  /* ---------- Capacity calculator ---------- */
  function initCalculator() {
    var hourly = document.getElementById('hourlyValue');
    var hours = document.getElementById('hoursWeek');
    var staff = document.getElementById('staffCost');
    var weekly = document.getElementById('weeklyValue');
    var monthly = document.getElementById('monthlyValue');
    var annual = document.getElementById('annualValue');
    if (!hourly || !hours) return;
    var fmt = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
    var update = function () {
      var hv = Math.max(0, Number(hourly.value || 0));
      var hw = Math.min(168, Math.max(0, Number(hours.value || 0)));
      var sc = Math.max(0, Number(staff.value || 0));
      var value = Math.max(0, (hv - sc) * hw);
      if (weekly) weekly.textContent = fmt.format(value);
      if (monthly) monthly.textContent = fmt.format(value * 4.33);
      if (annual) annual.textContent = fmt.format(value * 52);
    };
    [hourly, hours, staff].forEach(function (i) { if (i) i.addEventListener('input', update); });
    update();
  }

  /* ---------- FAQ accordion ---------- */
  function initAccordion() {
    document.querySelectorAll('[data-accordion] button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  /* ---------- Global starfield ---------- */
  function initStarfield() {
    var canvas = document.getElementById('starfield');
    if (!canvas || reduce) return;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1, stars = [], mouse = { x: -9999, y: -9999 };
    var make = function () {
      var n = Math.min(210, Math.floor((w * h) / 9000));
      stars = Array.from({ length: n }, function () {
        return { x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.9 + 0.1,
          r: Math.random() * 1.5 + 0.25, hue: Math.random() > 0.82 ? '204,0,255' : '0,229,255' };
      });
    };
    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); make();
    };
    var draw = function () {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var px = (mouse.x - w / 2) * s.z * 0.012, py = (mouse.y - h / 2) * s.z * 0.012;
        var tw = 0.42 + Math.sin(Date.now() * 0.0015 + s.x) * 0.22;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + s.hue + ',' + tw + ')';
        ctx.shadowColor = 'rgba(' + s.hue + ',.8)'; ctx.shadowBlur = 8;
        ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0; requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    resize(); draw();
  }

  /* ---------- HERO: 3D talent-network canvas ---------- */
  function initTalentNetwork() {
    var canvas = document.getElementById('talent-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1, t = 0, spin = 0, spinTarget = 0;
    var dragging = false, lastX = 0;
    var labels = ['OPS', 'CX', 'CRM', 'GHL', 'MKT', 'SUP', 'FIN', 'OPS'];
    var nodes = [];

    var build = function () {
      nodes = [];
      var count = w < 520 ? 9 : 13;
      for (var i = 0; i < count; i++) {
        var a = (i / count) * Math.PI * 2;
        var rad = 0.28 + Math.random() * 0.22;           // orbit radius (fraction of min dim)
        var speed = (0.18 + Math.random() * 0.32) * (Math.random() > 0.5 ? 1 : -1);
        var col = i % 4 === 0 ? '204,0,255' : (i % 3 === 0 ? '207,255,4' : '0,229,255');
        nodes.push({ a: a, rad: rad, speed: speed, size: 3 + Math.random() * 3, col: col,
          label: labels[i % labels.length], phase: Math.random() * Math.PI * 2 });
      }
    };
    var resize = function () {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); build();
    };
    var cx = function () { return w / 2; }, cy = function () { return h / 2; };
    var R = function () { return Math.min(w, h) * 0.34; };

    var draw = function () {
      if (!reduce) {
        t += 0.016;
        if (!dragging) spinTarget += 0.0016;        // slow auto-rotation
        spin += (spinTarget - spin) * 0.06;          // ease toward target
      }
      ctx.clearRect(0, 0, w, h);
      var ccx = cx(), ccy = cy(), rr = R();

      // core pulse
      var pulse = 0.5 + 0.5 * Math.sin(t * 1.4);
      var coreR = rr * 0.22 + pulse * rr * 0.03;
      var g = ctx.createRadialGradient(ccx, ccy, 2, ccx, ccy, coreR * 2.4);
      g.addColorStop(0, 'rgba(0,229,255,.55)');
      g.addColorStop(0.5, 'rgba(204,0,255,.22)');
      g.addColorStop(1, 'rgba(10,10,26,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ccx, ccy, coreR * 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,229,255,.7)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(ccx, ccy, coreR, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#00E5FF'; ctx.font = '700 13px Orbitron, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TEAM', ccx, ccy - 4);
      ctx.fillStyle = '#FFFFFF'; ctx.font = '700 18px Orbitron, sans-serif';
      ctx.fillText('ONLINE', ccx, ccy + 14);

      // compute node positions in 3D (Y-axis rotation for depth)
      var pos = [];
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var ang = n.a + (reduce ? 0 : t * n.speed);
        var r3 = rr * n.rad;
        var x3 = Math.cos(ang) * r3;
        var z3 = Math.sin(ang) * r3;          // depth
        var y3 = Math.sin(t * 0.5 + n.phase) * rr * 0.10; // gentle vertical bob
        // rotate around Y by global spin
        var ca = Math.cos(spin), sa = Math.sin(spin);
        var rx = x3 * ca - z3 * sa;
        var rz = x3 * sa + z3 * ca;
        var persp = 1 / (1 + rz / (rr * 2.4));   // perspective foreshortening
        pos.push({
          x: ccx + rx * 1.7 * persp,
          y: ccy + y3 + (rz * 0.18),
          z: rz, scale: persp, n: n
        });
      }
      pos.sort(function (a, b) { return a.z - b.z; }); // far first, near last

      // connecting lines from core to nodes + between near nodes (depth-aware)
      for (var i = 0; i < pos.length; i++) {
        var p = pos[i];
        ctx.strokeStyle = 'rgba(' + p.n.col + ',' + (0.10 + 0.22 * p.scale) + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ccx, ccy); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      for (var i = 0; i < pos.length; i++) {
        for (var j = i + 1; j < pos.length; j++) {
          var dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < rr * 0.6) {
            ctx.strokeStyle = 'rgba(0,229,255,' + (0.12 * (1 - dist / (rr * 0.6))) + ')';
            ctx.beginPath(); ctx.moveTo(pos[i].x, pos[i].y); ctx.lineTo(pos[j].x, pos[j].y); ctx.stroke();
          }
        }
      }

      // nodes (size by depth)
      for (var i = 0; i < pos.length; i++) {
        var p = pos[i], n = p.n;
        var rad = n.size * (0.55 + 0.65 * p.scale);
        ctx.fillStyle = 'rgba(' + n.col + ',' + (0.55 + 0.45 * p.scale) + ')';
        ctx.shadowColor = 'rgba(' + n.col + ',.9)'; ctx.shadowBlur = 10 * p.scale + 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(216,225,255,' + (0.4 + 0.5 * p.scale) + ')';
        ctx.font = '700 ' + Math.round(9 * p.scale + 5) + 'px Rajdhani, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.label, p.x, p.y - rad - 4);
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    var frame = canvas.closest('.holo-frame');
    if (frame && !reduce) {
      frame.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; });
      window.addEventListener('pointerup', function () { dragging = false; });
      frame.addEventListener('pointermove', function (e) {
        if (dragging) { spinTarget += (e.clientX - lastX) * 0.005; lastX = e.clientX; }
      });
      frame.style.cursor = 'grab';
    }
    resize(); draw();
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var update = function () {
      var st = window.scrollY || document.documentElement.scrollTop;
      var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      bar.style.width = Math.min(100, (st / max) * 100) + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- Cursor glow ---------- */
  function initCursorGlow() {
    var glow = document.getElementById('cursor-glow');
    if (!glow || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    window.addEventListener('pointermove', function (e) {
      glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    }, { passive: true });
  }

  /* ---------- Parallax (elements with data-parallax) ---------- */
  function initParallax() {
    if (reduce) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!items.length) return;
    var update = function () {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2 - vh / 2;
        var strength = parseFloat(el.getAttribute('data-parallax')) || 0.06;
        el.style.transform = 'translateY(' + (-center * strength).toFixed(1) + 'px)';
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- 3D card tilt ---------- */
  function initTilt() {
    if (reduce || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (px * 7) + 'deg) rotateX(' + (-py * 7) + 'deg)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Staggered reveals ---------- */
  function initRevealStagger() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal-stagger'));
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Timeline draw-in ---------- */
  function initTimeline() {
    var tl = document.querySelector('.timeline');
    if (!tl) return;
    if (!('IntersectionObserver' in window)) { tl.classList.add('drawn'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { tl.classList.add('drawn'); io.unobserve(e.target); } });
    }, { threshold: 0.3 });
    io.observe(tl);
  }

  function boot() {
    initHeader(); initMenu(); initReveal(); initRevealStagger(); initSectionRails(); initCounters();
    initSpotlight(); initServices(); initCalculator(); initAccordion();
    initStarfield(); initTalentNetwork(); initScrollProgress(); initCursorGlow();
    initParallax(); initTilt(); initMagneticButtons(); initAnchors(); initTimeline();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
