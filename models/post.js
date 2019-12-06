const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now()
  },
  image: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//https://images.unsplash.com/photo-1518214598173-1666bc921d66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&h=300&q=80
module.exports = mongoose.model('Post', postSchema)