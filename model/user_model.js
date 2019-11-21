const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
  email: { type: String, required: true, unique: true},
  userName: { type: String, required: true },
  password: {type: String, required: true}
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel