const { existsSync, readFileSync, writeFileSync } = require('node:fs')
const { pipeline } = require('node:stream')
const { createReadStream, createWriteStream } = require('node:fs')

const srcFile = './enumeration.gz'
const dstFile = './enumeration'
if (!existsSync(dstFile)) {
	const { createGunzip } = require('node:zlib')
	const gunzip = createGunzip()
	const src = createReadStream(srcFile)
	const dst = createWriteStream(dstFile)
	pipeline(src, gunzip, dst, (err) => {
		if (err) {
			console.error('unzip error: ', err)
			process.exitCode = 1
		}
	})
}

console.time()
const { shanten } = require('./shanten.js')
let A = readFileSync(dstFile)
A = Uint8Array.from(A)
A = new BigUint64Array(A.buffer).sort()
const n = A.length
const stn = new Uint8ClampedArray(n)
for (let i = 0; i < n; i++) {
	stn[i] = shanten(A[i])
}
writeFileSync('./shanten', stn)
const { createGzip } = require('node:zlib')
const gzip = createGzip()
const src = createReadStream('./shanten')
const dst = createWriteStream('./shanten.gz')
pipeline(src, gzip, dst, (err) => {
	if (err) {
		console.error('zip error: ', err)
		process.exitCode = 1
	}
})
console.timeEnd()
