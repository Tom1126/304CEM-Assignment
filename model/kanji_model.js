const mongoose = require('mongoose')
const schema = mongoose.Schema

const kanjiSchema = new schema({
  character: { type: String },
  encodedString: { type: String },
  jlpt: {type: Number },
  image: {type: String},
  meanings: [{ type: Object }],
  readings: [{ type: Object }],
  kanjiExamples: [{ type: Object }]
})

const kanjiModel = mongoose.model('kanji', kanjiSchema)

module.exports = kanjiModel