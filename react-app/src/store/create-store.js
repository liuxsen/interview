import { applyMiddleware, combineReducers, createStore } from 'redux'
import reducers from './reducers'
import { middlewares } from './middlewares'

export default function buildStore(){
  const reducer = combineReducers(reducers)
  const middlewareStore = applyMiddleware(...middlewares)(createStore)
  const store = middlewareStore(reducer)
  return store
}