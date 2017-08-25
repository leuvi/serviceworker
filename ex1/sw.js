const CACHE_DATA = {
	name: 'v1',
	urls: [
		'/ex1/',
		'/ex1/index.html',
		'/ex2/main.css',
		'/ex2/data.js',
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
	event.respondWith(
		caches.match(event.request).then(response => {
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