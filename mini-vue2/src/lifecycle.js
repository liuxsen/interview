import { patch } from "./vnode/patch"

export function mounteComponent (vm) {
  vm._update(vm._render()) // vm._render 将render函数变成vnode vm.update 将vnode变成真实dom
}

export function lifeCycleMixin(Vue){
  Vue.prototype._update = function(vnode) {
    // console.log(vnode)
    let vm = this
    // 两个参数 旧dom， vnode
    vm.$el = patch(vm.$el, vnode)
  }
}