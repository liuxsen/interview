// deepClone

export function deepClone(obj){
  if(typeof obj === 'object'){
    if(obj instanceof Date){
      return new Date(obj)
    }
    if(obj instanceof RegExp){
      return new RegExp(obj)
    }
    let res = {}
    if(obj instanceof Array){
      res = []
    }
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        // 这里做了深层copy
        res[key] = deepClone(element)
        // 这里是浅copy
        // res[key] = element
      }
    }
    return res
  } else {
    return obj
  }
}


var obj = {a: '1', b: {name: 'name'}}
const cloneObj = deepClone(obj)
console.log(obj.b === cloneObj.b)

const arr = [{a: 'a', b: {name: 'name'}}]
const cloneArr = deepClone(arr)
console.log(arr[0] === cloneArr[0])