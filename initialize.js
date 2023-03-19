const { existsSync } = require('node:fs')
if (existsSync('./shanten') && existsSync('./enumerations')) {
	return
}
const { stdin: input, stdout: output } = require('node:process')
const readline = require('node:readline')

let q =
	'Would you like to\n1. directly unzip pre-downloaded resources\n2. compute the resources on your own\nPlease input 1 or 2\n'
askQuestion()

function askQuestion() {
	const rl = readline.createInterface({ input, output })
	rl.question(q, (ans) => {
		ans = parseInt(ans)
		rl.close()
		switch (ans) {
			case 1:
				if (
					!existsSync('./gzip/shanten.gz') ||
					!existsSync('./gzip/enumerations.gz')
				) {
					console.log('Zip resources do not exist')
					compute()
				} else {
					console.log('Proceed to unzip resources ...')
					const { createReadStream, createWriteStream } = require('node:fs')
					const { createGunzip } = require('node:zlib')

					unzip('enumerations')
					unzip('shanten')
					console.log('unzip done')
					function unzip(src) {
						const rs = createReadStream(`./gzip/${src}.gz`)
						const ws = createWriteStream(`./${src}`)
						const unzip = createGunzip()
						rs.pipe(unzip).pipe(ws)
					}
				}
				break
			case 2:
				compute()
				break
			default:
				q = 'Invalid answer. Please input 1 or 2\n'
				askQuestion()
		}
	})
}

function compute() {
	console.log('Proceed to compute resources locally ...')
	require('./preprocess.js')
}
