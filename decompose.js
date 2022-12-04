const { writeFileSync } = require('node:fs')
module.exports = { main }

main()
function main() {
	const decomposition = decompose()
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
