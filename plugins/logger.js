'use strict'
import { LOGGER } from '../lib/logger'

export default ({ app }, inject) => {
  new LOGGER(app)
  //inject('logger', app.logger)
  app.logger.info('Logger Plugin Started')
}
