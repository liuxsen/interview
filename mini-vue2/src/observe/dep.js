export class Dep {
  constructor(){
    this.subs = []
  }
  // 收集watcher
  depend(){
    this.subs.push(Dep.target)
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