const autoBind = require('auto-bind')

export class MODULE {
  constructor(app) {
    this.app = app
    this.started = false
    autoBind(this) //Bind all methods to this context
  }

  //Set database options
  async init(id) {
    this.id = id ? id : this.constructor.name
    this.dbPath =
      this.id === this.constructor.name
        ? this.id
        : this.app.db.getPath(this.id, this.constructor.name)

    this.db = await this.app.db.orbitdb.docs(this.dbPath, { indexBy: 'id' })

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

    this.app.logger.info('Loading DB: ' + this.dbPath)
    this.id = this.db.address.root
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
    this.app.msg.send(this.constructor.name, this.id)
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
