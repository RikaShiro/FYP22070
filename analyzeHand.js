const { readFileSync } = require('node:fs')
const { assert } = require('node:console')
const { hand2int } = require('./helper')

let E = readFileSync('./enumerations')
E = Uint8Array.from(E)
E = new BigUint64Array(E.buffer)
const stnTable = Int8Array.from(readFileSync('./shanten'))
module.exports = { analyzeHand }

function analyzeHand(hand) {
	assert([14, 11, 8, 5, 2].includes(hand.length))
	assert(!hand.includes(-1))
	if (getShanten(hand) === -1) {
		console.log('win')
		return
	}

	const yama = new Yama().remove(hand)
	const allTiles = getAllTiles()
	const st = new Set(hand)

	let recommendation = null
	let [globalMin, globalDraw] = [Infinity, 0]
	for (const i of st.values()) {
		const [localMin, localDraw] = analyze(i)
		if (localMin < globalMin) {
			globalMin = localMin
			globalDraw = localDraw
			recommendation = {}
			recommendation[i] = localDraw
		} else if (localMin === globalMin) {
			if (localDraw.length > globalDraw.length) {
				globalDraw = localDraw
				recommendation = {}
				recommendation[i] = localDraw
			} else if (localDraw.length === globalDraw.length) {
				recommendation[i] = localDraw
			}
		}
	}
	parseRecommendation(recommendation, globalMin)

	function analyze(tile) {
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

	function getShanten(A) {
		const x = hand2int(A)
		const i = binarySearch(x)
		return stnTable[i]

		function binarySearch(x) {
			let [low, high] = [0, E.length]
			while (low < high) {
				const mid = Math.floor((low + high) / 2)
				if (E[mid] > x) {
					high = mid - 1
				} else if (E[mid] < x) {
					low = mid + 1
				} else {
					return mid
				}
			}
			return low
		}
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

	function parseRecommendation(r, min) {
		console.log(`next round min STN: ${min}`)
		for (const [k, v] of Object.entries(r)) {
			const s = `discard ${k}; pick ${v.join(' ')}`
			console.log(s)
		}
	}
}
