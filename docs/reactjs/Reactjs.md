# react

## 1. class组件中，事件中this为什么是undefined

标准函数中，this引用的是， 函数方法调用的上下文对象，在网页全局上下文调用函数时，this指向window

解决方法

a. 箭头函数中，this引用的是定义箭头函数的上下文
b. bind方法会创建一个新的函数实例；新函数中的this值会绑定传给bind(context)的对象

apply 和 call 都会以制定的this来调用函数

示例

```js
import {Component} from 'react'

export default class About extends Component {
  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  handleArrow = () => {
    // works
  }
  onClick = (...arg) => {

  }
  render(){
    return <div>
        <button onClick={this.onClick}>click</button>
        <button onClick={(...arg) => this.onClick(..arg)}>click</button>
        <button onClick={this.handleArrow}>click</button>
      </div>
  }
}

```

## 2. 合成事件

react自己实现的一套事件系统

目的

1. 抹平差异性
2. 统一管理事件，提高性能
3. 标记事件的渲染优先级，优先级高的事件优先处理，可以提高性能优化体验

事件委托

就是`事件代理机制`，不会吧事件处理函数直接绑定在真实的节点上；而是把所有的事件绑定到结构的最外层，使用一个`统一的事件监听器`，在统一事件监听器上插入和删除事件处理函数，当事件发生时，统一事件监听器找到真正的事件处理函数并调用

## 3. 函数组件如何实现forceUpdate

forceUpate

类组件中可以通过调用`this.forceUpdate()` 将会导致组件跳过 shouldComponentUpdate() 重新执行render

1. 通过更新 `hook state`

```js
export default function FunctionComponentForceUpdate(props){
  console.log('omg') // log omg
  const [count, forceUpdate] = useState(0)

  const handleClick = () => {
    forceUpdate(count+1)
  }

  return <div>
    <button onClick={handleClick}>{count}</button>
  </div>
}
```

2. 使用 usereducer

```js
export default function FunctionComponentForceUpdate(props){
  console.log('omg') // log omg
  const [, forceUpdate] = useReducer((x) => x+1, 0 )

  const handleClick = () => {
    forceUpdate()
  }

  return <div>
    <button onClick={handleClick}>count</button>
  </div>
}
```

3. 自定义hook

```js
function userForceUpdate(){
  const [state, setState] = useState(0)
  const update = useCallback(() => {
    setState(state + 1)
  }, [])
  return update
}
export default function FunctionComponentForceUpdate(props){
  const forceUpdate = useForceUpdate()

  const handleClick = () => {
    forceUpdate()
  }

  return <div>
    <button onClick={handleClick}>count</button>
  </div>
}
```

## 4. react 类组件中的 `constructor` 中为什么一定要用super

1. 首先，super不是react的知识点，是es6的
2. super作为函数调用，代表父类的构造函数，如果构造函数没有调用`super()`，会报错
3. 调用super的时候，应该传递props， `super(props)` 否则获取不到props, 如this.props.name
4. super 只能在派生类构造函数和静态方法中使用，不能在super调用之前使用this
5. 如果没有定义类构造函数，在实例化派生类时会调用super，并传入所有传给派生类的参数


```js
const Context = React.createContext()

class ClassComponent extends React.Component {
  static contextType = Context
  constructor(props, context){
    // 需要传递参数
    super(props, context)
    this.state = {}
  }
  return <div>{this.props.name}</div>
}

const jsx = (
  <Context.Provider value={123}>
    <ClassComponent name="class组件"/>
  </Context.Provider>
)
```

## 5. 什么是hook

> react16.8 之后发行， 在不使用class组件的情况下，也就是在函数组件中使用state和其他一些特性

基础hook

- useState
- useEffect
- useContext

其他

- useReducer
- useCallback
- userMemo
- useRef
- useImperativeHandle
- useLayoutEffect
- useDebugValue


## 6. hook解决了什么问题

问题

1. 组件之间复用逻辑困难
   1. hoc
   2. render props
   3. provier consumer
2. 复杂组件难以理解
   1. 在componentDidMount componnetWillUnmount中写各种逻辑，逻辑会不相关，逻辑混乱
3. 难以理解的class
   1. 需要处理this的问题
      1. 箭头函数
      2. bind
4. class组件不能很好的压缩

优势

1. useEffect 等 实现关注点分离，拆分逻辑


## Hook 为什么只能用在react函数的最顶层

> hook是作为一个单`链表存储`在 `fiber.memoizedState` 上的，因为这些hook没有名字，所以为了区分他们，必须保证`链表`节点**顺序的稳定性**

![](images/react-hook链表.png)

react规则

只能在顶层使用hook

- 不能在循环，条件，嵌套函数中调用hook


只能在函数组件中调用hook

- 不能在普通函数调用hook
- 可以在自定义hook中调用其他hook


## useState useReducer 为什么返回一个数组而不是一个对象

- 假如是对象，只能取key，不能自定义变量名称了

```js
function Foo () {
  // 假如是对象，只能取key，不能自定义变量名称了，会重名
  const {state, setState} = useState(0)
  const {state, setState} = useState(0)
  return <div>{state}</div>
}
```

## 7. 函数组件与类组件如何选择

颗粒度

函数组件颗粒度更小，是函数编程的优先选择

- 颗粒度体现在state定义与useEffect useLayoutEffect 上，函数组件可以写多个，也可以拆成自定义hook；但是 类组件中state和生命周期函数在组件中只能用一次，拆分比较繁琐

实例

- 类组件有实例，如果需要用到实例的话，类组件是首选

复用状态逻辑

- 函数组件和类组件都可以复用状态逻辑
- 类组件可以通过hoc，render props 但是会形成嵌套地狱，

学习成本

- 类组件有this；需要处理好this问题


## 8. 函数组件中 `setState` 没有回掉怎么办


在类组件中

```js
handle=() => {
  const {count} = this.state
  this.setState({count: count+1}, () => {
    console.log('new Count', this.state.count)
  })
}
```

```js
function Counter () {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log(count)
  }, [count])
  const handle = useCallback(() => {
    setCount(count+1)
  })
  return <div onClick={handle}>+<div>
}
```


useEffect 是dom更新之后延时调用，useLayoutEffect 是dom更新之后同步调用，一般使用useEffect

## 9. useCallback 和 useMemo 的区别

共同点

1. useCallback 和 useMemo 接收参数一致，第一参数是函数，第二个参数是依赖的数据
2. 依赖数据发生变化，重新计算结果；有缓存作用

区别

1. useMemo 缓存函数return的值，useCallback 缓存函数

例子：

```js
// useCallback
const memoizedCallback = useCallback(() => {
  console.log('do something', a, b)
}, [a, b])
// useMemo
const memoizedValue = useMemo(() => {
  return [a,b]
}, [a,b])
```

## 10. hooks 闭包陷阱

useEffect、useMemo、useCallback、都自带闭包；
每一次的渲染，他们都会捕获当前组件函数上下文的状态(state, props);所以每次这三种hook执行，反应的都是当前的状态，无法捕获上一次的状态;
如果useState使用的是一个引用值类型，在setState的时候，没有改变引用值，那么在这些函数中将不会出现闭包陷阱，不过不建议这样使用

```js
import { useEffect, useRef, useState } from 'react'

export const useFn = () => {
  const [state, setState] = useState(0)
  const ref = useRef()
  console.log('3')
  useEffect(() => {
    console.log(4)
    ref.current = setInterval(() => {
      console.log(state)
    }, 1000);
    return () => {
      console.log('5')
      clearInterval(ref.current)
    }
  }, [state])
  return [state, setState]
}

export const BCom = () => {
  console.log('2')
  const [state, setState] = useFn()

  const onClick = () => {
    setState(state + 1)
  }
  return (
    <div>
      <button onClick={onClick}>add</button>
    </div>
  )
}
```