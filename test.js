const sharp = require('sharp')
const { matchTemplate } = require('./matchTemplate.js')

const A = []
for (let i = 0; i < 10; i++) {
	for (const j of [10, 30, 50]) {
		const p = `./images/tiles/${j + i}.PNG`
		A.push(p)
	}
}
for (let i = 1; i <= 7; i++) {
	const p = `./images/tiles/${70 + i}.PNG`
	A.push(p)
}

async function main(threshold = 0.9) {
	const buffer = await sharp('./images/fullscreen/000.PNG')
		.extract({
			left: 220,
			top: 935,
			width: 95,
			height: 137
		})
    .toBuffer()
  for (const p of A) {
    const res = await matchTemplate(buffer, p)
    if (res > threshold) {
      const tile = p.split('/').pop().split('.')[0]
      console.log(tile)
      break
    }
  }
}

main()
