// fiber 架构，可以在浏览器空闲时间执行render； requesetidle
// 工作单元
// requestIdleCallback()
// requestIdleCallback((deadline) => {
//   // deadline.timeRemaining() 获取剩余时间 react使用的是自己的实现
// })

let nextUnitOfWork = null

function perforUnitWork (fiber){
  // 执行任务单元
  // reactElement 转化成真实DOM
  // return 下一个任务单元
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }
  if(fiber.parent){
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // 为当前的fiber创造它子节点的fiber
  // parent child sibling
  const elements = fiber?.props?.children
  let prevSibling = null;
  elements.forEach((childrenElement, index) => {
    const newFiber = {
      parent: fiber,
      props: childrenElement.props,
      type: childrenElement.type,
      dom: null
    }
    if(index === 0){
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  })
  if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
  return nextFiber
}

function workLoop(deadline){
  // 1.是否有空余时间
  // 2.是否有下一个任务单元
  // 3.执行工作单元
  // 继续判断1.
  let shouldWork = true
  // const time = deadline.timeRemaining()
  // console.log(time)

  // 是否有下一个任务单元&&是否应该执行工作
  while(nextUnitOfWork && shouldWork){
    nextUnitOfWork = perforUnitWork(nextUnitOfWork)
    shouldWork = deadline.timeRemaining() > 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

export function render(
  element,
  container
){
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

function createDom (element){
  const dom = element.type === 'TEXT_ELEMENT'
  ? document.createTextNode('')
  : document.createElement(element.type)

  const isProperty = key => key !== 'children'

  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })
  return dom
}