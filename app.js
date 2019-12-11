const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const postRouter = require('./controllers/posts')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const otherRouter = require('./controllers/other')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')


logger.info('connecting to', config.MONGODB_URI)
console.log(config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('connected to MongoDB')
}).catch((error) => {
  logger.error('error connection to MongoDB:', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/', otherRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app