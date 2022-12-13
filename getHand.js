const sharp = require('sharp')
const { matchTemplate } = require('./matchTemplate.js')
const { options } = require('./options.js')

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
	; (async () => {
	await getHand('./images/sample/001.PNG')
})()
module.exports = { getHand }

function Area(left, top, width, height) {
	this.left = left
	this.top = top
	this.width = width
	this.height = height
	return this
}

async function getHand(fullscreen) {
	const buffer = await sharp(fullscreen)
		.png(options)
		.extract(new Area(220, 935, 29 + 95 * 14, 137))
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
	// const newTile = await sharp(buffer)
	// 	.extract(new Area(29 + 95 * hand.length, 0, 95, 137))
	// 	.toBuffer()
	// const [tile, _idx] = await getTile(newTile)
	// if (tile !== -1) {
	// 	hand.push(tile)
	// }
	console.log(hand)
	return hand.sort()

	async function getTile(img, idx = 0) {
		const n = A.length
		for (let i = idx; i < n; i++) {
			const src = await readImage(img)
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
}
