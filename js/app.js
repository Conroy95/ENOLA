document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('[ENOLA] Offline systeem gereed.'))
      .catch((err) => console.error('[ENOLA] SW fout:', err));
  }

  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      navButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetId).classList.add('active');

      if (targetId === 'view-map' && window.enolaMap) {
        setTimeout(() => { window.enolaMap.invalidateSize(); }, 200);
      }
    });
  });

  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('nl-NL', { hour12: false }) + ' CET';
  }
  setInterval(updateClock, 1000);
  updateClock();

  const statusEl = document.getElementById('net-status');
  function updateNetworkStatus() {
    if (navigator.onLine) {
      statusEl.textContent = '● VERBONDEN';
      statusEl.className = 'status-badge status-online';
    } else {
      statusEl.textContent = '▲ OFFLINE MODUS';
      statusEl.className = 'status-badge status-offline';
    }
  }
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

  const nlCenter = [52.1326, 5.2913];
  const enolaMap = L.map('map', {
    zoomControl: false
  }).setView(nlCenter, 8);

  L.control.zoom({ position: 'topright' }).addTo(enolaMap);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(enolaMap);

  window.enolaMap = enolaMap;

  document.getElementById('btn-nl-center').addEventListener('click', () => {
    enolaMap.setView(nlCenter, 8);
  });

  document.getElementById('btn-print-map').addEventListener('click', () => {
    window.print();
  });
});
