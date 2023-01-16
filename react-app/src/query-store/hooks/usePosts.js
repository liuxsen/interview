import {useQuery} from 'react-query'
import { getAllPosts } from '../db'
export const usePosts = () => {
  return useQuery('posts', () => getAllPosts())
}