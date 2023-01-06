export const userReducer = (state, action) => {
  // init: console.log('Reducer is called with args', args) [undefined, {type: '@reudx/Init'}]
  if(typeof state === 'undefined'){
    return {}
  }
  switch (action.type) {
    case 'user/changeName':
      return {
        ...state,
        name: action.payload
      }
    case 'user/pre': 
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'user/success': 
      return {
        ...state,
        loading: false,
        error: null,
        userInfo: action.user
      }
    case 'user/fail': 
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}