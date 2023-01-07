export const storeName = 'user'
export const typeUserChangeName = `${storeName}/changeName`
export const typeUserChangeUserInfo = `${storeName}/changeUserInfo`

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case typeUserChangeName:
      return {
        ...state,
        name: action.payload
      }
    case typeUserChangeUserInfo:
      return {
        ...state,
        ...action.payload
      }
    default:
      return {
        ...state
      }
  }
}