const post = require('../models/post')
const User = require('../models/user')

const initialposts = [
  {
    title: 'Ketulla on kaksi hantaa',
    author: 'Miina',
    url: 'www.kettur.org',
    likes: 1,
    id: '5dc89961ea32f7219875c691'
  },
  {
    title: 'Mein leif',
    author: 'Adolfiina Hitleriina',
    url: 'www.elamamkoulum.org',
    likes: -1,
    id: '5dc89c8c1ed8974be0d7bacf'
  }
]

const nonExistingId = async () => {
  const post = new post({ title: 'willremovethissoon' })
  await post.save()
  await post.remove()

  return post._id.toString()
}

const postsInDb = async () => {
  const notes = await post.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialposts, nonExistingId, postsInDb, usersInDb
}