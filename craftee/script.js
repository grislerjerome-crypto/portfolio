/* Craftee Sites . Agency home page interactions */
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* ===== NAV TOGGLE (mobile) ===== */
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
    const more = $('#navMore');
    if (more) {
      const moreBtn = more.querySelector('button');
      moreBtn.addEventListener('click', (e) => { e.stopPropagation(); more.classList.toggle('open'); });
      document.addEventListener('click', (e) => { if (!more.contains(e.target)) more.classList.remove('open'); });
      more.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { more.classList.remove('open'); links.classList.remove('open'); }));
    }
  }

  /* ===== HERO STARFIELD ===== */
  const fx = $('#heroFx');
  if (fx && fx.getContext) {
    const ctx = fx.getContext('2d');
    let W, H, stars = [], raf;
    const resize = () => {
      const r = fx.parentElement.getBoundingClientRect();
      W = fx.width = r.width; H = fx.height = r.height;
      const n = Math.min(140, Math.floor(W / 9));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H, z: Math.random() * 1.6 + .4,
        r: Math.random() * 1.4 + .3, hue: Math.random() > .5 ? '0,229,255' : '181,84,255', tw: Math.random() * Math.PI * 2
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.y -= s.z; if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
        s.x += Math.sin((s.tw += 0.01)) * 0.3;
        const a = 0.5 + 0.5 * Math.sin(s.tw);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.hue},${a.toFixed(2)})`;
        ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${s.hue},.8)`;
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0; raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach(e => {
        if (e.isIntersecting) { if (!raf) draw(); } else { cancelAnimationFrame(raf); raf = null; }
      }), { threshold: 0 }).observe(fx);
    }
  }

  /* ===== SCROLL REVEAL ===== */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .12 });
    reveals.forEach(r => ro.observe(r));
  } else { reveals.forEach(r => r.classList.add('in')); }

  /* ===== CONTACT FORM -> mailto ===== */
  const form = $('#contactForm');
  const sent = $('#contactSent');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = `New store project . ${d.get('brand') || d.get('name')}`;
      const body =
`Hi Craftee Sites,

Name: ${d.get('name')}
Email: ${d.get('email')}
Business: ${d.get('brand')}
Phone: ${d.get('phone')}
Social/Website: ${d.get('social')}
What they sell: ${d.get('products')}
Products: ${d.get('count')}
Current platform: ${d.get('platform')}
What they need: ${d.get('msg')}
Budget: ${d.get('budget')}

Please send my free store mockup!`;
      window.location.href = `mailto:hello@crafteesites.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (sent) sent.hidden = false;
    });
  }
})();
