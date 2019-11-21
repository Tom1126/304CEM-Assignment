'use strict'

const path = require('path')

require('dotenv').config()
const utils = require('../utils/utils')
const userUtils = require('../utils/userUtils')

// All Html functions

exports.greetUser = (req, res, next) => {
  res.send(`API is now live.`)
}

exports.goToHomePage = (req, res, next) => {
  res.sendFile("learnKanji.html", {root: path.join(__dirname, "../static/html")})
}

// end

// All kanji related operations
exports.romanjiToKanji = (req, res, next) => {

  utils.romanjiToKanji(req, res)

}

exports.getKanjiDetails = (req, res, next) => {

  utils.getKanjiDetails(req, res)
  
}

exports.getKanjiExamples = (req, res, next) => {
  
  utils.getKanjiExamples(req, res)

}

exports.getAllKanjis = (req, res, next) => {

  utils.getAllKanji(res)

}

exports.getSingleKanji = (req, res, next) => {

  utils.getSingleKanji(req.params.kanji, res)

}

exports.addKanjiToDatabase = (req, res, next) => {

  utils.addKanji(req.params.kanji, res)

}

exports.updateKanjiInDatabase = (req, res, next) => {

  utils.updateKanji(req.params.kanji, req, res)

}

exports.deleteKanjiInDatabase = (req, res, next) => {

  utils.deleteKanji(req.params.kanji, res)

}
//end

//All login operations

exports.register = (req, res, next) => {
  userUtils.registerUser(req, res)
}

exports.getUserDetails = (req, res) => {
  userUtils.getUserDetails(req, res)
}

exports.loginUser = (req, res) => {
  userUtils.login(req, res)
}
//end

exports.searckKanji = (req, res) => {
  const encodedKanjiWord = encodeURIComponent(req.params.kanji)
  utils.searchKanji(encodedKanjiWord, res)
}

exports.deleteAllKanji = (req, res) => {
  utils.deleteAllKanji(res)
}

exports.redirectClient = (req, res) => {
  res.sendFile("client.html", {root: path.join(__dirname, "../static/html")})
}

exports.updateKanjiInDatabase = (req, res) => {
  const kanjiWord = req.params.kanji 

  if(kanjiWord.length > 1) {
    let errObj = {
      "error": true,
      "msg": "Please enter only 1 kanji",
      "word": kanjiWord
    }

    errObj = JSON.stringify(errObj)

    res.setHeader("Content-Type", "application/json;charset=utf-8")
    res.end(errObj)

  }

  else {
    const encodedKanjiWord = encodeURIComponent(kanjiWord)
    utils.updateKanji(encodedKanjiWord, req, res)
  }
  
}
