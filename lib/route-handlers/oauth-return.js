'use strict'

const status = require('http-status-codes')
const oauth = require('../oauth-providers')

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
      this.session.user = this.user._id
      this.body = this.user.info()
      return
    }

    if (!this.user.getOAuthToken(providerName)) {
      this.user.connectedAccounts.push(data)
      yield this.user.save()
    }
    this.body = this.user.info()
  }
}
