const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  console.log(user)
  console.log(user.passwordHash)
  console.log(process.env.SECRET)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      region: user.region,
      profilepic: user.profilepic,
      posts: user.posts,
      description: user.description,
      id: user.id
    })
})

module.exports = loginRouter