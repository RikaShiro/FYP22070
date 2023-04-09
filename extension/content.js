// chrome.runtime.sendMessage({ message: 'get' })
fetch('http://127.0.0.1:22071')
	.then((res) => res.json())
	.then((data) => {
		console.log(data)
	})
