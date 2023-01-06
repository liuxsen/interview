import { useEffect, useRef, useState } from 'react'

export const useFn = ({count}) => {
  const [state, setState] = useState(count)
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
  const [state, setState] = useFn({count: 2})

  const onClick = () => {
    setState(state + 1)
  }
  return (
    <div>
      <button onClick={onClick}>add</button>
    </div>
  )
}