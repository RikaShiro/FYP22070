const sharp = require('sharp')
const Jimp = require('jimp')

async function onRuntimeInitialized() {
	const src = await readImageSharp('./result.png')
	const templ = await readImageSharp('./images/singleTiles/16.PNG')

	const dst = new cv.Mat()
	const mask = new cv.Mat()
	cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask)
	let result = cv.minMaxLoc(dst, mask)
	console.log(result)
	let maxPoint = result.maxLoc
	let color = new cv.Scalar(255, 0, 0, 255)
	let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows)
	cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0)
	// new Jimp({
	// 	width: src.cols,
	// 	height: src.rows,
	// 	data: Buffer.from(src.data)
	// }).write('output.PNG')
	sharp(src.data).toBuffer()

	async function readImageSharp(input) {
		const { data, info } = await sharp(input)
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true })
		const { width, height } = info
		return cv.matFromImageData({ data, width, height })
	}
}

Module = {
	onRuntimeInitialized
}
cv = require('./opencv.js')

// https://github.com/lovell/sharp/issues/3291