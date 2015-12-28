'use strict'

const mongoose = require('mongoose')

module.exports = function makeUser (connection) {
  let UserSchema = new mongoose.Schema({
    username: String,
    connectedAccounts: [{
      provider: String,
      username: String,
      oauthToken: String,
      refreshTokne: String
    }]
  })

  UserSchema.methods.isAnonymous = function isAnonymous () {
    return this.isNew
  }

  return connection.model('User', UserSchema)
}
