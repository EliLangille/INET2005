const CACHE_NAME = 'trivia-game-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/trivia.js',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-120x120.png',
  '/icons/icon-144x144.png',
  '/icons/icon-167x167.png',
  '/icons/icon-192x192.png',
  '/icons/icon-310x310.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});