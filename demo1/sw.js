var cache_Names = [
	'./js/index.js'
];
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open('demo1')
			.then(function(cache){
				console.log('install finish..');
				return cache.addAll(cache_Names);
			})
	);
});

self.addEventListener('fetch', function(event){
	console.log('fetch listener');
	event.respondWith(
		caches.match(event.request)
			.then(function(response){
				console.log('成功拦截请求并进行匹配');
				if(response){
					return response.json();
				}
				return null;
			})
			.catch(function(){
				console.log('匹配异常');
			})
	);
});