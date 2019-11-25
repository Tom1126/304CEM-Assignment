const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate
} = require('./emailUtils')
const User = require('../model/user_model')
const path = require('path')

exports.userPasswordHashToMakeToken = ({
  password: passwordHash,
  _id: userId,
  createdAt
}) => {
  const secret = passwordHash + "-" + createdAt
  const token = jwt.sign({
    userId
  }, secret, {
    expiresIn: 3600 // 1 hour
  })
  return token
}

exports.sendPasswordResetEmail = async (req, res) => {
  const {
    email
  } = req.params
  let user
  try {
    user = await User.findOne({
      email
    }).exec()
  } catch (err) {
    const errObj = {
      "error": true,
      "msg": `Email not found in database`
    }
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.end(errObj)
  }

  const token = this.userPasswordHashToMakeToken({
    "password": user.password,
    "_id": user._id,
    "createdAt": user.createdAt
  })

  const url = getPasswordResetURL(user, token)
  const emailTemplate = resetPasswordTemplate(user, url)

  const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      const errObj = {}
      errObj.error = err ? true : false
      errObj.msg = err ? `Reset password email failed: ${err}` : `Reset password email sent successfully: ${info}`
      errObj.resetURL = err ? '' : url 

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      if (err) {
        res.status(400).end(JSON.stringify(errObj))
      }

      res.end(JSON.stringify(errObj))
    })
  }
  sendEmail()
}

exports.receiveNewPassword = (req, res) => {
  const {
    userId,
    token
  } = req.params
  const {
    password
  } = req.body

  User.findOne({
      _id: userId
    })
    .then(user => {
      const secret = user.password + '-' + user.createdAt
      const payload = jwt.decode(token, secret)
      if (payload.userId === user.id) {
        bcrypt.genSalt(10, function (err, salt) {
          // Call error-handling middleware:
          if (err) return
          bcrypt.hash(password, salt, function (err, hash) {
            // Call error-handling middleware:
            if (err) return
            User.findOneAndUpdate({
                _id: userId
              }, {
                password: hash
              })
              .then(() => res.status(202).json("Password changed accepted"))
              .catch(err => res.status(500).json(err))
          })
        })
      }
      else {
        const errObj = {
          "error": true,
          "msg": `Error: ${payload.userId} !== ${user._id}`
        }
        res.setHeader('Content-Type', "application/json")
        res.end(JSON.stringify(errObj))
      }
    })
    .catch(err => {
      const errObj = {
        "error": true,
        "msg": "Invalid user"
      }

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(JSON.stringify(errObj))
      
    })
}

/**
 * Function to redirect user to change password
 */

 exports.redirectChangePassword = (req, res) => {
  res.sendFile("resetPassword.html", {root: path.join(__dirname, "../static/html")})
 }