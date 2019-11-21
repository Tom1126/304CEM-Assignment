'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')
const bodyParser = require('body-parser')
const VerifyToken = require('../utils/verifyToken')

router.use(bodyParser.urlencoded({ extended: false}))
router.use(bodyParser.json())

// All html pages
router.get("/admin", controller.goToHomePage)

// All GET routes
router.get("/", controller.greetUser)
router.get('/client', controller.redirectClient)
router.get("/romanjiToKanji/:romanji", controller.romanjiToKanji)
router.get('/getKanjiDetails/:kanji', controller.getKanjiDetails)
router.get('/getKanjiExamples/:kanji', controller.getKanjiExamples)

router.get('/getSingleKanji/:kanji', controller.getSingleKanji)
router.get('/getAllKanji', controller.getAllKanjis)

router.get('/getUserDetails', VerifyToken, controller.getUserDetails)

// All POST routes
router.post('/register', controller.register)
router.post('/addKanji/:kanji', controller.addKanjiToDatabase)
router.post('/login', controller.loginUser)
router.post('searchKanji/:kanji', controller.searckKanji)

router.put('/updateKanji/:kanji', controller.updateKanjiInDatabase)

router.delete('/deleteKanji/:kanji', controller.deleteKanjiInDatabase)
router.delete('/deleteAllKanji', controller.deleteAllKanji)

module.exports = router