const screenshot = require('screenshot-desktop')
const sharp = require('sharp')
const { options } = require('./imageOptions.js')

screenshot().then(async (img) => {
  img = sharp(img).withMetadata(options).resize(1920, 1080).toBuffer()
})
