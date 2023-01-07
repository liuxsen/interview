import { typeUserChangeUserInfo } from "../reducers/user";
import { genActionConst } from "./utils";


export const userActionConst = genActionConst('getUserInfo')

export const getUserInfo = id => dispatch => {
  dispatch({
    type: userActionConst.pre
  })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({name: '章三', id})
      // reject(new Error('信息错误'))
    }, 2000);
  }).then(res => {
    dispatch({
      type: userActionConst.success
    })
    dispatch({
      type: typeUserChangeUserInfo,
      payload: {
        ...res
      }
    })
  }).catch((error) => {
    dispatch({
      type: userActionConst.error,
      error
    })
  })
}