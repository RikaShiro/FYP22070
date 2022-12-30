const { readFileSync } = require('node:fs')
const { assert } = require('node:console')
const { hand2int } = require('./helper')

// E = enumerations
let E = readFileSync('./enumerations')
E = Uint8Array.from(E)
E = new BigUint64Array(E.buffer)
// STN = shanten number
let STN = Int8Array.from(readFileSync('./shanten'))
const n = STN.length
// STNT = shanten number table
const STNT = new Map()
for (let i = 0; i < n; i++) {
	STNT.set(E[i], STN[i])
}
E = null
STN = null
// analyzeHand([11, 11, 11, 12, 13, 31, 32, 33, 34, 35, 37, 71, 71, 71])
module.exports = { analyzeHand, getShanten }

function analyzeHand(hand) {
	assert([14, 11, 8, 5, 2].includes(hand.length))
	assert(!hand.includes(-1))
	if (getShanten(hand) === -1) {
		console.log('win')
		return
	}
	if (hand.length === 14) {
		const M = new Map()
		for (const i of hand) {
			const j = 1 + (M.has(i) ? M.get(i) : 0)
			M.set(i, j)
		}
		const A = Array.from(M.entries())
		const r7 = analyze7(A)
		const r13 = analyze13(A)
		if (r7 === true || r13 === true) {
			console.log('win')
			return
		} else {
			console.log(`${r7}\n${r13}`)
		}
	}

	const yama = new Yama().remove(hand)
	const allTiles = getAllTiles()
	const st = new Set(hand)

	let r = []
	let globalMin = Infinity
	let globalDraw = []
	for (const i of st.values()) {
		const [localMin, localDraw] = substitute(i)
		if (localMin < globalMin) {
			globalMin = localMin
			globalDraw = localDraw
			r = {}
			r[i] = localDraw
		} else if (localMin === globalMin) {
			if (localDraw.length > globalDraw.length) {
				globalDraw = localDraw
				r = {}
				r[i] = localDraw
			} else if (localDraw.length === globalDraw.length) {
				r[i] = localDraw
			}
		}
	}
	parse(r, globalMin)

	function analyze7(A) {
		// if already win
		const stn14 = getShanten7()
		if (stn14 === -1) {
			return true
		}
		// if not win, give recommendations
		const n = A.length
		let min = 7
		let r = []
		for (let i = 0; i < n; i++) {
			A[i][1]--
			const stn = getShanten7()
			if (stn < min) {
				min = stn
				r = [A[i][0]]
			} else if (stn === min) {
				r.push(A[i][0])
			}
			A[i][1]++
		}
		const s = `7 pairs STN: ${min}\ndiscard ${r.join(' ')}`
		return s

		function getShanten7() {
			let count = 0
			for (const [_tile, num] of A) {
				if (num >= 2) {
					count++
				}
			}
			let stn = 6 - count
			const types = A.length
			if (types < 7) {
				stn += 7 - types
			}
			return stn
		}
	}

	function analyze13(A) {
		// if already win
		const stn14 = getShanten13()
		if (stn14 === -1) {
			return true
		}
		// if not win, give recommendations
		const n = A.length
		let min = 13
		let r = []
		for (let i = 0; i < n; i++) {
			A[i][1]--
			const stn = getShanten13()
			if (stn < min) {
				min = stn
				r = [A[i][0]]
			} else if (stn === min) {
				r.push(A[i][0])
			}
			A[i][1]++
		}
		const s = `13 orphans STN: ${min}\ndiscard ${r.join(' ')}`
		return s

		function getShanten13() {
			const yaochuu = [11, 19, 31, 39, 51, 59, 71, 72, 73, 74, 75, 76, 77]
			let pair = false
			let count = 0
			for (const [tile, num] of A) {
				if (yaochuu.includes(tile) && num > 0) {
					count++
					if (num >= 2) {
						pair = true
					}
				}
			}
			let stn = 13 - count
			if (pair) {
				stn--
			}
			return stn
		}
	}

	function substitute(tile) {
		const available = allTiles.filter((x) => {
			return x !== tile && yama[x] > 0
		})
		const stn = {}
		for (const i of available) {
			const A = [...hand]
			const idx = A.indexOf(tile)
			A.splice(idx, 1, i)
			A.sort()
			stn[i] = getShanten(A)
		}
		const min = Math.min(...Object.values(stn))
		let nextDraw = []
		for (const [k, v] of Object.entries(stn)) {
			if (v === min) {
				nextDraw.push(k)
			}
		}
		return [min, nextDraw]
	}

	function Yama() {
		for (let i = 1; i < 10; i++) {
			for (const j of [10, 30, 50]) {
				this[j + i] = 4
			}
		}
		for (let i = 1; i <= 7; i++) {
			this[70 + i] = 4
		}
		// for chaining operations
		Yama.prototype.remove = function (A) {
			for (const i of A) {
				this[i]--
			}
			return this
		}
		return this
	}

	function getAllTiles() {
		const A = []
		for (let i = 1; i < 10; i++) {
			for (const j of [10, 30, 50]) {
				A.push(j + i)
			}
		}
		for (let i = 1; i <= 7; i++) {
			A.push(70 + i)
		}
		return A
	}

	function parse(r, min) {
		console.log(`next round min STN: ${min}`)
		for (const [k, v] of Object.entries(r)) {
			const s = `discard ${k}; pick ${v.join(' ')}`
			console.log(s)
		}
	}
}

function getShanten(A) {
	return STNT.get(hand2int(A))
}
