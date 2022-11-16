const sharp = require('sharp')
const fs = require('node:fs')
const path = require('node:path')
const { options } = require('./imageOptions.js')

sharp.cache(false)
function preprocess(dirname) {
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
}

module.exports = { preprocess }
