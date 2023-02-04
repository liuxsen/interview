import { effect, reactive, computed, watch } from ".";
import { jobQueue, flushJob } from './jobQueue'

const data = {
  num1: 1,
  num2: 2,
  name: '张三', label: '哈哈哈', color: 'red', flag: false,
}
const obj = reactive(data)
const container = document.getElementById('app')

// 嵌套关系demo
// effect(() => {
//   console.log('effectFn1 执行')
//   effect(() => {
//     container.style.color = obj.color
//     console.log('effectFn2 执行')
//   })
//   // 注意第一层的effect建立关系滞后，导致绑定的effect实际上时effectFn2
//   container.innerHTML = obj.name
// })

// obj.name = 'green'
// 1. 执行 effectFn1  
// 2. 执行effect2  activeEffect = effectFn1 读取obj.color 建立关系obj.color = effectFn2
// 3. 执行effectFn1 后面的代码；读取数据，建立关系，
// 因为在第二步修改了 activeEffect = effectFn1 导致此时建立的关系时effectFn2
// 4. 解决方法，使用函数栈

// // cleanup
// effect(() => {
//   console.log('执行副作用')
//   container.innerHTML = obj.flag ? obj.name : obj.label
// })
// obj.flag = true
// // 理想情况下，label的变化不应该执行副作用
// // 解决方法，在重新执行副作用函数执行之前，根据副作用函数找到依赖这个副作用函数的deps，在deps中删除副作用函数
// obj.label = 'label'

// // 调度执行
// effect(() => {
//   console.log(obj.color, obj.name)
// }, {
//   scheduler(fn){
//     console.log('执行副作用')
//     jobQueue.add(fn)
//     flushJob()
//   }
// })

// // 最后的结果是一样的，可是执行了三次，可以做优化
// // 方案： 使用任务队列控制函数执行
// obj.color = 'blue'
// obj.name = 'name'

// lazy
// 1. lazy模式下，effect返回值是 effectFn
// 2. effectFn的执行会建立关系
// 3. effectFn 的返回值是执行fn后的结果
// const effectFn = effect(function fn() {
//   return obj.name
// }, {
//   lazy: true
// })

// const value = effectFn()
// console.log(value)

// computed
// 1. 懒计算，只有读取computed返回值的value属性时，才会执行副作用函数
// const info = computed(() => {
//   console.log('执行computed')
//   return obj.num1 + obj.num2
// })

// console.log(info.value)
// console.log(info.value)
// console.log(info.value)
// obj.num1 = 2
// console.log(info.value)

// watch
// 观察一个响应式数据，当数据发生变化的时候执行相应的回调函数
watch(obj, () => {
  console.log('数据发生变化了')
})
obj.name = 'a'