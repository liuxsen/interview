// 1. 对象 {a: b: {c: 1, list: [1,2,3]}}  2. 数组

import { ArrayMethods } from "./arr"
import {Dep} from './dep'
export function observer (data){
  // console.log('observe', data)
  if(typeof data !== 'object' || data === null){
    return data
  }
  // 对象
  return new Observer(data)
}

class Observer {
  constructor(value){
    // console.log('this: ', this)
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this
    })
    if(Array.isArray(value)){
      console.log('数组--')
      value.__proto__ = ArrayMethods
      this.observerArray(value)
    } else {
      // 遍历对象所有的key
      this.walk(value)
    }
  }
  walk(data){
    let keys = Object.keys(data).forEach(key => {
      // 对每个属性劫持
      let value = data[key]
      defineReactive(data, key, value)
    })
  }
  observerArray(arr){
    arr.forEach((data) => {
      observer(data)
    })
  }
}

// 对象属性劫持
function defineReactive (data, key, value){
  let dep = new Dep()
  // 递归遍历属性
  observer(data[key])
  Object.defineProperty(data, key, {
    get(){
      // 收集依赖
      if(Dep.target){
        dep.depend()
      }
      console.log('dep', dep)
      return value
    },
    set(newValue){
      if(newValue === value){
        return value
      }
      console.log('设置数据')
      // 如果是对象，就需要再次做对象属性劫持
      observer(newValue)
      value = newValue
      dep.notify()
    }
  })
}