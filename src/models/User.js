'use strict'

const uuid = require('node-uuid')
const redis = require('../modules/redis')

module.exports = class User {
  constructor (id) {
    this.id = id || null
    this.username = null

    this.tokens = {}
  }

  info () {
    return {
      id: this.id,
      username: this.username,
    }
  }

  data () {
    return {
      id: this.id,
      username: this.username,
      tokens: this.tokens
    }
  }

  getOAuthToken (provider) {
    return this.tokens[provider] || null
  }

  setOAuthToken (provider, token) {
    this.tokens[provider] = token
  }

  isAnonymous () {
    return this.id === null
  }

  save (context) {
    if (!this.id) {
      this.id = uuid.v4()
    }
    if (context) {
      context.session.user = this.id
    }
    return redis.setAsync(this._redisKey(), JSON.stringify(this.data()))
  }

  load () {
    return redis.getAsync(this._redisKey()).then(data => {
      data = JSON.parse(data) || {}
      this.username = data.username
      this.tokens = data.tokens || {}
    })
  }
  _redisKey () {
    return 'user/' + this.id
  }
}
