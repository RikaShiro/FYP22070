// try require('protobufjs/light')
'use strict'
const protobuf = require('protobufjs')
const fs = require('fs')
const Game = require('./Game.js')
const { Player, Self } = require('./Player.js')

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
		switch (frame[0]) {
			case msgType.notify:
				frame = this.wrapper.decode(frame.slice(1))
				// console.log(JSON.stringify(frame))
				// console.log('notify')
				try {
					frame.data = this.root.lookupType(frame.name).decode(frame.data)
				} catch (e) {
					console.log(e)
					return
				}
				// .lq.ActionPrototype
				frame.name = frame.name.substring(4)
				// ActionPrototype
				if (frame.name === 'ActionPrototype') {
					frame.data.data = this.root
						.lookupType(frame.data.name)
						.decode(frame.data.data)
					// this.parse(frame.data)
				}
				this.print(frame, 'notify')
				break
			case msgType.req:
				// frame = this.wrapper.decode(frame.slice(3))
				// console.log(JSON.stringify(frame))
				// console.log('req')
				break
			case msgType.res:
				// frame = this.wrapper.decode(frame.slice(3))
				// console.log(JSON.stringify(frame))
				// console.log('res')
				break
		}
	}
	parse(data) {
		// ActionDiscardTile
		// DiscardTile
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
			else hand[i] ++
		}
		return hand
	}
	print(obj, type) {
		fs.appendFileSync('./LOG4', JSON.stringify(obj) + '\n')
		if ('data' in obj) {
			this.print(obj.data, type)
		} else {
			fs.appendFileSync('./LOG4', type + ' end\n')
		}

	}
}

module.exports = Parser
