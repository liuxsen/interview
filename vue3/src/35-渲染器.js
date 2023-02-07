const { effect, ref } = VueReactivity
// 渲染器函数
function renderer(domString, container){
  container.innerHTML = domString
}

let count = ref(1)
effect(() => {
  renderer(`<h1>${count.value}</h1>`, document.getElementById('app'))
})

count.value = 2