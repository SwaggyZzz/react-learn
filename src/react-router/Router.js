import React, { useMemo, useEffect, useState } from 'react'
import ctx from './RouterContext'
import matchPath from './matchPath'

const Router = (props) => {
	const { children, history } = props

	const [location, setLocation] = useState(history.location)

	useEffect(() => {
		history.listen((location, action) => {
			// history.action = action
			setLocation(location)
		})
		console.log(history)
	}, [])

	console.log(history)

	const ctxValue = { history, location, match: matchPath('/', history.location.pathname) }

	return (
		<ctx.Provider value={ctxValue}>
			<button
				onClick={() => {
					history.push('/newPage', 'state')
				}}
			>
				jump
			</button>
			<div>{location.pathname}</div>
			{children}
		</ctx.Provider>
	)
}

export default Router
