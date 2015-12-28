'use strict'

const status = require('http-status-codes')

module.exports = function* getOauthToken () {
  let provider = this.params.provider
  let token = this.user.getOAuthToken(provider)

  if (!token) {
    this.status = status.NOT_FOUND
  }
  this.body = {
    provider,
    token: token.accessToken,
    tokenSecret: token.accessTokenSecret
  }
}
