const s = '111211113.111.2.1.1.1'
const M = new Map([
	['1', '00'],
	['2', '01'],
	['3', '10'],
	['4', '11'],
	['.', '10']
])
function f(s) {
	let buffer = []
	for (const i of s) {
		buffer.push(M.get(i))
	}
	buffer = '11' + buffer.join('')
	buffer = Buffer.from(buffer, 'binary')
	return buffer
}

f(s)
