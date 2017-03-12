var mongoose = require('mongoose')
var connection = require('../services/connection')

var VideocallSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  sessionId: { type: String, required: true },
  datetime: { type: Date, required: true },

  // Array referencing the userIds of participants in the call
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = connection.model('Videocall', VideocallSchema)
