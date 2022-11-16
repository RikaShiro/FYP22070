const sharp = require('sharp')
const fs = require('node:fs')
const path = require('node:path')
const options = {
	format: 'png',
	space: 'srgb',
	channels: 3,
	depth: 'uchar',
	density: 96,
	isProgressive: false,
	hasProfile: false,
	hasAlpha: false
}

const dirname = './images'
fs.readdirSync(dirname).forEach((filename) => {
	const p = path.join(dirname, filename)
	sharp(p)
		.withMetadata({
			channels: 3,
			density: 96,
			hasAlpha: false
		})
		.resize(80, 120)
		.toFile(p)
})
