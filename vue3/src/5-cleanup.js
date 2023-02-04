const data = {text: 'hello world', color: 'red', label: 'label!!', showLabel: true, defaultLabel: 'default label'}

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
  // 新增
  activeEffect.deps.push(deps)
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
  const effectsToRun = new Set(effects)
  // 遍历副作用函数数组，并执行
  effectsToRun && effectsToRun.forEach(effectFn => effectFn())
}

// 获取container
const app = document.getElementById('app')

// 一个用户注册副作用函数的变量
let activeEffect;
// 副作用注册函数
function effect(fn) {
  // 新建一个副作用函数，包裹真正的副作用函数
  const effectFn = () => {
    // 调用cleanup,完成清除工作
    cleanup(effectFn)
    // 注册副作用函数
    activeEffect = effectFn
    // 执行副作用 () => app.innerHTML = obj.text
    fn()
  }
  // effectFn === activeEffect
  // effectFn.deps 用来存储所有与该副作用函数相关联的依赖集合set[]
  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn) {
  // 循环副作用函数的deps数组，[set, set];set是各种effect函数
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    // 删除key依赖的副作用函数
    deps.delete(effectFn)
  }
  // 清空effectFn的数组长度
  effectFn.deps.length = 0
}

// 1. 调用effect,触发getter，将effect放入bucket
effect( () => {
  debugger
  // 读取变量，建立关系
  // console.log(obj.color)
  // console.log(obj.text)
  app.innerHTML = obj.showLabel ? obj.label : obj.defaultLabel
})

// effect(() => {
//   console.log(obj.text)
// })

// 1. 分支切换，这里的分支切换会导致effect重新执行，并执行cleanup函数
// 2. 在这里会重新执行effect
// 3. effect中会执行cleanup函数，清理上一次执行effect函数时，建立的key与effect对应的关系；结果就是，
// weackmap->map->key->set 删除了这个effect函数
// 4. 所以如果在分支中没有再次读取key，就不会新建立关系，再次设置key也不会触发effect函数
obj.showLabel = false
// 这里不会导致触发effectFn，因为在cleanup中清理了effectFn
obj.label = 'aaa'

// setTimeout(() => {
//   obj.showLabel = false
// }, 2000);

// !!! 因为切换过showLabel，会导致label defaultLabel 都被读取过并建立了链接
// 即使obj.showLabel 是false，label的设置也会导致副作用执行;
// 方案： 每次执行副作用之前清理副作用以来
// setTimeout(() => {
//   obj.label = 'new label'
// }, 3000);



