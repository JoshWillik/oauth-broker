'use strict'

const Router = require('koa-router')
const showDocumentation = require('./route-handlers/show-documentation')
const showProfile = require('./route-handlers/show-profile')
const getOauthToken = require('./route-handlers/get-oauth-token')
const oauth = require('./route-handlers/oauth')
const oauthReturn = require('./route-handlers/oauth-return')

function makeRouter (options) {
  let router = new Router

  router.get('/', showDocumentation)
  router.get('/accounts/profile', showProfile)
  router.get('/accounts/oauth-token/:provider', getOauthToken)
  router.get('/accounts/auth/:provider', oauth)
  router.get('/accounts/auth/:provider/return', oauthReturn)

  return router
}

module.exports = makeRouter
