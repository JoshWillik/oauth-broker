'use strict'

const _ = require('underscore')

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
    .then(tokenData => {
      request({
        url: config.profileUrl,
        headers: {
          Authorization: 'Bearer ' + tokenData.access_token
        }
      }).then(profile => {
        _.merge({}, profile, tokenData)
      })
    })
    .then(data => {
      console.log('Spotify User Data', data)
      return data
    })
    .catch(err => {
      console.log('ERROR', err)
      context.body = {
        error: err
      }
    })
  }
}
