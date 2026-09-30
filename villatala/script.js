(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('#siteHeader');
  const menuButton = $('#menuButton');
  const mobileMenu = $('#mobileMenu');
  const setMenu = open => {
    mobileMenu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  $$('#mobileMenu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 35), { passive: true });

  $$('.js-reserve').forEach(button => button.addEventListener('click', () => {
    $('#reserve').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }));

  const hero = $('.hero');
  if (!reducedMotion) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * -14;
      const y = ((event.clientY - rect.top) / rect.height - .5) * -8;
      hero.style.setProperty('--hero-x', `${x}px`);
      hero.style.setProperty('--hero-y', `${y}px`);
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-x', '0px');
      hero.style.setProperty('--hero-y', '0px');
    });
  }

  const suiteData = {
    master: {
      image: 'assets/suite.jpg', kicker: 'MASTER PAVILION', title: 'Wake up inside the horizon.',
      description: 'A quiet canopy room with uninterrupted water views, natural textures and a private deck for first light.',
      sleep: '2 guests', view: 'Bacuit sunrise', ritual: 'Morning soak', fact: 'Full height glass disappears into the wall so the pavilion opens directly to the bay.', alt: 'Ocean pavilion bedroom overlooking El Nido limestone cliffs'
    },
    cliff: {
      image: 'assets/hero-clean.jpg', kicker: 'CLIFF PAVILION', title: 'Live between stone and sea.',
      description: 'A timber pavilion placed against the karst with a long terrace above the sheltered channel.',
      sleep: '2 guests', view: 'Western cliffs', ritual: 'Sunset deck', fact: 'Deep rooflines shade the interior while framing the limestone walls beyond the pool.', alt: 'Cliffside private villa with infinity pool in El Nido'
    },
    lagoon: {
      image: 'assets/catamaran.jpg', kicker: 'LAGOON PAVILION', title: 'Begin at the waterline.',
      description: 'A low, quiet retreat closest to the pier with immediate access to the calm channel and morning sail.',
      sleep: '2 guests', view: 'Private lagoon', ritual: 'Dawn launch', fact: 'The pavilion faces the protected water so every departure feels like part of the room.', alt: 'Private catamaran in a sheltered El Nido lagoon'
    }
  };
  const selectSuite = key => {
    const data = suiteData[key];
    const image = $('#suiteImage');
    image.style.opacity = '0';
    setTimeout(() => { image.src = data.image; image.alt = data.alt; image.style.opacity = '1'; }, reducedMotion ? 0 : 220);
    $('#suiteKicker').textContent = data.kicker;
    $('#suiteTitle').textContent = data.title;
    $('#suiteDescription').textContent = data.description;
    $('#suiteSleep').textContent = data.sleep;
    $('#suiteView').textContent = data.view;
    $('#suiteRitual').textContent = data.ritual;
    $('#suiteFact p').textContent = data.fact;
    $('#suiteNumber').textContent = String(Object.keys(suiteData).indexOf(key) + 1).padStart(2, '0');
    $$('.suite-tabs button').forEach(button => button.classList.toggle('active', button.dataset.suite === key));
    $('#suiteFact').classList.remove('show');
  };
  $$('.suite-tabs button').forEach(button => button.addEventListener('click', () => selectSuite(button.dataset.suite)));
  $('#suiteHotspot').addEventListener('click', () => $('#suiteFact').classList.toggle('show'));

  const ritualData = {
    dawn: { image: 'assets/catamaran.jpg', alt: 'Private catamaran in a quiet El Nido lagoon', time: '06:10', kicker: 'FIRST LIGHT', title: 'Sail before the bay wakes.', description: 'Leave the private pier while the water is still glass and the public routes are still quiet.', length: '4 hours', setting: 'Private crew' },
    noon: { image: 'assets/hilot.jpg', alt: 'Traditional Filipino Hilot setting in a woven pavilion', time: '12:30', kicker: 'MIDDAY QUIET', title: 'Let the island slow the body.', description: 'A private Hilot ritual with warm coconut oil, woven shade and the lagoon just beyond the pavilion.', length: '90 minutes', setting: 'In pavilion' },
    sunset: { image: 'assets/kamayan.jpg', alt: 'Filipino Kamayan feast beside the sea', time: '18:12', kicker: 'GOLDEN TABLE', title: 'Gather with your hands.', description: 'A generous Kamayan table built around the catch, the fire and the people staying with you.', length: 'At your pace', setting: 'Private chef' },
    night: { image: 'assets/bioluminescent.jpg', alt: 'Night kayaks moving through glowing bioluminescent water', time: '22:08', kicker: 'NEW MOON WATER', title: 'Move through living light.', description: 'Paddle into the dark channel as the water glows around every stroke beneath the karst.', length: '1.5 hours', setting: 'Private guide' }
  };
  const selectRitual = key => {
    const data = ritualData[key];
    const image = $('#ritualImage');
    image.style.opacity = '0';
    setTimeout(() => { image.src = data.image; image.alt = data.alt; image.style.opacity = '1'; }, reducedMotion ? 0 : 220);
    $('#ritualTime').textContent = data.time;
    $('#ritualKicker').textContent = data.kicker;
    $('#ritualTitle').textContent = data.title;
    $('#ritualDescription').textContent = data.description;
    $('#ritualLength').textContent = data.length;
    $('#ritualSetting').textContent = data.setting;
    $$('.ritual-nav button').forEach(button => button.classList.toggle('active', button.dataset.ritual === key));
  };
  $$('.ritual-nav button').forEach(button => button.addEventListener('click', () => selectRitual(button.dataset.ritual)));

  let currentNights = 7;
  const rates = { 3: 18500, 7: 16900, 14: 14500 };
  const money = value => `₱${value.toLocaleString('en-PH')}`;
  const calculate = () => {
    const base = currentNights * rates[currentNights];
    const extras = ($('#seaplane').checked ? 18000 : 0) + ($('#hilot').checked ? 6500 : 0) + ($('#cellar').checked ? 7500 : 0);
    const total = base + extras + 2500;
    $('#nightLabel').textContent = `${currentNights} nights × ${money(rates[currentNights])}`;
    $('#nightCost').textContent = money(base);
    $('#seaplaneRow').hidden = !$('#seaplane').checked;
    $('#hilotRow').hidden = !$('#hilot').checked;
    $('#cellarRow').hidden = !$('#cellar').checked;
    $('#totalPrice').textContent = money(total);
    $('#modalTotal').textContent = money(total);
  };
  $$('[data-nights]').forEach(button => button.addEventListener('click', () => {
    currentNights = Number(button.dataset.nights);
    $$('[data-nights]').forEach(option => option.classList.toggle('active', option === button));
    calculate();
  }));
  $$('#stayBuilder input').forEach(input => input.addEventListener('change', calculate));
  calculate();

  const modal = $('#holdModal');
  const closeModal = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); $('#holdButton').focus(); };
  $('#holdButton').addEventListener('click', () => { modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); $('#modalClose').focus(); });
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalDone').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(element => observer.observe(element));
})();
