function throttle (fn, delay){
  let last = 0
  let deferTimer = null
  return function(...args){
    let that = this
    let now = Date.now()
    if(last && now < last + delay){
      deferTimer && clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(that, [...args])
      }, delay)
    } else {
      last = now
      fn.apply(that, [...args])
    }
  }
}

const throttleFn = throttle((args) => {
  console.log('throttle', 'log')
}, 1000)

setInterval(() => {
  throttleFn()
}, 100)