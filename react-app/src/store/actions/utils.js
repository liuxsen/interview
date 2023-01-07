import { loadingStatus } from "../reducers/loading"

export const genActionConst = (actionName) => {
  return {
    actionName,
    pre: `${actionName}_${loadingStatus.request}`,
    success: `${actionName}_${loadingStatus.success}`,
    error: `${actionName}_${loadingStatus.error}`,
  }
}