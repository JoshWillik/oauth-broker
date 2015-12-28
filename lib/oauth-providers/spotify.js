'use strict'

const _ = require('lodash')

const config = require('../config')
const request = require('request-promise')
const spotifyRedirectUrl = `${config.baseUrl}/oauth/spotify/return`

module.exports = {
  enabled: function () {
    return !!config.spotify.clientID && !!config.spotify.clientSecret
  },
  authorize: function (context) {
    let redirect = encodeURI(spotifyRedirectUrl)
    context.redirect(`${config.spotify.authorizeUrl}?response_type=code&client_id=${config.spotify.clientID}&redirect_uri=${redirect}&scope=user-library-read`)
    return {}
  },
  authorizeReturn: function (context) {
    return request.post({
      url: config.spotify.accessTokenUrl,
      json: true,
      form: {
        client_id: config.spotify.clientID,
        client_secret: config.spotify.clientSecret,
        grant_type: 'authorization_code',
        code: context.query.code,
        redirect_uri: spotifyRedirectUrl
      }
    })
    .then(tokenData => {
      return request({
        url: config.spotify.profileUrl,
        json: true,
        headers: {
          Authorization: 'Bearer ' + tokenData.access_token
        }
      }).then(profile => {
        return _.merge({}, profile, tokenData)
      })
    })
    .then(data => {
      return {
        username: data.id,
        provider: 'spotify',
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      }
    })
  }
}
