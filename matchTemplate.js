const sharp = require('sharp')

function loadOpenCV() {
	if (global.cv && global.Module) {
		return Promise.resolve()
	} else {
		return new Promise((resolve) => {
			global.Module = {
				onRuntimeInitialized: resolve
			}
			global.cv = require('./opencv.js')
		})
	}
}

async function matchTemplate(src, templ) {
	await loadOpenCV()
	src = await readImageSharp(src)
	templ = await readImageSharp(templ)
	const dst = new cv.Mat()
	const mask = new cv.Mat()
	cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask)
	const result = cv.minMaxLoc(dst, mask).maxVal
	for (const m of [src, templ, dst, mask]) {
		m.delete()
	}
	return result

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
