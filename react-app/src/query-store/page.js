import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export const PageDemo = () => {
  const [page, setPage] = useState(0)
  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
    keepPreviousData : true
  })
  return <div>
    {isLoading && <div>isLoading</div>}
    <div>current page {page}</div>
    <div>----</div>
    <div>page {data && data.page}</div>
    <div>page {data && data.count}</div>
    <div>----</div>
    <button onClick={() => {setPage(page -1)}}>pre</button>
    <button onClick={() => {setPage(page +1)}}>next</button>
  </div>
}

const fetchProjects = (page) => {
  console.log('trigger fetch projects')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        page,
        count: Math.random()
      })
    }, 2000);
  })
}