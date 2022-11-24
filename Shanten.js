const { Buffer } = require('node:buffer')

function shanten(
	hand = [11, 11, 11, 12, 13, 15, 16, 34, 35, 38, 59, 59, 71, 72]
) {
	if (hand.includes(-1)) return null
	hand = arrayToMap(hand)
	hand = mapToString(hand)
	hand = stringToBinary(hand)
	return hand

	function arrayToMap(A) {
		const M = new Map()
		for (const i of A) {
			if (M.has(i)) {
				M.set(i, M.get(i) + 1)
			} else {
				M.set(i, 1)
			}
		}
		return Array.from(M.entries()).sort((a, b) => a[0] - b[0])
	}

	function mapToString(A) {
		let q = []
		const n = A.length
		for (let i = 0; i < n - 1; i++) {
			let x = A[i][1].toString()
			let y = A[i + 1][0] - A[i][0]
			if (y > 2 || A[i][0] > 70 || A[i + 1][0] > 70) {
				y = '.'
			} else {
				y = y.toString()
			}
			x += y
			q.push(x)
		}
		q.push(A[n - 1][1])
		q = q
			.join('')
			.split('.')
			.map((x) => {
				const a = Number(x)
				const b = Number(x.split('').reverse().join(''))
				return a < b ? a : b
			})
		q.sort((a, b) => b - a)
		return q.join('.')
	}

	function stringToBinary(s) {
		const M = new Map([
			['1', '00'],
			['2', '01'],
			['3', '10'],
			['4', '11'],
			['.', '10']
		])
		let buffer = '11'
		for (const i of s) {
			buffer += M.get(i)
		}
		return Buffer.from(buffer, 'binary')
	}
}

let stn = shanten()
console.log(stn.toString())
module.exports = { shanten }
