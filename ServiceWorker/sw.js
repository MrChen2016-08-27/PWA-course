var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/',
	'/style/main.css'
];
//安装
self.addEventListener('install', function(events){
	events.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache){
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

//缓存和返回 请求
self.addEventListener('fetch', function(event){
	event.respondWith(
		cache.match(event.request)
			.then(function(response){
				if(response){
					return response;
				}
				return fetch(event.request);
			})
	);
});
