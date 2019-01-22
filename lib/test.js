export class TEST {
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
    let test = {
      _id: 'test',
      data: {
        variable1: 'ReTest1',
        variable2: 'Test2'
      }
    }
    this.add(test)

    let test1 = {
      _id: 'test1',
      data: {
        variable1: 'ReReTest1',
        variable2: 'ReTest2'
      }
    }
    this.add(test1)
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
