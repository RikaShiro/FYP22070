require('dotenv').config()
const sharp = require('sharp')
const { matchTemplate } = require('./matchTemplate.js')

const options = JSON.parse(process.env.imageOptions)
const threshold = 0.85
const A = []
// ignore aka dora
for (let i = 1; i <= 9; i++) {
	for (const j of [10, 30, 50]) {
		A.push(`./extension/images/tiles/${j + i}.PNG`)
	}
}
for (let i = 1; i <= 7; i++) {
	A.push(`./extension/images/tiles/${70 + i}.PNG`)
}
A.sort()
module.exports = { getHand }

async function getHand(fullscreen) {
	const buffer = await sharp(fullscreen)
		.withMetadata({ density: 96 })
		.resize({ width: 1920, height: 1080 })
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
	const img = await sharp(buffer)
		.extract(new Area(29 + 95 * hand.length, 0, 95, 137))
		.toBuffer()
	const [newTile, _idx] = await getTile(img)
	return [hand, newTile]

	function Area(left, top, width, height) {
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
}
