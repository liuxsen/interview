// 实现调度执行
// 当trigger动作触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数、方式
const data = {foo: true, bar: true, num: 1}

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
  const effectsToRun = new Set()
  // 遍历副作用函数数组，并执行
  effects && effects.forEach(effectFn => {
    // // 如果trigger的副作用函数跟当前执行的副作用函数相同，不触发执行
    if(effectFn !== activeEffect){
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    // 如果options.scheduler,调用调度器，并将副作用函数作为参数
    if(effectFn.options.scheduler){
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}



// 一个用户注册副作用函数的变量
let activeEffect;
//  因为只是用了一个变量注册副作用函数，会导致内层的effect函数覆盖变量，
// 解决方法，使用函数栈 [effectFn1, effectFn2]
// 函数栈可以支持嵌套的副作用函数
const effectStack = []

// 副作用注册函数
// 添加options参数
function effect(fn, options) {
  // 新建一个副作用函数，包裹真正的副作用函数
  const effectFn = () => {
    // 调用cleanup,完成清除工作
    cleanup(effectFn)
    // 注册副作用函数
    activeEffect = effectFn
    // 调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn)
    // 执行副作用 () => app.innerHTML = obj.text
    fn()
    // 当调用的副作用函数执行完毕后，将当前的副作用函数弹出栈，并设置当前的副作用函数还原为之前的值
    effectStack.pop() // 删除最后的副作用函数
    activeEffect = effectStack[effectStack.length -1]
  }
  // effectFn === activeEffect
  // effectFn.deps 用来存储所有与该副作用函数相关联的依赖集合set[]
  effectFn.deps = []
  // 将options挂载到富足用函数上
  effectFn.options = options
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
// 获取container
const app = document.getElementById('app')
effect( () => {
  console.log(obj.num)
}, {
  scheduler(fn){
    setTimeout(() => {
      fn()
    });
  }
})

obj.num = 2

console.log('结束了')