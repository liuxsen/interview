import { userReducer } from './user'
import { orderReducer } from './order'


const reducers = {
  user: userReducer,
  order: orderReducer
}

export default reducers