const jimp = require('jimp')

async function onRuntimeInitialized() {
	let src = await jimp.read('./result.PNG')
	src = cv.matFromImageData(src.bitmap)
	let templ = await jimp.read('./images/16.PNG')
	templ = cv.matFromImageData(templ.bitmap)
	const dst = new cv.Mat()
  const mask = new cv.Mat()
  cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF_NORMED, mask)
  
	let result = cv.minMaxLoc(dst, mask)
	let maxPoint = result.maxLoc
	let color = new cv.Scalar(255, 0, 0, 255)
	let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows)
	cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0)
	new jimp({
		width: src.cols,
		height: src.rows,
		data: Buffer.from(src.data)
	}).write('output.PNG')
}

Module = {
	onRuntimeInitialized
}
cv = require('./opencv.js')
