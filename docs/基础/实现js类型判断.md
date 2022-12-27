# 实现js类型判断

```js
function isType(type){
  return function(obj){
    const res = Object.prototype.toString.call(obj)
    return res === `[object ${type}]`
  }
}

const isArray = isType('Array')
const isFunction = isType('Function')
const isNumber = isType('Number')
const isString = isType('String')
const isBoolean = isType('Boolean')

console.log(isArray([]))
console.log(isFunction(()=>{}))
console.log(isNumber(1))
console.log(isString(''))
console.log(isBoolean(false))
```