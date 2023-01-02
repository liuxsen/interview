import { lifeCycleMixin } from './lifecycle'
import { initMixin } from './init'
import { renderMixin } from './vnode/index'

function Vue (options){
  this._init(options)
}

initMixin(Vue)
lifeCycleMixin(Vue) // 生命周期
renderMixin(Vue) // add render

export default Vue