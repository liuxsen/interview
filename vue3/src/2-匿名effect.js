const bucket = new Set()
const data = {text: 'hello world', color: 'red'}


const obj = new Proxy(data, {
  get(target, key){
    console.log(bucket)
    bucket.add(activeEffect)
    return target[key]
  },
  set(target, key, newVal){
    target[key] = newVal
    // // 注意：如果设置一个不存在的属性，还是会触发effect
    bucket.forEach(fn => fn())
    return true
  }
})

const app = document.getElementById('app')

// 一个用户注册副作用函数的变量
let activeEffect;
function effect(fn) {
  activeEffect = fn
  fn()
}

// 1. 调用effect,触发getter，将effect放入bucket
effect( () => {
  app.innerHTML = obj.text
})