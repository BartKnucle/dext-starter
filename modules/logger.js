'use strict'

module.exports = function logger() {
  const { createLogger, format, transports } = require('winston')
  this.logger = createLogger({
    level: 'debug',
    format: format.combine(format.colorize(), format.simple()),
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    transports: [new transports.Console()]
  })

  this.logger.info('Logger Module Started')
}
