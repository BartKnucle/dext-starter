import Module from './module'
import { isNode } from 'browser-or-node'
const { createLogger, format, transports } = require('winston')

export default class Logger extends Module {
  constructor(node) {
    super(node)

    //Client side, no colors
    this.format = format.simple()
    if (isNode) {
      //server side colors
      this.format = format.combine(format.colorize(), format.simple())
    }
  }
  //create the logger object
  init() {
    this.logger = createLogger({
      level: 'silly',
      format: this.format,
      transports: [new transports.Console()]
    })
    super.init()
  }

  silly(silly) {
    this.logger.silly(silly)
  }

  debug(debug) {
    this.logger.debug(debug)
  }

  info(info) {
    this.logger.info(info)
  }

  error(error) {
    this.logger.error(error)
  }
}
