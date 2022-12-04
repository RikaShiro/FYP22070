const { readFileSync, writeFileSync } = require('node:fs')
module.exports = { insert }

const st = new Set()
const M = new Map([
	[1, '00'],
	[2, '01'],
	[3, '10'],
	[4, '11'],
	[9, '.']
])
insert()
console.log(st.size)

function insert() {
	const A = JSON.parse(readFileSync('permutation.json'))
	A.forEach((x) => enumerate(x))
	// writeFileSync('insertion1.json', JSON.stringify(Array.from(st)))
}

function enumerate(A = [2, 4, 4, 4]) {
	const n = A.length
	const q = []
	DFS(0, 0)

	function DFS(k, sum) {
		if (k === n - 1) {
			addToSet([...q])
			return
		}
		k++
		if (sum <= 7) {
			q.push(1)
			DFS(k, sum + 1)
			q.pop()
		}
		if (sum <= 6) {
			q.push(2)
			DFS(k, sum + 2)
			q.pop()
		}
		q.push(9) // Infinity
		DFS(k, 0)
		q.pop()
	}

	function addToSet(q) {
		q = merge(A, q).map((x) => M.get(x))
		q = q
			.join('')
			.split('.')
			.map((x) => {
				const y = x.split('').reverse().join('')
				return Number(x) < Number(y) ? x : y
			})
		q = '11' + q.sort((a, b) => Number(a) - Number(b)).join('')
		st.add(BigInt(q))
	}

	function merge(x, y) {
		const A = []
		const n = y.length
		for (let i = 0; i < n; i++) {
			A.push(x[i], y[i])
		}
		A.push(x.at(-1))
		return A
	}
}
