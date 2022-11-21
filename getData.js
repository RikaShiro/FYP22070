const screenshot = require('screenshot-desktop')
const sharp = require('sharp')
const { metadata, pngOptions, hand } = require('./imageOptions.js')
const fs = require('node:fs')
const path = require('node:path')

const dirname = './images/tiles'
let idx = fs.readdirSync(dirname).length

let { left, top, width, height } = hand
setTimeout(() => {
	screenshot({ format: 'png' }).then((img) => {
			const filename = idx.toString().padStart(3, '0') + '.PNG'
			const writePath = path.join(dirname, filename)
			sharp(img)
				.withMetadata(metadata)
				.png(pngOptions)
				.resize(1920, 1080)
				.extract({ left, top, width, height })
				.toFile(writePath)
			left += 95
	})
}, 5000)
