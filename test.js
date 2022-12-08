const { writeFileSync, readFileSync } = require('node:fs')
const { createGzip } = require('node:zlib')
const { pipeline } = require('node:stream')
const { createReadStream, createWriteStream } = require('node:fs')

let x = readFileSync('./enumeration')
// x = Uint8Array.from(x)
// x = new BigUint64Array(x.buffer)
const gzip = createGzip()
const destination = createWriteStream('./test.gz')

pipeline(x, gzip, destination, (err) => {
  if (err) {
    console.error('An error occured: ', err)
    process.exitCode = 1
  }
})
