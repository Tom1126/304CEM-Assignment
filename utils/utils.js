'use strict'

const Kanji = require('../model/kanji_model')
const axios = require('axios')


exports.getKanjiAliveConfig = () => {

  const config = {
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": process.env.KANJI_ALIVE_URL_HOST,
      "x-rapidapi-key": process.env.KANJI_ALIVE_URL_KEY
    }
  }

  return config

}

exports.romanjiToKanji = async (req, res) => {

  const romanji = req.params.romanji

  const config = {
    headers: {
      "x-rapidapi-host": process.env.KANJI_ALIVE_URL_HOST,
      "x-rapidapi-key": process.env.KANJI_ALIVE_URL_KEY
    },
    params: {
      "kun": romanji
    }
  }

  const url = process.env.KANJI_ALIVE_URL_1

  axios.get(url, config)
    .then(resp => {

      const jsonResponse = JSON.stringify(resp['data'])

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(jsonResponse)

    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.getKanjiDetails = async (req, res) => {

  const word = req.params.kanji
  const encodedWord = encodeURIComponent(word)

  const urlToSend = process.env.KANJI_API_URL + encodedWord

  axios.get(urlToSend)
    .then(resp => {

      const response = resp['data']
      const jsonObj = JSON.stringify(response)

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(jsonObj)

    })
    .catch(err => {

      res.status(400).send(err)

    })

}

exports.getKanjiExamples = async (req, res) => {
  const kanjiWord = req.params.kanji

  const encodedWord = encodeURIComponent(kanjiWord)
  
  const arr = encodedWord.split("%")
  let wordString = ''
  for(let i = 1; i < arr.length; i++) {
    wordString += `%25${arr[i]}`
  }

  const urlToSend = process.env.KANJI_ALIVE_URL_KANJI + encodedWord

  const config = this.getKanjiAliveConfig()

  axios.get(urlToSend, config)
    .then(resp => {
      let response = resp['data']['examples']
      response = response.length > 3 ? response.slice(0, 3) : response

      let kanjiImageUrl = resp['data']['kanji']['video']['poster']

      const kanjiExampleObject = {
        "image": kanjiImageUrl,
        "examples": response
      }
      const jsonExamplesObject = JSON.stringify(kanjiExampleObject)
      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(jsonExamplesObject)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.getSingleKanji = async (word, res) => {
  const encodedString = encodeURIComponent(word)

  Kanji.findOne({
      encodedString
    })
    .then(kanjiDocument => {

      res.setHeader("Content-Type", "application/json;charset=utf-8")
      res.end(JSON.stringify(kanjiDocument))

    })
    .catch(err => {
      res.status(400).send(`Error in getting kanji: ${JSON.stringify(err)}`)
    })
}

exports.getAllKanji = async res => {

  Kanji.find({})
    .then(kanjiDocuments => {
      res.send(kanjiDocuments)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.addKanji = async (word, res) => {
  let gotError = false

  const kanjiDetailsUrl = `http://localhost:3000/getKanjiDetails/${encodeURIComponent(word)}`
  
  const kanjiDetails = await axios.get(kanjiDetailsUrl).catch(err => {
    console.error(err)
    res.status(400).send(`Error getting details: ${err}`)
    gotError = true
  })

  if(gotError) return 

  const details = kanjiDetails['data']

  const kanjiExamplesUrl = `http://localhost:3000/getKanjiExamples/${encodeURIComponent(details.kanji)}`

  const kanjiExamples = await axios.get(kanjiExamplesUrl).catch(err => {
    console.error(err)
    res.status(400).send(`Error getting kanji examples: ${err}`)
    gotError = true  
  })

  if(gotError) return

  const kanjiExamplesData = kanjiExamples['data']

  const newKanjiWord = new Kanji({
    character: details.kanji,
    encodedString: encodeURIComponent(details.kanji),
    jlpt: details.jlpt,
    image: kanjiExamplesData.image,
    meanings: details.meanings,
    readings: details.on_readings,
    kanjiExamples: kanjiExamplesData.examples
  })

  newKanjiWord.save()
    .then(() => {
      res.send(`Kanji successfully added to database.`)
    })
    .catch(err => {
      console.error(err)
      res.status(400).send(err)
    })

}

exports.updateKanji = async (word, req, res) => {

  Kanji.updateOne({
    encodedString: word
  }, req.body, function(err, doc) {
    if(err) {
      let errObj = {
        "error": true,
        "msg": "Error: ${err}"
      }
      res.setHeader("Content-Type", "application/json;charset=utf-8")
      res.status(400).send(JSON.stringify(errObj))
    }
    else {
      
      res.send(doc)
    }
  })

  

}

exports.deleteKanji = async (word, res) => {
  const encodedString = encodeURIComponent(word)

  Kanji.deleteOne({
      encodedString
    })
    .then(() => {
      res.send(`Kanji successfully deleted from database`)
    })
    .catch(err => {
      res.status(400).send(`Error in deleting kanji: ${JSON.stringify(err)}`)
    })

}

exports.deleteAllKanji = async res => {
  Kanji.deleteMany({}, function(err) {
    if(err) {
      const respObj = {
        error: true,
        message: `Error: ${JSON.stringify(err)}`
      }

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(JSON.stringify(respObj))
    }
    else {
      const respObj = {
        error: false,
        message: `All kanji successfully deleted from database`
      }

      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      res.end(JSON.stringify(respObj))
    }
  })
    
}
