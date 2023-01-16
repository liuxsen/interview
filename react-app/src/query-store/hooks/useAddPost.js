import { useMutation } from 'react-query'
import { addPost } from '../db'
import { queryClient } from '../queryclient'

export const useAddPost = () => {
  return useMutation('add-post', (post) => addPost(post), {
    onSuccess: () => {
      fetchQuery('posts')
    }
  })
}

const fetchQuery = (queryKey) => {
  const queries = queryClient.queryCache.queries
  console.log(queries)
  const keys = queries && queries.map(item => {
    return item.queryKey
  }) || []
  if(keys.indexOf(queryKey) > -1){
    queryClient.fetchQuery(queryKey)
  }
}