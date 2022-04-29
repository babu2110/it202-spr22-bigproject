// Establish a cache name
const cacheName = 'TNPcache';
let urlsToCache = [
  '/'
]

self.addEventListener('install', function(event) {
  //perform install steps
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("Opened cache")
      return cache.add('index.html');
    })
  );
});
self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(caches.open(cacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});
