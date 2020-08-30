import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

window.h = history
window.createBrowserHistory = createBrowserHistory
window.unListen = window.h.listen((location, action) => {
	console.log(action)
	window.h.action = action
})
