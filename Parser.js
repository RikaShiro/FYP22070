// try require('protobufjs/light') later
const protobuf = require('protobufjs')
const Game = require('./Game.js')

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
				}
				this.print(frame)
				this.parse({ name: frame.name, data: frame.data })
				break
			case msgType.req:
				break
			case msgType.res:
				break
		}
	}
	parse(data) {
	}
	print(obj) {
		console.log(JSON.stringify(obj))
		if ('data' in obj) {
			this.print(obj.data)
    } else {
      console.log('end')
    }
	}
}

module.exports = Parser
