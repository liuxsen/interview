// import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

const userReducer = (state, action) => {
  // init: console.log('Reducer is called with args', args) [undefined, {type: '@reudx/Init'}]
  if(typeof state === 'undefined'){
    return {}
  }
  switch (action.type) {
    case 'user/changeName':
      return {
        ...state,
        name: action.payload
      }
    default:
      return state
  }
}

const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        orderNum: action.orderNum + 1
      }
    default:
      return {
        ...state,
        orderNum: 1
      }
  }
}

const reducer = combineReducers({
  user: userReducer,
  order: orderReducer
})

const store = createStore(reducer)

console.log('store state after init', store.getState())

// 同步 action
const setNameActionCreator = function(name){
  return {
    type: 'user/changeName',
    payload: name
  }
}
// store.dispatch({
//   type: 'user/changeName',
//   payload: 'liuxsen'
// })

store.dispatch(setNameActionCreator('liuxsen'))
// 异步action
// const asyncSetNameActionCreator = function(name){
//   return function(dispatch) {
//     setTimeout(() => {
//       dispatch({
//         type: 'user/changeName',
//         payload: name
//       })
//     }, 2000);
//   }
// }

// ======中间件

// var anyMiddleware = function ({ dispatch, getState }) {
//   return function(next) {
//       return function (action) {
//           // your middleware-specific code goes here
//       }
//   }
// }

// store.dispatch(asyncSetNameActionCreator('liuxsen'))
console.log('store state after init', store.getState())