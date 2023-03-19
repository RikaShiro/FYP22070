const {
	Worker,
	isMainThread,
	workerData,
	parentPort
} = require('node:worker_threads')

if (isMainThread) {
	console.log('Calculating resources ...\nIt takes around 2 minutes\nPlease do not exit')
	console.time('Calculate Resources')
	const assert = require('node:assert')
	const { getPermutations } = require('./helper.js')

	const P = getPermutations()
	assert(P.length === 6434)
	const splitWork = [
		0, 25, 50, 75, 100, 150, 275, 350, 600, 1000, 1500, 2000, 2500, 3000, 4000,
		6434
	]
	const n = splitWork.length
	let count = 0
	const st = new Set()
	console.time('Enumerations')
	for (let i = 1; i < n; i++) {
		assign(splitWork[i - 1], splitWork[i])
	}

	function assign(start, end) {
		const $ = P.slice(start, end)
		const worker = new Worker(__filename, { workerData: $ })
		worker.on('message', (msg) => {
			if (msg === 'done') {
				count++
				if (count === n - 1) {
					console.timeEnd('Enumerations')
					generateTable()
				}
			} else {
				for (const i of msg) {
					st.add(i)
				}
			}
		})
	}

	function generateTable() {
		console.time('Shanten Number')
		const {
			writeFileSync,
			createReadStream,
			createWriteStream,
			existsSync,
			mkdirSync
		} = require('node:fs')
		const { createGzip } = require('node:zlib')
		const { pipeline } = require('node:stream')
		const { calShanten } = require('./helper.js')

		const A = BigUint64Array.from(st).sort()
		const k = A.length
		assert(k === 1292059)
		saveAndZip('enumerations', A)
		const stn = new Int8Array(k)
		for (let i = 0; i < k; i++) {
			stn[i] = calShanten(A[i])
		}
		saveAndZip('shanten', stn)
		console.timeEnd('Shanten Number')
		console.timeEnd('Calculate Resources')

		function saveAndZip(path, buffer) {
			if (!existsSync('./gzip')) {
				mkdirSync('./gzip')
			}
			writeFileSync(`./${path}`, buffer)
			const gzip = createGzip()
			const src = createReadStream(path)
			const dst = createWriteStream(`./gzip/${path}.gz`)
			pipeline(src, gzip, dst, (err) => {
				if (err) {
					console.error('zip error: ', err)
					process.exitCode = 1
				}
			})
		}
	}
} else {
	const { insert } = require('./helper.js')
	workerData.forEach((x) => {
		parentPort.postMessage(insert(x))
	})
	parentPort.postMessage('done')
}
