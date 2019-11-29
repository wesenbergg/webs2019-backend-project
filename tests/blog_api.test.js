const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)


describe('REST api get test', () => {
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test(`there are ${helper.initialBlogs.length} blogs`, async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })
})

describe('REST api format test', () => {
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('id in first blog is defined', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body[0].id).toBeDefined()
  })
})

describe('REST api POST method test', () => {
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  const newBlog = {
    title: 'kalevi making async call',
    author: 'kalevi',
    url: 'www.kalevi.org',
    likes: 13
  }

  test('blogs length check after adding blog', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
  })

  test('read title from added valid blog', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
  
    const blogsAtEnd = await helper.blogsInDb()  
    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
      newBlog.title
    )
  })

  test('post blog without likes', async () => {
    const blogWoLikes = {
      title: 'kalevi making async call',
      author: 'kalevi',
      url: 'www.kalevi.org',
    }

    await api
      .post('/api/blogs')
      .send(blogWoLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
  
    const blogsAtEnd = await helper.blogsInDb()  
    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]

    expect(lastBlog.likes).toBeDefined()
    expect(lastBlog.likes).toBe(0)
  })

  test('post blog with no title', async () => {
    const blogWoLikes = { author: 'kalevi', url: 'www.kalevi.org' }

    await api
      .post('/api/blogs')
      .send(blogWoLikes)
      .expect(400)
  })

  test('post blog with no url', async () => {
    const blogWoLikes = { title: 'kalevi making async call', author: 'kalevi' }

    await api
      .post('/api/blogs')
      .send(blogWoLikes)
      .expect(400)
  })
})

describe('REST api DELETE request', () => {
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('remove first blog', async () => {
    let blogs = await helper.blogsInDb() 
    await api
      .delete('/api/blogs/' + blogs[0].id)
      .expect(204)
    
    let blogsAtEnd = await helper.blogsInDb()
    let blogsAtEndId = blogsAtEnd.map(b => b.id)
    expect(blogsAtEndId).not.toContain(blogs[0].id)
  })
})

describe('REST api PUT request', () => {
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  beforeEach(async () => {
    await Blog.remove({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('update first blogs likes', async () => {
    let blogs = await helper.blogsInDb() 
    await api
      .put('/api/blogs/' + blogs[0].id)
      .send({ likes: blogs[0].likes + 1 })
      .expect(200)
    
    let blogsAtEnd = await helper.blogsInDb()
    let blogsAtEndId = blogsAtEnd.map(b => b.likes)
    expect(blogsAtEndId[0]).toBe(blogs[0].likes + 1)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', name: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with too short username', async () => {
    const newUser = {
      username: 'ot',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')
  })

  test('creation fails with too short password', async () => {
    const newUser = {
      username: 'rooot',
      name: 'Superduperuser',
      password: '1',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid password')
  })
})

afterAll(async () => {
  mongoose.connection.close()
})