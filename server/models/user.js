var mongoose = require('mongoose')
var connection = require('../services/connection')
var autoIncrement = require('mongoose-auto-increment')

var UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  google: {
    id: { type: Number },
    token: { type: String }
  },
  // Array referencing the userIds of contact
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { id: false })

UserSchema.virtual('calls', {
  ref: 'Videocall',
  localField: '_id',
  foreignField: 'participants'
})

UserSchema.set('toJSON', {
  virtuals: true
})

UserSchema.set('toObject', {
  virtuals: true
})

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1
})

module.exports = connection.model('User', UserSchema)
