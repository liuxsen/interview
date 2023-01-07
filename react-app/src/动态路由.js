import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

const Home = () => {
  return <div>home</div>
}
const Foo = () => {
  return <div>Foo</div>
}
const Bar = () => {
  return <div>bar</div>
}

const routeBases = [
  {
    path: '/', component: <Home/>, exact: true
  },
  {
    path: '/foo', component: <Foo/>
  },
  {
    path: '/bar', component: <Bar/>
  },
]

const useDidMount = (cb) => {
  useEffect(() => {
    debugger
    cb()
  }, [cb])
}

export const AppRoutes = () => {
  const [routes, setRoutes] = useState(routeBases)
  const memoCb = useCallback(() => {
    setTimeout(() => {
      setRoutes([
        ...routes,
        {
          path: '/baz',
          component: <div>baz</div>
        }
      ])
    }, 1000)
  }, [])
  useDidMount(memoCb)
  const routeList = routes.map(({path, component, ...rest}) => {
    return <Route path={path} key={path} {...rest}>
      {component}
    </Route>
  })
  return <div>
    <Router>
    <div>
      <ul>
        <li><Link to="/">home</Link></li>
        <li><Link to="/foo">foo</Link></li>
        <li><Link to="/bar">bar</Link></li>
        <li><Link to="/baz">baz</Link></li>
      </ul>
    </div>
      <Switch>
        {routeList}
        <Route path="*">
          404
        </Route>
      </Switch>
    </Router>
  </div>
}