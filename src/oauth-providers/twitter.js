'use strict'

let config = require('../config/twitter')
let request = require('request-promise')

module.exports = {
  enabled: function () {
    return !!config.clientID && !!config.clientSecret
  },
  authorize: function (context) {
    return request.post({
      url: config.oauthTokenUrl,
      oauth: {
        callback: config.callbackUrl,
        consumer_key: config.clientID,
        consumer_secret: config.clientSecret
      }
    })
      .then(data => data.split('&').map(chunk => chunk.split('=')).reduce((prev, vals) => {
        prev[vals[0]] = vals[1]
        return prev
      }, {}))
      .then(data => context.redirect(`${config.authorizeUrl}?oauth_token=${data.oauth_token}`))
      .catch(err => {
        console.log('ERROR', err)
        context.body = {
          error: err
        }
      })
  },
  authorizeReturn: function (context) {
    return request.post({
      url: config.accessTokenUrl,
      oauth: {
        verifier: context.query.oauth_verifier,
        token: context.query.oauth_token,
        consumer_key: config.clientID,
        consumer_secret: config.clientSecret
      }
    })
      .then(data => data.split('&').map(chunk => chunk.split('=')).reduce((prev, vals) => {
        prev[vals[0]] = vals[1]
        return prev
      }, {}))
      .then(data => context.user.setOAuthToken('twitter', data.oauth_token))
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
