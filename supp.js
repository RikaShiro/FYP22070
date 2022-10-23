const fs = require('fs')

function print(obj) {
	fs.appendFileSync('./LOG', JSON.stringify(obj) + '\n')
	if ('data' in obj) {
		print(obj.data)
	} else {
		fs.appendFileSync('./LOG', 'end\n')
	}
}

module.exports = { print }
