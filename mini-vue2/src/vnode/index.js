export function renderMixin(Vue) {

  // 标签
  Vue.prototype._c = function(...args){
    return createElement(...args)
  }
  // 文本
  Vue.prototype._v = function(text){
    return createText(text)
  }
  // 变量
  Vue.prototype._s = function(val){
    return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }
  Vue.prototype._render = function(){
    let vm = this
    let render = vm.$options.render
    // console.log(render)
    // console.log('msg:', vm.msg)
    let vnode = render.call(this)
    // console.log(vnode)
    return vnode;
  }
}

function createElement(tag, data = {}, ...children){
  return vnode(tag, data, data && data.key || '', children)
}

function vnode(tag, data, key, children, text){
  return {
    tag, data, key, children, text
  }
}

function createText(text){
  return vnode(undefined,undefined,undefined,undefined,text)
}