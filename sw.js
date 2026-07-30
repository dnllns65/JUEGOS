// sw.js - Service Worker para Juego Offline 100% (Modo Avión)
const CACHE_NAME = 'adivina-quien-v51';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './receiver.html',
  './app.js',
  './receiver.js',
  './database.js',
  './style.css',
  './manifest.json',
  './manifest_guest.json',
  './icon.png',
  './icon_guest.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('ntfy.sh') || event.request.url.includes('wikipedia') || event.request.url.includes('qrserver')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
