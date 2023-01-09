import { createContext, memo, useContext, useMemo, useState } from 'react'
const context = createContext(null)

export const Provider = (
  {
    value,
    children
  }
) => {
  return <context.Provider value={value}>
    {children}
  </context.Provider>
}


export const Home = () => {
  // console.log('render')
  const value = useContext(context)
  // console.log(value)
  const onClick = () => {
    // store.name = 'changeedName'
    // store = {
      // name: 'changeedName'
    // }
    value.setName('changeedName')
    // forceUpdate()
  }
  const onChangeAge = () => {
    value.setAge(21)
  }
  return <div>
    <div>Home</div>
    <div>{value.name}</div>
    <button onClick={onClick}>changeName</button>
    <button onClick={onChangeAge}>changeAge</button>
  </div>
}

export const Button = () => {
  // console.log('button-render')
  const {age} = useContext(context)
  return <MemoButton age={age}>
  </MemoButton>
}

export const MemoButton = memo(({age}) => {
  console.log('render memoButton',age)
  return <div>
    <div>memo button</div>
    age: {age}
    </div>
})

export const ContextDemo = () => {
  const [state, setState] = useState({name: '章三111', age: 1})
  const store = {
    ...state,
    setName(name){
      setState({
        ...state,
        name
      })
    },
    setAge(age){
      setState({
        ...state,
        age
      })
    }
  }
  return <Provider value={store}>
    <Home></Home>
    <Button/>
  </Provider>
}