'use strict'

let config = {
  baseUrl: process.env.BASE_URL,
  sessionKeys: (process.env.SESSION_KEYS || '').split(',')
}

if (!config.sessionKeys.length) {
  console.log('You must provide session keys with the SESSION_KEYS env variable')
  console.log('Keys are passed directly into koa\'s app.keys')
  throw new Error('missing SESSION_KEYS')
}

;['mongo', 'redis', 'spotify', 'twitter'].forEach(file => {
  config[file] = require('./' + file)
})
