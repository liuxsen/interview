import { useQuery } from "@tanstack/react-query"
import { getPost } from "./apis/post"

export const Post = ({id, onChangId}) => {
  const {isLoading, isError, error, data: post} = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id)
  })
  if(isLoading){
    return <div>isLoading post</div>
  }
  return <div>
    post id: {id}
    <div>
      title: {post.title}
      <button onClick={() => onChangId(null)}>返回</button>
    </div>
    </div>
}