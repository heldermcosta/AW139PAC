'use strict';

// Version changes on every build â€” forces old caches to be replaced.
const CACHE = 'aw139pac-20260223220107';

// Every file in the build is listed here so the service worker
// can pre-cache all of them during install, enabling offline use
// immediately after the first online load.
const PRECACHE = [
  './.last_build_id',
  './favicon.png',
  './flutter.js',
  './flutter_bootstrap.js',
  './flutter_service_worker.js',
  './index.html',
  './main.dart.js',
  './manifest.json',
  './version.json',
  './assets/AssetManifest.bin',
  './assets/AssetManifest.bin.json',
  './assets/FontManifest.json',
  './assets/NOTICES',
  './assets/assets/100withEAPS.jpg',
  './assets/assets/100withIBF.jpg',
  './assets/assets/100withoutEAPS.jpg',
  './assets/assets/102withEAPS.jpg',
  './assets/assets/102withIBF.jpg',
  './assets/assets/102withoutEAPS.jpg',
  './assets/assets/aw139_pwr_ass_icon.png',
  './assets/assets/BleedValveGraph.jpg',
  './assets/assets/BleedValveGraph.png',
  './assets/assets/performanceTables.json',
  './assets/assets/s50-63.jpg',
  './assets/assets/s50-63.json',
  './assets/assets/s50-63_chartBounds.json',
  './assets/assets/s69-63.jpg',
  './assets/assets/s69-63.json',
  './assets/assets/s69-63_chartBounds.json',
  './assets/fonts/MaterialIcons-Regular.otf',
  './assets/packages/cupertino_icons/assets/CupertinoIcons.ttf',
  './assets/shaders/ink_sparkle.frag',
  './assets/shaders/stretch_effect.frag',
  './canvaskit/canvaskit.js',
  './canvaskit/canvaskit.js.symbols',
  './canvaskit/canvaskit.wasm',
  './canvaskit/skwasm.js',
  './canvaskit/skwasm.js.symbols',
  './canvaskit/skwasm.wasm',
  './canvaskit/skwasm_heavy.js',
  './canvaskit/skwasm_heavy.js.symbols',
  './canvaskit/skwasm_heavy.wasm',
  './canvaskit/wimp.js',
  './canvaskit/wimp.js.symbols',
  './canvaskit/wimp.wasm',
  './canvaskit/chromium/canvaskit.js',
  './canvaskit/chromium/canvaskit.js.symbols',
  './canvaskit/chromium/canvaskit.wasm',
  './icons/Icon-192.png',
  './icons/Icon-512.png',
  './icons/Icon-maskable-192.png',
  './icons/Icon-maskable-512.png',
  './icons/maskable_icon_x128.png',
  './icons/maskable_icon_x192.png',
  './icons/maskable_icon_x384.png',
  './icons/maskable_icon_x48.png',
  './icons/maskable_icon_x512.png',
  './icons/maskable_icon_x72.png',
  './icons/maskable_icon_x96.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Cache files individually â€” one failure won't abort the whole install.
      Promise.allSettled(
        PRECACHE.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[sw] failed to cache:', url, err)
          )
        )
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  // Delete any caches from previous builds.
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// Cache-first: serve instantly from cache; fall back to network for
// anything not yet cached (e.g. weather API, analytics).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached ||
      fetch(event.request).then((response) => {
        if (response.ok) {
          caches.open(CACHE).then((cache) =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      })
    )
  );
});
