'use strict'

module.exports = {}
;['mongo', 'redis', 'spotify', 'twitter'].forEach(file => {
  module.exports[file] = require('./' + file)
})
