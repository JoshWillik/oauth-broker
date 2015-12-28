'use strict'

const Router = require('koa-router')
const showDocumentation = require('./route-handlers/show-documentation')
const showProfile = require('./route-handlers/show-profile')
const getOauthToken = require('./route-handlers/get-oauth-token')
const oauth = require('./route-handlers/oauth')
const oauthReturn = require('./route-handlers/oauth-return')

function makeRouter (User) {
  let router = new Router

  router.get('/', showDocumentation)
  router.get('/me', showProfile)
  router.get('/oauth/:provider', oauth)
  router.get('/oauth/:provider/token', getOauthToken)
  router.get('/oauth/:provider/return', oauthReturn(User))

  return router
}

module.exports = makeRouter
