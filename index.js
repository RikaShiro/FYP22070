require('dotenv').config({ debug: false })
const http = require('node:http')
const { existsSync } = require('node:fs')
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

http
	.createServer((_req, res) => {
		if (existsSync('./res.json')) {
			const msg = JSON.stringify(require('./res.json'))
			res
				.writeHead(200, {
					'Content-Length': Buffer.byteLength(msg),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET'
				})
				.end(msg)
		} else {
			res.writeHead(304).end()
		}
	})
	.listen(serverPort, '127.0.0.1', () => {
		console.log(`server set up at port ${serverPort}`)
	})
