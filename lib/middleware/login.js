function login (user) {
  this.session.user = user._id
}
function logout (user) {
  delete this.session.user
}

module.exports = function* exposeLogin (next) {
  this.login = login
  this.logout = logout
  yield next
}
