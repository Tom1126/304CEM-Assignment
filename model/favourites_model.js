const mongoose = require('mongoose')
const schema = mongoose.Schema

const favouritesSchema = new schema({
  email: {type: String, required: true},
  character: { type: String },
  encodedString: { type: String },
  jlpt: {type: Number },
  image: {type: String},
  meanings: [{ type: Object }],
  readings: [{ type: Object }],
  kanjiExamples: [{ type: Object }]
})

const favouritesModel = mongoose.model('favourites', favouritesSchema)

module.exports = favouritesModel