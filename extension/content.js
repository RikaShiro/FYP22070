const el = document.createElement('div')
const style = {
	position: 'absolute',
	zIndex: 200000,
	width: '95px',
	height: '137px',
	backgroundColor: 'red',
	opacity: 0.3,
	borderWidth: 'thick',
	borderRadius: '10px',
	borderColor: 'blue',
	left: '220px',
	top: '935px'
}
Object.assign(el.style, style)
document.body.appendChild(el)
console.log(el.style.top, typeof el.style.top)
// fetch('http://127.0.0.1:22071')
// 	.then((res) => res.json())
// 	.then((data) => {
// 		console.log(data)
// 	})
