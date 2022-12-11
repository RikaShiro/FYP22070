const sharp = require('sharp')
const { matchTemplate } = require('./matchTemplate.js')
const { shanten } = require('./shanten.js')

const threshold = 0.85
const A = []
// ignore aka dora
for (let i = 1; i < 10; i++) {
	for (const j of [10, 30, 50]) {
		const p = `./images/tiles/${j + i}.PNG`
		A.push(p)
	}
}
for (let i = 1; i <= 7; i++) {
	const p = `./images/tiles/${70 + i}.PNG`
	A.push(p)
}
A.sort()

function Area(left = 0, top = 0, width = 1920, height = 1080) {
	this.left = left
	this.top = top
	this.width = width
	this.height = height
}

async function getTile(buffer, idx = 0) {
	const n = A.length
	for (let i = idx; i < n; i++) {
		const src = await readImage(buffer)
		const templ = await readImage(A[i])
		const res = await matchTemplate(src, templ)
		if (res > threshold) {
			let tile = A[i].split('/').pop().split('.')[0]
			tile = Number(tile)
			return [tile, i]
		}
	}
	return [-1, 0]

	async function readImage(input) {
		const { data, info } = await sharp(input)
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true })
		const { width, height } = info
		return { data, width, height }
	}
}

async function getFullHand(fullscreen) {
	const buffer = await sharp(fullscreen)
		.extract(new Area(220, 935, 95 * 13, 137))
		.toBuffer()
	const hand = []
	let start = 0
	for (let i = 0; i < 13; i++) {
		const img = await sharp(buffer)
			.extract(new Area(95 * i, 0, 95, 137))
			.toBuffer()
		const [tile, idx] = await getTile(img, start)
		start = idx
		hand.push(tile)
	}
	return hand
}

;(async () => {
	const hand = await getFullHand('./images/fullscreen/002.PNG')
	try {
		// const stn = shanten(hand)
		// console.log(hand, stn)
		console.log(hand)
	} catch (e) {
		console.log(e)
	}
})()
