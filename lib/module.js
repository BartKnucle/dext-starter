const autoBind = require('auto-bind')

export class MODULE {
  constructor(app) {
    this.app = app
    this.started = false
    autoBind(this) //Bind all methods to this context
  }

  //Set database options
  async init(dbId, options) {
    //Set database path
    this.dbId = dbId ? dbId : this.constructor.name
    this.dbPath =
      this.dbId === this.constructor.name
        ? this.dbId
        : this.app.db.getPath(this.dbId, this.constructor.name)

    //Set default database options
    options = options
      ? options
      : {
          type: 'docstore',
          create: true,
          indexBy: 'id',
          write: [this.app.db.id, '*']
        }

    this.db = await this.app.db.orbitdb.open(this.dbPath, options)
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
    if (this.get(data.id).length !== 0) {
      if (data.data != this.get(data.id)[0].data) {
        console.log('update')
        await this.db.put(data)
      } else {
        console.log('no update')
      }
    } else {
      console.log('update')
      await this.db.put(data)
    }
  }

  //Delete a record from database
  del(dbId) {}

  //get record from database
  get(id) {
    return this.db.get(id)
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
