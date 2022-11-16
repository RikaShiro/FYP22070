const sharp = require('sharp')

const hand = {
	left: 220,
	top: 930,
	width: 1240,
	height: 140
}
sharp('table.PNG').extract(hand).toFile('result.PNG')
