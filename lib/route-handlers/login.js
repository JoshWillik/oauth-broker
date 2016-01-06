'use strict'

const status = require('http-status-codes')
const config = require('../config')
const jwt = require('jsonwebtoken')
const Promise = require('bluebird')
const verify = Promise.promisify(jwt.verify)

module.exports = function buildLogin (User) {
  return function* login () {
    if (!config.jwt.secret) {
      this.status = status.NOT_IMPLIMENTED
      this.body = {
        error: 'not_implimented'
      }
      return
    }

    let token = this.request.body.loginToken

    if (token) {
      let data

      try {
        data = yield verify(token, config.jwt.secret)
      } catch (e) {
        let err
        this.status = status.UNAUTHORIZED
        switch (e.name) {
          case 'TokenExpiredError':
            err = 'token_expired'
          break
          case 'JsonWebTokenError':
            err = 'bad_token'
          break
          default:
            err = 'unknown_error'
          break
        }
        this.body = err
        return
      }

      let user = yield User.findById(data.userId)
      if (!user) {
        this.status = status.NOT_AUTHORIZED
        this.body = {
          error: 'missing_user'
        }
        return
      }
      this.login(user)
      this.body = user.info()
      return
    }

    this.status = status.UNAUTHORIZED
    this.body = {
      error: 'login_failed'
    }
  }
}
