document.addEventListener('DOMContentLoaded', () => {
  // 1. Service Worker Registreren
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('[ENOLA] Offline systeem gereed.'))
      .catch((err) => console.error('[ENOLA] SW fout:', err));
  }

  // 2. Navigatie tussen secties
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      navButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // 3. Live Tactische Klok (NL Tijd)
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('nl-NL', { hour12: false }) + ' CET';
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 4. Online / Offline Status Detector
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
});
