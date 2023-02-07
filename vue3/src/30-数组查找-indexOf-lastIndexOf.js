
const bucket = new WeakMap()
const ITERATE_KEY = Symbol()

// 重写array方法

const arrayInstrumentations = {
};
['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method]
  // 因为在includes等方法中传参有可能是代理对象的元素也可能是原始数组对象的元素，所以需要重写方法，两次查找元素
  arrayInstrumentations[method] = function(...args){
    // this是代理对象
    let res = originMethod.apply(this, args)
    if(res === false || res === -1){
      // res为false 或者 -1 值，说明没找到，通过this.raw 拿到原始数组对象，再去其中查找并更新res值
      res = originMethod.apply(this.raw, args)
    }
    // 返回最终结果
    return res
  }
})

/**
 * reactive 构建函数
 * @param {Object} data 原始对象
 * @param {Bolean} isShallow 是否浅响应，默认是false，为深响应
 * @param {Bolean} isReadonly 是否只读，默认是false，为可读可写
 */
function createReactive (data, isShallow = false, isReadonly = false){
  return new Proxy(data, {
    get(target, key, receiver){
      if(key === 'raw'){
        return target
      }
      if(Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)){
        return Reflect.get(arrayInstrumentations, key, receiver)
      }
      if(!isReadonly){
        // 为非只读的对象绑定副作用函数，只读的对象，不需要绑定副作用函数，因为不会触发set-> triger逻辑
        track(target, key)
      }
      const res = Reflect.get(target, key, receiver)
      if(isShallow){
        return res
      }
      if(typeof res === 'object' && res !== null){
        // 如果get返回值是对象，递归建立关系
        // 如果是只读的响应式，需要递归进行readonly
        return isReadonly ? readOnly(res) : reactive(res)
      }
      return res
    },
    set(target, key, newVal, receiver){
      if(isReadonly){
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 获取旧值
      const oldValue = target[key]
      const type = Array.isArray(target) ?
          // 判断代理的目标对象是否是数组，如果是数组，检测设置的索引值是否小于数组长度
          Number(key) < target.length ? 'SET' : 'ADD'
          // 如果有属性标记设置属性，没有属性标记添加属性
          : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      // 通过reflect设置属性
      const res = Reflect.set(target, key, newVal,receiver)
      if(target === receiver.raw){
        // 只有当代理对象是target的代理对象的时候才触发更新
        if(oldValue !== newVal && (oldValue === oldValue || newVal === newVal)){
          // 如果新值与旧值不一致，并且不都是NaN(后者保障了至少有一个不是NaN,排除了由NaN到NaN的情况) 触发trigger
          // 需要对NaN进行特殊处理，因为NaN不等于自身
          trigger(target, key, newVal, type)
        }
      }
      return res
    },
    deleteProperty(target, key){
      if(isReadonly){
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 检查被操作的属性是否有对象自己的属性
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      // 使用 Reflect 删除属性
      const res = Reflect.deleteProperty(target, key)
      if(res && hadKey){
        // 只有当被删除的属性是对象自己的属性，并且成功删除时，触发更新
        // 因为删除会影响for in的结果，所以应该重新执行与 ITERATE_KEY 相关联的副作用函数
        trigger(target, key, 'DELETE')
      }
      return res
    },
    has(target, key){
      track(target, key)
      return Reflect.has(target, key)
    },
    ownKeys(target){
      // 注意在trigger的时候也需要触发 ITERATE_KEY 对应的副作用函数
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    }
  })
}

// 定义一个Map实例，存储原始对象到代理对象的映射
const reactiveMap = new Map()
// 深度响应函数
function reactive (data){
  // 判断是否存在原始对象的代理对象
  const existionProxy = reactiveMap.get(data)
  //  如果存在原始对象的代理对象，返回已有的代理对象
  if(existionProxy) return existionProxy
  //  新建一个代理对象
  const proxy = createReactive(data, false)
  //  存储代理对象
  reactiveMap.set(data, proxy)
  return proxy
}
// 浅响应函数
function shallowReactive(data){
  return createReactive(data, true)
}
// 只读响应函数
function readOnly(data){
  return createReactive(data, false, true)
}
// 只读 浅响应函数
function shallowReadonly (data){
  return createReactive(data, true, true)
}

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
function trigger(target, key, newVal, type){
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
  if(Array.isArray(target) && key === 'length'){
    // 如果原始数据是数组，并且设置的是length属性
    // 对于索引大于等于新length值的元素
    // 需要把所有相关联的副作用函数取出来并添加到effectsToRun 中待执行
    depsMap.forEach((effects, index) => {
      if(index <= key){
        effects.forEach((effectFn) => {
          if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }
  if(type === 'ADD' || type=== 'DELETE'){
    // 如果是新增属性，删除属性，重新执行iterateKey对应的副作用函数
    // for in 操作对应的副作用函数
    const iterateEffects = depsMap.get(ITERATE_KEY);
    // 遍历 ITERATE_KEY 的副作用函数
    iterateEffects && iterateEffects.forEach(effectFn => {
      if(effectFn !== activeEffect){
        effectsToRun.add(effectFn)
      }
    })
    if(type === 'ADD' && Array.isArray(target)){
      // 如果是add并且是数组的设置操作,  需要触发length绑定的副作用函数
      const lengthEffects = depsMap.get('length')
      lengthEffects && lengthEffects.forEach(effectFn => {
        effectsToRun.add(effectFn)
      })
    }
  }
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
function effect(fn, options = {}) {
  // 新建一个副作用函数，包裹真正的副作用函数
  const effectFn = () => {
    // 调用cleanup,完成清除工作
    cleanup(effectFn)
    // 注册副作用函数
    activeEffect = effectFn
    // 调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn)
    // 执行副作用 () => app.innerHTML = obj.text
    // 将fn的执行结果保存到res中
    const res = fn()
    // 当调用的副作用函数执行完毕后，将当前的副作用函数弹出栈，并设置当前的副作用函数还原为之前的值
    effectStack.pop() // 删除最后的副作用函数
    activeEffect = effectStack[effectStack.length -1]
    return res
  }
  // effectFn === activeEffect
  // effectFn.deps 用来存储所有与该副作用函数相关联的依赖集合set[]
  effectFn.deps = []
  // 将options挂载到富足用函数上
  effectFn.options = options
  // lazy懒执行判断
  if(!options.lazy){
    effectFn()
  }
  // effectFn()
  return effectFn
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

function computed(getter) {
  let dirty = true
  let value
  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler(){
        dirty = true
      }
    }
  )
  const obj = {
    get value(){
      if(dirty){
        value = effectFn()
        dirty = false
        return value
      } else {
        return value
      }
    }
  }
  return obj
}

function watch(source, cb, options = {}){
  // 支持传递getter函数
  let getter
  if(typeof source === 'function'){
    getter = source
  } else {
    getter = () => traverse(source)
  }
  let oldValue,newValue;
  let cleanup
  function onInvalidate(fn){
    cleanup = fn
  }
  // 封装scheduler
  const job = () => {
    newValue = effectFn()
    if(cleanup) cleanup()
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }
  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler(){
        // 在调度函数中判断flush是否为post，如果是，将job放到微任务中执行
        if(options.flush === 'post'){
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )
  if(options.immediate){
    job()
  } else {
    // 先执行一次保存第一次的值，视为旧值，当数据变化的时候，获取新值，将新值旧值都传递到cb
    oldValue = effectFn()
  }
}
function traverse(source, seen=new Set()){
  if(typeof source !== 'object' || source === null || seen.has(source)) return;
  seen.add(source)
  for (const key in source) {
    traverse(source[key], seen)
  }
  return source
}

// 定义一个任务队列
const jobQueue = new Set()
// 使用Promise.resolve() 创建一个promise实例，用它将一个任务添加到微任务队列
const p = Promise.resolve()
// 一个标志代表是否正在刷新
let isFlushing = false
function flushJob(){
  // 如果队列正在刷新，则什么都不做
  if(isFlushing) return
  // 设置为true，代表正在刷新
  isFlushing = true
  p.then(() => {
    jobQueue.forEach(job => job())
    jobQueue.clear()
  }).finally(() => {
    isFlushing = false
  })
}