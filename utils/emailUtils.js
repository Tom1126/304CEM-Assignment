require('dotenv').config({
  path: './../.env'
})

const nodemailer = require('nodemailer')
const BASE_URL = `https://web-api-assignment-304cem.herokuapp.com`

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  }
})

exports.getPasswordResetURL = (user, token) => 
  `${BASE_URL}/changeNewPassword/${user._id}/${token}`

exports.resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN 
  const to = user.email 
  const subject = `Learn Kanji Password Reset`
  const html = `
  <p>Hey ${user.email},</p>
  <p>You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  `
  
  return { from, to, subject, html}
}