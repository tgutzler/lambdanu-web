const CACHE_NAME = 'lambdanu-v2'; // <--- BUMP THIS VERSION NUMBER WHEN YOU UPDATE FILES!
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
];

self.addEventListener('install', (e) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// NEW: Delete old caches when a new version activates
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

