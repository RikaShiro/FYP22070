const Proxy = require('http-mitm-proxy')
const fs = require('fs')
const path = require('path')
const proxy = Proxy()

proxy.onCertificateRequired = function (hostname, callback) {
	return callback(null, {
		keyFile: path.resolve('/ca/certs/', hostname + '.key'),
		certFile: path.resolve('/ca/certs/', hostname + '.crt')
	})
}
proxy.onError(function (ctx, err) {
	console.error('proxy error:', err)
})
proxy.onResponseData(function (ctx, chunk, callback) {
	// console.log('RESPONSE DATA:', chunk.toString())
	fs.appendFileSync('LOGFILE', chunk.toString())
	return callback(null, chunk)
})

const options = {
	port: 22070
}
proxy.listen(options)
console.log(proxy.options.sslCaDir)
