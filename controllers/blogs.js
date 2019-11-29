const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.find({}).populate('user', { blogs: 0 })
    response.json(blogs.map(b => b.toJSON()))
  }catch(exception){
    next(exception)
  }
})

blogRouter.post('/', async (request, response, next) => {
  let body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) 
      return response.status(401).json({ error: 'token missing or invalid' })

    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
  
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  }catch(exception){
    next(exception)
  }
})

blogRouter.put('/:id', async (req, res, next) => {
  try{
    let updatedBlog = await Blog.findOneAndUpdate(
      req.params.id,
      { 
        likes: req.body.likes
      },
      {
        new: true 
      })
    res.json(updatedBlog.toJSON())
  }catch(e){
    next(e)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) 
      return response.status(401).json({ error: 'token missing or invalid' })

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    console.log(blog.user)
    if(user._id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }/*





 //handle !(user._id.toString() === blog.user.toString()) virheilmoitus





    */
   
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogRouter