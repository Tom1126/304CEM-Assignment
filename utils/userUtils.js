require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/user_model')

const secret = process.env.SECRET

exports.registerUser = async (req, res) => {

  const hashedPassword = bcrypt.hashSync(req.body.password, 8)

  User.create({
      email: req.body.email,
      password: hashedPassword
    })
    .then(user => {
      const token = jwt.sign({
        id: user._id
      }, secret, {
        expiresIn: 86400 //expires in 24 hours
      })
      const jsonResponse = JSON.stringify({
        auth: true,
        token
      })

      res.setHeader("Content-Type", "application/json;charset=utf-8")
      res.end(jsonResponse)

    })
    .catch(err => {
      res.status(500).send('There was a problem registering the user.')
    })
}

exports.getUserDetails = async (req, res) => {

  //res.status(200).send(decoded)
  User.findById(req.userId, {
    password: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    res.status(200).send(user)
  })


}

exports.login = async (req, res) => {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) return res.status(500).send('Error on the server')
    if (!user) return res.status(404).send(`No user found`)

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) return res.status(401).send({
      auth: false,
      token: null
    })

    const token = jwt.sign({
      id: user._id
    }, secret, {
      expiresIn: 86400 // expires in 24 hours
    })

    res.status(200).send({
      auth: true,
      token
    })
  })
}