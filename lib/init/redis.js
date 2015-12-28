'use strict'

const bluebird = require('bluebird')
const redis = require('redis')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

function makeRedisConnection (config, logger) {
  logger.info(`Opening redis connection to ${config.host}:${config.port}`)
  let client = redis.createClient(config)
  return new Promise((resolve, reject) => {
    logger.info('Waiting for redis')
    client.on('error', err => {
      logger.error(`Redis connection failed at ${config.host}:${config.port}`)
      reject(err)
    })
    client.on('connect', () => {
      logger.info(`Redis connected to ${config.host}:${config.port}`)
      resolve(client)
    })
  })
}
module.exports = makeRedisConnection
