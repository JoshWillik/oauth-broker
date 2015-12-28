'use strict'
const HTTP_PORT = 80

const Koa = require( 'koa' )
const session = require('koa-session-redis')
const mount = require('koa-mount')
const serveStatic = require('koa-static')
const connectRedis = require('./init/redis')
const connectMongoose = require('./init/mongoose')
const responseTime = require('./middleware/response-time')
const makeRouter = require('./router')
const makeUser = require('./models/User')
const currentUser = require('./middleware/current-user')

function makeApplication (config) {
  let app = new Koa()
  app.keys = ['this is a demo key, but it will do']
  app.logger = require('./logger')

  app.logger.debug('Creating application')
  let settings = {}

  return connectRedis(config.redis, app.logger).then(redisConnection => {
    settings.redis = redisConnection
    return connectMongoose(config.mongo, app.logger)
  }).then(mongooseConnection => {
    settings.mongoose = mongooseConnection
  }).then(() => {
    let User = makeUser(settings.mongoose)

    app.use(responseTime)
    app.use(serveStatic('static'))

    app.use(session({
     store: settings.redis
    }))
    app.use(currentUser(User))

    let router = makeRouter()
    app.use(router.routes())

    return app
  }).catch(err => {
    console.log(err)
    app.logger.error('error', err)
  })
}

module.exports = makeApplication