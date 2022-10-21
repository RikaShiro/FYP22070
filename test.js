const { Player, Self } = require('./Player.js')
const players = new Array(3).fill(new Player())
players.push(new Self())
for (let i of players) {
  for (let j in i) {
    console.log(j, i[j])
  }
}