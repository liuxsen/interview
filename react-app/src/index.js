import React from 'react'
import ReactDOM from 'react-dom'
import {App} from './App'
import {store} from './store'

const container = document.getElementById('root')
ReactDOM.render(<App store={store}/>, container)