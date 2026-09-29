const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.body.classList.add('motion-ready');

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const map = (value, inMin, inMax, outMin, outMax) => outMin + clamp((value - inMin) / (inMax - inMin)) * (outMax - outMin);

const threshold = $('#threshold');
const siteHeader = $('#siteHeader');
const bookingRail = $('#bookingRail');
const sceneProgress = $('#sceneProgress');
let ticking = false;

function updateScrollExperience() {
  const top = threshold.getBoundingClientRect().top;
  const max = threshold.offsetHeight - window.innerHeight;
  const progress = clamp(-top / max);
  const mobile = window.innerWidth <= 640;

  if (!reducedMotion) {
    root.style.setProperty('--hero-scale', String(1 + progress * (mobile ? .18 : .35)));
    root.style.setProperty('--hero-opacity', String(1 - clamp(progress / .34)));
    root.style.setProperty('--hero-y', `${progress * -55}px`);
    root.style.setProperty('--cue-opacity', String(1 - clamp(progress / .12)));
    root.style.setProperty('--door-scale', String(.84 + progress * .72));
    root.style.setProperty('--door-opacity', String(clamp(.66 + progress * .7)));
    root.style.setProperty('--door-left', `${map(progress, .24, .66, 0, -104)}deg`);
    root.style.setProperty('--door-right', `${map(progress, .24, .66, 0, 104)}deg`);
    root.style.setProperty('--interior-opacity', String(map(progress, .4, .72, 0, 1)));
    root.style.setProperty('--interior-scale', String(map(progress, .42, 1, 1.15, 1.01)));
    root.style.setProperty('--shade-opacity', String(map(progress, .38, .78, 1, .48)));
    root.style.setProperty('--entry-opacity', String(progress < .62 ? 0 : progress > .91 ? map(progress, .91, 1, 1, 0) : map(progress, .62, .78, 0, 1)));
    root.style.setProperty('--entry-scale', String(map(progress, .62, .9, .94, 1)));
  }
  root.style.setProperty('--progress', `${progress * 100}%`);
  sceneProgress.style.width = `${progress * 100}%`;

  const pageY = window.scrollY;
  siteHeader.classList.toggle('scrolled', pageY > window.innerHeight * .55);
  bookingRail.classList.toggle('show', pageY > window.innerHeight * 1.35 && !isBookingVisible());
  ticking = false;
}

function isBookingVisible() {
  const booking = $('#booking');
  const rect = booking.getBoundingClientRect();
  return rect.top < window.innerHeight * .75 && rect.bottom > 0;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollExperience);
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollExperience);
updateScrollExperience();

$('#skipTour').addEventListener('click', () => $('#stay').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }));

if (!reducedMotion) {
  window.addEventListener('pointermove', event => {
    const glow = $('.cursor-glow');
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
$$('.reveal').forEach(el => observer.observe(el));

const rooms = {
  living: {
    image: 'assets/living.jpg', alt: 'Warm modern living room with desert views', number: '01', kicker: 'Space 01',
    title: 'Designed for the hours nobody wants to end.',
    description: 'Open desert views and deep seating make this the natural center of the house, from first coffee to the final glass.',
    features: ['Seats up to 10 guests', 'Wood burning fireplace', 'Direct terrace access']
  },
  kitchen: {
    image: 'assets/kitchen.jpg', alt: 'Minimal chef kitchen with natural finishes', number: '02', kicker: 'Space 02',
    title: 'Dinner plans do not need a reservation.',
    description: 'A generous kitchen built for shared cooking, long dinners, and mornings that begin around the island.',
    features: ['Fully equipped chef kitchen', 'Eight seat dining table', 'Coffee and welcome essentials']
  },
  suite: {
    image: 'assets/suite.jpg', alt: 'Calm primary suite with warm neutral tones', number: '03', kicker: 'Space 03',
    title: 'Quiet when you want the house to disappear.',
    description: 'Natural textures, soft light, and a private outlook create a calm retreat at the end of the day.',
    features: ['King bed with premium linen', 'Private outdoor access', 'Ensuite rainfall shower']
  },
  pool: {
    image: 'assets/pool.jpg', alt: 'Private modern pool in a desert setting', number: '04', kicker: 'Space 04',
    title: 'Morning coffee. Sunset drinks. Nothing between them.',
    description: 'The outdoor space follows the desert light from cool mornings to the stars coming out over the pool.',
    features: ['Private heated pool', 'Covered dining terrace', 'Two acre setting']
  }
};

function selectRoom(key) {
  const data = rooms[key];
  const visual = $('.room-visual');
  visual.classList.add('changing');
  $$('.room-tab').forEach(tab => {
    const active = tab.dataset.room === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  $$('.plan-room').forEach(room => room.classList.toggle('active', room.dataset.room === key));
  setTimeout(() => {
    $('#roomImage').src = data.image;
    $('#roomImage').alt = data.alt;
    $('#roomNumber').textContent = data.number;
    $('#roomKicker').textContent = data.kicker;
    $('#roomTitle').textContent = data.title;
    $('#roomDescription').textContent = data.description;
    $('#roomFeatures').innerHTML = data.features.map(item => `<li>${item}</li>`).join('');
    visual.classList.remove('changing');
  }, 280);
}
$$('.room-tab, .plan-room').forEach(button => button.addEventListener('click', () => selectRoom(button.dataset.room)));

$$('.hotspot').forEach(button => button.addEventListener('click', () => {
  const note = $('#hotspotNote');
  note.textContent = button.dataset.note;
  note.classList.add('show');
  clearTimeout(note.hideTimer);
  note.hideTimer = setTimeout(() => note.classList.remove('show'), 3200);
}));

const modes = {
  reset: { image: 'assets/pool.jpg', title: 'A weekend with nowhere else to be.', description: 'Slow mornings, private evenings, and enough room to let the day happen naturally.', benefits: ['Private hot tub', 'Late morning coffee', 'Sunset dining'] },
  friends: { image: 'assets/terrace.jpg', title: 'Together, without being on top of each other.', description: 'Generous gathering spaces and private suites give the whole group the right balance.', benefits: ['Seats 10 together', 'Four private bedrooms', 'Outdoor entertaining'] },
  family: { image: 'assets/living.jpg', title: 'Space for everyone to settle in.', description: 'Easy shared spaces, practical comforts, and room for every generation to find their pace.', benefits: ['Flexible sleeping', 'Full kitchen', 'Quiet private setting'] },
  work: { image: 'assets/detail.jpg', title: 'A better view for your next good idea.', description: 'Fast connection, calm work zones, and an instant change of pace when the laptop closes.', benefits: ['Fast WiFi', 'Two work zones', 'Restorative surroundings'] }
};

$$('.mode-pill').forEach(button => button.addEventListener('click', () => {
  const data = modes[button.dataset.mode];
  $$('.mode-pill').forEach(pill => {
    const active = pill === button;
    pill.classList.toggle('active', active);
    pill.setAttribute('aria-selected', String(active));
  });
  $('#modeImage').style.backgroundImage = `url('${data.image}')`;
  $('#modeTitle').textContent = data.title;
  $('#modeDescription').textContent = data.description;
  $('#modeBenefits').innerHTML = data.benefits.map(item => `<span>${item}</span>`).join('');
}));

const places = {
  home: ['Your private base', 'Close to what you came for.'],
  park: ['Joshua Tree National Park', 'Fourteen minutes to the west entrance.'],
  dining: ['Local tables', 'Eight minutes to coffee, dinner, and drinks.'],
  market: ['Everyday essentials', 'Six minutes to groceries and supplies.']
};
$$('.map-pin').forEach(pin => pin.addEventListener('click', () => {
  $$('.map-pin').forEach(item => item.classList.toggle('active', item === pin));
  const [label, title] = places[pin.dataset.place];
  $('#mapCard').innerHTML = `<small>${label}</small><strong>${title}</strong>`;
}));

const reviews = [
  { quote: 'We booked for the view, but the layout is what made the weekend. Everyone had space, and we still spent most of the trip together.', name: 'Maya R.', type: 'Friends trip · August 2026' },
  { quote: 'The house felt even calmer than the photos. We watched the light change all afternoon and never felt the need to leave.', name: 'Elliot T.', type: 'Couples stay · June 2026' },
  { quote: 'Every practical detail was handled before we arrived. It made a family weekend feel simple from the first minute.', name: 'Nadia K.', type: 'Family stay · April 2026' }
];
let reviewIndex = 0;
function renderReview() {
  const review = reviews[reviewIndex];
  $('#reviewQuote').animate([{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350 });
  $('#reviewQuote').textContent = review.quote;
  $('#reviewName').textContent = review.name;
  $('#reviewType').textContent = review.type;
  $('#reviewCount').textContent = `${String(reviewIndex + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
}
$('#prevReview').addEventListener('click', () => { reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length; renderReview(); });
$('#nextReview').addEventListener('click', () => { reviewIndex = (reviewIndex + 1) % reviews.length; renderReview(); });

const gallery = $('#galleryDialog');
const story = $('#storyDialog');
$('#viewGallery').addEventListener('click', () => gallery.showModal());
$('#watchStory').addEventListener('click', () => story.showModal());
$$('dialog .dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
}));

const arrival = $('#arrivalDate');
const departure = $('#departureDate');
const today = new Date();
const addDays = days => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
arrival.min = addDays(1);
departure.min = addDays(2);
arrival.value = addDays(14);
departure.value = addDays(16);
let guests = 2;

function updateBooking() {
  const start = new Date(`${arrival.value}T12:00:00`);
  const end = new Date(`${departure.value}T12:00:00`);
  let nights = Math.round((end - start) / 86400000);
  if (!Number.isFinite(nights) || nights < 1) nights = 1;
  const subtotal = nights * 680;
  const tax = Math.round((subtotal + 180) * .12);
  const total = subtotal + 180 + tax;
  $('#nightCount').textContent = nights;
  $('#nightSubtotal').textContent = `$${subtotal.toLocaleString()}`;
  $('#taxTotal').textContent = `$${tax.toLocaleString()}`;
  $('#totalPrice').textContent = `$${total.toLocaleString()}`;
  $('#guestCount').textContent = guests;
  $('#railGuests').textContent = `${guests} guest${guests === 1 ? '' : 's'}`;
  if (arrival.value && departure.value) {
    const format = value => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    $('#railDates').textContent = `${format(arrival.value)} to ${format(departure.value)}`;
  }
}
arrival.addEventListener('change', () => {
  const minDeparture = new Date(`${arrival.value}T12:00:00`);
  minDeparture.setDate(minDeparture.getDate() + 1);
  departure.min = minDeparture.toISOString().split('T')[0];
  if (new Date(departure.value) <= new Date(arrival.value)) departure.value = departure.min;
  updateBooking();
});
departure.addEventListener('change', updateBooking);
$('#guestMinus').addEventListener('click', () => { guests = Math.max(1, guests - 1); updateBooking(); });
$('#guestPlus').addEventListener('click', () => { guests = Math.min(12, guests + 1); updateBooking(); });
updateBooking();

$$('.js-book').forEach(button => button.addEventListener('click', () => {
  $('#booking').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  closeMobileMenu();
}));

$('#bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  const toast = $('#toast');
  toast.textContent = 'Dates confirmed in this prototype. No payment was processed.';
  toast.classList.add('show');
  $('#formNote').textContent = 'Your selected dates are available in this prototype.';
  setTimeout(() => toast.classList.remove('show'), 4200);
});

const menuButton = $('#menuButton');
const mobileMenu = $('#mobileMenu');
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
menuButton.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('.mobile-menu a').forEach(link => link.addEventListener('click', closeMobileMenu));

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMobileMenu();
});
