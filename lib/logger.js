import { isNode } from 'browser-or-node'
const { createLogger, format, transports } = require('winston')

export class LOGGER {
  constructor(app) {
    //Get the app to register the logger
    this.app = app

    //Client side, no colors
    this.format = format.simple()
    if (isNode) {
      //server side colors
      this.format = format.combine(format.colorize(), format.simple())
    }

    this.create()
  }
  //create the logger object
  create() {
    this.app.logger = createLogger({
      level: 'silly',
      format: this.format,
      transports: [new transports.Console()]
    })
  }
}
