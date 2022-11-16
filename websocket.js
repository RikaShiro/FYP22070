const Proxy = require('http-mitm-proxy')
const Parser = require('./Parser.js')
const { preprocess } = require('./preprocess.js')

preprocess('./images')
const proxy = Proxy()
const parser = new Parser()
proxy.onWebSocketFrame((_ctx, _type, _fromServer, data, flags, callback) => {
	parser.decode(data)
	return callback(null, data, flags)
})

const options = {
	port: 22070
}
proxy.listen(options)