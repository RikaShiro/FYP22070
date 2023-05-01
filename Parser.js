const protobuf = require('protobufjs/light')
const screenshot = require('screenshot-desktop')
const { getHand } = require('./getHand.js')
const { analyzeHand } = require('./analyzeHand.js')

const msgType = {
	notify: 1,
	req: 2,
	res: 3
}

class Parser {
	constructor() {
		this.root = protobuf.Root.fromJSON(require('./liqi.json'))
		this.wrapper = this.root.lookupType('Wrapper')
	}
	parse(frame) {
		if (frame[0] !== msgType.notify) return
		frame = this.wrapper.decode(frame.slice(1))
		frame.data = this.root.lookupType(frame.name).decode(frame.data)
		if (!'name' in frame.data) return
		const name = frame.data.name
		if (name !== 'ActionDealTile') return
		setTimeout(() => {
			screenshot({ format: 'png' }).then(async (img) => {
				try {
					const [hand, newTile] = await getHand(img)
					const n = hand.length + 1
					if (n % 4 === 2) {
						analyzeHand(hand, newTile)
					}
				} catch (e) {
					console.error(e)
				}
			})
		}, 750)
	}
}

module.exports = Parser
