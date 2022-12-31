const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export class MyPromise {
  constructor(fn){
    this.status = PENDING
    this.value = null
    this.fufilledCallbacks = []
    this.rejectedCallbacks = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    fn(this.resolve, this.reject)
  }
  resolve(val){
    if(this.status !== PENDING) return
    this.value = val
    this.status = FULFILLED
    // triger callbacks
    this.fufilledCallbacks.forEach(cb => {
      cb(this.value)
    })
  }
  reject(val){
    if(this.status !== PENDING) return
    this.value = val
    this.status = REJECTED
    this.rejectedCallbacks.forEach(cb => {
      cb(this.value)
    })
  }
  then(onFulfilled, onRejected){
    if(typeof onFulfilled !== 'function'){
      onFulfilled = (res) => {
        return res
      }
    }
    if(typeof onRejected !== 'function'){
      onRejected = (res) => {
        return res
      }
    }
    const promiseThen = new MyPromise((resolve, reject) => {
      // value
      const resolvePromise = cb => {
        setTimeout(() => {
          try {
            const result = cb(this.value)
            if(result instanceof MyPromise){
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (error) {
            reject(error)
            throw error
          }
        });
      }
      if(this.status === PENDING){
        this.fufilledCallbacks.push(onFulfilled)
        this.rejectedCallbacks.push(onRejected)
      }
      if(this.status === REJECTED){
        // onRejected(this.value)
        resolvePromise(onRejected)
      }
      if(this.status === FULFILLED){
        // onFulfilled(this.value)
        resolvePromise(onFulfilled)
      }
    })
    return promiseThen
  }
  static all(promises){
    let results = []
    let count = 0
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        results[index] = value
        count++
        if(count === promises.length) resolve(results)
      }
      promises.forEach((promise, index) => {
        if(promise instanceof MyPromise){
          promise.then(res => {
            addData(index, res)
          }, (reason) => {
            reject(reason)
          })
        } else {
          addData(index, promise)
        }
      })
    })
  }
}

// const p1 = new MyPromise((resolve, reject) => {
//     // reject('faild')
//     resolve('result')
// })
//   .then((val) => {
//     console.log('fulfilled:', val)
//     return 'p2'
//   }, (val) => {
//     console.log('rejected:', val)
//   })
//   .then(val => {
//     console.log('p2 result: ', val)
//   })
  // .then((val) => {

  // })
// console.log(p1)
// console.log(1)

// ========promise.reject=====

// const p1  = new MyPromise((resolve, reject) => {
//   reject('reject')
// })
//   .then(() => {}, (res) => {
//     console.log(res)
//   })


// ========MyPromise.all======
// const p1 = new MyPromise((resolve) => {
//   setTimeout(() => {
//     resolve(1)
//   },1000);
// })
// const p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(2)
//   });
// })

// MyPromise.all([p1, p2])
//   .then(res => {
//     console.log(res)
//   }, (reason) => {
//     console.log(reason)
//   })
// result: 2


// const p1 = new MyPromise((resolve) => {
//     setTimeout(() => {
//       resolve(1)
//     },1000);
//   })
//   const p2 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(2)
//     });
//   })
//   MyPromise.all([p1, p2])
//     .then(res => {
//       console.log(res)
//     }, (reason) => {
//       console.log(reason)
//     })
// result: 1,2