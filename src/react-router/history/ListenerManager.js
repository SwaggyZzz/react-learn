export default class ListenerManager {
	listeners = []

	addListener(listener) {
		this.listeners.push(listener)
		const unListen = () => {
			this.listeners = this.listeners.filter((item) => item !== listener)
		}
		return unListen
	}

	/**
	 * 触发所有监听器
	 * @param {*} location
	 * @param {*} action
	 */
	triggerListener(location, action) {
		this.listeners.forEach((fn) => fn(location, action))
	}
}
