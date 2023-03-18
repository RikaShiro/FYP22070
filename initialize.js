const { existsSync } = require('node:fs')
if (!existsSync('./enumerations')) {
  console.log('Would you like to unzip prepared files, or compute the table on your own?')
}