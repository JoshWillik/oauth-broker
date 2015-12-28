'use strict'

module.exports = {
  profileUrl: 'https://api.spotify.com/v1/me',
  authorizeUrl: 'https://accounts.spotify.com/authorize',
  accessTokenUrl: 'https://accounts.spotify.com/api/token',
  callbackUrl: 'https://laptop.joshwillik.com/accounts/auth/spotify/return',
  clientID: process.env[`SPOTIFY_CLIENT_ID`],
  clientSecret: process.env[`SPOTIFY_CLIENT_SECRET`],
}
