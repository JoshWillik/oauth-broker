const log = require('jj-log')
module.exports = log({
  methods: {
    debug: { level: 'debug' },
    info: { level: 'info' },
    warn: { level: 'warn' },
    error: { level: 'error' },
    fatal: { level: 'fatal' },
  }
})
