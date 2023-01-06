
export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        orderNum: action.orderNum + 1
      }
    default:
      return {
        ...state,
        orderNum: 1
      }
  }
}