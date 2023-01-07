import { Link, BrowserRouter as Router, Switch, Route,
  useRouteMatch,
  useParams,
  Redirect,
  useLocation,
  useHistory
} from 'react-router-dom'
import { createContext, useContext, useState } from 'react'

const Home = () => {
  return <div>Home</div>
}
const Users = () => {
  return <div>users</div>
}
const About = () => {
  return <div>About</div>
}
const Topic = () => {
  const params = useParams()
  return <div>topicId: {params.topicId}</div>
}

const authContenxt = createContext()
const useProvideAuth = () => {
  const [user, setUser] = useState(null)
  const signin = (cb) => {
    setUser('user')
    cb()
  }
  const signout = (cb) => {
    setUser(null)
    cb()
  }
  return {
    user,
    signin,
    signout
  }
}
const ProvideAuth = ({children}) => {
  const auth = useProvideAuth()
  return <authContenxt.Provider value ={auth}>
    {children}
  </authContenxt.Provider>
}
const useAuth = () => {
  return useContext(authContenxt)
}
const PrivateRoute = ({children, ...rest}) => {
  let auth = useAuth()
  return  <Route
    {...rest}
    render={
      ({location}) => {
        return auth.user ?
        children :
        <Redirect
          to={{
            pathname: '/login',
            state: {from: location}
          }}/>
      }
    }
  >
  </Route>
}
function ProtectedPage() {
  const auth = useAuth()
  const history = useHistory()
  const logout = () => {
    auth.signout(() => {
      console.log('登出成功')
      history.replace('/')
    })
  }
  return <div>
    <h3>protected</h3>
    <button onClick={logout}>登出</button>
  </div>
}
function Login(){
  const history = useHistory()
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  let auth = useAuth();
  const login = () => {
    auth.signin(() => {
      console.log('登录成功')
      console.log(location.state)
      history.replace(from)
    })
  }
  return <div>
    <button onClick={login}>login</button>
  </div>
}


const Topics = () => {
  let match = useRouteMatch();
  return <div>
      url: {match.url}
      <ul>
        <li><Link to="/topics/component?name=1">component</Link></li>
      </ul>
      <Switch>
        <Route path={`${match.url}/:topicId`}>
          <Topic></Topic>
        </Route>
        <Route exact path={`${match.url}`}>
          请选择一个 topic
        </Route>
      </Switch>
  </div>
}

export const RouterV5 = () => {
  return <ProvideAuth>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
              <li>
                <Link to="/protected">protected</Link>
              </li>
            </ul>
          </nav>
            <Switch>
              <Route path="/about">
                <About/>
              </Route>
              <Route path="/users">
                <Users/>
              </Route>
              <Route path="/topics">
                <Topics/>
              </Route>
              <Route path="/login">
                <Login/>
              </Route>
              <Route path="/" exact>
                <Home/>
              </Route>
              <PrivateRoute to="/protected">
                <ProtectedPage/>
              </PrivateRoute>
            </Switch>
        </div>
      </Router>
    </ProvideAuth>
}