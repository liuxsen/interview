import React from 'react'
import ReactDOM from 'react-dom'
import {App} from './App'
import buildStore from './store/create-store'
const store = buildStore()

const container = document.getElementById('root')
ReactDOM.render(<App store={store}/>, container)