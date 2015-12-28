module.exports = function* getOauthToken () {
  this.body = this.user.getOauthToken(this.params.provider)
}
