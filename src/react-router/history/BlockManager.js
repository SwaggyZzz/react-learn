export default class BlockManager {
	prompt = null // 该属性是否有值，决定是否阻塞

	constructor(getUerConfirmation) {
		this.getUerConfirmation = getUerConfirmation
	}

	/**
	 * 设置一个阻塞，传递一个提示消息
	 * @param {*} prompt 可以是字符串，也可以是一个函数，函数返回一个消息字符串
	 */
	block(prompt) {
		this.prompt = prompt
		return () => {
			this.prompt = null
		}
	}

	/**
	 * 触发阻塞
	 * @param {*} location
	 * @param {*} action
	 * @param {*} callback 当阻塞完成之后要做的事情（一般是跳转页面）
	 */
	triggerBlock(location, action, callback) {
		if (!this.prompt) {
			callback()
			return
		}

		let message // 阻塞消息
		if (typeof this.prompt === 'string') {
			message = this.prompt
		} else if (typeof this.prompt === 'function') {
			message = this.prompt(location, action)
		}

		this.getUerConfirmation(message, (result) => {
			if (result === true) {
				callback()
			} else {
			}
		})
	}
}
