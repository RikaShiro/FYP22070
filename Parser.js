// try require('protobufjs/light')
const protobuf = require('protobufjs')
const Game = require('./Game.js')
const { Player, Self } = require('./Player.js')
const { print } = require('./supp.js')

const msgType = {
	notify: 1,
	req: 2,
	res: 3
}
let game = new Game()
let self = new Self()
const players = new Player(4)

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
		switch (frame.name) {
			case 'ActionPrototype':
				frame.data.data = this.root
					.lookupType(frame.data.name)
					.decode(frame.data.data)
				// this.parse(frame.data)
				break
			case 'NotifyPlayerLoadGameReady':
				for (let i = 0; i < 4; i++) {
					ID[i] = frame.data.ready_id_list[i]
				}
				game = new Game()
				break
			case 'NotifyGameEndResult':
				for (let i = 0; i < 4; i++) {
					ID[i] = null
					players[i] = null
				}
				break
			default:
				console.log('unexpected name')
		}
		// print(frame)
	}
	parse(data) {
		// ActionDiscardTile -> DiscardTile
		const method = data.name.substring(6)
		data = data.data
		switch (method) {
			case 'NewRound':
				self.hand = this.tilesToHand(data.tiles)
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
				console.log('unexpected action')
		}
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
