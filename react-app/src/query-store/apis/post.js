import axios from "axios"

// { params: { _sort: "title" }
export function getPost(id) {
  return axios
    .get(`http://localhost:3000/posts/${id}`)
    .then(res => res.data)
}