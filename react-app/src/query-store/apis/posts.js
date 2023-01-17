import axios from "axios"

// { params: { _sort: "title" }
export function getPosts(query = { params: { _sort: "title" }}) {
  return axios
    .get("http://localhost:3000/posts",  query )
    .then(res => res.data)
}