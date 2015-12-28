'use strict'

module.exports = {
  baseUrl: process.env.BASE_URL
}

;['mongo', 'redis', 'spotify', 'twitter'].forEach(file => {
  module.exports[file] = require('./' + file)
})
