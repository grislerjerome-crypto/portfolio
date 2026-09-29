const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.add('motion-ready');

const flavors = [
  {
    name: 'Primofiore Classic', short: 'PRI', batch: 'PRESS 01 · BATCH 049', color: '#f3db45', bottle: '#edd64d', brix: '8.2°', ring: '82%',
    description: 'Clean Sicilian lemon with bright peel oils, mineral spring water, and a dry finish.',
    acidity: 94, hydration: 100, botanical: 42,
    ritual: 'Pour 120ml over one clear cube at sunrise. Finish with mineral water.'
  },
  {
    name: 'Cucumber Mint', short: 'MNT', batch: 'PRESS 02 · BATCH 050', color: '#9bd8b5', bottle: '#9fd7b7', brix: '4.1°', ring: '41%',
    description: 'Cool cucumber, mountain mint, and Meyer lemon zest for a clean mineral reset.',
    acidity: 62, hydration: 100, botanical: 96,
    ritual: 'Serve ice cold after movement, heat, or a long afternoon in the sun.'
  },
  {
    name: 'Moro Blood Orange', short: 'MOR', batch: 'PRESS 03 · BATCH 051', color: '#ff7b45', bottle: '#cb5a43', brix: '11.5°', ring: '92%',
    description: 'Deep citrus, soft bitterness, and natural ruby sweetness with an aperitif finish.',
    acidity: 78, hydration: 85, botanical: 55,
    ritual: 'Pour over sparkling mineral water with rosemary at sunset.'
  },
  {
    name: 'Lavender Thyme', short: 'LAV', batch: 'PRESS 04 · BATCH 052', color: '#c5adea', bottle: '#b9a4d7', brix: '5.6°', ring: '56%',
    description: 'Primofiore lemon lifted with wild lavender and a clean thread of mountain thyme.',
    acidity: 68, hydration: 92, botanical: 100,
    ritual: 'Sip chilled in the evening, or warm gently before a slower night.'
  }
];

let activeFlavor = 0;
let crate = [0, 1, 2];
let toastTimer;

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function selectFlavor(index) {
  activeFlavor = Number(index);
  const flavor = flavors[activeFlavor];
  document.documentElement.style.setProperty('--flavor', flavor.color);
  $('#flavorTitle').textContent = flavor.name;
  $('#sceneFlavor').textContent = flavor.name;
  $('#flavorBatch').textContent = flavor.batch;
  $('#flavorDescription').textContent = flavor.description;
  $('#brixValue').textContent = flavor.brix;
  $('#acidityValue').textContent = `${flavor.acidity}%`;
  $('#hydrationValue').textContent = `${flavor.hydration}%`;
  $('#botanicalValue').textContent = `${flavor.botanical}%`;
  $('#acidityBar').style.width = `${flavor.acidity}%`;
  $('#hydrationBar').style.width = `${flavor.hydration}%`;
  $('#botanicalBar').style.width = `${flavor.botanical}%`;
  $('#sensoryRing').style.setProperty('--ring', flavor.ring);
  $('#ritualText').textContent = flavor.ritual;
  $('#activeMarker span').textContent = String(activeFlavor + 1).padStart(2, '0');
  $('#addFlavor').textContent = `Add ${flavor.name.split(' ')[0]} to crate`;
  $('#quickFlavor').value = String(activeFlavor);
  $$('.flavor-tab').forEach((tab, tabIndex) => {
    const active = tabIndex === activeFlavor;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  $('#flavorImage').animate([
    { opacity: .4, transform: 'scale(1.04)' },
    { opacity: 1, transform: 'scale(1)' }
  ], { duration: reducedMotion ? 1 : 520, easing: 'ease-out' });
}

$$('.flavor-tab').forEach(tab => tab.addEventListener('click', () => selectFlavor(tab.dataset.flavor)));

function renderCrate() {
  const slots = $('#bottleSlots');
  slots.innerHTML = Array.from({ length: 6 }, (_, index) => {
    if (crate[index] === undefined) return `<div class="bottle-slot"><span class="empty-plus">+</span></div>`;
    const flavor = flavors[crate[index]];
    return `<div class="bottle-slot filled"><button type="button" data-remove="${index}" aria-label="Remove ${flavor.name}">×</button><div class="mini-bottle" data-code="${flavor.short}" style="--bottle:${flavor.bottle}"></div></div>`;
  }).join('');
  const count = crate.length;
  const total = count * 12;
  $('#crateCount').textContent = count;
  $('#navCount').textContent = count;
  $('#dockCount').textContent = count;
  $('#crateTotal').textContent = `$${total.toFixed(2)}`;
  $('#dockTotal').textContent = `$${total}`;
  $('#crateProgress').style.width = `${count / 6 * 100}%`;
  $('#crateStatus').textContent = count >= 6 ? 'Cold delivery unlocked' : `Add ${6 - count} more for cold delivery`;
  $('#checkoutButton').textContent = count >= 6 ? 'Complete your crate' : `Add ${6 - count} more bottle${6 - count === 1 ? '' : 's'}`;
  $('#checkoutButton').disabled = count < 6;
  $('#dockSlots').innerHTML = Array.from({ length: 6 }, (_, index) => `<i style="--mini:${crate[index] === undefined ? 'transparent' : flavors[crate[index]].color}"></i>`).join('');
  $$('[data-remove]').forEach(button => button.addEventListener('click', () => {
    crate.splice(Number(button.dataset.remove), 1);
    renderCrate();
  }));
}

function addToCrate(index) {
  if (crate.length >= 6) {
    showToast('Your six bottle flight is full.');
    $('#crate').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    return;
  }
  const flavorIndex = Number(index);
  crate.push(flavorIndex);
  renderCrate();
  showToast(`${flavors[flavorIndex].name} added to your crate.`);
}

$('#addFlavor').addEventListener('click', () => addToCrate(activeFlavor));
$('#quickAdd').addEventListener('click', () => addToCrate($('#quickFlavor').value));
$('#checkoutButton').addEventListener('click', () => {
  if (crate.length < 6) return;
  showToast('Your tasting flight is ready. No payment was processed.');
});
$$('.js-open-crate').forEach(button => button.addEventListener('click', () => {
  $('#crate').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  closeMenu();
}));
renderCrate();

const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
$$('.mobile-menu a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const header = $('#siteHeader');
const dock = $('#crateDock');
function updateScrollState() {
  header.classList.toggle('scrolled', window.scrollY > 80);
  const crateRect = $('#crate').getBoundingClientRect();
  const flavorRect = $('#flavors').getBoundingClientRect();
  const crateVisible = crateRect.top < innerHeight * .78 && crateRect.bottom > 100;
  const flavorVisible = flavorRect.top < innerHeight * .82 && flavorRect.bottom > innerHeight * .18;
  dock.classList.toggle('show', window.scrollY > innerHeight * .8 && !crateVisible && !flavorVisible);
}
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: .1, rootMargin: '0px 0px -5% 0px' });
$$('.reveal').forEach(element => observer.observe(element));

const productUniverse = $('#productUniverse');
if (!reducedMotion) {
  productUniverse.addEventListener('pointermove', event => {
    const rect = productUniverse.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    $('#productStage').style.setProperty('--tiltX', `${x * 12}deg`);
    $('#productStage').style.setProperty('--tiltY', `${y * -10}deg`);
  });
  productUniverse.addEventListener('pointerleave', () => {
    $('#productStage').style.setProperty('--tiltX', '0deg');
    $('#productStage').style.setProperty('--tiltY', '0deg');
  });
  window.addEventListener('pointermove', event => {
    const light = $('.cursor-light');
    light.style.left = `${event.clientX}px`;
    light.style.top = `${event.clientY}px`;
  }, { passive: true });
}

$$('[data-tilt]').forEach(card => {
  if (reducedMotion) return;
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const processColors = [
  ['#d6ddb7', '#f4e492'], ['#c6ddbd', '#cbe988'], ['#e3dfbd', '#f7eeb3'], ['#bdd8ca', '#d8edcf']
];
$$('.process-step').forEach((step, index) => step.addEventListener('click', () => {
  $$('.process-step').forEach(item => item.classList.toggle('active', item === step));
  const [one, two] = processColors[index];
  $('.origin-visual').style.background = `linear-gradient(150deg,${one},${two} 52%,#c7d7af)`;
  $('.origin-bottle').animate([
    { transform: 'translateY(0) rotate(0)' },
    { transform: 'translateY(-12px) rotate(2deg)' },
    { transform: 'translateY(0) rotate(0)' }
  ], { duration: reducedMotion ? 1 : 600, easing: 'ease-out' });
}));

function setupCanvas() {
  const canvas = $('#citrusCanvas');
  const context = canvas.getContext('2d');
  const particles = [];
  let width = 0, height = 0, frame = 0;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    width = innerWidth; height = innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;
    const count = reducedMotion ? 18 : Math.min(58, Math.floor(width / 22));
    for (let i = 0; i < count; i++) particles.push({
      x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2.2 + .5,
      vx: (Math.random() - .5) * .14, vy: -(Math.random() * .18 + .04), a: Math.random() * .38 + .08
    });
  }
  function draw() {
    if (!reducedMotion && frame++ % 2) { requestAnimationFrame(draw); return; }
    context.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      if (!reducedMotion) {
        particle.x += particle.vx; particle.y += particle.vy;
        if (particle.y < -5) particle.y = height + 5;
        if (particle.x < -5) particle.x = width + 5;
        if (particle.x > width + 5) particle.x = -5;
      }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(243,219,69,${particle.a})`;
      context.fill();
    });
    if (!reducedMotion) requestAnimationFrame(draw);
  }
  resize(); draw();
  window.addEventListener('resize', resize);
}
setupCanvas();
selectFlavor(0);
