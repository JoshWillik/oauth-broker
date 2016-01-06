'use strict'

let keys
if (process.env.SESSION_KEYS) {
  keys = process.env.SESSION_KEYS.split(',')
} else {
  keys = false
}

let config = {
  baseUrl: process.env.BASE_URL,
  sessionKeys: keys
}

if (!config.sessionKeys.length) {
  console.log('You must provide session keys with the SESSION_KEYS env variable')
  console.log('Keys are passed directly into koa\'s app.keys')
  throw new Error('missing SESSION_KEYS')
}

;['mongo', 'redis', 'spotify', 'twitter', 'jwt'].forEach(file => {
  config[file] = require('./' + file)
})

module.exports = config
