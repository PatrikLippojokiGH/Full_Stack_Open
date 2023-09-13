import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const createNew = newBlog => {
  const headers = { 'Authorization': token }
  const request = axios.post(baseUrl, newBlog, { headers })
  return request.then(response => response.data)
}

const updateBlog = updatedBlog => {
  const headers = { 'Authorization': token }
  const urlWithID = `${baseUrl}/${updatedBlog.id}`
  const request = axios.put(urlWithID, updatedBlog, { headers })
  return request.then(response => response.data)
}

const deleteBlog = blogToDelete => {
  const headers = { 'Authorization': token }
  const urlWithID = `${baseUrl}/${blogToDelete.id}`
  const request = axios.delete(urlWithID, { headers })
  return request.then(response => response.data)
}

export default { getAll, setToken, createNew, updateBlog, deleteBlog }