let activeEffect;
const effectStack = []
export const effect = (fn, options) => {
  const effectFn = () => {
    cleanUp(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    let res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length -1]
    return res
  }
  effectFn.deps = [] // 存储依赖此副作用函数的deps
  effectFn.options = options
  const {lazy} = options
  if(lazy){
    return effectFn
  }
  effectFn()
}
const cleanUp = (effectFn) => {
  for (const deps of effectFn.deps) {
    deps.delete(effectFn)
  }
}

export const computed = (getter) => {
  let value;
  // 用dirty标识是否需要重新计算，true代表脏，需要重新计算
  let dirty = true
  const effectFn = effect(getter, {
    // 利用懒执行特性
    lazy: true,
    scheduler(){
      // 如果设置proxy对象，就会导致scheduler执行，并设置dirty=true
      // 在下次获取value的时候，就会重新执行effectFn
      dirty = true
    }
  })
  const obj = {
    get value(){
      if(dirty){
        value = effectFn()
        // 执行getter函数之后，讲dirty设置为false
        dirty = false
        return value
      } else {
        // 返回缓存的值
        return value
      }
    }
  }
  return obj
}

/**
 * 监听一个响应式数据
 * @param {proxy data} source 响应式数据
 * @param {function} cb 回调函数
 */
export const watch = (source, cb) => {
  effect(
    // 触发getter，绑定name与副作用的关系
    // 注意： 这里硬编码了source.name,
    // 方案：使用递归读取source
    // () => {console.log(source.name)},
    () => traverse(source),
    {
      scheduler(fn){
        // 当source.name 发生变化时，触发trigger 会执行scheduler
        cb()
      }
    }
  )
}
const traverse = (source, seen = new Set()) => {
  // 如果要读取的数据是原始值，或者已经被读取过了，什么都不做
  if(typeof source !== 'object' || source === null || seen.has(source)){
    return
  }
  seen.add(source)
  for (const key in source) {
    traverse(source[key], seen)
  }
  return source
}


const bucket = new WeakMap()
export const reactive = (data) => {
  return new Proxy(data, {
    get(target, key, receiver){
      track(target, key, receiver)
      return target[key]
    },
    set(target, key, newValue, receiver){
      trigger(target, key, newValue, receiver)
      return true
    }
  })
}
const track = (target, key, receiver) => {
  // 防止在effec函数外面执行，导致没有activeEffect
  if(!activeEffect) return
  let depsMap = bucket.get(target)
  if(!depsMap){
    depsMap = new Map()
    bucket.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if(!deps){
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}
const trigger = (target, key, newValue, receiver) => {
  target[key] = newValue
  const depsMap = bucket.get(target)
  if(!depsMap) return
  const effectDeps = new Set(depsMap.get(key))
  effectDeps && effectDeps.forEach(effectFn => {
    const { scheduler } = effectFn.options || {}
    if(scheduler){
      scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

