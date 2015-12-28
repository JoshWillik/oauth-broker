'use strict'

const mongoose = require('mongoose')

module.exports = function makeUser (connection) {
  let UserSchema = new mongoose.Schema({
    username: String,
    connectedAccounts: [{
      provider: String,
      userId: Number,
      username: String,
      accessToken: String,
      accessTokenSecret: String,
      refreshToken: String
    }]
  })

  UserSchema.methods.isAnonymous = function isAnonymous () {
    return this.isNew
  }

  UserSchema.methods.info = function isAnonymous () {
    return {
      username: this.username
    }
  }

  UserSchema.methods.getOAuthToken = function (provider) {
    let matches = this.connectedAccounts
      .filter(account => account.provider === provider)

    if (matches.length) {
      let match = matches.pop()
      return {
        accessToken: match.accessToken,
        accessTokenSecret: match.accessTokenSecret
      }
    } else {
      return {
        accessToken: null,
        accessTokenSecret: null
      }
    }
  }

  return connection.model('User', UserSchema)
}
