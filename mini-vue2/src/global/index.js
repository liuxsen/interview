import { mergeOptions } from "../utils/index"

export function initGlobalApi(Vue){
  Vue.options = {}
  Vue.mixin = function(mixin){
    // mixin {created: function a() {}}
    Vue.options = mergeOptions(this.options, mixin)
    console.log(Vue.options)
  }
}
