import { useState } from 'react'

const Blog = ({ blog, loggedUser, likeBlog, deleteBlog }) => {

  const [state, setState] = useState(false) // False state = simple, True state = all

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleState = () => {
    setState(!state)
  }

  const like = (event) => {
    event.preventDefault()
    const likes = blog.likes + 1
    likeBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes : likes
    })
  }

  const remove = (event) => {
    event.preventDefault()
    deleteBlog({
      id: blog.id,
      title: blog.title
    })
  }

  if (!state) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleState}>view</button>
        </div>
      </div>
    )}

  if (blog.user.name === loggedUser.name){
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleState}>hide</button>
          <div>
            {blog.url}
          </div>
          <div>
            {blog.likes} <button onClick={like}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
        </div>
        <div>
          <button onClick={remove}>remove</button>
        </div>
      </div>
    )}

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleState}>hide</button>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes} <button onClick={like}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
      </div>
    </div>
  )}

export default Blog