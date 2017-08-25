const CACHE_DATA = {
	name: 'v2',
	urls: [
		'/ex2/main.css',
		'/ex2/data.js',
		'/ex2/img/buou.jpg',
		'/ex2/img/nuowei.jpg',
		'/ex2/img/mianyin.jpg',
	]
}


self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_DATA.name).then(cache => {
			return cache.addAll(CACHE_DATA.urls)
		})
	)
})

self.addEventListener('fetch', event => {
	//设置白名单
	if(!CACHE_DATA.urls.some(url => event.request.url.includes(url))) {
		return
	}
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			if(response) {
				return response
			}
			return fetch(event.request).then(response => {
				let responseClone = response.clone()
				caches.open(CACHE_DATA.name).then(cache => {
					cache.put(event.request, responseClone)
				})
				return response
			}).catch(e => console.log(e))
		}).catch(() => fetch(event.request))
	)
})