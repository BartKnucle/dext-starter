'use strict'
import { LOGGER } from '../lib/logger'

export default ({ app }, inject) => {
  inject('app', app)
  new LOGGER(app)
  app.logger.started = true
  app.logger.info('Logger Plugin Started')
}
