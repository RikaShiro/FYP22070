class Player {
  constructor() {
    this.seat = 0
    this.self = false
    this.points = 25000
    this.riichi = false
    this.daburuRiichi = false
  }
}
class Game {
	constructor(bonus) {
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
		this.bonus = bouns ? bonus : 0
    this.doras = []
    this.uraDoras = []
    this.hill = { ...this.allTiles }
    this.count = 136
	}
}

module.exports = Game
