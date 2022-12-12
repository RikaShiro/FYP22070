function AllTiles() {
	for (let i = 1; i < 10; i++) {
		for (const j of [10, 30, 50]) {
			this[j + i] = 4
		}
	}
	for (let i = 1; i <= 7; i++) {
		this[70 + i] = 4
	}
	AllTiles.prototype.remove = function (A) {
		for (const i of A) {
			this[i]--
		}
		return this
	}
	return this
}

const x = new AllTiles().remove([11, 11, 11, 11])
console.log(x)
