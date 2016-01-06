'use strict'

const status = require('http-status-codes')
const oauth = require('../oauth-providers')
const config = require('../config')
const jwt = require('jsonwebtoken')

module.exports = function makeOAuthReturn (User) {
  return function* authenticate () {
    let providerName = this.params.provider
    if (!oauth[providerName] || !oauth[providerName].enabled()) {
      this.status = status.NOT_IMPLEMENTED
      this.body = {
        error: 'unsupported_oauth_provider',
        provider: provider,
        loaded: !!oauth[providerName],
        enabled: !!oauth[providerName] && !!oauth[providerName].enabled(),
      }
      return
    }

    let provider = oauth[providerName]
    let data = yield provider.authorizeReturn(this)

    if (this.user.isAnonymous()) {
      let existingUser = yield User.findOne({
        'connectedAccounts.provider': providerName,
        $or: [
          {'connectedAccounts.userId': data.userId},
          {'connectedAccounts.username': data.username},
        ]
      })
      if (existingUser) {
        this.user = existingUser
      } else {
        this.user.username = data.username
        this.user.connectedAccounts.push(data)
        yield this.user.save()
      }
      this.login(this.user)
      this.body = this.user.info()
      return
    }

    if (!this.user.getOAuthToken(providerName)) {
      this.user.connectedAccounts.push(data)
      yield this.user.save()
    }

    let url = this.session.returnUrl
    if (url) {
      let token
      if (config.jwt.secret) {
        token = jwt.sign({
          userId: this.user._id
        }, config.jwt.secret, {
          expiresIn: 30 // seconds
        })
      }

      if (token) {
        if (url.indexOf('?') === -1) {
          url += `?loginToken=${token}`
        } else {
          url += `&loginToken=${token}`
        }
      }
      this.redirect(url)
    } else {
      this.body = this.user.info()
    }
  }
}
