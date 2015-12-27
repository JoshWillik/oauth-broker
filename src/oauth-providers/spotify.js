'use strict'

let config = require('../config/spotify')
let request = require('request-promise')

module.exports = {
  enabled: function () {
    return !!config.clientID && !!config.clientSecret
  },
  authorize: function (context) {
    let redirect = encodeURI(config.callbackUrl)
    context.redirect(`${config.authorizeUrl}?response_type=code&client_id=${config.clientID}&redirect_uri=${redirect}&scope=user-library-read`)
    return {}
  },
  authorizeReturn: function (context) {
    return request.post({
      url: config.accessTokenUrl,
      json: true,
      form: {
        client_id: config.clientID,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        code: context.query.code,
        redirect_uri: config.callbackUrl
      }
    })
      .then(data => context.user.setOAuthToken('spotify', data.access_token, data.refresh_token))
      .then(() => context.user.save(context))
      .then(() => context.body = context.user.info())
      .catch(err => {
        console.log('ERROR', err)
        context.body = {
          error: err
        }
      })
  }
}
