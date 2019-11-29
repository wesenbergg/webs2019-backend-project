const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response, next) => {
  try{
    const users = await User.find({}).populate('blogs', { likes: 0, user: 0 })
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
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = userRouter