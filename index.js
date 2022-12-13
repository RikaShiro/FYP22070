const Proxy = require('http-mitm-proxy')
const Parser = require('./Parser.js')

const proxy = Proxy()
const parser = new Parser()
proxy.onWebSocketFrame((_ctx, _type, fromServer, data, flags, callback) => {
	if (fromServer) {
		parser.parse(data)
	}
	return callback(null, data, flags)
})
proxy.listen({ port: 22070 })
