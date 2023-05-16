const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


describe('When there is initially some blogs saved', () => {  
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have the correct id field', async () => {
    const blogs = await helper.blogsInDb()
  
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    });
  })

  describe('addition of a new blog', () => {

    test('a valid blog can be added', async () => {
        
        const newBlog = {
            title: "To Be Added",
            author: "Test Author",
            url: "http://testing-only.com",
            likes: 99,
          }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
      
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
          "To Be Added"
        )
    })

    test('a blog has 0 likes by default', async () => {
        const newBlog = {
            title: "To Be Added",
            author: "Test Author",
            url: "http://testing-only.com",
          }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
      
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBeDefined()
        expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBe(0)
        expect(blogsAtEnd[blogsAtEnd.length-1].author).toEqual("Test Author")
    })
    
    
    test('no title or url results in 400 Bad Request', async () => {
        const blogWithNoTitle = {
            author: "Test Author",
            url: "http://testing-only.com",
            likes: 99,
          }
    
        const blogWithNoUrl = {        
            title: "To Be Added",
            author: "Test Author",
            likes: 99,
          }
      
        await api
          .post('/api/blogs')
          .send(blogWithNoTitle)
          .expect(400)
    
          await api
          .post('/api/blogs')
          .send(blogWithNoUrl)
          .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
  
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
  
        const blogsAtEnd = await helper.blogsInDb()
  
        expect(blogsAtEnd).toHaveLength(
          helper.initialBlogs.length - 1
        )
  
        const titles = blogsAtEnd.map(r => r.title)
  
        expect(titles).not.toContain(blogToDelete.title)
      })
  })
  describe('editing of a blog', () => {
    test('changes the values of an existing blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToEdit = blogsAtStart[0]

        const editedBlog = {
          title: "Edited title",
          author: "Edited Author",
          url: "http://this-was-edited.com",
          likes: 1234,
        }
  
        await api
          .put(`/api/blogs/${blogToEdit.id}`)
          .send(editedBlog)
  
        const blogsAtEnd = await helper.blogsInDb()
        const allLikes = blogsAtEnd.map(blog => blog.likes)
  
        expect(allLikes).toContain(1234)
      })
  })
})






  




  

afterAll(async () => {
  await mongoose.connection.close()
})