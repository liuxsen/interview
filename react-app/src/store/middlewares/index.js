import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

export const middlewares = [thunk, createLogger()]