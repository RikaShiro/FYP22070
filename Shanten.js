// 如果不是14张 那么返回什么
const encoding = {}
const suffix = ['m', 'p', 's']
for (let i = 1; i <= 9; i++) {
	for (let j = 0; j < 3; j++) {
		encoding[i.toString() + suffix[j]] = 10 + 20 * j + i
	}
}
for (let i = 1; i <= 7; i++) {
	encoding[i.toString() + 'z'] = 70 + i
}

class Shanten {
	constructor() {
		for (let i in encoding) {
			console.log(i, encoding[i])
		}
	}
	shanten(hand) {
		const res = {}
		for (const k in hand) {
			res[k] = 6
		}
		return res
	}
}

// shanten number is at most 6.
// because given any hand, it requires at most 6 extra pairs to reach chiitoitsu tenpai form
module.exports = Shanten