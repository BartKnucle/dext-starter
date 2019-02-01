const autoBind = require('auto-bind')

export class MODULE {
  constructor(app, id) {
    //Object name
    this.app = app
    this.id = id ? id : this.constructor.name
    this.started = false
    autoBind(this) //Bind all methods to this context
  }

  //Set database options
  async init() {
    var dbPath =
      this.id === this.constructor.name
        ? this.id
        : this.app.db.getPath(this.id, this.constructor.name)

    this.db = await this.app.db.orbitdb.docs(dbPath, { indexBy: 'id' })
    await this.db.load()
    this.app.logger.info('Loading DB: ' + dbPath)
    this.dbRoot = this.db.address.root

    this.db.events.on('replicated', async address => {})

    this.db.events.on('write', address => {})
  }

  //Fill database
  fill() {
    this.app.logger.info('Fill DB: ' + this.db.id)
  }

  //Close database
  close() {}

  //Add a record to the database or update id
  async add(data) {
    await this.db.put(data)
  }

  //Delete a record from database
  del(id) {}

  //get record from database
  get(record) {
    return this.db.get(record)
  }

  //Annouce the module
  announce() {
    this.app.msg.send(this.constructor.name, this.dbRoot)
  }
}
