const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
/*const User = require('../models/user')*/
const middleware = require('../utils/middleware')

const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  // console.log("getting blogs")
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id:1})
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title, author, url, 
    likes: likes ? likes : 0
  })

  /*if (body.title === undefined || body.url === undefined) {
    response.status(400).end()
  }*/
  
  const user = request.user
  logger.info(user)

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  blog.user = user._id  

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  
  const user = request.user
  const blogToBeRemoved = await Blog.findById(request.params.id)

  console.log(user.id.toString())
  console.log(blogToBeRemoved.user.toString())

  if (blogToBeRemoved.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'invalid authorization' })
  }

  
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, url, author, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,  { title, url, author, likes }, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter