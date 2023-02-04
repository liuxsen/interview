import { useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools} from '@tanstack/react-query-devtools'
import { PostList } from "./PostList"
import { PostList2 } from './PostList2'
import { Post } from './Post'
import { PageDemo } from './page'
const queryClient = new QueryClient({
  // defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
})

export const ReactQueryDemo = () => {
  return <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools/>
    {/* <Demo/> */}
    <PageDemo/>
  </QueryClientProvider>
}

export const Demo = () => {
  const [index, setIndex] = useState(0)
  const [postId, setPostId] = useState(null)
  // const [PostlistComponent, setComponent] = useState(<PostList/>)
  const onChangeComponent = (index) => {
    setIndex(index)
  }
  return <div>
    <div>
      <button onClick={() => {onChangeComponent(0)}}>postlist 1</button>
      <button onClick={() => {onChangeComponent(1)}}>postlist 2</button>
    </div>
    {!postId && index === 0 && <PostList onChangId={(id) => {setPostId(id)}}/>}
    {!postId && index === 1 && <PostList2 onChangId={(id) => {setPostId(id)}}/>}
    {postId && <Post id={postId} onChangId={(id) => {setPostId(id)}}/>}
  </div>
}