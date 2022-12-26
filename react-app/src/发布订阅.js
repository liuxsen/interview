class Emitter {
  constructor(){
    this.eventMap = {}
  }
  on(eventName, fn){
    if(!this.eventMap[eventName]){
      this.eventMap[eventName] = [fn]
    } else {
      this.eventMap[eventName].push(fn)
    }
  }
  emit(eventName, ...args){
    if(!this.eventMap[eventName]){
      return
    }
    this.eventMap[eventName].forEach(callback => {
      callback(...args)
    })
  }
}


const event = new Emitter()
event.on('click', (params) => {
  console.log('click1', params)
})
event.on('click', (params) => {
  console.log('click2', params)
})
event.on('pay', (params) => {
  console.log('pay', params)
})

event.emit('click', 'me')
event.emit('pay', '5')