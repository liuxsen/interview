/**
 * redux实现
 * @param {*} reducer 
 * @param {*} initState 初始值
 */
export function createStore (reducer, initState = {}) {
  let state = initState
  let listeners = []
  const getState = () => {
    return state
  }
  const dispatch = (action) => {
    console.log(action)
    // 获取新的状态树
    state = reducer(state, action)
    listeners.forEach(fn => {
      fn()
    })
  }
  const subscribe = (fn) => {
    listeners.push(fn)
    return () => {
      const index = listeners.findIndex(item => {
        return item === fn
      })
      listeners.splice(index, 1)
    }
  }
  dispatch({
    type: 'init'
  })
  return {
    getState,
    dispatch,
    subscribe
  }
}

export function combineReducer (reducers) {
  const reducerKeys = Object.keys(reducers)
  return function reducer (state, action) {
    let nextState = {}
    for (let i = 0; i < reducerKeys.length; i++) {
      // 代表state的key
      const key = reducerKeys[i];
      // key对应的reducer
      const reducer = reducers[key]
      // 当前key对应的state的 旧值
      const prevKeyState = state[key]
      const nextKeyState = reducer(prevKeyState, action)
      nextState[key] = nextKeyState
    }
    return nextState
  }
}

// 测试
const countReducer = (state = {}, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + action.payload
      }
    default:
      return {
        count: 0
      }
  }
}

const reducer = combineReducer({count: countReducer})
const store = createStore(reducer)
store.subscribe(() => {
  console.log('store 发生变化了', store.getState())
})
store.dispatch({type: 'add', payload: 1})
store.dispatch({type: 'add', payload: 2})