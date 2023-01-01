// 重写数组方法,实现劫持

let oldArrayProtoMethods = Array.prototype
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 劫持

let methods = [
  'push', 'pop', 'unshift', 'shift', 'splice'
]

methods.forEach(method => {
  ArrayMethods[method] = function(...args){
    console.log('数组劫持')
    let result = oldArrayProtoMethods[method].apply(this, args)
    let inserted = null
    // 追加对象的情况
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.splice(2);
      default:
        break;
    }
    // console.log('inserted', inserted)
    let ob = this.__ob__
    // console.log('get this.ob:',ob)
    if(inserted && inserted.length){
      ob.observerArray(inserted)
    }
    return result
  }
})

