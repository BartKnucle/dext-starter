const events = require('events')

//Default module class
export default class MODULE {
  constructor(node) {
    this.node = node
    //Default state of the module
    this.started = false
    //Is the module can be stopped
    this.isStoppable = true
    //Default event emmiter
    this.eventEmitter = new events.EventEmitter()
    //Other modules dependencies
    this.dependencies = []
  }

  init() {
    process.on('SIGINT', () => {
      this.stop()
    })

    this.started = true
    this.node.logger.info('Module ' + this.constructor.name + ' initialized')
  }

  //Change the module state
  switch(value) {
    if (this.isStoppable) {
      this.started = value
      this.node.logger.info(
        'Module ' + this.constructor.name + ' state changed to: ' + value
      )
    }
  }

  //Stop the module
  stop() {
    this.started = false
    this.node.logger.info('Module ' + this.constructor.name + ' stopped')
  }

  //Start the module
  start() {
    this.started = true
    this.node.logger.info('Module ' + this.constructor.name + ' started')
  }

  //restart the module
  restart() {
    this.stop()
    this.start()
    this.node.logger.info('Module ' + this.constructor.name + ' restarted')
  }
}
