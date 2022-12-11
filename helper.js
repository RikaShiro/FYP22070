module.exports = { getPermutations, insert, hand2int, shanten }

function getPermutations() {
	const decomposition = []
	for (const n of [14, 11, 8, 5, 2]) {
		decomposition.push(...decompose(n))
	}
	const permutation = decomposition.flatMap((x) => permute(x))
	return permutation
}

function decompose(target) {
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

function permute(A) {
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

function insert(A) {
	const st = new Set()
	const n = A.length
	const q = []
	DFS(0, 0)
	return BigUint64Array.from(st)

	function DFS(k, sum) {
		if (k === n - 1) {
			st.add(arr2int(A, q))
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
		q.push(9)
		DFS(k, 0)
		q.pop()
	}
}

function hand2int(A) {
	const M = new Map()
	for (const i of A) {
		const j = 1 + (M.has(i) ? M.get(i) : 0)
		M.set(i, j)
	}
	A = Array.from(M.entries())
	const T = A.map((x) => x[1])
	const D = A.map((x) => x[0])
	const n = D.length
	for (let i = n - 1; i > 0; i--) {
		if (D[i] > 70) {
			D[i] = 9
		} else {
			D[i] -= D[i - 1]
			if (D[i] > 2) {
				D[i] = 9
			}
		}
	}
	D.shift()
	return arr2int(T, D)
}

function arr2int(x, y) {
	const M = new Map([
		['1', '00'],
		['2', '01'],
		['3', '10'],
		['4', '11'],
		['9', '11']
	])
	const s = merge(x, y)
		.join('')
		.split('9')
		.map((x) => {
			const y = x.split('').reverse().join('')
			return BigInt(x) < BigInt(y) ? x : y
		})
		.sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1))
		.join('9')
		.split('')
		.map((x) => M.get(x))
		.join('')
	return BigInt('0b11' + s)

	function merge(x, y) {
		const n = 2 * x.length - 1
		const A = new Array(n)
		for (let i = 0; i < n; i++) {
			A[i] = i % 2 === 0 ? x[i / 2] : y[(i - 1) / 2]
		}
		return A
	}
}

function shanten(s) {
	s = s.toString(2).substring(2).split('')
	const T = merge(filter(0), filter(1))
	const D = merge(filter(2), filter(3)).map((x) => (x > 2 ? 9 : x))

	const n = T.length
	const k = (T.reduce((sum, curr) => sum + curr, 0) - 2) / 3
	let max = 0
	let stn = 8
	toitsu()
	return stn

	function toitsu() {
		for (let i = 0; i < n; i++) {
			if (T[i] >= 2) {
				T[i] -= 2
				mentsu(0, 1, 0)
				T[i] += 2
			}
		}
		mentsu(0, 0, 0)
	}

	function mentsu(i, p, g) {
		if (i === n) {
			taatsu(0, p, g, 0)
			return
		}
		if (T[i] >= 3) {
			T[i] -= 3
			mentsu(i, p, g + 1)
			T[i] += 3
		}
		if (isShuntsu(i)) {
			T[i]--
			T[i + 1]--
			T[i + 2]--
			mentsu(i, p, g + 1)
			T[i]++
			T[i + 1]++
			T[i + 2]++
		}
		mentsu(i + 1, p, g)

		function isShuntsu(i) {
			if (i + 2 >= n) return false
			else if (T[i] < 1 || T[i + 1] < 1 || T[i + 2] < 1) return false
			else return D[i] === 1 && D[i + 1] === 1
		}
	}

	function taatsu(i, p, g, gp) {
		if (stn === -1 || g + gp > k) return
		const c = 3 * g + 2 * gp + 2 * p
		const r = T.reduce((sum, curr) => sum + curr, 0)
		if (r < max - c) return
		if (r === 0) {
			stn = Math.min(stn, 2 * (k - g) - gp - p)
			max = Math.max(max, c)
			return
		}
		if (T[i] >= 2) {
			T[i] -= 2
			taatsu(i, p, g, gp + 1)
			T[i] += 2
		}
		if (isTaatsu(i)) {
			T[i]--
			T[i + 1]--
			taatsu(i, p, g, gp + 1)
			T[i + 1]++
			T[i]++
		}
		T[i] = 0
		taatsu(i + 1, p, g, gp)

		function isTaatsu(i) {
			if (i + 1 >= n) return false
			else if (T[i] < 1 || T[i + 1] < 1) return false
			else return D[i] <= 2
		}
	}

	function merge(x, y) {
		const n = x.length
		const z = new Uint8ClampedArray(n)
		for (let i = 0; i < n; i++) {
			z[i] = parseInt(x[i] + y[i], 2) + 1
		}
		return z
	}
	function filter(i) {
		return s.filter((c, idx) => idx % 4 === i)
	}
}