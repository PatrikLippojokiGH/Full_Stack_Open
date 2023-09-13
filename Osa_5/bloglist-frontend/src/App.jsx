import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null) // Virheviesti
  const [messageStyle, setStyle] = useState(null) // Virheviestin tyyli


  useEffect(() => {  // Kun sivulle tullaan, tarkastetaan local storage
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {  // Kun sivulle tullaa, tarkastetaan local storage
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      console.log('logging in with', user.name)

      setMessage(`Logged in as ${user.username}`)
      setStyle('message')
      setTimeout(() => {
        setMessage(null)
        setStyle(null)
      }, 5000)

    } catch (exception) {
      setMessage('wrong credentials')
      setStyle('error')
      setTimeout(() => {
        setMessage(null)
        setStyle(null)
      }, 5000)
    }
  }

  const logOut = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

    setMessage('logged out')
    setStyle('change')
    setTimeout(() => {
      setMessage(null)
      setStyle(null)
    }, 5000)

  }

  const handleCreation = async (blogObject) => {
    try {
      const newBlog = await blogService.createNew(blogObject)
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs)

      createBlogFormRef.current.toggleVisibility()

      setMessage(`new blog ${newBlog.title} created!`)
      setStyle('message')
      setTimeout(() => {
        setMessage(null)
        setStyle(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage('creation failed')
      setStyle('error')
      setTimeout(() => {
        setMessage(null)
        setStyle(null)
      }, 5000)
    }
  }

  const handleLike = async (blogObject) => {
    try {
      const likedBlog = await blogService.updateBlog(blogObject)
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs)

      setMessage(`${likedBlog.title} got a like!`)
      setStyle('message')
      setTimeout(() => {
        setMessage(null)
        setStyle(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage('like failed')
      setStyle('error')
      setTimeout(() => {
        setMessage(null)
        setStyle(null)
      }, 5000)
    }
  }

  const handleDelete = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title}`)) {
      try {
        await blogService.deleteBlog(blogObject)
        const allBlogs = await blogService.getAll()
        setBlogs(allBlogs)

        setMessage('Blog removed succesfully!')
        setStyle('message')
        setTimeout(() => {
          setMessage(null)
          setStyle(null)
        }, 5000)
      } catch (exception) {
        console.log(exception)
        setMessage('Blog removal failed')
        setStyle('error')
        setTimeout(() => {
          setMessage(null)
          setStyle(null)
        }, 5000)
      }
    }
  }

  const createBlogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} style={messageStyle}/>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} style={messageStyle}/>

      <p>{user.name} logged in<button onClick={logOut}>logout</button></p>

      <Togglable buttonLabelShow="create new blog" buttonLabelHide="cancel" ref={createBlogFormRef}>
        <CreateBlogForm createBlog={handleCreation} />
      </Togglable>

      {// blogs.filter(blog => blog.user.username === user.username) // Otetaan kaikkien blogien joukosta käyttäjän blogit *** Ilmeisesti kaikkien blogien tuleekin näkyä
        blogs.sort((blogA, blogB) => { // Likejen mukainen suuruusjärjestys
          if(blogA.likes > blogB.likes) {
            return -1
          } else if (blogA.likes < blogB.likes) {
            return 1
          }
          return 0
        })
          .map(blog => // Lopuksi näytetään blogit
            <Blog key={blog.id} blog={blog} loggedUser={user} likeBlog={handleLike} deleteBlog={handleDelete}/>
          )}
    </div>
  )

}

export default App