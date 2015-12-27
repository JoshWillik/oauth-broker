'use strict'

let code = require('http-status-codes')

module.exports = function* showProfile () {
  this.status = this.user.isAnonymous() ? code.UNAUTHORIZED : code.OK
  this.body = this.user.data()
}
