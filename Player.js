const shanten = require('./shanten.js')

class Player {
	constructor() {
		// seat [0, 1, 2, 3]
		this.seat = 0
    // jikaze [ton, nan, sha, bei] = [0, 1, 2, 3]
		this.jikaze = 0
		this.tensuu = 0
		this.riichi = false
		this.daburu = false
    this.sutehai = {}
    this.genbutsu = new Set()
    this.fuuro = {}
    this.id = ''
  }
  discard(data) {
    const { tile, is_liqi, is_wliqi } = data.tile
    this.riichi = is_liqi
    this.daburu = is_wliqi
    this.genbutsu.add(tile)
    if (tile in sutehai) sutehai[tile] ++
    else sutehai[tile] = 1
  }
}

class Self extends Player {
	constructor() {
		super()
    this.hand = {}
    this.shanten = 6
  }
  deal(tile) {
    if (tile in hand) hand[tile]++
    else hand[tile] = 1
    if (this.count() === 14) {
      shanten(this.hand)
    }
  }
  count() {
    let count = 0
    for (const k in this.hand) {
      count += this.hand[k]
    }
  }
}

module.exports = { Player, Self }