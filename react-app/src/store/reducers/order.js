export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case 'order/add':
      return {
        ...state,
        list: [
          ...state.list,
          action.payload
        ]
      }
    default:
      return {
        list: []
      }
  }
}