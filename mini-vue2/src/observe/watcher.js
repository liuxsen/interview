import { popTarget, pushTarget } from "./dep"

let id = 0
class Watcher {
  constructor(vm, updater, cb, options){
    this.vm = vm
    this.updater = updater
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    // this.updat
    if(typeof updater === 'function'){
      this.getter = updater // 更新试图
    }
    this.get()
  }
  get(){
    pushTarget(this) // 添加watcher
    this.getter() // 渲染页面
    popTarget() // 取消 wacher
  }
  update(){
    this.getter()
  }
  addDep(dep){
    // 去重
    let id = dep.id
    if(!this.depsId.has(id)){
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
}

export default Watcher

// 收集依赖
// dep wathcer data: {name: '', msg: ''}

// dep 和 data中的属性一一对应
//  watcher 在视图上有几个属性，就有几个watcher

// dep 和 watcher 关系： 一对多
// dep dep.name = [w1, w2]
// 

// 实现对象收集依赖