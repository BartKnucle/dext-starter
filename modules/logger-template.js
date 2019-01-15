'use strict'
'use strict'

export default async ({ app }, inject) => {
  const { createLogger, format, transports } = require('winston')

  app.logger = createLogger({
    level: 'debug',
    format: format.combine(format.colorize(), format.simple()),
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    transports: [new transports.Console()]
  })

  app.logger.info('Logger Plugin Started')

  inject('logger', app.logger)
}
