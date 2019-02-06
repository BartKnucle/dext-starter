const autoBind = require('auto-bind')

export class MODULE {
  constructor(app) {
    this.app = app
    this.started = false
    autoBind(this) //Bind all methods to this context
  }

  //Set database options
  async init(dbId) {
    this.dbId = dbId ? dbId : this.constructor.name
    this.dbPath =
      this.dbId === this.constructor.name
        ? this.dbId
        : this.app.db.getPath(this.dbId, this.constructor.name)

    this.db = await this.app.db.orbitdb.docs(this.dbPath, {
      indexBy: 'id',
      write: [this.app.db.id, '*']
    })

    this.db.events.on('replicated', async address => {
      console.log('replicated ' + address)
    })

    this.db.events.on('write', address => {
      console.log('write ' + address)
    })

    this.db.events.on('ready', async () => {
      console.log('Database ready')
    })

    this.db.events.on(
      'load.progress',
      (address, hash, entry, progress, total) => {
        console.log('Loading database... ' + progress + '/' + total)
      }
    )

    await this.db.load()

    this.dbId = this.db.address.root
    this.app.logger.info('Loading DB: ' + this.dbId)
  }

  //Fill database
  fill() {
    this.app.logger.info('Fill DB: ' + this.dbId)
  }

  //Close database
  close() {}

  //Add a record to the database or update id
  async add(data) {
    await this.db.put(data)
  }

  //Delete a record from database
  del(dbId) {}

  //get record from database
  get(record) {
    return this.db.get(record)
  }

  //Annouce the module
  announce() {
    this.app.msg.send(this.constructor.name, this.dbId)
  }

  //Liste annoucement on the module
  listen(callback) {
    this.app.msg.listen(this.constructor.name, callback)
  }

  //Stop listening on the channel
  stopListen(callback) {
    this.app.msg.stopListen(this.constructor.name, callback)
  }
}
