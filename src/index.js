'use strict'
const HTTP_PORT = 80

const Koa = require( 'koa' )
const session = require('koa-session-redis')
const mount = require('koa-mount')
const serveStatic = require('koa-static')
const redis = require('./config/redis')
const responseTime = require('./middleware/response-time')
const makeRouter = require('./router')
const currentUser = require('./middleware/current-user')

let app = new Koa()
app.keys = ['this is a demo key, but it will do']
app.logger = require('./logger')

app.use(responseTime)
app.use(serveStatic('static'))

app.use(session({
 store: redis
}))
app.use(currentUser)

let router = makeRouter()
app.use(router.routes())

app.listen(HTTP_PORT, function(){
  app.logger('App listening')
})
