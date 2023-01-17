import { useQueryClient } from '@tanstack/react-query'
import { getPost } from '../apis/post'

export const usePreFetchPost = (id) => {
  const queryClient = useQueryClient()
  return queryClient.prefetchQuery({
    queryFn: () => getPost(id),
    queryKey: ['post', id]
  })
}