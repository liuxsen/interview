export const jobQueue = new Set()
const p = Promise.resolve()
let isFlushing = false

export const flushJob = () => {
  console.log(jobQueue)
  if(isFlushing) return
  isFlushing = true
  p.then(() => {
    jobQueue.forEach(job => job())
    jobQueue.clear()
  })
  .finally(() => {
    isFlushing = false
  })
}