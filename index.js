require('dotenv').config({ debug: false })
const Proxy = require('http-mitm-proxy').Proxy
const Parser = require('./Parser.js')

const { mitmPort, serverPort } = process.env
const proxy = new Proxy()
const parser = new Parser()
proxy.onWebSocketFrame((_ctx, _type, fromServer, data, flags, callback) => {
	if (fromServer) {
		parser.parse(data)
	}
	return callback(null, data, flags)
})
proxy.listen({ port: mitmPort }, () => {
	console.log(`proxy set up at port ${mitmPort}`)
})

const localhost = '127.0.0.1'
const http = require('node:http')
http
	.createServer((_req, res) => {
		res.writeHead(200)
		res.end()
	})
	.listen(serverPort, localhost, () => {
		console.log(`server set up at port ${serverPort}`)
	})
