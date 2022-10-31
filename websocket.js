const Proxy = require('http-mitm-proxy')
const Parser = require('./Parser.js')
const proxy = Proxy()
const parser = new Parser()

proxy.onWebSocketFrame((ctx, type, fromServer, data, flags, callback) => {
	parser.decode(data)
	return callback(null, data, flags)
})

const options = {
	port: 22070
}
proxy.listen(options)