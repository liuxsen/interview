import { callHook, mounteComponent } from './lifecycle'
import { compileToFuntion } from './compile/index'
import { initState } from './initState'
import { mergeOptions } from './utils/index'

export function initMixin (Vue) {
  Vue.prototype._init = function(options){
    console.log('vue', options)
    let vm = this
    vm.$options = mergeOptions(Vue.options, options)
    console.log('init:', vm)
    callHook(vm, 'beforeCreated')
    // 初始化状态
    initState(vm)
    callHook(vm, 'created')
    // 配置 el跟使用vm.$mounted 效果一致
    if(vm.$options.el){
      vm.$mounted(vm.$options.el)
    }
  }
  Vue.prototype.$mounted = function(el){
    // console.log('el:',el)
    let vm = this
    let options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    // 没有render
    if(!options.render){
      let template = options.template
      if(!template && el){
        const html = el.outerHTML
        console.log(html)
        const render = compileToFuntion(html)
        console.log(render)
        // render-> vnode => dom
        options.render = render
      }
    }
    mounteComponent(vm)
  }
}
