(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = $('#mobileMenu'), toggle = $('#menuButton');
  function setMenu(open, restore = false) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a').focus();
    else if (restore) toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') setMenu(false, true);
    if (e.key === 'Tab') {
      const items = [toggle, ...menu.querySelectorAll('a')];
      const i = items.indexOf(document.activeElement);
      e.preventDefault(); items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    }
  });
  $$('.js-assess').forEach(b => b.addEventListener('click', () => {
    $('#assessment').scrollIntoView({behavior: motion.matches ? 'auto' : 'smooth'});
    setTimeout(() => ($('#formResult').classList.contains('show') ? $('#resultReset') : $('.form-stage.active input')).focus({preventScroll:true}), motion.matches ? 0 : 700);
  }));
  const cycle = $('#cycle');
  const states = [
    ['12:00 PM<br>Capture the peak.', 'The roof supplies the home first, then stores excess energy for later.', 'MIDDAY'],
    ['6:18 PM<br>Keep what you made.', 'As production falls, stored daylight can help meet evening demand.', 'EVENING'],
    ['10:42 PM<br>Put reserves to work.', 'The battery supports overnight demand. Backup duration depends on the system and the load.', 'NIGHT']
  ];
  let phase = -1;
  function updateScroll() {
    $('#siteHeader').classList.toggle('scrolled', scrollY > 40);
    const progress = clamp(-cycle.getBoundingClientRect().top / Math.max(1, cycle.offsetHeight - innerHeight));
    document.documentElement.style.setProperty('--cycle', progress.toFixed(3));
    const next = progress < .34 ? 0 : progress < .68 ? 1 : 2;
    if (next !== phase) {
      phase = next;
      $('#cycleTitle').innerHTML = states[next][0]; $('#cycleText').textContent = states[next][1]; $('#cycleTime').textContent = states[next][2];
      $$('[data-phase]').forEach((b,i) => b.setAttribute('aria-pressed', String(i === next)));
    }
    const reserve = Math.round(82 - Math.max(0, progress - .5) * 68);
    $('#cycleOutput').textContent = progress > .68 ? `${reserve}% reserve` : `${(8.4 * (1 - Math.pow(progress, 1.35))).toFixed(1)} kW`;
    $('#cycleBar').style.width = `${progress > .68 ? reserve : 100 * (1 - progress)}%`;
  }
  let scheduled = false;
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(() => {scheduled = false; updateScroll();}); } }, {passive:true});
  addEventListener('resize', () => {if(innerWidth > 980) setMenu(false); updateScroll();});
  $$('[data-phase]').forEach(b => b.addEventListener('click', () => scrollTo({top: cycle.offsetTop + Number(b.dataset.phase) * (cycle.offsetHeight - innerHeight), behavior:'instant'})));
  updateScroll();
  const hardware = {
    panels: ['01 / 03','ROOF ARRAY','Low profile panels','Matte black modules turn daylight into electricity. The inverter makes it usable at home.',['420 W','Roof mounted','Capture'],['Example output','Configuration','Role']],
    inverter: ['02 / 03','POWER CONTROL','Smart inverter','The control layer converts direct current into usable alternating current and coordinates energy flow.',['DC → AC','System control','Convert'],['Conversion','Function','Role']],
    battery: ['03 / 03','HOME STORAGE','Night reserve','Store surplus energy for later. Backup capacity depends on the chosen equipment and connected loads.',['13.5 kWh','Stored energy','Store'],['Example capacity','Function','Role']]
  };
  function selectHardware(key) {
    const d = hardware[key];
    $$('[data-hardware]').forEach(b => {const on = b.dataset.hardware === key; b.classList.toggle('active',on); b.setAttribute('aria-pressed',String(on));});
    ['hardwareIndex','hardwareKicker','hardwareTitle','hardwareDescription'].forEach((id,i) => $('#'+id).textContent = d[i]);
    ['specOne','specTwo','specThree'].forEach((id,i) => $('#'+id).textContent = d[4][i]);
    $$('.hardware-panel dt').forEach((e,i) => e.textContent = d[5][i]);
  }
  $$('[data-hardware]').forEach(b => b.addEventListener('click', () => selectHardware(b.dataset.hardware)));
  selectHardware('panels');
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  function updateForecast() {
    const bill = Number($('#billSlider').value);
    $('#billValue').textContent = money(bill);
    const utility = Array.from({length:21}, (_,y) => bill * 12 * 1.045 ** y);
    const solar = Array.from({length:21}, (_,y) => Math.max(1600,bill * 12 * .48) * (y < 13 ? 1 : .3));
    const max = utility[20] * 1.08;
    $('#chartMax').textContent = '$'+(max/1000).toFixed(1)+'k';
    $('#chartMid').textContent = '$'+(max/2000).toFixed(1)+'k';
    const points = values => values.map((v,i) => `${55+i*34},${330-v/max*250}`);
    $('#utilityLine').setAttribute('d','M'+points(utility).join(' L'));
    $('#solarLine').setAttribute('d','M'+points(solar).join(' L'));
    $('#utilityArea').setAttribute('d','M55,330 L'+points(utility).join(' L')+' L735,330 Z');
    const diff = utility.slice(0,20).reduce((a,v,i) => a+v-solar[i],0);
    $('#savingsValue').textContent = money(Math.round(diff/100)*100);
    const summary = `Annual cost at year 20: utility ${money(utility[20])}, solar ${money(solar[20])}. Illustrative model, not a quote.`;
    $('#chartSummary').textContent = summary;
    $('#roiChart').setAttribute('aria-label',summary);
  }
  $('#billSlider').addEventListener('input',updateForecast); updateForecast();
  const form = $('#assessmentForm');
  let step = 1;
  function setStep(n, focus = true) {
    step = n;
    $$('.form-stage').forEach(s => s.classList.toggle('active',Number(s.dataset.formStep) === n));
    $('#formStep').textContent = `0${n} / 02`; $('#formError').textContent = '';
    if(focus) $('.form-stage.active input').focus({preventScroll:true});
  }
  function validZip() {
    const input = $('#zipInput'), valid = /^\d{5}$/.test(input.value.trim());
    input.setAttribute('aria-invalid', String(!valid));
    if(!valid) {$('#formError').textContent = 'Enter a five digit sample ZIP code.';input.focus();}
    return valid;
  }
  $('#formNext').addEventListener('click', () => {if(validZip()) setStep(2);});
  $('#formBack').addEventListener('click', () => setStep(1));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(step === 1) {if(validZip()) setStep(2); return;}
    const input = $('#assessmentBill'), bill = Number(input.value);
    if(!input.value || !input.checkValidity() || !Number.isFinite(bill)) {
      input.setAttribute('aria-invalid','true'); $('#formError').textContent = 'Enter a whole dollar bill from $50 to $1,500.';input.focus();return;
    }
    input.setAttribute('aria-invalid','false'); $('#formError').textContent = '';
    const sun = $('#sunExposure').value, multiplier = sun === 'high' ? 1 : sun === 'medium' ? .86 : .7;
    const system = clamp(bill/27*multiplier,3.2,18.5);
    const offset = Math.round(clamp(72+multiplier*22-Math.max(0,bill-500)/35,58,96));
    $('#resultSystem').textContent = system.toFixed(1)+' kW';
    $('#resultOffset').textContent = offset+'%';
    $('#resultBattery').textContent = bill > 360 ? '27 kWh' : '13.5 kWh';
    $('#resultMessage').textContent = 'Illustration only. ZIP code and property type do not determine roof suitability. Array size is bill ÷ 27 × sunlight factor (1, 0.86 or 0.7), limited to 3.2 through 18.5 kW. Offset is a sample score, not measured production. Battery size changes above a $360 bill. A real design needs usage data and a site survey.';
    $$('.form-stage').forEach(s => s.classList.remove('active'));
    $('#formResult').classList.add('show'); $('#formStep').textContent = 'READY'; $('#formResult').focus({preventScroll:true});
  });
  $('#resultReset').addEventListener('click', () => {
    $('#formResult').classList.remove('show'); form.reset();
    $$('[aria-invalid]').forEach(e => e.removeAttribute('aria-invalid'));
    $('#billSlider').value = 240; updateForecast(); setStep(1);
  });
  const observer = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target);}}),{threshold:.08});
  $$('.reveal').forEach(e => observer.observe(e));
})();
