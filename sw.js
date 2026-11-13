const CACHE_NAME = 'enola-cmd-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './assets/icons/logo.svg'
];

// Installatie: sla kernbestanden op in cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activatie: ruim oude caches op
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: lever bestanden uit cache bij offline gebruik
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback als zowel cache als netwerk falen (bijv. kaarttegels die niet gecached zijn)
        return new Response('OFFLINE - GEEN CACHED DATA BESCHIKBAAR', {
          status: 503,
          statusText: 'Offline'
        });
      });
    })
  );
});
