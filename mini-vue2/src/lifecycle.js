import Watcher from './observe/watcher'
import { patch } from "./vnode/patch"

export function mounteComponent (vm) {
  callHook(vm, 'beforeMounted')
  // vm._update(vm._render()) // vm._render 将render函数变成vnode vm.update 将vnode变成真实dom
  let updateComponent = () => {
    vm._update(vm._render())
  }
  // 一个组件有一个watcher!!!
  // wacher 有更新组件方法
  new Watcher(vm, updateComponent, () => {}, true)
  callHook(vm, 'mounted')
}

export function lifeCycleMixin(Vue){
  Vue.prototype._update = function(vnode) {
    // console.log(vnode)
    let vm = this
    // 两个参数 旧dom， vnode
    vm.$el = patch(vm.$el, vnode)
  }
}

// 生命周期调用
export function callHook(vm, hook){
  const handles = vm.$options[hook]
  console.log('callhook:', hook)
  if(handles){
    handles.forEach(handle => {
      handle.call(vm)
    })
  }
}