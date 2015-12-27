'use strict'

module.exports = {
  baseUrl: 'https://api.twitter.com',
  authorizeUrl: 'https://api.twitter.com/oauth/authorize',
  oauthTokenUrl: 'https://api.twitter.com/oauth/request_token',
  accessTokenUrl: 'https://api.twitter.com/oauth/access_token',
  callbackUrl: 'https://laptop.joshwillik.com/accounts/auth/twitter/return',
  clientID: process.env[`TWITTER_CLIENT_ID`],
  clientSecret: process.env[`TWITTER_CLIENT_SECRET`],
}
