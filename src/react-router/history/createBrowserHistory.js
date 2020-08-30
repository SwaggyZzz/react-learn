import ListenerManager from './ListenerManager'
import BlockManager from './BlockManager'

export default function createBrowserHistory(options = {}) {
	const {
		basename = '',
		forceRefresh = false,
		keyLength = 4,
		getUserConfirmation = (msg, cb) => cb(window.confirm(msg)),
	} = options
	const listenerManager = new ListenerManager()
	const blockManager = new BlockManager(getUserConfirmation)

	const history = {
		action: 'POP',
		length: window.history.length,
		location: createLocation(basename),
		go: window.history.go,
		goBack: window.history.goBack,
		goForward: window.history.goForward,
		push,
		replace,
		listen,
		block,
	}

	/**
	 * 向地址栈中加入一个新地址
	 * @param {*} path 新的地址，可以是字符串，也可以是对象
	 * @param {*} state 附加的状态数据，如果第一个参数是对象，该参数无效
	 */
	function push(path, state) {
		changePage(path, state, true)
	}

	function replace(path, state) {
		changePage(path, state, false)
	}

	function changePage(path, state, isPush) {
		const action = isPush ? 'PUSH' : 'REPLACE'
		const pathInfo = handlePathAndState(path, state, basename)

		const location = createLocationFromPath(pathInfo, basename)

		blockManager.triggerBlock(location, action, () => {
			isPush
				? window.history.pushState({ key: createKey(keyLength), state: pathInfo.state }, null, pathInfo.path)
				: window.history.replaceState({ key: createKey(keyLength), state: pathInfo.state }, null, pathInfo.path)

			// 要先触发事件，再更新history对象，要确保在事件回调中能拿到旧的history对象数据
			// 因为pushState和replaceState无法触发popstate事件，需要手动去执行监听函数
			listenerManager.triggerListener(location, action)

			// 改变location，因为是取的window.history.state，所以要在pushState之后赋值
			history.location = location

			// 改变action
			history.action = action

			if (forceRefresh) {
				// 强制刷新
				window.location.href = pathInfo.path
			}
		})
	}

	/**
	 * 添加对地址变化的监听
	 */
	function addDomListener() {
		// popstate事件，仅能监听前进（点击浏览器按钮）、后退、用户对地址hash的改变
		// 无法监听到pushState、replaceState
		// pushState和replaceState无法触发popstate事件，需要在push和replace方法中手动去执行监听函数
		window.addEventListener('popstate', () => {
			const location = createLocation(basename)
			const action = 'POP'
			blockManager.triggerBlock(location, action, () => {
				listenerManager.triggerListener(location, action)
				// 要先触发事件，再更新location，要确保在事件回调中能拿到旧的history对象数据
				history.location = location
			})
		})
	}
	addDomListener()

	/**
	 * 添加一个监听器，并返回一个可用于取消监听的函数
	 * @param {*} listener
	 */
	function listen(listener) {
		const unListen = listenerManager.addListener(listener)
		return unListen
	}

	function block(prompt) {
		return blockManager.block(prompt)
	}

	return history
}

/**
 * 根据path和state，得到一个统一的对象格式
 * @param {*} path
 * @param {*} state
 */
function handlePathAndState(path, state, basename) {
	if (typeof path === 'string') {
		return {
			path: `${basename}${path}`,
			state,
		}
	} else if (typeof path === 'object') {
		const pathResult = `${basename}${path.pathname}${path.search || ''}${path.hash || ''}`
		return {
			path: pathResult,
			state: path.state,
		}
	} else {
		throw new TypeError('path must be string or object')
	}
}

/**
 * 创建一个location对象
 */
function createLocation(basename = '') {
	const { hash, search } = window.location
	let pathname = window.location.pathname
	const regExp = new RegExp(`^${basename}`)
	pathname = pathname.replace(regExp, '')

	const location = {
		hash,
		search,
		pathname,
	}

	// 处理state
	let state
	const historyState = window.history.state
	if (historyState === null) {
		state = undefined
	} else if (typeof historyState !== 'object') {
		state = historyState
	} else {
		if ('key' in historyState) {
			location.key = historyState.key
			state = historyState.state
		} else {
			state = historyState
		}
	}

	location.state = state

	return location
}

/**
 *
 * @param {*} pathInfo {path: "/news/abc?id=1#aaa",state: "123"}
 * @param {*} basename
 */
function createLocationFromPath(pathInfo, basename) {
	const { path, state } = pathInfo

	let pathname = path.replace(/[#?].*$/, '')

	const regExp = new RegExp(`^${basename}`)
	pathname = pathname.replace(regExp, '')

	const searchIndex = path.indexOf('?')
	const hashIndex = path.indexOf('#')

	let search
	if (searchIndex === -1 || searchIndex > hashIndex) {
		search = ''
	} else {
		search = path.substr(searchIndex, hashIndex)
	}

	let hash
	if (hashIndex === -1) {
		hash = ''
	} else {
		hash = path.substr(hashIndex)
	}

	return {
		pathname,
		search,
		hash,
		state,
	}
}

function createKey(keyLength) {
	// 随机数转成36进制  36 = 26个字母 + 10个数字 产生包含字母和数字的随机字符串
	return Math.random().toString(36).substr(2, keyLength)
}

window.myHistory = createBrowserHistory({ basename: '/news', forceRefresh: false })
