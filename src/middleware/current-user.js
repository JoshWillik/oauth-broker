'use strict'

const User = require('../models/User')

module.exports = function* setCurrentUser (next) {
  if (this.session.user) {
    console.log(this.session.user)
    this.user = new User(this.session.user)
    yield this.user.load()
  } else {
    this.user = new User
  }
  yield next
}
