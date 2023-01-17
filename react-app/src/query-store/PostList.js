import { useQueryClient } from "@tanstack/react-query"
import { getPost } from "./apis/post"
import { usePosts } from "./hooks/usePosts"

export const PostList = ({onChangId}) => {
  const {isLoading, error, data: posts} = usePosts()
  const queryClient = useQueryClient()
  if(isLoading) {
    return <div>fetch posts loading</div>
  }
  if(error){
    return <div>{JSON.stringify(error)}</div>
  }

  const onLoadPost = (id) => {
    queryClient.prefetchQuery({
      queryFn: () => getPost(id),
      queryKey: ['post', id]
    })
  }

  return <div>
    <h1>postlist 1</h1>
    <ul>
      {
        posts.map(item => {
          return <li
            // onMouseOver={ () => onLoadPost(item.id) }
            onClick={() => onChangId(item.id)}
            key={item.id}> {item.title}  </li>
        })
      }
    </ul>
  </div>
}