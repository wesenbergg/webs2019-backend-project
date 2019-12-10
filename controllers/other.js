//const jwt = require('jsonwebtoken')
//const bcrypt = require('bcryptjs')
const otherRouter = require('express').Router()

otherRouter.get('/signup', async () => {
  
})

otherRouter.get('/signin', async () => {
  
})

otherRouter.get('/users', async (req, res) => {
  //res
  console.log(req.params)
  res.status(200).end()
})

module.exports = otherRouter