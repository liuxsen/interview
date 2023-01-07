export const loadingStatus = {
  request: 'REQUEST',
  success: 'SUCESS',
  error: 'ERROR'
}

export const loadingReducer = (state = {}, action) => {
  const {type, error} = action;
  const reg = /(.*)_(REQUEST|SUCESS|ERROR)/;
  const matches = reg.exec(type);
  if(!matches) return {
    ...state
  }
  const requestName = matches[1]
  const matchStatus = matches[2]
  const isLoading = matchStatus === 'REQUEST'
  const isError = matchStatus === 'ERROR'
  const errorKey = `${requestName}_ERROR`
  return {
    ...state,
    [requestName]: isLoading,
    [errorKey]: isError ? error : null
  }
}