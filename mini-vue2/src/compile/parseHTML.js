

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 标签名 <sapn:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>")); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// <div id="app"></div>
const startTagClose = /^\s*(\/?)>/; //匹配标签结束的 >
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配大括号{{}}
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

// 创建ast语法树
function createAstElement (tag, attrs) {
  return {
    tag,
    attrs,
    children: [],
    type: 1,
    parent: null
  }
}

let root; // 跟元素
let createParent; // 当前元素的父亲
// 数据结构 栈
let stack = []
// [div,h1, ]
function start (tag, attrs){
  // console.log('start:', tagName, attrs)
  let element = createAstElement(tag, attrs)
  if(!root){
    root = element
  }
  createParent = element
  stack.push(element)
}
// 获取文本
function charts (text){
  console.log('text:', text)
  // 删除空格
  text = text.replace(/\s/g, '')
  if(text){
    createParent.children.push({
      type: 3,
      text
    })
  }
}

function end(tag){
  // console.log('end-tag:', tag)
  // 出栈
  let element = stack.pop()
  createParent = stack[stack.length - 1]
  if(createParent){
    element.parent = createParent.tag
    createParent.children.push(element)
  }
}


// <div id="app">hello {{msg}}<h1 id="h1"></h1></div>
/**
 * {
 * tag: 'div',
 * attrs: [{id: 'app'}],
 * children: [{tag: null, text: 'hello'},
 * {
 *  tag: 'h1',
 *  attrs: [{id: 'h1'}]
 * }]
 * }
 */
// 遍历html字符串，逐次删除
export function parseHTML (html){
  // 开始标签 文本 结束标签
  // <div id="app">hello {{msg}}<h1 id="h1"></h1></div>
  while (html) {
    let textEnd = html.indexOf('<') // 0
    if(textEnd === 0){ // 开始或者结束标签
      // 1. 开始标签
      const startTagMatch = parseStartTag() // 开始标签的内容
      // console.log('startTagMatch', startTagMatch)
      if(startTagMatch){
        start(startTagMatch.tag, startTagMatch.attrs)
        continue;
      }
      // 结束标签
      let endTagMatch = html.match(endTag)
      if(endTagMatch){
        advance(endTagMatch[0].length)
        // console.log('endTagMatch', endTagMatch)
        // ['</div>', 'div']
        end(endTagMatch[1])
        continue;
      }
    }
    // 文本 ` hello {{msg}}</div>`
    if(textEnd > 0){
      // console.log(textEnd)
      let text = html.substring(0, textEnd)
      // text: hello {{msg}}
      // console.log('text:', text)
      charts(text)
      if(text){
        advance(text.length)
      }
    }
  }

  function parseStartTag (){
    const start = html.match(startTagOpen)
    if(!start) return
    // ['<div', 'div']
    // console.log(start)
    let match = {
      tag: start[1],
      attrs: []
    }
    // 删除开始标签
    advance(start[0].length)
    // 多个属性，遍历
    let attr
    let end
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      // console.log(attr)
      // attr: [' id=\"app\"', "id", "=", "app"]
      match.attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5]
      })
      advance(attr[0].length)
      // break;
    }
    if(end){
      // console.log('end:', end)
      // ['>', '']
      advance(end[0].length)
    }
    // console.log(match)
    return match
  }
  function advance(length){
    html = html.substring(length)
    // console.log('end: html', html)
  }
  // console.log('root:', root)
  return root
}