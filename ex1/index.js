if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/ex1/sw.js', {
		scope: '/ex1/'
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

window.onload = function() {
	const app = document.querySelector('#app')
	DATA.imgs.forEach(image => {
		const img = document.createElement('img')
		const p = document.createElement('p')
		img.src = image.url
		p.textContent = image.name
		app.appendChild(img)
		app.appendChild(p)
	})
}