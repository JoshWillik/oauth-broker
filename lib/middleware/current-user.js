'use strict'

module.exports = function makeCurrentUser(User) {
  return function* setCurrentUser (next) {
    if (this.session.user) {
      this.user = yield User.findById(this.session.user)
    }
    if (!this.user) {
      this.user = new User
    }
    yield next
  }
}
