import { combineReducers } from 'redux'
import { loadingReducer } from './loading'
import { orderReducer } from './order'
import { userReducer } from './user'

const reducers = {
  user: userReducer,
  order: orderReducer,
  loading: loadingReducer
}

export default combineReducers(reducers)


