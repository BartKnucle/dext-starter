'use strict'
import { LOGGER } from '../lib/logger'

export default ({ app }, inject) => {
  new LOGGER(app)
  app.logger.info('Logger Plugin Started')
}
