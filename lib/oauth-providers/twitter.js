'use strict'

const config = require('../config')
const request = require('request-promise')
const returnUrl = `${config.baseUrl}/oauth/twitter/return`

module.exports = {
  enabled: function () {
    return !!config.twitter.clientID && !!config.twitter.clientSecret
  },
  authorize: function (context) {
    return request.post({
      url: config.twitter.oauthTokenUrl,
      oauth: {
        callback: returnUrl,
        consumer_key: config.twitter.clientID,
        consumer_secret: config.twitter.clientSecret
      }
    })
      .then(data => data.split('&').map(chunk => chunk.split('=')).reduce((prev, vals) => {
        prev[vals[0]] = vals[1]
        return prev
      }, {}))
      .then(data => context.redirect(`${config.twitter.authorizeUrl}?oauth_token=${data.oauth_token}`))
  },
  authorizeReturn: function (context) {
    return request.post({
      url: config.twitter.accessTokenUrl,
      oauth: {
        verifier: context.query.oauth_verifier,
        token: context.query.oauth_token,
        consumer_key: config.twitter.clientID,
        consumer_secret: config.twitter.clientSecret
      }
    })
      .then(data => data.split('&').map(chunk => chunk.split('=')).reduce((prev, vals) => {
        prev[vals[0]] = vals[1]
        return prev
      }, {}))
      .then(data => {
        return {
          provider: 'twitter',
          accessToken: data.oauth_token,
          accessTokenSecret: data.oauth_token_secret,
          username: data.screen_name,
          userId: data.user_id
        }
      })
  }
}
