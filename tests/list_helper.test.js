const listHelper = require('../utils/list_helper')

const listWithOnepost = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const posts = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://post.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://post.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://post.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const posts = []

  const result = listHelper.dummy(posts)
  expect(result).toBe(1)
})

describe('total likes', () => {
    
  test('when list has only one post equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOnepost)
    expect(result).toBe(5)
  })

  test('when list has many posts equals the likes of that', () => {
    const result = listHelper.totalLikes(posts)
    expect(result).toBe(36)
  })
})

describe('favorite post', () => {
   
  test('when list has none post, equals the favorite of that', () => {
    const result = listHelper.favoritepost([])
    expect(result).toEqual({})
  })

  test('when list has only one post, equals the favorite of that', () => {
    const result = listHelper.favoritepost(listWithOnepost)
    expect(result).toEqual({
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    })
  })
  
  test('when list has many posts equals, the favorite of that', () => {
    const result = listHelper.favoritepost(posts)
    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })
  })
})

describe('most posts', () => {
   
  test('when list has none post, equals the most posts of that', () => {
    const result = listHelper.mostposts([])
    expect(result).toEqual({})
  })
  
  test('when list has only one post, equals the most posts of that', () => {
    const result = listHelper.mostposts(listWithOnepost)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      posts: 1
    })
  })
    
  test('when list has many posts equals, the most posts of that', () => {
    const result = listHelper.mostposts(posts)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      posts: 3
    })
  })
})

describe('most likes by postger', () => {
   
  test('when list has none post, equals the most likes of that', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })
    
  test('when list has only one post, equals the most likes of that', () => {
    const result = listHelper.mostLikes(listWithOnepost)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })
      
  test('when list has many posts equals, the most likes of that', () => {
    const result = listHelper.mostLikes(posts)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})