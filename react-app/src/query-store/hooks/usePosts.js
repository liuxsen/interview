import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../apis/posts'
import { keyPost } from '../querykey'

export const usePosts = () => {
  return useQuery({
    queryKey: [keyPost],
    queryFn: getPosts
  })
}