export const getUserAction = (time) => {
  return {
    types: ['pre', 'pending', 'fail'],
    promise: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            user: {
              name: 'xxx'
            }
          })
        }, time);
      })
    }
  }
}