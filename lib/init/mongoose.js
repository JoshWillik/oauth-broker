'use strict'

const co =  require('co')
const mongoose = require('mongoose')
const sleep = require('../util/sleep')
const CONNECTION_ATTEMPTS = 10
const CONNECTION_SLEEP = 5 * 1000

function attemptConnection (config) {
  return new Promise((resolve, reject) => {
    let client = mongoose.createConnection()
    client.open(config.host, config.db, config.port, err => {
      if (err) {
        reject(err)
      } else {
        resolve(client)
      }
    })
  })
}

function waitForMongoose (config, logger) {
  return co(function* () {
    logger.info({
      message: 'Attempting connection to mongo',
      host: config.host,
      port: config.port
    })
    for (var i = 0; i < CONNECTION_ATTEMPTS; i++) {
      logger.info({
        message: `Connection attempt`,
        attempt: i + 1
      })
      try {
        let connection = yield attemptConnection(config)
        logger.info('Connected')
        return connection
      } catch (e) {
        logger.info('Connection failed')
        yield sleep(CONNECTION_SLEEP)
        logger.info('Retrying')
      }
    }
    throw new Error(`Connection to mongo failed`)
  })
}
module.exports = waitForMongoose
