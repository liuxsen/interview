import { createBrowserHistory } from 'history'

// const history = createBrowserHistory()
// const location = history.location
// const unListen = history.listen(({location, action}) => {
//   console.log(action, location.pathname, location.state)
// })

// setTimeout(() => {
//   history.push('/home', {some: 'state'})
// }, 1000);

// setTimeout(() => {
//   history.push('/foo', {some: 'state'})
// }, 2000);

import React, {useState, useContext} from 'react'
import { pathToRegexp } from 'path-to-regexp'


export function matchPath(pathname, path) {
  const keys = []
  const regexp = pathToRegexp(path, keys)

  const match = regexp.exec(pathname)
  if(!match) return null
  const values = match.slice(1)
  console.log(regexp, keys, match, values)
  const res = {
    params: keys.reduce((pre, cur, index) => {
      pre[cur.name] = values[index]
      return pre
    }, {})
  }
  console.log(res)
  return res
}

// matchPath('/users/1/master', '/users/:id/:tag')

export const Context = React.createContext(null)
export const BrowerRouter = props => {
  const history = createBrowserHistory()
  console.log(history)
  const [location, setLocation] = useState(history)
  history.listen(location => {
    console.log(location)
    setLocation(location)
  })
  // TODO: match
  return <Context.Provider
    value={{history, location,}}
  >
    {props.children}
  </Context.Provider>
}

export const Route = props => {
  const {location} = useContext(Context)
  const {pathname} = location.location
  const match = matchPath(pathname, props.path)
  console.log('match', match)
  return match ? props.children : null
}

export const Link = ({to, children}) => {
  const {history} = useContext(Context)
  const onClick = e => {
    e.preventDefault();
    history.push(to)
  }
  return <a href={to} onClick={onClick}>{children}</a>
}

export const Switch = props => {
  const {location} = useContext(Context)
  const {pathname} = location.location
  let match = null
  let element = null
  // props.children [Route, Route]
  React.Children.forEach(props.children, (child, index) => {
    if(match === null && React.isValidElement(child)){
      element = child
      const path = child.props.path;

      match = path ? matchPath(pathname, path) : null
    }
  })
  return match ? React.cloneElement(element, {}) : null
}

export const MyReactRouteDemo = () => {
  return <BrowerRouter>
    <div>
      <Link to="/user/1">user/1</Link>
      <Link to="/order/1">order/1</Link>
    </div>
    <Switch>
      <Route path="/">
        <div>/</div>
      </Route>
      <div>aaa</div>
      <Route path="/user/:id">
        <div>/user/:id</div>
      </Route>
      <Route path="/order/:id">
        <div>/order/:id</div>
      </Route>
    </Switch>
  </BrowerRouter>
}