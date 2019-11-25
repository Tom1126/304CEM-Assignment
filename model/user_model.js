const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
  email: { type: String, required: true, unique: true},
  password: {type: String, required: true},
  userType: {type: String, required: true},
  favourites: [{type: Object}]
}, {timestamps: true})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel