var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/',
	'/style/main.css'
];
/** 
* 安装 
* 不会将 data1 cache.addAll promise 传递回 event.waitUntil
* 因此，即使它失败，在离线状态下仍然可用
* 对应的本机应用会将这些对象包含在初始下载中
* 如果未能提取 data 2 对象，将使您的网站完全无法运行，
* 对应的本机应用会将 data 2包含在初始下载中。
*/
self.addEventListener('install', function(events){
	events.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache){
				console.log('Opened cache');
				// data 1
				cache.addAll([
					'/style/main.css'
				]);
				// data 2
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

//如果有可用的缓存版本，则使用该版本，但下次会获取更新
self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.open('mysite-dynamic')
			.then(function(cache){
				return cache.match(event.request)
					.then(function(response){
						var fetcbPromise = fetch(event.request)
							.then(function(networkResponse){
								cache.put(event.request,networkResponse.clone());
								return networkResponse;
							});
						return response || networkResponse;
					})
			})
	);
});

/**
 * Push API 是基于 ServiceWorker 构建的另一个功能。
 * 该 API 允许唤醒 ServiceWorker 以响应来自操作系统消息传递服务的消息。
 * 即使用户没有为您的网站打开标签，也会如此，仅唤醒 ServiceWorker。 
 * 您从页面请求执行此操作的权限，用户将收到提示。
 */

/*
* 消息推送
* 显示通知前, 先更新缓存
 */
self.addEventListener('push', function(event){
	if(event.data.text() === 'new-email'){
		event.waitUntil(
			caches.open('mysite-dynamic')
				.then(function(cache){
					return fetch('./inbox.json')
						.then(function(response){
							cache.put('./inbox.json', response.clone());
							return response.json();
						});
				})
				.then(function(emails){
					registration.showNotification("New email", {
						body: "From" + emails[0].from.name,
						tag: "new-email"
					});
				});
		)
	}	
});
/*
* 推送消息被点击
*/ 
self.addEventListener('notificationclick', function(event){
	if(event.notification.tag === 'new-email'){
		new WindowClient('/inbox/');
	}
});

/*
* 后台同步是基于 ServiceWorker 构建的另一个功能。
* 它允许您一次性或按（非常具有启发性的）间隔请求后台数据同步。 
* 即使用户没有为您的网站打开标签，也会如此，仅唤醒 ServiceWorker。
* 您从页面请求执行此操作的权限，用户将收到提示。
* 适合于： 非紧急更新，特别那些定期进行的更新，
* 每次更新都发送一个推送通知会显得太频繁，如社交时间表或新闻文章。
 */

self.addEventListener('sync', function(event){
	if(event.id === 'update-leader'){
		event.waitUntil(
			caches.open('mygame-dynamic')
				.then(function(cache){
					return cache.add('./xxxx.json');
				});
		);
	}
});

/**
 * 缓存持久化
 * 为您的源提供特定量的可用空间以执行它需要的操作。
 * 该可用空间可在所有源存储之间共享。
 *  LocalStorage、IndexedDB、Filesystem，当然还有 Caches。
 */

navigator.storage.requestPersistent().then(function(granted) {
  if (granted) {
    // Hurrah, your data is here to stay!
  }
});

