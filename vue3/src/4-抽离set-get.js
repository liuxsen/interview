const data = {text: 'hello world', color: 'red'}

// 树形结构
// 为了将副作用函数跟数据的key做对应关系
// target
//   - text
//     - effectFn1
//     - effectFn2
//   - text2
//     - effectFn1
//     - effectFn2
// target2
//   - text
//     - effectFn1
//     - effectFn2
//   - text2
//     - effectFn1
//     - effectFn2

const bucket = new WeakMap()

const obj = new Proxy(data, {
  get(target, key){
    track(target, key)
    return target[key]
  },
  set(target, key, newVal){
    trigger(target, key, newVal)
    return true
  }
})

function track(target, key){
  if(!activeEffect) return target[key]
  // 根据target 从 桶 中取得 depsMap， depsMap 是一个Map类型， key-> [effect]
  let depsMap = bucket.get(target)
  if(!depsMap){
    // 新建一个map对象，映射key跟副作用函数数组，建立关系
    depsMap = new Map()
    // 绑定当前map对象跟weakMap对象，其中key是原始对象，值是新map对象
    // 因此建立了原始对象跟新map对象的关系
    bucket.set(target, depsMap)
  }
  // 里面存储着所有与当前key相关联的副作用函数，他是一个set类型
  let deps = depsMap.get(key)
  if(!deps){
    // 如果当前读取的key没有依赖副作用函数数组，新建一个key，并对应一个set数组
    depsMap.set(key, deps = new Set())
  }
  // 将副作用函数保存到set数组中，将来key变化，会被调用，执行副作用函数
  deps.add(activeEffect)
}

function trigger(target, key, newVal){
  // 设置原始数据 新值
  target[key] = newVal
  // 根据target从桶中取得depsMap，他是 key-> [effect]
  const depsMap = bucket.get(target)
  // 如果没有map对象，就返回
  if(!depsMap) return
  // 获取当前key对应的副作用函数数组
  const effects = depsMap.get(key)
  // 遍历副作用函数数组，并执行
  effects && effects.forEach(fn => fn())
}

const app = document.getElementById('app')

// 一个用户注册副作用函数的变量
let activeEffect;
// 副作用注册函数
function effect(fn) {
  // 注册副作用函数
  activeEffect = fn
  // 执行副作用 () => app.innerHTML = obj.text
  fn()
}

// 1. 调用effect,触发getter，将effect放入bucket
effect( () => {
  // 读取变量，建立关系
  app.innerHTML = obj.text
})

effect( () => {
  app.style.color = obj.color
})

setTimeout(() => {
  obj.text = 'hello vue1'
  obj.text = 'hello vue2'
}, 1000);

setTimeout(() => {
  obj.color = 'green'
}, 3000);


