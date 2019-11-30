const jwt = require('jsonwebtoken')
const postRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')

postRouter.get('/', async (request, response, next) => {
  try {
    const posts = await Post.find({}).populate('user', { posts: 0 })
    response.json(posts.map(b => b.toJSON()))
  } catch(exception ){
    next(exception)
  }
})

postRouter.post('/', async (request, response, next) => {
  let body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) 
      return response.status(401).json({ error: 'token missing or invalid' })

    const user = await User.findById(decodedToken.id)

    const newpost = new Post({
      title: body.title,
      text: body.text,
      image_url: body.image_url,
      likes: body.likes || 0,
      user: user._id
    })
  
    const savedpost = await newpost.save()
    user.posts = user.posts.concat(savedpost._id)
    await user.save()
    response.json(savedpost.toJSON())
  }catch(exception){
    next(exception)
  }
})

postRouter.put('/:id', async (req, res, next) => {
  try {
    let updatedpost = await Post.findOneAndUpdate(
      req.params.id,
      { likes: req.body.likes },
      {  new: true })
    res.json(updatedpost.toJSON())
  } catch(e) {
    next(e)
  }
})

postRouter.delete('/:id', async (request, response, next) => {
  try {
    console.log(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id) 
      return response.status(401).json({ error: 'token missing or invalid' })

    const user = await User.findById(decodedToken.id)
    const post = await Post.findById(request.params.id)
    //console.log(post.user)
    if(user._id.toString() === post.user.toString()) {
      await Post.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
   
  } catch(exception) {
    next(exception)
  }
})

module.exports = postRouter