const { effect, ref, reactive } = VueReactivity

const Text = Symbol()
const Comment = Symbol()
const Fragment = Symbol()

function createRenderer(options){
  const { createElement, setElementText, insert, patchProps, createText, setText } = options
  /**
   * 缓存上一次的vnode到dom上；挂载或者更新 dom props
   * @param {vnode} vnode 虚拟节点
   * @param {dom} container 容器
   */
  function render(vnode, container){
    if(vnode){
      // 执行patch方法；更新dom props
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode){
        // 有旧vnode，没有新vnode，说明是卸载unmount 操作
        // 将container的dom清空
        // container.innerHTML = ''
        unmount(container._vnode)
      }
    }
    // 缓存上一次的vnode
    container._vnode = vnode
  }
  /**
   * 挂载或者更新dom
   * @param {vnode} n1 旧vnode
   * @param {vnode} n2 新vnode
   * @param {dom} container dom
   */
  function patch(n1, n2, container, anchor){
    // n1 第一次是空的，第二次有值从container中获取
    if(n1 && n1.type !== n2.type){
      // 如果有旧dom，新dom跟旧dom不一致；先卸载旧dom；vnode会在mountElement中通过vnode.el来挂载dom
      unmount(n1)
      n1 = null
    }
    const {type} = n2
    if(typeof type === 'string'){
      // 如果新节点的类型是字符串
      if(!n1){
        // 如果n1不存在，意味着挂载，调用mounteElement完成挂载
        mountElement(n2, container, anchor)
      } else {
        // n1存在意味着打补丁 更新
        patchElement(n1, n2)
      }
    } else if(typeof type === 'object'){
      // 如果n2.type 的值的类型是对象，则他描述的是组件
    } else if(type === Text){
      // 处理其他类型的vnode
      if(!n1){
        // 如果没有旧节点，则进行挂载
        const el = n2.el = createText(n2.children)
        insert(el, container)
      } else {
        // 如果旧vnode存在，只需要使用新文本节点的文本内容更新旧文本节点即可
        const el = n2.el = n1.el
        if(n2.children !== n1.children){
          setText(el, n2.children)
        }
      }
    } else if(type === Fragment){
      console.log('fragment')
      if(!n1){
        // 如果没有旧节点，遍历新节点挂载
        n2.children.forEach(c => patch(null, c, container))
      } else {
        patchChildren(n1,n2, container)
      }
    }
  }
  /**
   * 卸载vnode对应的dom
   * @param {vnode} vnode 需要卸载的vnode
   * @returns
   */
  function unmount(vnode){
    if(vnode.type === Fragment){
      vnode.children.forEach(function(c){
        unmount(c)
      })
      return
    }
    // 根据vnode获取真实的vnode节点
    const el = vnode.el
    // 获取el的父元素
    const parent = el.parentNode
    // 删除元素
    if(parent) parent.removeChild(el)
  }

  // 挂载dom
  function mountElement(vnode, container, anchor){
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
    insert(el, container, anchor)
  }
  // 更新子节点
  function patchChildren(n1, n2, container){
    if(typeof n2.children === 'string'){
      // 判断新子节点的类型 如果是文本节点
      if(Array.isArray(n1.children)){
        // 如果旧节点是数组，遍历卸载旧节点
        n1.children.forEach(c => {
          unmount(c)
        })
      }
      // 设置内容
      setElementText(container, n2.children)
    } else if(Array.isArray(n2.children)){
      // 如果新子节点是一组子节点
      if(Array.isArray(n1.children)){
        // 如果旧节点是一组节点
        // 说明 新旧子节点都是一组子节点，核心算法
        patchKeyedChildren(n1, n2, container)
      } else {
        // 旧子节点要么是文本子节点，要么不存在
        // 无论是哪种情况，我们都只需要清空容器，然后将新的一组子节点逐个挂载
        setElementText(container, '')
        n2.children.forEach(c => {
          patch(null, c, container)
        })
      }
    } else {
      // 代码运行到这里，说明新子节点不存在
      // 旧节点是一组子节点，只需要逐个卸载即可
      if(Array.isArray(n1.children)){
        n1.children.forEach(c => unmount(c))
      } else if(typeof n1.children === 'string'){
        setElementText(container, '')
      }
    }
  }
  // 更新element
  function patchElement(n1, n2){
    const el = n2.el = n1.el
    const oldProps = n1.props
    const newProps = n2.props
    // 更新props，或者新增属性
    for (const key in newProps) {
      if(newProps[key] !== oldProps[key]){
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }
    // 删除属性
    for (const key in oldProps) {
      if(!(key in newProps)){
        // 如果属性不存在于新属性上，进行删除操作
        patchProps(el, key, oldProps[key], null)
      }
    }
    // 更新children
    patchChildren(n1, n2, el)
  }
  // 复用节点
  function patchKeyedChildren(n1, n2, container){
    const oldChildren = n1.children
    const newChildren = n2.children
    // 四个索引值
    let oldStartIndex = 0
    let oldEndIndex = oldChildren.length -1
    let newStartIndex = 0
    let newEndIndex = newChildren.length - 1
    // 四个索引指向的vnode节点
    let oldStartNode = oldChildren[oldStartIndex]
    let oldEndNode = oldChildren[oldEndIndex]
    let newStartNode = newChildren[newStartIndex]
    let newEndNode = newChildren[newEndIndex]
    while(newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex){
      // 一个while循环中，执行的条件是 新旧节点 头部索引值小于等于尾部索引值
      if(newStartNode.key === oldStartIndex.key){
        // 第一步
        patch(oldStartNode, newStartNode, container)
        // 更新索引
        oldStartNode = oldChildren[++oldStartIndex]
        newStartNode = newChildren[--newStartIndex]
      } else if(newEndNode.key === oldEndNode.key){
        // 第二步
        // 由于比较的都是尾部节点，所以节点在新的顺序中仍然处于尾部，不需要移动
        // 需要打补丁
        patch(oldEndNode, newEndNode, container)
        oldEndNode = oldChildren[--oldEndIndex]
        newEndNode = newChildren[--newEndIndex]
      } else if(newEndNode.key === oldStartNode.key){
        // 第三步; 新节点在最后， 说明旧节点对应的dom需要放在旧节点组的最后一个节点后面
        // 调用patch函数
        patch(oldStartNode, newEndNode, container)
        insert(oldStartNode.el, container, oldEndNode.el.nextSibling)
        oldStartNode = oldChildren[++oldStartIndex]
        newEndNode = newChildren[--newEndIndex]
      } else if(newStartNode.key === oldEndNode.key){
        // 第四步 说明最后一个元素在新队列中是第一个
        patch(oldEndNode, newStartNode, container)
        // 将oldEndNode.el 移动到 oldEndStartNode.el 前面
        insert(oldEndNode.el, container, oldStartNode.el)
        // 移动DOM完成后，更新索引值
        oldEndIndex = oldEndIndex -1
        oldEndNode = oldChildren[oldEndIndex]
        newStartNode = newChildren[++newStartIndex]
      }
    }
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
  setText(el, text){
    el.nodeValue = text
  },
  createText(text){
    return document.createTextNode(text)
  },
  // 更新dom props 属性 事件
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
            // e.timestamp 是事件发生的时间
            // 如果事件发生的时间早于事件处理函数绑定的时间，则不执行时间处理函数
            if(e.timeStamp < invoker.attached) {
              return
            }
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
          // 添加invoker.attached属性，存储事件处理函数被绑定的时间, performance.now() 是高精时间
          invoker.attached = performance.now()
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
const bol = ref(true)


// <div><!-- 注释节点 -->我是文本节点</div>
effect(() => {
  const newNode = {
    type: 'ul',
    props: {
      onClick(){
        bol.value = !bol.value
      }
    },
    children: [
      {
        type: Fragment,
        children: bol.value ? [
          {
            type: 'li',
            key: 1,
            children: '1'
          },
          {
            type: 'li',
            key: 2,
            children: '2'
          },
          {
            type: 'li',
            key: 3,
            children: '3'
          },
        ] : [
          {
            type: 'li',
            key: 3,
            children: 'a'
          },
          {
            type: 'li',
            key: 1,
            children: 'b'
          },
          {
            type: 'li',
            key: 2,
            children: 'c'
          },
        ]
      }
    ]
  }
  render(newNode, container)
})