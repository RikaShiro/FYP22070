require('dotenv').config()
const Proxy = require('http-mitm-proxy').Proxy
const Parser = require('./Parser.js')

const port = process.env.port
const proxy = new Proxy()
const parser = new Parser()
proxy.onWebSocketFrame((_ctx, _type, fromServer, data, flags, callback) => {
	if (fromServer) {
		parser.parse(data)
	}
	return callback(null, data, flags)
})
proxy.listen({ port })
console.log(`Serve at port ${port}`)
