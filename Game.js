class Game {
	constructor() {
		this.allTiles = {}
		for (let j in ['m', 'p', 's']) {
			for (let i = 0; i <= 9; i++) {
				switch (i) {
					case 0:
						this.allTiles[i.toString() + j] = 1
						break
					case 5:
						this.allTiles[i.toString() + j] = 3
						break
					default:
						this.allTiles[i.toString() + j] = 4
				}
			}
		}
		for (let i = 1; i <= 7; i++) {
			this.allTiles[i.toString() + 'z'] = 4
		}
		this.hyouji = null
		this.yama = { ...this.allTiles }
		this.count = 0
	}
	// expect string or string[]
	removeFromYama(tile) {
		if (Array.isArray(tile)) {
			for (let i of tile) {
				yama[i]--
			}
		} else {
			yama[tile]--
		}
	}
}

module.exports = Game
