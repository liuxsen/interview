import { useState } from 'react'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from './queryclient'

import { usePosts } from './hooks/usePosts'
import { useAddPost } from './hooks/useAddPost'
import { usePost } from './hooks/usePost'


export const ReactQueryDemo = () => {
  return <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <DemoPage />
  </QueryClientProvider>
}

export const Demo = ({queryKey, onSetId}) => {
  // querykey 可以用来做重复请求排重
  const {isLoading, error, data} = usePosts()

  if(isLoading){
    return <div>loading</div>
  }
  if(error){
    return <div>error</div>
  }
  return <div>
    <ul>
      {
        data.map(post => {
          return <li key={post.id} onClick={() => onSetId(post.id)}>{post.title}</li>
        })
      }
    </ul>
  </div>
}

const DemoPage = ({children}) => {
  const [id, setId] = useState(null)
  return <div>
    {
      !id ? <Demo queryKey="post" onSetId={(id) => setId(id)}/> : <Post onClearId={() => setId(null)} id={id}></Post>
    }
    <AddPost/>
  </div>
}

const Post = ({id, onClearId}) => {
  const {isLoading, data} = usePost(id)
  return <div>
    <div>{isLoading ? `fetch post detail with id = ${id}` : ''}</div>
    {!isLoading && <div>title: {data && data.title}</div>}
    <button onClick={() => onClearId()}>clear id</button>
  </div>
}

const AddPost = () => {
  const { mutate, isLoading, isSuccess } = useAddPost()
  return <div>
    {isLoading ? 'loading' : ''}
    {isSuccess ? 'add success ' : ''}
    <button onClick={() => mutate({id: 'new id', title: 'new post'})}>add post</button>
  </div>
}