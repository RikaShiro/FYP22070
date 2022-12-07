const { writeFileSync } = require('node:fs')
module.exports = { permute14, insert }

function permute14() {
	const decomposition = []
	for (const n of [14, 11, 8, 5, 2]) {
		decomposition.push(...decompose(n))
	}
	writeFileSync('decomposition.json', JSON.stringify(decomposition))
	const permutation = decomposition.flatMap((x) => permute(x))
	writeFileSync('permutation.json', JSON.stringify(permutation))
}

function decompose(target = 14) {
	const A = [1, 2, 3, 4]
	const n = A.length
	const decomposition = []
	const q = []
	DFS(target, 0)
	return decomposition

	function DFS(k, idx) {
		if (k === 0) {
			decomposition.push([...q])
			return
		}
		for (let i = idx; i < n; i++) {
			const x = A[i]
			if (k >= x) {
				q.push(x)
				DFS(k - x, i)
				q.pop()
			}
		}
	}
}

function permute(A = [2, 2, 3, 3, 4]) {
	const n = A.length
	const permutation = []
	const q = []
	const used = new Array(n).fill(false)
	DFS(0)
	return permutation

	function DFS(k) {
		if (k === n) {
			permutation.push([...q])
			return
		}
		for (let i = 0; i < n; i++) {
			if (used[i] || (i > 0 && !used[i - 1] && A[i] === A[i - 1])) {
				continue
			}
			q.push(A[i])
			used[i] = true
			DFS(k + 1)
			used[i] = false
			q.pop()
		}
	}
}

function insert(A = [2, 4, 4, 4]) {
	const st = new Set()
	const n = A.length
	const q = []
	DFS(0, 0)
	return st

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
		;``
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
		q = merge(A, q)
		q = q
			.join('')
			.split('9')
			.map((x) => {
				const y = x.split('').reverse().join('')
				return Number(x) < Number(y) ? x : y
			})
			.sort((a, b) => Number(a) - Number(b))
			.join('9')
		st.add(BigInt(q))
		return
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