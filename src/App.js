import React from 'react'
import { Router } from './react-router'
import { createBrowserHistory } from './react-router/history'

const history = createBrowserHistory()

function App() {
	return <Router history={history}></Router>
}

export default App
