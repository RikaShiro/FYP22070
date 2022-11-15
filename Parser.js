// require('protobufjs/light') or require('protobufjs)
const protobuf = require('protobufjs/light')
const { Game, Player, Self } = require('./Game.js')
const { id } = require('./user.json')
const { print } = require('./supp.js')
const PRINT = 0

const msgType = {
	notify: 1,
	req: 2,
	res: 3
}
let game = new Game()
let self = new Self()
const players = new Player(4)
let seat = -1

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
				console.log(frame  )
				break
			case 'NotifyPlayerLoadGameReady':
				const list = frame.data.ready_id_list
				for (let i = 0; i < 4; i++) {
					if (id === list[i]) {
						self = new Self()
						players[i] = self
						seat = i
					} else {
						players[i] = new Player()
					}
				}
				break
			case 'NotifyGameEndResult':
				for (let i = 0; i < 4; i++) {
					players[i] = null
				}
				break
			default:
				return
		}
		if (PRINT) {
			print(frame)
		}
	}
	parse(data) {
		// ActionDiscardTile -> DiscardTile
		const method = data.name.substring(6)
		data = data.data
		let idx = 'seat' in data ? data.seat : -2
		switch (method) {
			// 如何监听hyouji的变化 并自动同步到dora
			case 'NewRound':
				game = new Game()
				game.count = data.left_tile_count
				game.hyouji = data.doras
				game.dora = game.hyoujiToDora(data.doras)
				game.removeFromYama(data.tiles)
				self.tilesToHand(data.tiles)
				break
			// kan -> draw a tile -> discard a tile -> reveal new dora
			// dora is a Japanese word. It should not have a plural form
			// therefore I abandon the word 'doras' used in Majsoul API
			case 'DiscardTile':
				players[idx].discard(data)
				if (idx === seat) {
					self.removeFromHand(data.tile)
				}
				game.removeFromYama(data.tile)
				if ('doras' in data) {
					game.hyouji = data.doras
					game.dora = game.hyoujiToDora(data.doras)
				}
				break
			// new dora jyoujihai after kan
			case 'DealTile':
				game.count = data.left_tile_count
				if ('tile' in data) {
					game.removeFromYama(data.tile)
					self.deal(data.tile)
					console.log(self.hand)
				}
				break
			// type [0, 1, 2] = [chii, pon, minkan]
			case 'ChiPengGang':
				players[idx].chiiPonKan(data)
				game.removeFromYama(data.tiles)
				break
			case 'AnGangAddGang':
				players[idx].anKanChaKan(data.tiles)
				game.removeFromYama(data.tiles)
				// if ankan: transfer pon to kan
				// if chakan: add a new attribute to player.fuuro obj
				break
			case 'NoTile':
				const delta = data.scores[0].delta_scores
				for (let i = 0; i < 4; i++) {
					players[i].score += delta[i]
				}
				break
			case 'Hule':
				for (let i = 0; i < 4; i++) {
					players[i].score = data.scores[i]
				}
				break
			case 'MJStart':
				return
			default:
				console.log('unexpected action')
		}
	}
}

module.exports = Parser
