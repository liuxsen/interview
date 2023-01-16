// 实现 简易版本 history

export function createLocation (basename=""){
  let {hash, search, pathname} = window.location
  // 处理存在basename的情况
  const reg = new RegExp(`^${basename}`)
  pathname = pathname.replace(reg, '')

  const location = {
    hash,
    search,
    pathname,
  }
  let state = null
  let historyState = window.history.state // {key: 'aaa'}

  if(historyState === null){
    state = null
  } else if(typeof historyState !== 'object'){
    state = historyState
  } else {
    if('key' in historyState){
      location.key = historyState.key
      state = historyState.state
    } else {
      state = historyState
    }
  }
  location.state = state
  return location
}

function createBrowserHistory (options = {}){
  const go = (step) => {
    window.history.go(step)
  }
  let listenFn = null
  const goBack = () => {
    window.history.back()
  }
  const goForward = (step) => {
    window.history.goForward()
  }
  const listen = (cb) => {
    if(!listenFn){
      listenFn = cb
    }
    // 监听浏览器前进后退操作
    window.addEventListener('popstate', () => {
      // console.log('pop history change')
      listenFn()
    })
  }
  const push = (data, unused, url) => {
    window.history.pushState(data, unused, url)
    listenFn && listenFn()
  }
  const replace = (data, unused, url) => {
    window.history.replaceState(data, unused, url)
    listenFn && listenFn()
  }
  const history = {
    action: 'POP',
    length: window.history.length,
    go,
    goBack,
    goForward,
    location: createLocation(),
    listen,
    replace,
    push,
  }
  return history
}


const history = createBrowserHistory()

console.log(history)

history.listen(() => {
  console.log('history changeed')
})

export const HistoryDemo = () => {
  const onPush = (url) => {
    history.push(null, null, url)
  }
  const onReplace = () => {
    history.replace(null, null, '/baz')
  }
  const onBack = (step) => {
    history.go(step)
  }
  return <div>
    <button onClick={() => {onPush('foo')}}>push foo</button>
    <button onClick={() => {onPush('bar')}}>push bar</button>
    <button onClick={() => {onBack(-1)}}>back</button>
    <button onClick={() => {onBack(1)}}>forword</button>
    <button onClick={onReplace}>replace</button>
  </div>
}

// const history = window.history

// window.addEventListener('popstate', (e) => {
//   console.log('popstate', e)
//   listenCallback()
// })

// function listenCallback () {
//   console.log('listen called')
// }

// function push(data, unused, url){
//   history.pushState(data, unused, url)
//   listenCallback()
// }

// function replace(data, unused, url){
//   history.replaceState(data, unused, url)
//   listenCallback()
// }

// setTimeout(() => {
//   // history.replaceState(data, unused, url)
//   push({a: 1}, {}, 'bar')
// }, 1000);

// setTimeout(() => {
//   push(null, null, 'foo')
// }, 2000);
