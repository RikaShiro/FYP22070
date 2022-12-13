module.exports = { matchTemplate }

function loadOpenCV() {
	if (global.cv) {
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
	src = cv.matFromImageData(src)
	templ = cv.matFromImageData(templ)
	const dst = new cv.Mat()
	const mask = new cv.Mat()
	cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask)
	const max = cv.minMaxLoc(dst, mask).maxVal
	for (const m of [src, templ, dst, mask]) {
		m.delete()
	}
	return max
}
