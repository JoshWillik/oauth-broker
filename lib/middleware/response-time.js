'use strict'

module.exports = function* (next) {
  let start = new Date
  yield next
  let ms = new Date - start
  this.set('X-Response-Time', `${ms}ms`)
}
