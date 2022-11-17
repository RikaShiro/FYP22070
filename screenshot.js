const screenshot = require('screenshot-desktop')
const sharp = require('sharp')
const { metadata, pngOptions } = require('./imageOptions.js')

sharp.cache(true)
const hand = {
	left: 220,
	top: 930,
	width: 1240,
	height: 140
}
function getHand() {
	screenshot().then((img) => {
		const buffer = sharp(img)
			.withMetadata(metadata)
			.png(pngOptions)
			.resize(1920, 1080)
			.extract(hand)
			.toBuffer()
	})
}

function getSample() {
	setTimeout(() => {
		screenshot().then((img) => {
			sharp(img)
				.withMetadata(metadata)
				.png(pngOptions)
				.resize(1920, 1080)
				.toFile('xxx.PNG')
		})
	}, 10000)
}

getSample()
module.exports = { getHand }
