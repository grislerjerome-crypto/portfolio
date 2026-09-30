(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const siteHeader = $('#siteHeader');
  const menuButton = $('#menuButton');
  const mobileMenu = $('#mobileMenu');
  const setMenu = open => {
    mobileMenu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  $$('#mobileMenu a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  $$('.js-assess').forEach(button => button.addEventListener('click', () => {
    $('#assessment').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    setTimeout(() => $('#zipInput').focus({ preventScroll: true }), reducedMotion ? 0 : 700);
  }));

  const cycle = $('#cycle');
  const cycleTitle = $('#cycleTitle');
  const cycleText = $('#cycleText');
  const cycleTime = $('#cycleTime');
  const cycleOutput = $('#cycleOutput');
  const cycleStates = [
    { max: .34, title: '12:00 PM<br>Capture the peak.', text: 'The roof supplies the home first, then stores the excess for later.', time: 'MIDDAY' },
    { max: .68, title: '6:18 PM<br>Keep what you made.', text: 'Stored daylight takes over as the sun drops and evening demand rises.', time: 'GOLDEN HOUR' },
    { max: 1.01, title: '10:42 PM<br>Power without the grid.', text: 'The battery quietly discharges while the home remains bright and connected.', time: 'NIGHT' }
  ];
  let currentCycleState = -1;
  const updateScroll = () => {
    siteHeader.classList.toggle('scrolled', scrollY > 40);
    const rect = cycle.getBoundingClientRect();
    const distance = Math.max(1, cycle.offsetHeight - innerHeight);
    const progress = clamp(-rect.top / distance);
    root.style.setProperty('--cycle', progress.toFixed(3));
    const stateIndex = cycleStates.findIndex(state => progress < state.max);
    if (stateIndex !== currentCycleState) {
      currentCycleState = stateIndex;
      const state = cycleStates[stateIndex];
      cycleTitle.innerHTML = state.title;
      cycleText.textContent = state.text;
      cycleTime.textContent = state.time;
    }
    const output = Math.max(0, 8.4 * (1 - Math.pow(progress, 1.35)));
    cycleOutput.textContent = progress > .72 ? `${Math.round(48 + progress * 34)}% reserve` : `${output.toFixed(1)} kW`;
  };
  updateScroll();
  addEventListener('scroll', updateScroll, { passive: true });
  addEventListener('resize', updateScroll);

  const hardwareData = {
    panels: { index: '01 / 03', kicker: 'ROOF ARRAY', title: 'Low profile panels', description: 'Matte black modules sit close to the roofline and convert daylight into direct home power.', specs: ['420 W', 'Class 4', '25 yr'] },
    inverter: { index: '02 / 03', kicker: 'POWER CONTROL', title: 'Smart inverter', description: 'A quiet control layer converts power, balances each circuit, and keeps every energy flow visible.', specs: ['97.5%', '< 30 dB', 'Module level'] },
    battery: { index: '03 / 03', kicker: 'HOME STORAGE', title: 'Night reserve', description: 'Stored solar power supports the home after sunset and offers a calm backup layer during outages.', specs: ['13.5 kWh', 'Whole home', 'App aware'] }
  };
  const selectHardware = key => {
    const data = hardwareData[key];
    $$('.hardware-object, .hardware-tabs button').forEach(item => item.classList.toggle('active', item.dataset.hardware === key));
    $('#hardwareIndex').textContent = data.index;
    $('#hardwareKicker').textContent = data.kicker;
    $('#hardwareTitle').textContent = data.title;
    $('#hardwareDescription').textContent = data.description;
    $('#specOne').textContent = data.specs[0];
    $('#specTwo').textContent = data.specs[1];
    $('#specThree').textContent = data.specs[2];
  };
  $$('[data-hardware]').forEach(button => button.addEventListener('click', () => selectHardware(button.dataset.hardware)));

  const billSlider = $('#billSlider');
  const billValue = $('#billValue');
  const savingsValue = $('#savingsValue');
  const utilityLine = $('#utilityLine');
  const utilityArea = $('#utilityArea');
  const solarLine = $('#solarLine');
  const chartPoint = (index, value, max) => `${55 + index * 34},${330 - (value / max) * 250}`;
  const updateForecast = () => {
    const bill = Number(billSlider.value);
    billValue.textContent = `$${bill}`;
    const utilityCosts = Array.from({ length: 21 }, (_, year) => bill * 12 * Math.pow(1.045, year));
    const solarAnnual = Math.max(1600, bill * 12 * .48);
    const solarCosts = Array.from({ length: 21 }, (_, year) => solarAnnual * (year < 13 ? 1 : .3));
    const max = Math.max(...utilityCosts) * 1.08;
    const utilityPoints = utilityCosts.map((value, index) => chartPoint(index, value, max));
    const solarPoints = solarCosts.map((value, index) => chartPoint(index, value, max));
    utilityLine.setAttribute('d', `M${utilityPoints.join(' L')}`);
    utilityArea.setAttribute('d', `M55,330 L${utilityPoints.join(' L')} L735,330 Z`);
    solarLine.setAttribute('d', `M${solarPoints.join(' L')}`);
    const difference = utilityCosts.reduce((sum, value) => sum + value, 0) - solarCosts.reduce((sum, value) => sum + value, 0);
    savingsValue.textContent = `$${Math.round(difference / 100) * 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  billSlider.addEventListener('input', updateForecast);
  updateForecast();

  const form = $('#assessmentForm');
  const setFormStep = step => {
    $$('.form-stage').forEach(stage => stage.classList.toggle('active', Number(stage.dataset.formStep) === step));
    $('#formStep').textContent = `0${step} / 02`;
  };
  $('#formNext').addEventListener('click', () => {
    if (!/^\d{5}$/.test($('#zipInput').value.trim())) {
      $('#zipInput').focus();
      showToast('Enter a valid 5 digit ZIP code');
      return;
    }
    setFormStep(2);
  });
  $('#formBack').addEventListener('click', () => setFormStep(1));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const bill = clamp(Number($('#assessmentBill').value), 50, 1500);
    const sun = $('#sunExposure').value;
    const multiplier = sun === 'high' ? 1 : sun === 'medium' ? .86 : .7;
    const system = clamp((bill / 27) * multiplier, 3.2, 18.5);
    const offset = Math.round(clamp(72 + multiplier * 22 - Math.max(0, bill - 500) / 35, 58, 96));
    $('#resultSystem').textContent = `${system.toFixed(1)} kW`;
    $('#resultOffset').textContent = `${offset}%`;
    $('#resultBattery').textContent = bill > 360 ? '27 kWh' : '13.5 kWh';
    $('#resultMessage').textContent = `${$('#zipInput').value} may support a ${system.toFixed(1)} kW concept array with an illustrative ${offset}% energy offset.`;
    $$('.form-stage').forEach(stage => stage.classList.remove('active'));
    $('#formResult').classList.add('show');
    $('#formStep').textContent = 'READY';
  });
  $('#resultReset').addEventListener('click', () => {
    $('#formResult').classList.remove('show');
    form.reset();
    billSlider.value = 240;
    setFormStep(1);
  });

  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(item => revealObserver.observe(item));

  const canvas = $('#energyCanvas');
  const context = canvas.getContext('2d');
  let particles = [];
  const resizeCanvas = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: Math.min(45, Math.floor(innerWidth / 26)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.4 + .3, v: Math.random() * .25 + .08 }));
  };
  const drawParticles = () => {
    context.clearRect(0, 0, innerWidth, innerHeight);
    context.fillStyle = 'rgba(186,255,60,.18)';
    particles.forEach(particle => {
      particle.y -= particle.v;
      if (particle.y < -4) { particle.y = innerHeight + 4; particle.x = Math.random() * innerWidth; }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(drawParticles);
  };
  resizeCanvas();
  if (!reducedMotion) drawParticles();
  addEventListener('resize', resizeCanvas);
})();
