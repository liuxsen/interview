// ast => render 

import { defaultTagRE } from "./parseHTML"

/**
 * render () {
 *  return _c('div', {id: 'app'}, _v('hello'+_s(msg)),)
 * }
 */

function genProps(attrs){
  let str = ''
  for(let i =0; i<attrs.length;i++){
    let attr = attrs[i]
    if(attr.name === 'style'){
      // color: red; background: blue;
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str+=`${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren (children){
  if(children){
    return children.map(child => {
      return gen(child)
    }).join(',')
  }
}

function gen(ast){ // 3文本 1元素
  if(ast.type === 1){
    return generate(ast)
  } else {
    let text = ast.text
    if(!defaultTagRE.test(text)){
      return  `_v(${JSON.stringify(text)})`
    } else {
      let tokens = []
      let lastIndex = defaultTagRE.lastIndex = 0
      let match
      while(match = defaultTagRE.exec(text)){
        console.log('match', match)
        // ['{{msg}}', 'msg'] input: 'hello{{msg}}'
        const index = match.index
        if(index > lastIndex){
          tokens.push(JSON.stringify(text.slice(lastIndex, match.index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if(lastIndex < text.length){
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      console.log('tokens', tokens)
      return `_v(${tokens.join('+')})`
    }
    // console.log('gen-text:', text)
    // return 
  }
}

export function generate(ast){
  console.log('ast:', ast)
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}',${ast.attrs.length ? `${genProps(ast.attrs)}` : 'null'}, ${children ? children : 'null'})`
  // console.log(code)
  return code
}