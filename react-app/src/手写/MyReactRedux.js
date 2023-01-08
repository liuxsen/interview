import React, { Component, createContext, useContext, useEffect, useRef, useState } from 'react'
import { combineReducer, createStore } from './MyRedux'

const reduxContext = createContext(null)
export const Provider = (props) => {
  const {value, children, ...rest} = props
  return <reduxContext.Provider value={value} {...rest}>
    {children}
  </reduxContext.Provider>
}

export const connect = (mapStateToProps, mapDispatchToProps) => {
  return function wrapWithComponent (component){
    const Hoc = (props) => {
      const preStateRef = useRef({})
      const [, forceUpdate] = useState({})
      const {dispatch, getState, subscribe} = useContext(reduxContext)
      const state = getState()
      preStateRef.current = state;
      function childPropsSelector (state) {
        const stateProps = mapStateToProps ? mapStateToProps(state) : state
        const dispatchProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : dispatch
        return {
          ...stateProps,
          ...dispatchProps,
          ...props
        }
      }
      useEffect(() => {
        const unsubscribe = subscribe(() => {
          const state = getState();
          if(state !== preStateRef.current){
            forceUpdate({})
          }
        })
        return unsubscribe
      }, [getState, subscribe])
      const childProps = childPropsSelector(state)
      return React.createElement(component, childProps, props.children)
    }
    return Hoc
  }
}
const createSelecterHook = (context) => {
  const useSelector = (selector) => {
    const preStateRef = useRef({})
    const { getState, subscribe } = useContext(context)
    // 获取值
    const state = getState()
    // 保存上一次的状态值
    preStateRef.current = state
    const selectedState = selector(state)
    const [, forceUpdate] = useState({})
    useEffect(() => {
      // 订阅状态变化
      const unSubscribe = subscribe(fn => {
        const state = getState()
        if(state !== preStateRef.current){
          forceUpdate({})
        }
      })
      // 组件销毁，取消订阅
      return unSubscribe
    }, [getState, subscribe])
    return selectedState;
  }
  return useSelector
}
export const useSelector = createSelecterHook(reduxContext)

const createUseStore = (context) => {
  return function useStore(){
    return useContext(context)
  }
}
export const useStore = createUseStore(reduxContext)

const createUseDispatch = context => {
  return function useDispatch(){
    return useContext(context).dispatch
  }
}
export const useDispatch = createUseDispatch(reduxContext)

// demo
const countReducer = (state = {}, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        count: state.count + action.payload
      }
    default:
      return {
        count: 1
      }
  }
}
const reducer = combineReducer({
  count: countReducer
})
const store = createStore(reducer)

export class Home extends Component {

  render(){
    return <div>
      <div>home-count: {this.props.count.count}</div>
      <button onClick={() => this.props.add()}>add</button>
      </div>
  }
}
const mapStateToProps = (state) => {
  return {
    count: state.count,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    add: () => {
      dispatch({type: 'add', payload: 1})
    }
  }
}

const ConnectHome = connect(mapStateToProps, mapDispatchToProps)(Home)

// hooks 版本
const User = () => {
  const store = useStore()
  console.log(store)
  const count = useSelector(state => {
    return state.count
  })
  const dispatch = useDispatch()
  console.log('hook-select,',count)
  return <div>
    <div>user: {count.count}</div>
    <button onClick={() => dispatch({type: 'add', payload: 2})}>+</button>
  </div>
}

export class ReactReduxDemo extends Component {
  render(){
    return <Provider value={store}>
      <ConnectHome/>
      <User/>
    </Provider>
  }
}