// import './手写/链表'
// import './手写/deepClone'
// import './手写/数组去重'
// import './手写/发布订阅'
// import './手写/防抖'
// import './手写/节流'
// import './手写/快速排序'
// import './手写/类型判断'
// import './手写/手写Promise'
// import { BCom } from './手写/hook闭包'
// import './store/index'
// import './store/中间件'
import { Provider } from 'react-redux'
import Home from './Home'

export const App = ({store}) => {
  return <Provider store={store}>
    <Home/>
  </Provider>
}