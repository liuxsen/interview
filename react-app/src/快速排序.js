function quickSort(arr){
  console.log('sort')
  if(arr.length <= 1){
    return arr
  }
  let baseIndex = Math.floor(arr.length / 2)
  let base = arr.splice(baseIndex, 1)[0]
  let left = []
  let right = []
  for(let i =0; i< arr.length; i++){
    if(arr[i] < base){
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  // 3. 递归
  return quickSort(left).concat([base], quickSort(right))
}

const arr = quickSort([13,4,3,6,123,11,44,44,66,66])
console.log(arr)