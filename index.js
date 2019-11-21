'use strict'

const express = require('express')
require('dotenv').config()
const cors = require('cors')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const databaseUrl = process.env.MONGODB_URL

app.use(express.static('static'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.use("/", routes)

const port = process.env.PORT || 3000

mongoose.connect(databaseUrl, { useNewUrlParser: true})
  .then(() => {
    console.log(`Database connected`)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  })
  .catch(err => {
    console.error(err)
  })

