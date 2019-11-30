const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const post = require('../models/post')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)


describe('REST api get test', () => {
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })
  test('posts are returned as json', async () => {
    await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test(`there are ${helper.initialposts.length} posts`, async () => {
    const response = await api.get('/api/posts')
  
    expect(response.body.length).toBe(helper.initialposts.length)
  })
})

describe('REST api format test', () => {
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })
  test('id in first post is defined', async () => {
    const response = await api.get('/api/posts')
  
    expect(response.body[0].id).toBeDefined()
  })
})

describe('REST api POST method test', () => {
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })
  const newpost = {
    title: 'kalevi making async call',
    author: 'kalevi',
    url: 'www.kalevi.org',
    likes: 13
  }

  test('posts length check after adding post', async () => {
    await api
      .post('/api/posts')
      .send(newpost)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const postsAtEnd = await helper.postsInDb()
    expect(postsAtEnd.length).toBe(helper.initialposts.length + 1)
  })

  test('read title from added valid post', async () => {
    await api
      .post('/api/posts')
      .send(newpost)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
  
    const postsAtEnd = await helper.postsInDb()  
    const contents = postsAtEnd.map(n => n.title)
    expect(contents).toContain(
      newpost.title
    )
  })

  test('post post without likes', async () => {
    const postWoLikes = {
      title: 'kalevi making async call',
      author: 'kalevi',
      url: 'www.kalevi.org',
    }

    await api
      .post('/api/posts')
      .send(postWoLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
  
    const postsAtEnd = await helper.postsInDb()  
    const lastpost = postsAtEnd[postsAtEnd.length - 1]

    expect(lastpost.likes).toBeDefined()
    expect(lastpost.likes).toBe(0)
  })

  test('post post with no title', async () => {
    const postWoLikes = { author: 'kalevi', url: 'www.kalevi.org' }

    await api
      .post('/api/posts')
      .send(postWoLikes)
      .expect(400)
  })

  test('post post with no url', async () => {
    const postWoLikes = { title: 'kalevi making async call', author: 'kalevi' }

    await api
      .post('/api/posts')
      .send(postWoLikes)
      .expect(400)
  })
})

describe('REST api DELETE request', () => {
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })

  test('remove first post', async () => {
    let posts = await helper.postsInDb() 
    await api
      .delete('/api/posts/' + posts[0].id)
      .expect(204)
    
    let postsAtEnd = await helper.postsInDb()
    let postsAtEndId = postsAtEnd.map(b => b.id)
    expect(postsAtEndId).not.toContain(posts[0].id)
  })
})

describe('REST api PUT request', () => {
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })
  beforeEach(async () => {
    await post.remove({})
  
    for (let post of helper.initialposts) {
      let postObject = new post(post)
      await postObject.save()
    }
  })
  test('update first posts likes', async () => {
    let posts = await helper.postsInDb() 
    await api
      .put('/api/posts/' + posts[0].id)
      .send({ likes: posts[0].likes + 1 })
      .expect(200)
    
    let postsAtEnd = await helper.postsInDb()
    let postsAtEndId = postsAtEnd.map(b => b.likes)
    expect(postsAtEndId[0]).toBe(posts[0].likes + 1)
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
      username: 'matnyka',
      name: 'Matti Nykanen',
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