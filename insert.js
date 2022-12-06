const {
	Worker,
	isMainThread,
	workerData,
	parentPort
} = require('node:worker_threads')

if (isMainThread) {
	const { readFileSync, existsSync } = require('node:fs')
	const assert = require('node:assert')
	const { permute14 } = require('./enumerate.js')

	if (!existsSync('./decomposition.json') || !existsSync('./permutation.json'))
		permute14()
	const A = JSON.parse(readFileSync('permutation.json'))
	assert(A.length === 5536)
	let st = new Set()
	const breaks = [
		0, 25, 50, 75, 100, 150, 275, 350, 600, 1000, 1500, 2000, 2500, 3000, 4000, 5536
	]
	for (let i = 1; i < breaks.length; i++) {
		assign(breaks[i - 1], breaks[i], i - 1)
	}

	function assign(start, end, idx) {
		const $ = A.slice(start, end)
		const worker = new Worker(__filename, { workerData: $ })
		worker.on('message', (msg) => {
			for (const i of msg.values()) {
				st.add(i)
			}
			console.log(st.size)
			console.log(`worker ${idx} done`)
		})
	}
} else {
	const { insert } = require('./enumerate.js')
	let st = new Set()
	workerData.forEach((x) => {
		st = new Set([...st, ...insert(x)])
	})
	parentPort.postMessage(st)
}
