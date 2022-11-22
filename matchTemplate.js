const sharp = require('sharp')
const cv = require('@rikashiro/opencv-js')

async function matchTemplate() {
	const src = await readImageSharp('./images/fullscreen/000.PNG')
	const templ = await readImageSharp('./images/tiles/16.PNG')
	// const templ = await readImageSharp(input)
	const dst = new cv.Mat()
	const mask = new cv.Mat()
	cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask)
	const result = cv.minMaxLoc(dst, mask).maxVal
	src.delete()
	templ.delete()
	dst.delete()
	console.log(result)

	async function readImageSharp(input) {
		const { data, info } = await sharp(input)
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true })
		const { width, height } = info
		return cv.matFromImageData({ data, width, height })
	}
}

module.exports = { matchTemplate }

// https://github.com/lovell/sharp/issues/3291
// https://blog.csdn.net/jm_12138/article/details/122910737
// https://docs.opencv.org/4.x/dc/de6/tutorial_js_nodejs.html
// https://emscripten.org/docs/api_reference/module.html
// https://www.npmjs.com/package/opencv4js
// https://codeberg.org/arghyadeep/opencv4js.git