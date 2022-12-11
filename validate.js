const { shanten } = require('./shanten.js')

function str2int(str) {
	const m = str.indexOf('m')
	const p = str.indexOf('p')
	const s = str.indexOf('s')
	const z = str.indexOf('z')
	let start = 0
  const A = {}
	for (const i of [m, p, s, z]) {
    if (i > 0) {
      A[i] = str.substring(start, i)
			start = i + 1
    }
	}
	return A
}

console.log(str2int('1112m3456p112345s'))
