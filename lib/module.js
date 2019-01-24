export class MODULE {
  constructor(app, id) {
    //Object name
    this.app = app
    this.id = id ? id : this.constructor.name
  }

  //Create database
  async init() {
    var dbPath =
      this.id === this.constructor.name
        ? this.id
        : this.app.db.getPath(this.id, this.constructor.name)

    this.db = await this.app.db.orbitdb.docs(dbPath)
    this.dbId = this.db.address.root
    await this.db.load()
    this.app.logger.info('Loading DB: ' + this.db.id)
  }

  //Fill database
  fill() {
    this.app.logger.info('Fill DB: ' + this.db.id)
  }

  //Close database
  close() {}

  //Add a record to the database or update id
  add(data) {
    this.db.put(data)
  }

  //Delete a record from database
  del(id) {}

  get(id) {
    return this.db.get(id)
  }

  //Get all records from database
  all() {
    return this.db.get('')
  }
}
