	(function(){
		if('serviceWorker' in navigator){
			window.addEventListener('load', function(){
				navigator.serviceWorker.register('./js/sw.js').then(function(registration){
					console.log('ServiceWorker registration scope', registration.scope);
				}).catch(function(err){
					console.log('err: ', err);
				});
			});
		}	
	}());
	/**
	* 为用户提供一个“Read later”或“Save for offline”按钮,让用户选择自己需要缓存的内容
	* 在点击该按钮后，从网络获取您需要的内容并将其置于缓存中
	* caches API 可通过页面以及服务工作线程获取，
	* 这意味着您不需要通过服务工作线程向缓存添加内容
	*/

	(function(){
		document.querySelector('.cache-article').addEventListener('click', function(event){
			event.preventDefault();
			caches.open('mysite-article')
				.then(function(cache){
					fetch('http://api.biaojingli.com/api/v1/admin/tenders?page=1&limit=10')
						.then(function(response){
							return response.json();
						})
						.then(function(urls){
							let data = urls.data;
							cache.addAll(data);
						});
				});
		});
	}());