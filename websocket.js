const Proxy = require('http-mitm-proxy')
const proxy = Proxy()

proxy.onWebSocketFrame(function (ctx, type, fromServer, data, flags, callback) {
	console.log(
		'WEBSOCKET FRAME ' +
			type +
			' received from ' +
			(fromServer ? 'server' : 'client'),
		ctx.clientToProxyWebSocket.upgradeReq.url,
		data
	)
	return callback(null, data, flags)
})

const options = {
	port: 22070
}
proxy.listen(options)