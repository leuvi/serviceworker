### Service Worker

如果对概念不清楚请先了解下[Service Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)

需要注意的是，Service Worker线程脚本只能由`HTTPS`承载

先注册`sw.js`脚本文件
```js
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/ex1/sw.js', {
		scope: '/ex1/' //注意路径
	}).then(reg => {
		if(reg.installing) {
			console.log('serviceWorker 正在安装！')
		} else if (reg.waiting) {
			console.log('serviceWorker 成功安装！')
		} else if (reg.active) {
			console.log('serviceWorker 成功激活！')
		}
	}).catch(e => console.log(`注册失败：%c${e}`, 'color: red'))
}
```



### 全部缓存

```js
const CACHE_DATA = {
	name: 'v1',
	urls: [
		'/ex1/', //设置该路径下所有内容缓存
	]
}
```
[点我查看](https://demo.sweetui.com/ex1/)

<img src="sw1.png">

可以看到status都是200并且都是from ServiceWorker
离线刷新页面依然可以访问



### 缓存静态资源

```js
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
```
[点我查看](https://demo.sweetui.com/ex2/)

<img src="sw2.png">

缓存列表里没有index.js (from memory cache)

根据项目需求做到静态资源缓存

