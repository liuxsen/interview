export const HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

// 策略模式

let starts = {}
starts.data = function(parentVal, childVal){
  return childVal
}
starts.computed = function(){}
starts.watch = function(){}
starts.methods = function(){}

HOOKS.forEach(hook => {
  starts[hook] = mergeHook
})

function mergeHook(parentValue, childValue){
  // created: [a,b,c], watch: [a,b]
  if(childValue){
    if(parentValue){
      return parentValue.concat([childValue])
    } else {
      return [childValue]
    }
  } else {
    return parentValue
  }
}

export function mergeOptions (parent, child){
  // child: {created: function a() {}}
  // parent: {}
  console.log(parent, child)
  let options = {}
  for(let key in parent){
    mergeField(key)
  }
  for(let key in child){
    mergeField(key)
  }
  function mergeField(key){
    if(starts[key]){
      options[key] = starts[key](parent[key], child[key])
    } else {
      options[key] = child[key]
    }
  }
  // console.log(options)
  return options
}