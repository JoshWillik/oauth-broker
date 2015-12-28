function* showDocumentation () {
  this.body = {
    profile_url: '/me',
    oauth_url: '/oauth/{provider}',
    oauth_token: '/oauth/{provider}/token'
  }
}

module.exports = showDocumentation
