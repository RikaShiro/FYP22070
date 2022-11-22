const sharp = require('sharp')
const { matchTemplate } = require('./matchTemplate.js')

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

function Area(left = 0, top = 0, width = 1920, height = 1080) {
	this.left = left
	this.top = top
	this.width = width
	this.height = height
}

async function getTile(buffer) {
	let tile = -1
	for (const i of A) {
		const res = await matchTemplate(buffer, i)
		if (res > threshold) {
			tile = i.split('/').pop().split('.')[0]
			tile = Number(tile)
			break
		}
	}
	return tile
}

async function getFullHand(fullscreen) {
	const buffer = await sharp(fullscreen)
		.extract(new Area(220, 935, 95 * 13, 137))
		.toBuffer()
	const hand = []
	for (let i = 0; i < 13; i++) {
		const tile = await sharp(buffer)
			.extract(new Area(95 * i, 0, 95, 137))
			.toBuffer()
		hand.push(await getTile(tile))
	}
	return hand
}

; (async () => {
	const hand = await getFullHand('./images/fullscreen/002.PNG')
	console.log(hand)
})()
