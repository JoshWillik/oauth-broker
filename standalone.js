'use strict'

const HTTP_PORT = 80
const settings = require('./lib/config')
const oauthBroker = require('./lib')

oauthBroker(settings).then(app => {
  app.logger.debug('Created')
  app.listen(HTTP_PORT, () => {
    app.logger.info('Listening on :80')
  })
})
