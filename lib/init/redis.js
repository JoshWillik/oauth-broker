'use strict'

const co = require('co')
const bluebird = require('bluebird')
const redis = require('redis')
const sleep = require('../util/sleep')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const CONNECTION_ATTEMPTS = 10
const CONNECTION_SLEEP = 5 * 1000

function connectToRedis (config) {
  return new Promise((resolve, reject) => {
    let client = redis.createClient(config)
    client.on('error', err => {
      reject(err)
    })
    client.on('connect', () => {
      resolve(client)
    })
  })
}

function waitForRedis (config, logger) {
  return co(function* () {
    logger.info({
      message: 'Attempting connection to redis',
      host: config.host,
      port: config.port
    })
    for (var i = 0; i < CONNECTION_ATTEMPTS; i++) {
      logger.info({
        message: `Connection attempt`,
        attempt: i + 1
      })
      try {
        let connection = yield connectToRedis(config)
        logger.info('Connected')
        return connection
      } catch (e) {
        logger.info('Connection failed')
        yield sleep(CONNECTION_SLEEP)
        logger.info('Retrying')
      }
    }
    throw new Error(`Connection to redis failed`)
  })
}

module.exports = waitForRedis
