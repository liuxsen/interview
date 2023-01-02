import { generate } from './generate'
import {parseHTML} from './parseHTML'

export function compileToFuntion(html){
  console.log('compile-html:',html)
  let ast = parseHTML(html)
  // console.log(ast)
  const code = generate(ast)
  // 将render字符串变成函数
  // _c(div,{id:"app",class:"container",style:{"color":" red"," background":" blue"}}, _v("hello"+_s(msg)+_s(name)+"你好"),_c(h1,null, _v("aa")))
  let render = new Function(`with(this){return ${code}}`)
  // console.log(render)
  return render
}

