let id = 0

export class Dep {
  constructor(){
    this.id = id++
    this.subs = []
  }
  // 收集watcher
  depend(){
    // this.subs.push(Dep.target)
    // 给wacher 添加 deep
    Dep.target.addDep(this)
  }
  addSub(watcher){
    this.subs.push(watcher)
  }
  // 更新
  notify(){
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

Dep.target = null

export function pushTarget(watcher){
  Dep.target = watcher
}

export function popTarget(){
  Dep.target = null
}