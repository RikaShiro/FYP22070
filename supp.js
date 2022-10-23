const fs = require('fs')

export function print(obj) {
	fs.appendFileSync('./LOG', JSON.stringify(obj) + '\n')
	if ('data' in obj) {
		this.print(obj.data, type)
	} else {
		fs.appendFileSync('./LOG', 'end\n')
	}
}