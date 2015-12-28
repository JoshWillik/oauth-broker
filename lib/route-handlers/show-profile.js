'use strict'

let code = require('http-status-codes')

module.exports = function* showProfile () {
  if (this.user.isAnonymous()) {
    this.status = code.UNAUTHORIZED
    this.body = {error: 'not_signed_in'}
  } else {
    this.body = this.user
  }
}
