'use strict';

const CACHE = 'aw139pac-v2';

// Core shell — pre-cached immediately on install so the app can launch,
// render, and use every tool even on a device that has never been online
// with this app before (first-run offline).
//
// NOTE: this list is manually maintained. If assets/ gains or loses files,
// or the Flutter/CanvasKit version changes, update the relevant section
// below (paths are checked by hand against a `flutter build web` output).
const SHELL = [
  './',
  'flutter.js',
  'flutter_bootstrap.js',
  'main.dart.js',
  'manifest.json',
  'favicon.png',
  'version.json',

  // CanvasKit renderer — required to render anything at all. Bundled
  // locally (see web/flutter_bootstrap.js, canvasKitBaseUrl) instead of
  // fetched from Google's CDN, specifically so it can be precached here.
  'canvaskit/canvaskit.js',
  'canvaskit/canvaskit.wasm',
  'canvaskit/chromium/canvaskit.js',
  'canvaskit/chromium/canvaskit.wasm',

  // Flutter engine manifests — needed at startup to know what assets/fonts exist.
  'assets/AssetManifest.bin',
  'assets/AssetManifest.bin.json',
  'assets/FontManifest.json',

  // Fonts — Material icons are used throughout the whole UI.
  'assets/fonts/MaterialIcons-Regular.otf',
  'assets/packages/cupertino_icons/assets/CupertinoIcons.ttf',

  // Shaders — Material ripple/stretch effects.
  'assets/shaders/ink_sparkle.frag',
  'assets/shaders/stretch_effect.frag',

  // App assets (declared in pubspec.yaml under `assets: - assets/`).
  'assets/assets/100withEAPS.jpg',
  'assets/assets/100withIBF.jpg',
  'assets/assets/100withoutEAPS.jpg',
  'assets/assets/102withEAPS.jpg',
  'assets/assets/102withIBF.jpg',
  'assets/assets/102withoutEAPS.jpg',
  'assets/assets/BleedValveGraph.jpg',
  'assets/assets/BleedValveGraph.png',
  'assets/assets/S97-35.jpg',
  'assets/assets/aw139_pwr_ass_icon.png',
  'assets/assets/path163-4.jpg',
  'assets/assets/performanceTables.json',
  'assets/assets/s-97-35.svg',
  'assets/assets/s50-63.jpg',
  'assets/assets/s50-63.json',
  'assets/assets/s50-63_chartBounds.json',
  'assets/assets/s69-63.jpg',
  'assets/assets/s69-63.json',
  'assets/assets/s69-63_chartBounds.json',
  'assets/assets/s97-35.json',
  'assets/assets/s97-35_chartBounds.json',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Cache each file independently rather than cache.addAll(), so one
      // missing/renamed file can't abort precaching of everything else.
      Promise.all(
        SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[sw] failed to precache', url, err);
          })
        )
      )
    )
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
