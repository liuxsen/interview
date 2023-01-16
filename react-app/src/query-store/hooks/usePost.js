import {useQuery} from 'react-query'
import { getPostWithId } from '../db'

export const usePost = (id) => {
  return useQuery(['postdetail', id], () => getPostWithId(id))
}