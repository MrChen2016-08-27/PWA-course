(function(){
	if('serviceWorker' in navigator){
		window.addEventListener('load', function(){
			navigator.serviceWorker.register('../sw.js')
				.then(function(registration){
					console.log('注册服务工作线程成功');
					console.log('作用域:' + registration.scope);
				})
				.catch(function(){
					console.log('注册服务工作线程失败');
				})
		});
	}
}());

(function(){
	let oSend = document.getElementById('send');
	let url = 'http://api.biaojingli.com/api/v1/admin/tenders?page=1&limit=10';
	oSend.addEventListener('click', function(){
		fetch(url).then(function(response){
			return response.json();
		}).then(function(json){
			alert(json);
		})
	})
}());