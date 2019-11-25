'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')
const bodyParser = require('body-parser')
const {verifyToken} = require('../utils/verifyToken')
const {checkAdminUser, getUserDetails} = require('../utils/userUtils')
const resetPasswordUtils = require('../utils/resetPasswordUtils')

router.use(bodyParser.urlencoded({ extended: false}))
router.use(bodyParser.json())

// All html pages
router.get("/admin", controller.goToHomePage)

// All GET routes
router.get("/", controller.redirectClient)
router.get('/client', controller.redirectClient)
router.get("/romanjiToKanji/:romanji", controller.romanjiToKanji)
router.get('/getKanjiDetails/:kanji', controller.getKanjiDetails)
router.get('/getKanjiExamples/:kanji', controller.getKanjiExamples)

router.get('/getSingleKanji/:kanji', controller.getSingleKanji)
router.get('/getAllKanji', controller.getAllKanjis)

router.get('/getUserDetails', verifyToken, controller.getUserDetails)
router.get('/getUserFavourites', verifyToken, controller.getUserFavourites)

// All POST routes
router.post('/register', controller.register)
router.post('/addKanji/:kanji', controller.addKanjiToDatabase)
router.post('/login', controller.loginUser)
router.post('/searchKanji/:kanji', controller.searckKanji)
router.post('/addUserFavourite', verifyToken, getUserDetails, controller.addUserFavouriteKanji)
router.post('/findUserInDatabase', controller.findUserInDatabase)

// All PUT routes
router.put('/updateKanji/:kanji', verifyToken, checkAdminUser, controller.updateKanjiInDatabase)
router.put('/updateUserFavourites', verifyToken, controller.updateUserFavourites)

// All DELETE routes
router.delete('/deleteKanji/:kanji', verifyToken, checkAdminUser, controller.deleteKanjiInDatabase)
router.delete('/deleteAllKanji', verifyToken, checkAdminUser, controller.deleteAllKanji)
router.delete('/deleteUser', verifyToken, getUserDetails, controller.deleteUser)
router.delete('/deleteUserFavourite', verifyToken, getUserDetails, controller.deleteUserFavourite)
router.delete('/deleteAllUserFavourites', verifyToken, getUserDetails, controller.deleteAllUserFavourites)

//Reset password
router.post('/resetPassword/:email', resetPasswordUtils.sendPasswordResetEmail)
router.post('/receiveNewPassword/:userId/:token', resetPasswordUtils.receiveNewPassword)
router.get('/changeNewPassword/:userId/:token', resetPasswordUtils.redirectChangePassword)


module.exports = router