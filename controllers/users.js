const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response, next) => {
  try{
    const users = await User.find({}).populate('posts', { likes: 0, user: 0 })
    response.json(users.map(b => b.toJSON()))
  }catch(exception){
    next(exception)
  }
})

userRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.password === undefined || body.password.length <= 3)
      return response.status(400).json({ error: 'invalid password' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      region: body.region,
      role: body.role || 'writer',
      passwordHash,
    })
    console.log(user)
    const savedUser = await user.save()
    console.log(savedUser)
    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

userRouter.put('/:id', async (req, res, next) => {
  //console.log(req.body.id)
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      { firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        description: req.body.description,
        region: req.body.region,
        profilepic: req.body.profilepic
      },
      {  new: true })
    res.json(updatedUser.toJSON())
  } catch(e) {
    next(e)
  }
})

module.exports = userRouter