'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "c6b210a77d0f9f937b62d27aba248595",
"assets/AssetManifest.bin.json": "5753745a070f658179a1156256ddb8bf",
"assets/AssetManifest.json": "f700441807baf0b5509cace04a7dd2b8",
"assets/assets/100withEAPS.jpg": "165f525f6f640ebe1484399852464665",
"assets/assets/100withEAPS.svg": "20361de8bc6b7b8e98b9b106a52f934f",
"assets/assets/100withIBF.jpg": "48a9b72044b02e2ad19a172565bdf36b",
"assets/assets/100withIBF.svg": "38345ef25af82d0b86d11448508ddd88",
"assets/assets/100withoutEAPS.jpg": "ef48c17652495a36766f2f89f967f26f",
"assets/assets/100withoutEAPS.svg": "71dc4c0c226c5dae740eb2439eba4c67",
"assets/assets/102withEAPS.jpg": "dd92a97d542578781bd7c59b1f6b1c13",
"assets/assets/102withEAPS.svg": "8770102cbbc634c160b312a3cb2f964c",
"assets/assets/102withIBF.jpg": "0bcca6ca28aeb64d61eb3f6d9dbf2222",
"assets/assets/102withIBF.svg": "f399872762f8394a5141af618f771cda",
"assets/assets/102withoutEAPS.jpg": "16d82f9e9b97f6c0b2c3bf5fe4f2f865",
"assets/assets/102withoutEAPS.svg": "0f036b642a5db4a7d3cb9b29b043ebbf",
"assets/assets/aw139_pwr_ass_icon.png": "123f7d0a88f3b4e0fbfd60b03fd6f79c",
"assets/assets/aw139_pwr_ass_icon.svg": "acd2d1ca3bd12063a4cce1141d40be45",
"assets/assets/graphData.json": "606cf763cdcbca4ff4d9dbab18276ebf",
"assets/assets/HeightLossFlyawayUpTo6400Kg.jpg": "5d6af567d2a4c1a1e8a1c0b909d1b759",
"assets/assets/IBF%2520100.tar": "1c228ca81b764f8e2ec9b2e9f7a55312",
"assets/assets/IBF%2520102.tar": "9b5b2277c4867562774ccb344d396204",
"assets/assets/performanceTables.json": "2cb27b1bda46bee98a011d8933fcc89c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "41a628f02f67e499d0c2fbab87442b38",
"assets/NOTICES": "740e3ca5fd75fac9384d65c6c29787b6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"favicon.png": "123f7d0a88f3b4e0fbfd60b03fd6f79c",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "f851bc2194ef9bc073c90f757fe97390",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/maskable_icon_x128.png": "0f7e0cb48f8a54e1708631f3de982ba5",
"icons/maskable_icon_x192.png": "03770a2b2803d1fd026437c063dd6d53",
"icons/maskable_icon_x384.png": "740e03c3bfc1e403e742941ac65f0d98",
"icons/maskable_icon_x48.png": "1b25116393eae495a77e05bf4925bbba",
"icons/maskable_icon_x512.png": "fb872e0a35cc5d1ea5bf3fd38997fa4f",
"icons/maskable_icon_x72.png": "be66a9649fa714c500dc543b5c146c83",
"icons/maskable_icon_x96.png": "12d39a71ab033765dad580a6b1fe0e49",
"index.html": "f04ead92d756632555dcb106d4eaa643",
"/": "f04ead92d756632555dcb106d4eaa643",
"main.dart.js": "3a44fba9877b4ae34dd00395ef3fb4a7",
"manifest.json": "73c33b3564f64c31681775376f8785df",
"version.json": "edbe3d570bf3a6e812d256a905e5c2d3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((networkResponse) => {
  if (networkResponse && networkResponse.ok) {
    cache.put(event.request, networkResponse.clone());
  }
  return networkResponse;
}).catch(() => {
  return response;
});
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
