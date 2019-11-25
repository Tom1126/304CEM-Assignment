require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/user_model')

const secret = process.env.SECRET

exports.registerUser = async (req, res) => {

  const hashedPassword = bcrypt.hashSync(req.body.password, 8)

  User.create({
      email: req.body.email,
      password: hashedPassword,
      userType: "user"
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
      const errObj = {
        "error": true,
        "msg": `Error: ${err}`
      }

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(JSON.stringify(errObj))
    })
}

exports.getUserDetails = async (req, res) => {

  //res.status(200).send(decoded)
  User.findById(req.userId, {
    password: 0,
    userType: 0,
    _id: 0
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
      token,
      userType: user.userType
    })
  })
}

exports.deleteUser = async (req, res) => {
  const id = req.userId
  User.findById(id, function (err, doc) {

    const errObj = {}

    errObj.error = err ? true : false
    errObj.msg = err ? err : `User successfully deleted`

    if (!err) {
      const curUser = doc
      curUser.remove((err, userDoc) => {
        errObj.msg = err ? err : `User successfully deleted`
      })
    }

    res.setHeader('Content-Type', "application/json;charset=utf-8")
    res.end(JSON.stringify(errObj))
  })
}

exports.getUserFavourites = async (req, res) => {
  User.findById(req.userId, {
    password: 0,
    userType: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    const userFavourites = user.favourites

    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.end(JSON.stringify(userFavourites))
  })

}

exports.updateUserFavourites = async (req, res) => {
  User.findById(req.userId, {
    password: 0,
    userType: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    const newUserFavourites = req.body.favourites
    user.favourites = newUserFavourites

    user.save()
      .then(doc => {
        const errObj = {
          error: false,
          msg: "User favourites successfully updated"
        }

        res.setHeader("Content-Type", "application/json;charset=utf-8")
        res.end(JSON.stringify(errObj))
      })
      .catch(err => {
        const errObj = {
          error: true,
          msg: `Error: ${err}`
        }

        res.setHeader("Content-Type", "application/json;charset=utf-8")
        res.end(JSON.stringify(errObj))

      })
  })
}

/**
 * Function to delete all user favourites
 */
exports.deleteAllUserFavourite = async (req, res) => {
  const userId = '' + req.userId

  User.findById(userId, {
    password: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    user.favourites = []

    User.findByIdAndUpdate(userId, user, function (err, doc) {
      if (err) {
        const errObj = {
          "error": true,
          "msg": `Error: ${err}`
        }

        res.setHeader('Content-Type', 'application/json;charset=utf-9')
        res.end(JSON.stringify(errObj))
      } else {
        const errObj = {
          "error": false,
          "msg": `All user favourites has successfully been deleted`
        }

        res.setHeader('Content-Type', 'application/json;charset=utf-9')
        res.end(JSON.stringify(errObj))

      }

    })
  })
}

/**
 * Function to delete user favourite
 */
exports.deleteUserFavourite = async (req, res) => {
  const userId = '' + req.userId
  const kanjiToAdd = req.body.kanji
  const encodedString = kanjiToAdd.encodedString

  console.log(`EncodedString: ${encodedString}`)

  User.findById(userId, {
    password: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    let indexToBeDeleted
    const userFavourites = user.favourites
    console.log(`userFavourite: ${JSON.stringify(userFavourites)}`)

    for (let i = 0; i < userFavourites.length; i++) {
      const favObj = userFavourites[i]
      if (Object.is(encodedString, favObj.encodedString)) {
        indexToBeDeleted = i
        break
      }
    }

    console.log(`indexToBeDeleted: ${indexToBeDeleted}`)
    if (typeof indexToBeDeleted !== 'undefined' && typeof indexToBeDeleted !== 'null') {
      user.favourites.splice(indexToBeDeleted, 1)
    }

    User.findByIdAndUpdate(userId, user, function (err, doc) {
      if (err) {
        const errObj = {
          "error": true,
          "msg": `Error: ${err}`
        }

        res.setHeader('Content-Type', 'application/json;charset=utf-9')
        res.end(JSON.stringify(errObj))
      } else {
        const errObj = {
          "error": false,
          "msg": `User favourite has successfully been deleted`
        }

        res.setHeader('Content-Type', 'application/json;charset=utf-9')
        res.end(JSON.stringify(errObj))

      }

    })
  })

}

exports.getUserDetails = (req, res, next) => {
  const userId = req.userId
  console.log(`GetUserDetails: ${userId}`)
  User.findById(userId, {
    password: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    req.token = user.token
    req.email = user.email
    req.favourites = user.favourites
    req.userId = userId
    req.user = user
    next()
  })
}

exports.checkAdminUser = (req, res, next) => {
  const userId = '' + req.userId
  User.findById(userId, {
    password: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    if (!Object.is(user.userType, 'admin')) return res.status(400).send(`User is not admin`)

    req.token = user.token
    req.email = user.email
    next()
  })
}

/**
 * Function to add user favourite
 */

exports.addUserFavourite = async (req, res) => {
  const userId = '' + req.userId
  const kanjiToAdd = req.body.kanji

  User.findById(userId, {
    password: 0,
    _id: 0
  }, function (err, user) {
    if (err) return res.status(400).send(`There was a problem finding the user`)
    if (!user) return res.status(404).send(`No user found`)

    user.favourites.push(kanjiToAdd)

    User.findByIdAndUpdate(userId, user, function (err, doc) {
      if (err) {
        const errObj = {
          "error": true,
          "msg": `Error: ${err}`
        }

        res.setHeader('Content-Type', 'application/json;charset=utf-9')
        res.end(JSON.stringify(errObj))
      } else {
        const errObj = {
          "error": false,
          "msg": `User favourites has successfully been added`
        }

        res.setHeader('Content-Type', 'application/json;charset=utf-9')
        res.end(JSON.stringify(errObj))

      }

    })
  })

}

/**
 * Function to find user in database
 */
exports.findUserInDatabase = async (req, res) => {
  const email = req.body.email 

  console.log(`Email: ${email}`)
  User.findOne({
    email
  }, function(err, user) {
    const errObj = {}

    if(err) {
      errObj.error = true 
      errObj.msg = `Error: ${err}`
    }

    else if(!user) {
      errObj.error = true 
      errObj.msg = `User not found in database`
    }

    else {
      errObj.error = false 
      errObj.msg = `User is in database`
    }

    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.end(JSON.stringify(errObj))

  })
}