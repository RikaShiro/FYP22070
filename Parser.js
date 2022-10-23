// try require('protobufjs/light')
const protobuf = require('protobufjs')
const Game = require('./Game.js')
const { Player, Self } = require('./Player.js')
const print = require('./supp.js')

const msgType = {
	notify: 1,
	req: 2,
	res: 3
}
let game = new Game()
let players = new Array(4).fill(new Player())
let inGame = false
let self = new Self()

class Parser {
	constructor() {
		this.root = protobuf.Root.fromJSON(require('./liqi.json'))
		this.wrapper = this.root.lookupType('Wrapper')
	}
	decode(frame) {
		if (frame[0] !== msgType.notify) return
		frame = this.wrapper.decode(frame.slice(1))
		frame.data = this.root.lookupType(frame.name).decode(frame.data)
		// .lq.ActionPrototype -> ActionPrototype
		frame.name = frame.name.substring(4)
		if (frame.name === 'ActionPrototype') {
			frame.data.data = this.root
				.lookupType(frame.data.name)
				.decode(frame.data.data)
			// this.parse(frame.data)
		}
	}
	parse(data) {
		// ActionDiscardTile -> DiscardTile
		const method = data.name.substring(6)
		data = data.data
		switch (method) {
			case 'NewRound':
				this.newRound(data)
				break
			case 'DiscardTile':
				game.removeFromYama(data.tile)
				break
			case 'DealTile':
				if ('tile' in data) {
					self.deal(data.tile)
					game.removeFromYama(data.tile)
				}
				game.count = data.left_tile_count
				break
			case 'ChiPengGang':
				// type [0, 1, 2] = [chii, pon, kan]
				game.removeFromYama(data.tiles)
				break
			case 'Hule':
				inGame = false
				for (let i = 0; i < 4; i++) {
					players[i].tensuu = data.scores[i]
				}
				break
			default:
				console.log('other methods')
				return
		}
	}
	newRound(data) {
		inGame = true
		self.hand = this.tilesToHand(data.tiles)
	}
	tilesToHand(tiles) {
		const hand = {}
		for (let i of tiles) {
			if (i in hand) hand[i] = 1
			else hand[i]++
		}
		return hand
	}
}

module.exports = Parser
