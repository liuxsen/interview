import { observer } from "./observe/index"

export function initState(vm) {
  let opts = vm.$options
  console.log('ops', opts)
  if(opts.props){
    initProps()
  }
  if(opts.data){
    initData(vm)
  }
  if(opts.computed){
    initComputed()
  }
  if(opts.watch){
    initWatch()
  }
  if(opts.created){
    initCreated()
  }
  if(opts.mounted){
    initMounted()
  }
}

function initProps(){}

// 对data初始化
function initData(vm){
  // console.log('vm', vm)
  let data = vm.$options.data
  // 修正this指向到vm实例
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  // 将data的所有属性代理到vm上
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      proxy(vm, '_data', key)
    }
  }
  // data数据劫持
  observer(data)
}

function proxy (vm, source, key){
  Object.defineProperty(vm, key, {
    get(){
      return vm[source][key]
    },
    set(newValue){
      vm[source][key] = newValue
    }
  })
}

function initComputed(){}
function initWatch(){}
function initCreated(){}
function initMounted(){}