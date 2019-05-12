var CACHE_STATIC_NAME = "static-v2";
var CACHE_DYNAMIC_NAME = "dynamic-v1";

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME).then(function(cache) {
			cache.addAll([
				"/",
				"/index.html",
				"/src/css/app.css",
				"/src/css/main.css",
				"/src/js/main.js",
				"/src/js/material.min.js",
				"https://fonts.googleapis.com/css?family=Roboto:400,700",
				"https://fonts.googleapis.com/icon?family=Material+Icons",
				"https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"
			]);
		})
	);
});

self.addEventListener("activate", function(event) {
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(
				keyList.map(function(key) {
					if (key !== CACHE_STATIC_NAME) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

// Network with cache fallback strategy
// self.addEventListener("fetch", function(event) {
// 	event.respondWith(
// 		fetch(event.request).catch(function(_) {
// 			return caches.match(event.request);
// 		})
// 	);
// });

// Dynamic caching for cache then network strategy
self.addEventListener("fetch", function(event) {
	event.respondWith(
		caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
			return fetch(event.request).then(function(response) {
				cache.put(event.request.url, response.clone());
				return response;
			});
		})
	);
});
