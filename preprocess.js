const sharp = require('sharp')
const fs = require('node:fs')
const path = require('node:path')
sharp.cache(false)
const options = {
	format: 'png',
	space: 'srgb',
	channels: 3,
	depth: 'uchar',
	density: 120,
	isProgressive: false,
	hasProfile: false,
	hasAlpha: false
}

const dirname = './images'
fs.readdirSync(dirname)
	.filter((x) => path.extname(x) === '.PNG')
	.forEach(async (filename) => {
		const img = path.join(dirname, filename)
		const buffer = await sharp(img)
			.withMetadata(options)
			.resize(80, 120)
			.toBuffer()
		sharp(buffer).toFile(img)
	})
