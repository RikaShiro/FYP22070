const screenshot = require('screenshot-desktop')
const sharp = require('sharp')
const { metadata, pngOptions } = require('./imageOptions.js')
const fs = require('node:fs')
const path = require('node:path')

const dirname = './images/fullscreen'
let idx = fs.readdirSync(dirname).length

setInterval(() => {
	screenshot().then((img) => {
		const filename = idx.toString().padStart(3, '0') + '.PNG'
		const writePath = path.join(dirname, filename)
		sharp(img)
			.withMetadata(metadata)
			.png(pngOptions)
			.resize(1920, 1080)
			.toFile(writePath)
		idx++
	})
}, 20000)
