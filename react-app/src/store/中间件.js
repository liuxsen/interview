// import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'

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



const thunkMiddleware = ({dispatch, getState}) => {
  return next => {
    return action => {
      return typeof action === 'function' ? action(dispatch, getState) : next(action)
    }
  }
}

const logMiddleware = ({dispatch, getState}) => {
  return next => {
    return action => {
      console.log('log Middleware action recieved:', action)
      return next(action)
    }
  }
}

const middlelwareStore = applyMiddleware(thunkMiddleware, logMiddleware)(createStore)



// 异步action
// const asyncSetNameActionCreator = function(name){
//   return function(dispatch) {
//     setTimeout(() => {
//       dispatch({
//         type: 'user/changeName',
//         payload: name
//       })
//       // console.log('async state after called', store.getState())
//     }, 2000);
//   }
// }

// store.dispatch(asyncSetNameActionCreator('liuxsen'))


export default function create (){
  const store = middlelwareStore(reducer)
  store.subscribe(() => {
    console.log('store has been changed', store.getState())
  })
  return store
}

// 同步 action
// const setNameActionCreator = function(name){
//   return {
//     type: 'user/changeName',
//     payload: name
//   }
// }
// store.dispatch({
//   type: 'user/changeName',
//   payload: 'liuxsen'
// })

// store.dispatch(setNameActionCreator('liuxsen'))

// ======中间件

// var anyMiddleware = function ({ dispatch, getState }) {
//   return function(next) {
//       return function (action) {
//           // your middleware-specific code goes here
//       }
//   }
// }

// store.dispatch(asyncSetNameActionCreator('liuxsen'))
// console.log('store state after init', store.getState())