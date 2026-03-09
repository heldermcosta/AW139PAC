'use strict';

const CACHE = 'aw139pac-v1';

// Core shell — pre-cached immediately on install so the app
// can launch even before any page has been visited.
const SHELL = [
  './',
  'flutter.js',
  'flutter_bootstrap.js',
  'main.dart.js',
  'manifest.json',
  'favicon.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL))
  );
});

self.addEventListener('activate', (event) => {
  // Remove any old caches from previous versions.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Network-first, cache fallback.
// Online: always fetch fresh content and update the cache silently.
// Offline: serve whatever was cached on the last online visit.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          caches.open(CACHE).then((cache) =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
