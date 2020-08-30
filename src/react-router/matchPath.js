import { pathToRegexp } from 'path-to-regexp'

/**
 * 得到匹配结果(match对象)
 * 如果不能匹配，返回undefined
 * 如果可以匹配，返回匹配结果，匹配结果是一个对象，该对象中的属性名对应路径规则中的关键字
 * @param {*} path 路径规则
 * @param {*} pathname 具体的地址
 * @param {*} options 相关配置
 */
export default function pathMatch(path, pathname, options) {
	const keys = []
	const regExp = pathToRegexp(path, keys, getOptions(options))
	const result = regExp.exec(pathname)
	console.log(result, keys)
	if (!result) {
		return null
	}

	const execArr = Array.from(result)
	execArr.pop()

	const params = getParams(execArr, keys)
	console.log(params)

	return { params, path, url: result[0], isExact: pathname === result[0] }
}

/**
 * 根据匹配的分组结果，得到一个params对象
 * @param {*} groups
 * @param {*} keys
 */
function getParams(groups, keys) {
	const obj = {}

	for (let i = 0; i < groups.length; i++) {
		const value = groups[i]
		const name = keys[i].name
		obj[name] = value
	}

	return obj
}

function getOptions(options = {}) {
	const defaultOptions = {
		exact: false,
		sensitive: false,
		strict: false,
	}

	const opts = {
		...defaultOptions,
		...options,
	}

	return {
		sensitive: opts.sensitive,
		strict: opts.strict,
		end: opts.exact,
	}
}
