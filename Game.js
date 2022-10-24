const shanten = require('./shanten.js')

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
		this.dora = null
		this.yama = { ...this.allTiles }
		this.count = -1
	}
	// expect string | string[]
	removeFromYama(tiles) {
		if (Array.isArray(tiles)) {
			for (let i of tiles) {
				this.removeTile(i)
			}
		} else {
			this.removeTile(tiles)
		}
	}
	removeTile(tile) {
		if (this.yama[tile] >= 1) {
			this.yama[tile]--
		}
	}
	// expect string[] with length [1, 5]
	hyoujiToDora(hyouji) {
		const n = hyouji.length
		for (let i = 0; i < n; i++) {
			const tile = hyouji[i]
			let idx = Number(tile[0])
			idx = (idx + 1) % tile[1] === 'z' ? 7 : 9
			hyouji[i] = idx.toString() + tile[1]
		}
		return hyouji
	}
}

class Player {
	// seat [0, 1, 2, 3]
	// jikaze [ton, nan, sha, bei] = [0, 1, 2, 3]
	constructor() {
		this.id = -1
		this.seat = -1
		this.jikaze = -1
		this.score = 0
		this.riichi = false
		this.daburu = false
		this.sutehai = {}
		this.genbutsu = new Set()
		// tiles: string[]
		// type: number [0, 1, 2, 3] = [chii, pon, kan, ankan]
		this.fuuro = []
		this.fuuroCount = 0
	}
	discard(data) {
		const { tile, is_liqi, is_wliqi } = data
		this.riichi = is_liqi
		this.daburu = is_wliqi
		this.genbutsu.add(tile)
		if (tile in this.sutehai) this.sutehai[tile]++
		else this.sutehai[tile] = 1
	}
	chiiPonKan(data) {
		let { type, tiles } = data
		tiles = this.sortTiles(tiles).join('.')
		this.fuuroCount++
		this.fuuro.push({ type, tiles })
	}
	anKanChaKan(tiles) {
		const tile = tiles[0]
		if (tiles.length === 1) {
			for (let i = 0; i < 2; i++) {
				tiles.push(tile)
			}
			key = tiles.join('.')
		}
		// change pon to kan if chakan
		// else ankan
		let [chaKan, idx, type] = [false, -1, -1]
		for (let i = 0; i < this.fuuro.length; i++) {
			if (fuuro[i].tiles === key) {
				chakan = true
				idx = i
				break
			}
		}
		tiles.push(tile)
		tiles = tiles.join('.')
		if (chaKan) {
			type = 2
			this.fuuro.splice(idx, 1, { type, tiles })
		} else {
			type = 3
			this.fuuro.push({ type, tiles })
		}
	}
	sortTiles(tiles) {
		return tiles.sort((x, y) => {
			if (x[1] !== y[1]) {
				return x[1].charCodeAt() - y[1].charCodeAt()
			} else {
				return Number(x[0]) - Number(y[0])
			}
		})
	}
}

class Self extends Player {
	constructor() {
		super()
		this.hand = {}
		this.shanten = -1
	}
	deal(tile) {
		if (tile in this.hand) this.hand[tile]++
		else this.hand[tile] = 1
		// if (this.count() === 14) {
		// 	return shanten(this.hand)
		// }
	}
	removeFromHand(tile) {
		if (this.hand[tile] === 1) {
			delete this.hand[tile]
		} else {
			this.hand[tile]--
		}
	}
	count() {
		let count = 0
		for (const k in this.hand) {
			count += this.hand[k]
		}
		return count
	}
	tilesToHand(tiles) {
		for (let i of tiles) {
			if (i in this.hand) this.hand[i]++
			else this.hand[i] = 1
		}
	}
}

module.exports = { Game, Player, Self }
