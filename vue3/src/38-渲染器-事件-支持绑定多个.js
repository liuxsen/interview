const { effect, ref, reactive } = VueReactivity
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
        console.log('todo: 更新操作')
        // patchElement()
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
        // 循环遍历属性
        const value = vnode.props[key]
        // 更新dom属性以及绑定事件函数
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
    const el = vnode.el
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
      // 处理事件绑定
      const name = key.slice(2).toLowerCase()
      // 先移除之前的事件处理函数, 或者使用伪造的事件处理函数
      // prevValue && el.removeEventListener(name, prevValue)
      // 获取缓存在el上的事件函数
      // 设计evi结构为对象
      let invokers = el._veis || (el._veis = {})
      let invoker = invokers[key]
      if(nextValue){
        // 如果绑定了事件函数
        if(!invoker){
          // 如果没有缓存过事件函数，新建一个事件函数并保存到el._vei[key] 避免被覆盖
          el._veis[key] = invoker = (e) => {
            if(Array.isArray(invoker.value)){
              invoker.value.forEach(fn => {
                fn(e)
              })
            }else {
              invoker.value(e)
            }
          }
          // 将事件函数赋值给invoker.value
          invoker.value = nextValue
          // 添加事件监听，这里每次触发的函数都是invoker
          el.addEventListener(name, invoker)
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
      // 如果设置的key不在dom properties属性中，则使用setAttribute
      el.setAttribute(key, nextValue)
    }
  }
})
const container = document.getElementById('app')

// 虚拟dom vnode
// const vnode = {
//   type: 'div',
//   props: {
//     onClick: (e) => {
//       console.log(e)
//       console.log('clicked')
//     }
//   },
//   children: 'on click'
// }
// // 第一次渲染 mount
// render(vnode, container)
const vnode2 = {
  type: 'span',
  props: {
    onClick: [
      (e) => {
        console.log('clicked1')
      },
      (e) => {
        console.log('clicked2')
      }
    ],
    onContextmenu: (e) => {
      console.log(e)
      console.log('contenxtMenu')
    }
  },
  children: 'on click span'
}
render(vnode2, container)