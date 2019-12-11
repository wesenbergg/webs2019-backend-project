const otherRouter = require('express').Router()
const path = require('path')


otherRouter.get('/', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/users', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/about', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/posts', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/signup', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/users/u/:id', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/posts/p/:id', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/users/profile', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/users/profile/edit', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/posts/new', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})

otherRouter.get('/signin', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'))
})


module.exports = otherRouter