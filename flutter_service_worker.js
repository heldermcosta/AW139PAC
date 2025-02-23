'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "fa4e782c9e5173d4d9014920be1397ab",
"assets/AssetManifest.bin.json": "6d038ea8aea233eb0e87acf1d234ac26",
"assets/AssetManifest.json": "80343fb7a243752779b9f11239ab9968",
"assets/assets/100withEAPS.jpg": "165f525f6f640ebe1484399852464665",
"assets/assets/100withEAPS.svg": "889b99aa63a61738093683b2d7839718",
"assets/assets/100withIBF.jpg": "48a9b72044b02e2ad19a172565bdf36b",
"assets/assets/100withIBF.svg": "400d12391aad3f0c533a42d3495ae8de",
"assets/assets/100withoutEAPS.jpg": "ef48c17652495a36766f2f89f967f26f",
"assets/assets/100withoutEAPS.svg": "5aa192ba41413a3d22b47a3a96bdcfd3",
"assets/assets/102withEAPS.jpg": "dd92a97d542578781bd7c59b1f6b1c13",
"assets/assets/102withEAPS.svg": "8770102cbbc634c160b312a3cb2f964c",
"assets/assets/102withIBF.jpg": "0bcca6ca28aeb64d61eb3f6d9dbf2222",
"assets/assets/102withIBF.svg": "f399872762f8394a5141af618f771cda",
"assets/assets/102withoutEAPS.jpg": "16d82f9e9b97f6c0b2c3bf5fe4f2f865",
"assets/assets/102withoutEAPS.svg": "0f036b642a5db4a7d3cb9b29b043ebbf",
"assets/assets/aw139_pwr_ass_icon.png": "123f7d0a88f3b4e0fbfd60b03fd6f79c",
"assets/assets/aw139_pwr_ass_icon.svg": "acd2d1ca3bd12063a4cce1141d40be45",
"assets/assets/IBF%2520100.tar": "1c228ca81b764f8e2ec9b2e9f7a55312",
"assets/assets/IBF%2520102.tar": "9b5b2277c4867562774ccb344d396204",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "2a7e38d87b56758180648c803d4f996f",
"assets/NOTICES": "5694c7f3d1e6341febf4a6e102d8ffc1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "123f7d0a88f3b4e0fbfd60b03fd6f79c",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"flutter_bootstrap.js": "b1f967fb37bdfc8b366ed3ade9cf5c94",
"flutter_service_worker.js.bak": "c4724c63222e01829efff248c642d93b",
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
"index.html": "effc7be13102f8617a624b6408d5af74",
"./": "affc7be13102f8617a624b6408d5af74",
"main.dart.js": "4b90804976b02a083a54fd5a7055c233",
"manifest.json": "845e746b0316ba86182765aace55ca57",
"version.json": "edbe3d570bf3a6e812d256a905e5c2d3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
               "/",
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
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
