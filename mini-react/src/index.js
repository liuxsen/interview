// import React from 'react'
// import ReactDOM from 'react-dom'

import {render, createElement} from './MyReact'
const container = document.querySelector('#root')

const element = createElement(
  'div',
  {
    title: 'hello',
    id: 'sky'
  },
  'world',
  createElement('a', null, '我是a标签')
)
console.log(element)

render(element, container)