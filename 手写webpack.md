# 手写webpack

## 原理

```js
// 返回一个自执行函数，传入文件依赖
(function(list){
  function require(file){
    // 提供exports对象
    var exports = {};
    (function(exports, code){
      eval(code)
    })(
      exports,
      list[file]
    );
    return exports
  }
  // 执行入口文件
  require('index.js')
  })(
    // 文件依赖
    {
      'add.js': `exports.default = function add(a, b) {return a + b}`,
      'index.js': `const add = require('add.js').default
                  const total = add(1,2)
                  console.log(total)
                `
    }
)
```

## webpack bundle逻辑 实现

```js
const fs = require('fs')
const path = require('path')

const parser = require('@babel/parser')
// 分析有哪些import
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')


/**
 * 分析单独模块
 * @param {string} file
 */
function getModuleInfo(file){
  const body = fs.readFileSync(file, 'utf-8')
  // console.log('body:', body)
  // 分析有哪些import 项
    // 转换ast语法树
    // 编译过程： 代码str => 对象 => 对象遍历解析
    const ast = parser.parse(body, {
      sourceType: 'module' // es6
    })
    const deps = {}
    // console.log(ast)
    traverse(ast, {
      ImportDeclaration({node}){
        // 遇到import节点的时候，会触发
        // console.log('import ', node)
        const dirname = path.dirname(file)
        const absPath = './' + path.join(dirname, node.source.value)
        // console.log(absPath)
        deps[node.source.value] = absPath
      }
    })
  // es6 => es5
  const {code} = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })
  const moduleInfo = {
    file,
    deps,
    code
  }
  return moduleInfo
}

// const info = getModuleInfo('./src/index.js')
// console.log('info ', info)


/**
 * 解析模块
 * file 入口文件
 */
function parseModules(file) {
  const entry = getModuleInfo(file)
  const temp = [entry]
  const depsGraph = {} // 最后输出依赖图

  getDeps(temp, entry)

  temp.forEach(info => {
    depsGraph[info.file] = {
      deps: info.deps,
      code: info.code,
    }
  })
  return depsGraph
}

/**
 * 获取依赖
 */
function getDeps(temp, {deps}){
  Object.keys(deps).forEach(key => {
    const child = getModuleInfo(deps[key])
    temp.push(child)
    getDeps(temp, child)
  })
}

// const content = parseModules('./src/index.js')

// console.log('content ', content)

function bundle(file){
  const depsGraph = JSON.stringify(parseModules(file))
  return `
    (function(graph){
      function require(file){
        function absRequire(relPath){
          return require(graph[file].deps[relPath])
        }
        var exports = {};
        (function(require, exports, code){
            eval(code)
        })(absRequire, exports, graph[file].code)
        return exports
      }
      require('${file}')
    })(${depsGraph})
  `
}

const content = bundle('./src/index.js')

console.log(content)

!fs.existsSync('./dist') && fs.mkdirSync('./dist')

fs.writeFileSync('./dist/bundle.js', content)
```

