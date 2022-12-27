# 快速排序

[快速排序（Quicksort）的Javascript实现](https://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html)

"快速排序"的思想很简单，整个排序过程只需要三步

1. 在数据集之中，选择一个元素作为"基准"（pivot）。
2. 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
3. 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

```js
function quickSort(arr){
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

quickSort([13,4,3,6,123,11,44,44,66,66])

```