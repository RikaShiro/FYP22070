const {
	Worker,
	isMainThread,
	workerData,
	parentPort
} = require('node:worker_threads')

if (isMainThread) {
	console.time()
	const {
		readFileSync,
		existsSync,
		writeFileSync,
		createReadStream,
		createWriteStream
	} = require('node:fs')
	const { createGzip } = require('node:zlib')
	const { pipeline } = require('node:stream')
	const assert = require('node:assert')
	const { permute14 } = require('./enumerate.js')

	if (!existsSync('./decomposition.json') || !existsSync('./permutation.json'))
		permute14()
	const A = JSON.parse(readFileSync('permutation.json'))
	assert(A.length === 6434)
	const splitWork = [
		0, 25, 50, 75, 100, 150, 275, 350, 600, 1000, 1500, 2000, 2500, 3000, 4000,
		6434
	]
	const n = splitWork.length
	let count = 0
	const st = new Set()
	for (let i = 1; i < n; i++) {
		assign(splitWork[i - 1], splitWork[i])
	}

	function assign(start, end) {
		const $ = A.slice(start, end)
		const worker = new Worker(__filename, { workerData: $ })
		worker.on('message', (msg) => {
			if (msg === null) {
				count++
				if (count === n - 1) {
					console.log(st.size)
					writeFileSync('./enumeration', BigUint64Array.from(st))
					const gzip = createGzip()
					const src = createReadStream('./enumeration')
					const dst = createWriteStream('./enumeration.gz')
					pipeline(src, gzip, dst, (err) => {
						if (err) {
							console.error('enumeration error: ', err)
							process.exitCode = 1
						}
					})
					console.timeEnd()
				}
			} else {
				for (const i of msg.values()) {
					st.add(i)
				}
			}
		})
	}
} else {
	const { insert } = require('./enumerate.js')
	workerData.forEach((x) => {
		parentPort.postMessage(insert(x))
	})
	parentPort.postMessage(null)
}
