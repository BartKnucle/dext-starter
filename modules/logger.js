'use strict'
import { LOGGER } from '../lib/logger'
module.exports = function logger() {
  new LOGGER(this)
  this.logger.info('Logger Module Started')
}
