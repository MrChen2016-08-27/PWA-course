const cacheName = 'cacheFiles-list';
var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];
self.addEventListener('install', function(event){
	console.log('ServiceWorker install ....');
	event.waitUntil(
		caches.open(cacheName)
			.then(function(cache){
				console.log("ServiceWorker caching app shell");
				return cache.addAll(filesToCache);
			})
	);

});

self.addEventListener('activate', function(event){
	console.log("ServiceWorker Activate");
	event.waitUntil(
		caches.keys().then(function(keyList){
			return Promise.all(keyList.map(function(key){
				if(key !== cacheName){
					console.log('ServiceWorker Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	)
	return self.clients.claim();
});
