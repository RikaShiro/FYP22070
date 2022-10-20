// try require('protobufjs/light')
const protobuf = require('protobufjs')
const Game = require('./Game.js')
const fs = require('fs')

const msgType = {
	notify: 1,
	req: 2,
	res: 3
}

class Parser {
	constructor() {
		this.root = protobuf.Root.fromJSON(require('./liqi.json'))
		this.wrapper = this.root.lookupType('Wrapper')
		this.queue = []
	}
	decode(frame) {
		switch (frame[0]) {
			case msgType.notify:
				frame = this.wrapper.decode(frame.slice(1))
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
          this.parse(frame.data)
				}
				// this.print(frame)
				break
			case msgType.req:
				break
			case msgType.res:
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
        console.log(method, data.tiles)
        break
      case 'DiscardTile':
        console.log(method, data.tile)
        break
      case 'DealTile':
        if ('tile' in data) {
          console.log(method, 'myself')
        } else {
          console.log(method, 'opponent')
        }
        break
      case 'ChiPengGang':
        console.log(method)
        break
      default:
        console.log('other methods')
        return
    }
	}
	print(obj) {
		fs.appendFileSync('./LOG', JSON.stringify(obj) + '\n')
		if ('data' in obj) {
			this.print(obj.data)
    } else {
      fs.appendFileSync('./LOG', 'end\n')
    }
	}
}

module.exports = Parser
