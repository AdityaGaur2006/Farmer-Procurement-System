let authToken = sessionStorage.getItem('kisansetuToken') || '';
const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(path, { ...options, headers });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Something went wrong');
  return payload;
}

function enterDashboard(farmer) {
  document.body.classList.remove('auth-required');
  document.body.classList.add('authenticated');
  if (farmer) {
    document.querySelector('.greeting h1').innerHTML = `Good morning, ${farmer.name.split(' ')[0]} <span>✦</span>`;
    document.querySelector('.profile strong').textContent = farmer.name;
    document.querySelector('.profile small').textContent = `Farmer ID · ${farmer.id}`;
  }
  loadMarketRecommendations();
}

document.querySelector('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const error = document.querySelector('#loginError');
  const submit = event.currentTarget.querySelector('[type="submit"]');
  error.textContent = '';
  submit.disabled = true;
  submit.textContent = 'Signing in…';
  try {
    const result = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ phone: document.querySelector('#phone').value, password: document.querySelector('#password').value }) });
    authToken = result.token;
    sessionStorage.setItem('kisansetuToken', authToken);
    enterDashboard(result.farmer);
    showToast(`Welcome back, ${result.farmer.name.split(' ')[0]}.`);
  } catch (err) {
    error.textContent = `${err.message}. Start the app with “npm start” and try again.`;
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Sign in <span>→</span>';
  }
});

document.querySelector('#otpLogin').addEventListener('click', () => {
  document.querySelector('#loginError').textContent = 'OTP delivery will connect to the Notification Service in the next backend phase.';
});
document.querySelector('#registerFarmer').addEventListener('click', () => {
  document.querySelector('#loginError').textContent = 'Registration API is ready at POST /api/auth/register. A full registration form is the next UI step.';
});

function money(value) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value); }
async function loadMarketRecommendations() {
  const target = document.querySelector('#marketRows');
  target.innerHTML = '<tr><td colspan="5">Loading today’s market intelligence…</td></tr>';
  try {
    const result = await api('/api/recommendations?crop=Wheat&quantity=45');
    target.innerHTML = result.recommendations.map(row => `<tr><td><strong>${row.centre}</strong><small>${row.queueCount} farmers in queue · ${row.district}</small></td><td>${money(row.pricePerQuintal)} / qtl</td><td>${row.distanceKm} km</td><td class="net-return">${money(row.estimatedNetReturn)}</td><td><button class="choose-market">${row.recommended ? 'Recommended' : 'View centre'}</button></td></tr>`).join('');
  } catch (err) {
    target.innerHTML = '<tr><td colspan="5">Market recommendations are temporarily unavailable.</td></tr>';
  }
}

const slotDialog = document.querySelector('#slotDialog');
document.querySelector('#bookSlot').addEventListener('click', () => slotDialog.showModal());
document.querySelector('#viewBooking').addEventListener('click', () => showToast('Booking #A-042 is confirmed for Friday, 10:30 AM.'));
document.querySelectorAll('.slot').forEach(slot => slot.addEventListener('click', () => {
  document.querySelectorAll('.slot').forEach(item => item.classList.remove('selected'));
  slot.classList.add('selected');
}));
slotDialog.addEventListener('close', async () => {
  if (slotDialog.returnValue === 'confirm') {
    try {
      const result = await api('/api/bookings', { method: 'POST', body: JSON.stringify({ crop: document.querySelector('#crop').value, quantityQuintals: document.querySelector('#quantity').value, slotAt: '2026-09-12T10:30:00+05:30' }) });
      showToast(`Token #${result.booking.token} is reserved. We will notify you before arrival.`);
    } catch { showToast('Your booking could not be saved. Please try again.'); }
  }
});

const queueCount = document.querySelector('#queueCount');
document.querySelector('#refreshQueue').addEventListener('click', () => {
  const count = Math.floor(24 + Math.random() * 11);
  queueCount.textContent = count;
  showToast(`Live queue updated: ${count} farmers currently in line.`);
});
document.querySelector('#checkQueue').addEventListener('click', () => document.querySelector('.queue-card').scrollIntoView({ behavior:'smooth', block:'center' }));
document.querySelector('#trackProcurement').addEventListener('click', () => document.querySelector('#procurement').scrollIntoView({ behavior:'smooth', block:'start' }));
document.querySelector('#viewPayments').addEventListener('click', () => showToast('Latest settlement: ₹48,360 paid successfully today.'));
document.querySelector('#arrivalTips').addEventListener('click', () => showToast('Tip: arrive 10 minutes before your token time; your place in line is protected.'));
document.querySelector('.view-report').addEventListener('click', () => showToast('Quality report: Grade A · Moisture 10.8% · Clean grain 98.2%.'));
document.querySelector('#refreshMarkets').addEventListener('click', () => { loadMarketRecommendations(); showToast('Fetching the latest published market rates.'); });

const marketBot = document.querySelector('#marketBot');
const botMessages = document.querySelector('#botMessages');
function addBotMessage(text, type = 'message') {
  const message = document.createElement('div');
  message.className = type === 'result' ? 'bot-result' : 'bot-message';
  message.textContent = text;
  botMessages.append(message);
  botMessages.scrollTop = botMessages.scrollHeight;
  return message;
}
function addMandiResult(mandi) {
  const result = document.createElement('div');
  result.className = 'bot-result';
  const name = document.createElement('strong'); name.textContent = mandi.recommended ? `Best net return · ${mandi.centre}` : mandi.centre;
  const detail = document.createElement('small'); detail.textContent = `${mandi.distanceKm} km away · ${mandi.queueCount} farmers in queue · rate published today`;
  const value = document.createElement('b'); value.textContent = `${money(mandi.pricePerQuintal)}/qtl → estimated net ${money(mandi.estimatedNetReturn)}`;
  result.append(name, detail, value);
  botMessages.append(result);
}
document.querySelector('#botTrigger').addEventListener('click', () => {
  marketBot.hidden = false;
  document.querySelector('#botTrigger').hidden = true;
});
document.querySelector('#botClose').addEventListener('click', () => {
  marketBot.hidden = true;
  document.querySelector('#botTrigger').hidden = false;
});
document.querySelector('#findMandis').addEventListener('click', () => {
  const button = document.querySelector('#findMandis');
  if (!navigator.geolocation) { addBotMessage('This browser does not support location services. Please use a browser with location access enabled.'); return; }
  button.disabled = true;
  button.textContent = 'Requesting location…';
  navigator.geolocation.getCurrentPosition(async position => {
    const crop = document.querySelector('#botCrop').value;
    const quantity = document.querySelector('#botQuantity').value;
    addBotMessage('Location received for this comparison. Looking at nearby published mandi rates…');
    try {
      const results = await api(`/api/nearby-mandis?lat=${position.coords.latitude}&lng=${position.coords.longitude}&crop=${encodeURIComponent(crop)}&quantity=${encodeURIComponent(quantity)}`);
      if (!results.nearbyMandis.length) { addBotMessage('No mandis with published rates were found within 100 km. Try again after rates are updated.'); }
      else {
        const best = results.nearbyMandis[0];
        addBotMessage(`${best.centre} is currently the best option for your ${quantity} quintals of ${crop}, after estimated transport cost.`);
        results.nearbyMandis.slice(0, 3).forEach(addMandiResult);
      }
    } catch (error) { addBotMessage('I could not compare rates right now. Please check your connection and try again.'); }
    finally { button.disabled = false; button.textContent = '⌖ Find nearby mandis'; }
  }, error => {
    const reason = error.code === error.PERMISSION_DENIED ? 'Location access was not allowed. Please allow it in your browser and try again.' : 'Your location could not be determined. Please try again outdoors or after enabling GPS.';
    addBotMessage(reason);
    button.disabled = false;
    button.textContent = '⌖ Find nearby mandis';
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
});
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  target.scrollIntoView({ behavior:'smooth', block:'start' });
}));
