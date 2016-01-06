'use strict'
const HTTP_PORT = 80

const Koa = require( 'koa' )
var cors = require('koa-cors')
const session = require('koa-session-redis')
const mount = require('koa-mount')
const serveStatic = require('koa-static')
const connectRedis = require('./init/redis')
const connectMongoose = require('./init/mongoose')
const responseTime = require('./middleware/response-time')
const makeRouter = require('./router')
const makeUser = require('./models/User')
const currentUser = require('./middleware/current-user')
const login = require('./middleware/login')

function makeApplication (config) {
  let app = new Koa()
  app.keys = config.sessionKeys
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

    app.use(cors())
    app.use(responseTime)
    app.use(serveStatic('static'))

    app.use(session({
     store: {
       host: config.redis.host,
       port: config.redis.port
     }
    }))
    app.use(login)
    app.use(currentUser(User))

    let router = makeRouter(User)
    app.use(router.routes())

    return app
  })
}

module.exports = makeApplication
