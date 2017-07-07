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
		caches.match(event.request)
			.then(function(response){
				if(response){
					return response;
				}
				return fetch(event.request);
			})
	);
});

//连续缓存新请求
self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request)
			.then(function(response){
				if(response){
					return response;
				}
				var req = events.request.clone();
				return fetch(req)
					.then(function(response){
						if(!response || response.status!== 200 ||response.type !== 'basic'){
							return response;
						}
						var resToCache = response.clone();
						caches.open(CACHE_NAME)
							.then(function(cache){
								cache.put(event.request, resToCache);
							});
						return response;
					});
			}));
});
/** 
* 旧服务工作线程被终止，新服务工作线程取得控制权 触发 activate 事件
* 遍历服务工作线程的所有缓存，并删除不在白名单中的缓存
* 如果想要废弃旧服务线程的旧缓存，可以在白名单去掉
*/
self.addEventListener('activate', function(event){
	var cacheWhitelist = ['page-cache-1', 'blog-posts-cache-v1'];
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheWhitelist.indexOf(cacheName === -1)){
						return caches.delete(cacheName);
					}
				})
			);
		}));
});