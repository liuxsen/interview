import { useQuery } from "@tanstack/react-query"
import { getPosts } from "./apis/posts"
import { keyPosts } from "./querykey"

export const PostList2 = () => {
  // const {isLoading, error, data: posts} = usePosts()
  const {isLoading, error, data: posts} = useQuery({
    queryKey: [keyPosts, {page: 1, limit: 2}],
    queryFn: () => getPosts({params: {_page: 1, _limit: 2}})
  })
  if(isLoading) {
    return <div>fetch posts loading</div>
  }
  if(error){
    return <div>{JSON.stringify(error)}</div>
  }
  return <div>
    <h1>postlist 2</h1>
    <ul>
      {
        posts.map(item => {
          return <li key={item.id}> {item.title}  </li>
        })
      }
    </ul>
  </div>
}