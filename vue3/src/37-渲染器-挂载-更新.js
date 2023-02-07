const { effect, ref } = VueReactivity
function createRenderer(
  {
    createElement,
    setElementText,
    insert,
    patchProps,
    unmount
  }
){
  /**
   * 挂载或者更新dom
   * @param {vnode} n1 旧vnode
   * @param {vnode} n2 新vnode
   * @param {dom} container dom
   */
  function patch(n1, n2, container){
    if(n1 && n1.type !== n2.type){
      unmount(n1)
      n1 = null
    }
    const {type} = n2
    if(typeof type === 'string'){
      if(!n1){
        // 如果n1不存在，意味着挂载，调用mounteElement完成挂载
        mountElement(n2, container)
      } else {
        // n1存在意味着打补丁 更新
      }
    } else if(typeof type === 'object'){
      // 如果n2.type 的值的类型是对象，则他描述的是组件
    } else if(type === 'xxx'){
      // 处理其他类型的vnode
    }
  }
  function mountElement(vnode, container){
    // 新建dom元素
    const el = vnode.el = createElement(vnode.type)
    if(vnode.props){
      // 如果vnode.props 存在
      for (const key in vnode.props) {
        const value = vnode.props[key]
        patchProps(el, key, null, value)
      }
    }
    if(typeof vnode.children === 'string'){
      // 只需要设置元素的textContent属性即可
      setElementText(el, vnode.children)
    } else if(Array.isArray(vnode.children)){
      // 如果是数组，遍历children
      vnode.children.forEach(child => {
        // 递归调用patch，挂载阶段没有旧vnode，
        patch(null, child, el)
      })
    }
    insert(el, container)
  }
  function render(vnode, container){
    if(vnode){
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode){
        // 有旧vnode，没有新vnode，说明是卸载unmount 操作
        // 将container的dom清空
        // container.innerHTML = ''
        unmount(container._vnode)
      }
    }
    container._vnode = vnode
  }
  function hydrate (vnode, container){

  }
  return {
    render,
    hydrate
  }
}



// 渲染器函数
const {render} = createRenderer({
  createElement(tag){
    return document.createElement(tag)
  },
  setElementText(el, text){
    el.textContent = text
  },
  // insertedNode 被插入节点 (newNode)
  // parentNode 新插入节点的父节点
  // newNode 用于插入的节点
  // referenceNode newNode 将要插在这个节点之前 如果 referenceNode 为 null 则 newNode 将被插入到子节点的末尾*。*
  insert(el, parent, anchor = null){
    parent.insertBefore(el, anchor)
  },
  unmount(vnode){
    // 根据vnode获取真实的vnode节点
    const el = container._vnode.el
    // 获取el的父元素
    const parent = el.parentNode
    // 删除元素
    if(parent) parent.removeChild(el)
  },
  patchProps(el, key, prevValue, nextValue){
    function shouldSetAsProps(el, key, value){
      // 特殊处理
      if(key === 'form' && el.tagName === 'INPUT') return false
      return key in el
    }
    const type = typeof el[key]
    if(/^on/.test(key)){
      debugger
      const name = key.slice(2).toLowerCase()
      // 先移除之前的事件处理函数, 或者使用伪造的事件处理函数
      // prevValue && el.removeEventListener(name, prevValue)
      let invoker = el._vei
      if(nextValue){
        if(!invoker){
          invoker = el._vei = (e) => {
            invoker.value(e)
          }
          invoker.value = nextValue
          el.addEventListener(name, nextValue)
        } else {
          invoker.value = nextValue
        }
      } else if(invoker){
        // 新的事件绑定函数不存在，且之前绑定的invoker存在，则移除绑定
        el.removeEventListener(name, invoker)
      }
    } else if(key === 'class'){
      // 对class做特殊处理
      el.className = nextValue
    } else if(shouldSetAsProps(el, key, nextValue)){
      if(type === 'boolean' && value === ''){
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
})
const container = document.getElementById('app')

// 虚拟dom vnode
const vnode = {
  type: 'div',
  props: {
    onClick: () => {
      console.log('clicked')
    }
  },
  children: 'on click'
}

// 第一次渲染 mount
render(vnode, container)
vnode.props.onClick = () => {
  console.log('clicked 2')
}
console.log(vnode)
render(vnode, container)
// 第三次渲染，删除dom
// render(null, container)
