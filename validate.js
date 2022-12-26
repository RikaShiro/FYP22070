const { getShanten } = require('./analyzeHand.js')

function str2hand(str) {
	const M = {}
	for (const i of str.split(' ')) {
		for (const k of ['m', 'p', 's', 'z']) {
			if (i.includes(k)) {
				M[k] = i.substring(0, i.length - 1)
				break
			}
		}
	}
	const dict = {
		m: 10,
		p: 30,
		s: 50,
		z: 70
	}
	let hand = []
	for (const [k, v] of Object.entries(M)) {
		const A = v.split('').map((x) => {
			return Number(x) + dict[k]
		})
		hand = hand.concat(A)
	}
	return hand
}

const hand = str2hand('258m 258p 258s 12345z')
console.log(hand)
console.log(getShanten(hand))