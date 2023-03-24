// chrome.runtime.onInstalled.addListener(() => {
// 	chrome.action.setBadgeText({
// 		text: 'OFF'
// 	})
// })

chrome.action.onClicked.addListener(() => {
  fetch('http://127.0.0.1:22071')
	.then((res) => res.text())
	.then((res) => {
		console.log(res)
	})
})
