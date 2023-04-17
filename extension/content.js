function generateMask(mode, stn, pos, discard, last) {
	const wait = 50
	const mask = document.createElement('div')
	mask.className = 'mask'
	const pairs = [7, 8, 20, 21]
	const orphans = [13, 14, 20, 21]
	let text = `STN = ${stn}`
	if (pairs.includes(mode)) {
		text += '7 pairs\n'
	}
	if (orphans.includes(mode)) {
		text += '13 orphans\n'
	}
	mask.innerText = text
	const left = pos * 95 + (last ? 249 : 220)
	mask.style.left = `${left}px`

	const adv = document.createElement('div')
	adv.className = 'adv'
	for (const tile of discard) {
		const img = document.createElement('img')
		img.src = chrome.runtime.getURL(`images/tiles/${tile}.PNG`)
		img.className = 'thumbnail'
		img.setAttribute('title', tile)
		adv.appendChild(img)
	}

	mask.addEventListener(
		'mouseover',
		debounce(function () {
			mask.innerText = ''
			mask.appendChild(adv)
		}, wait)
	)
	mask.addEventListener(
		'mouseleave',
		debounce(function () {
			mask.innerText = text
			mask.removeChild(adv)
		}, wait)
	)
	document.body.appendChild(mask)

	function debounce(func, wait) {
		let id = 0
		return function (...args) {
			if (id) {
				clearTimeout(id)
			}
			id = setTimeout(() => {
				func.apply(this, args)
			}, wait)
		}
	}
}

function removeMask() {
	const masks = document.getElementsByClassName('mask')
	for (const x of masks) {
		document.body.removeChild(x)
	}
}

let request = null
setInterval(() => {
	fetch('http://127.0.0.1:22071')
		.then((res) => res.json())
		.then((data) => {
			const record = JSON.stringify(data)
			if (request === record) {
				return
			}
			request = record
			removeMask()
			const { mode, min, discard, last } = data
			const arr = Array.from(Object.keys(discard))
			const n = arr.length
			for (let i = 0; i < n; i++) {
				const k = parseInt(arr[i])
				const v = discard[k]
				generateMask(mode, min, k, v, last && i === n - 1)
			}
		})
}, 400)

