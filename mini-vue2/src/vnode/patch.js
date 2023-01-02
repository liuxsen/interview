export function patch(oldVnode, vnode) {
  console.log(oldVnode, vnode)
  const el = createEl(vnode)
  // console.log(el)
  // 替换oldvnode
  let parentEl = oldVnode.parentNode
  parentEl.insertBefore(el, oldVnode)
  parentEl.removeChild(oldVnode)
  return el
}

function createEl(vnode){
  /**
   * children: [vnode],
   * data: {},
   * key: '',
   * tag: 'div',
   * text: ''
   */
  let {tag, children, data, text, key} = vnode
  if(typeof tag === 'string'){
    // 元素
    vnode.el = document.createElement(tag)
    if(children && children.length > 0){
      children.forEach(child => {
        vnode.el.appendChild(createEl(child))
      })
    }
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}