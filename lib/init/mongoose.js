'use strict'

let mongoose = require('mongoose')

function makeMongooseConnection (config, logger) {
  return new Promise((resolve, reject) => {
    let client = mongoose.createConnection()
    logger.info(`Connecting to mongo at ${config.host}:${config.port}`)
    client.open(config.host, config.db, config.port, err => {
      if (err) {
        logger.error(`Mongo connection failed at ${config.host}:${config.port}`)
        reject(err)
      } else {
        logger.info(`Mongo connected to ${config.host}:${config.port}`)
        resolve(client)
      }
    })
    logger.info(`Waiting for mongo at ${config.host}:${config.port}`)
  })
}
module.exports = makeMongooseConnection
