const events = require('events')

//Default module class
export default class Module {
  constructor(node) {
    this.node = node
    //Default state of the module
    this.started = false
    //Is the module can be stopped
    this.isStoppable = true
    //Default event emmiter
    this.eventEmitter = new events.EventEmitter()
    //Module name
    this.name = this.constructor.name
  }

  init() {
    process.on('SIGINT', () => {
      this.stop()
    })

    this.started = true
    this.node.logger.info(`Module ${this.name} initialized`)
  }

  //Get a local or remote messages database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.node.orbitdb.open(this.name, dbId)
    this.node.logger.info(`Getting Db ${this.name} ${dbId}`)
    return db
  }

  //Change the module state
  switch(value) {
    if (this.isStoppable) {
      this.started = value
      this.node.logger.info(`Module ${this.name} state change to: ${value}`)
    }
  }

  //Stop the module
  stop() {
    this.started = false
    this.node.logger.info(`Module ${this.name} stopped`)
  }

  //Start the module
  start() {
    this.started = true
    this.node.logger.info(`Module ${this.name} started`)
  }

  //restart the module
  restart() {
    this.stop()
    this.start()
    this.node.logger.info(`Module ${this.name} restarted`)
  }

  //Execute a command
  execute(command, args) {
    this[command](args)
  }
}
