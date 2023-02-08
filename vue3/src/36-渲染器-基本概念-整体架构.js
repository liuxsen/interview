const { effect, ref, reactive } = VueReactivity
function createRenderer(
  {
    createElement,
    setElementText,
    insert
  }
){
  /**
   * 挂载或者更新dom
   * @param {vnode} n1 旧vnode
   * @param {vnode} n2 新vnode
   * @param {dom} container dom
   */
  function patch(n1, n2, container){
    if(!n1){
      // 如果n1不存在，意味着挂载，调用mounteElement完成挂载
      mountElement(n2, container)
    } else {
      // n1存在意味着打补丁
      console.log('TODO 更新操作')
    }
  }
  function mountElement(vnode, container){
    // 新建dom元素
    const el = createElement(vnode.type)
    if(typeof vnode.children === 'string'){
      // 只需要设置元素的textContent属性即可
      setElementText(el, vnode.children)
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
        container.innerHTML = ''
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
  }
})
const container = document.getElementById('app')

// 虚拟dom vnode
const vnode = {
  type: 'h1',
  children: 'hello vnode'
}
const obj = reactive(vnode)
// 第一次渲染 mount
effect(() => {
  console.log('change effect')
  render(obj, container)
})
obj.children = 'change text'
// 第二次渲染，更新dom
// render(newNode, container)
// 第三次渲染，删除dom
// render(null, container)
