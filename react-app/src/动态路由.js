import { memo, useCallback, useEffect, useMemo, useState, lazy, Suspense } from "react"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import loadable from '@loadable/component'

const Loading = loadable(() => import('./动态组件').then(module => ({default: module.Loading})))

// react.lazy 不支持变量， loadable 支持变量
const LazyLoading = lazy(() => import('./动态组件').then(module => ({default: module.Loading})))

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
    path: '/foo', component: <Suspense fallback={<>fetch loading component</>}><LazyLoading/></Suspense>
  },
  {
    path: '/bar', component: <Loading/>
  },
]

const useDidMount = (cb) => {
  useEffect(() => {
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
        <li><Link to="/bar">动态路由，异步加载组件</Link></li>
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