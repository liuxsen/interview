const bucket = new Set()
const data = {text: 'hello world'}


const obj = new Proxy(data, {
  get(target, key){
    console.log(bucket)
    // 注意，这里硬编码了effect函数名称
    bucket.add(effect)
    return target[key]
  },
  set(target, key, newVal){
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})

const app = document.getElementById('app')

function effect() {
  app.innerHTML = obj.text
}

// 1. 调用effect,触发getter，将effect放入bucket
effect()
obj.text = 'change'

