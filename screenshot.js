const screenshot = require('screenshot-desktop')
const sharp = require('sharp')
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

screenshot().then(async (img) => {
	sharp(img)
		.withMetadata({
			density: 96,
      hasAlpha: false,
      channels: 3
		})
		.resize(1920, 1080)
		.toFile('shot.png')
	let metadata = await sharp('shot.png').metadata()
  console.log(metadata)
  metadata = await sharp('./images/10.png').metadata()
  console.log(metadata)
})
