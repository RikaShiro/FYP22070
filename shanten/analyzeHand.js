const { hand2int } = require('./helper')
const { readFileSync } = require('node:fs')
const { assert } = require('node:console')

let E = readFileSync('./enumerations')
E = Uint8Array.from(E)
E = new BigUint64Array(E.buffer)
const stnTable = Int8Array.from(readFileSync('./shanten'))
console.log(analyzeHand([11, 11, 11, 31, 32, 33, 34, 35, 36, 36, 36, 71, 72, 73]))

function analyzeHand(hand) {
	assert([14, 11, 8, 5, 2].includes(hand.length))
	const yama = new Yama().remove(hand)
	const allTiles = getAllTiles()
	const st = new Set(hand)

	let recommendation = null
	let [min, minCount] = [Infinity, 0]
	for (const i of st.values()) {
		const [stn, stnCount] = analyze(i)
		if (stn < min) {
			min = stn
			minCount = stnCount
			recommendation = [i]
		} else if (stn === min) {
			if (stnCount < minCount) {
				minCount = stnCount
				recommendation = [i]
			} else if (stnCount === minCount) {
				recommendation.push(i)
			}
		}
	}
	return recommendation
	
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
		let minCount = 0
		for (const [_k, v] of Object.entries(stn)) {
			if (v === min) {
				minCount ++
			}
		}
		return [min, minCount]
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
}

module.exports = { analyzeHand }
