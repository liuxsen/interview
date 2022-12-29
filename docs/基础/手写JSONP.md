# 手写jsonp

```js
// 客户端请求
const jsonp = ({url, params, callbackName}) => {
  const generateUrl = () => {
    let dataStr = ''
    for(let key in params){
      dataStr += `${key}=${params[key]}&`
    }
    dataStr+=`callback=${callbackName}`
    return `${url}?${dataStr}`
  }
  return new Promise((resolve, reject) => {
    let scriptEl = document.creaateElement('script')
    scriptEl.src = generateUrl()
    document.body.appendChild(scriptEl)
    const cbName = callbackName || 'callback'
    window[cbName] = (data) => {
      resolve(data)
      document.body.removeChild(scriptEl)
    }
  })
}

```

服务端响应

```js
let express = require('express')

let app = express()
app.get('/', function(req, res) {
  let {a, b, callback} = req.query
  // get data
  const data = {name: 'data'}
  res.end(`${callback}(${data})`)
})
```

调用

```js
jsonp({
  url: 'http://locahost:3000',
  params: {
    a: 1, b: 2
  }
}).then(data => {
  console.log(data)
})
```

