function deBounce (fn, time){
  return function(...args){
    let that = this
    fn.id && clearTimeout(fn.id)
    fn.id = setTimeout(function(){
      fn.apply(that, [...args])
    }, time)
  }
}

const deBounceFn = deBounce((...args)=> {
  console.log(args)
}, 1000)

deBounceFn(1, 2,3)
deBounceFn(1, 2,3)
deBounceFn(1, 2,3)

setTimeout(() => {
  deBounceFn(1, 2,3)
}, 2000);