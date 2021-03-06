'use strict'

const status = require('http-status-codes')
const oauth = require('../oauth-providers')

module.exports = function* authenticate () {
  let provider = this.params.provider
  if (!oauth[provider] || !oauth[provider].enabled()) {
    this.status = status.NOT_IMPLEMENTED
    this.body = {
      error: 'unsupported_oauth_provider',
      provider: provider,
      loaded: !!oauth[provider],
      enabled: !!oauth[provider] && !!oauth[provider].enabled(),
    }
    return
  }

  let returnUrl = this.query.returnUrl || this.headers.Referer
  if (returnUrl) {
    this.session.returnUrl = returnUrl
  } else {
    this.session.returnUrl = null
  }

  provider = oauth[provider]
  let accountInfo = yield provider.authorize(this)
}
