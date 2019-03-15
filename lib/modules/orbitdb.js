import MODULE from './_module'
import { isNode } from 'browser-or-node'
import { fromEvent, merge } from 'rxjs'
import stores from '../stores'
const OrbitDB = require('orbit-db')

export default class ORBITDB extends MODULE {
  constructor(node) {
    super(node)
    this.isStoppable = false
    this.ipfs = this.node.ipfs.ipfs
    this.databases = []
  }

  init() {
    this.addStores()

    if (isNode) {
      this.db = new OrbitDB(this.ipfs, './data/orbitdb')
    } else {
      this.db = new OrbitDB(this.ipfs)
    }
    super.init()
  }

  async stop() {
    await this.db.stop()
  }

  //Import custom stores
  addStores() {
    stores.items.forEach(store => {
      OrbitDB.addDatabaseType(store.type, store)
    })
  }

  //Create a local database
  async create(dbName, dbOptions) {
    var db = await this.db.open(dbName, dbOptions)
    await db.load()
    return this.registerDb(db)
  }

  //Open a remote database
  async open(dbName, dbId) {
    //If DB is open return the opened db. Else, return a new db
    var db = this.find(dbId)
    if (db) {
      return db
    } else {
      return this.create('/orbitdb/' + dbId + '/' + dbName)
    }
  }

  //Load the database
  async load(dbId) {
    var db = this.find(dbId)
    await db.database.load()
    db.open = true
    this.eventEmitter.emit('dbUpdate')
  }

  //Close the database
  async close(dbId) {
    var db = this.find(dbId)
    await db.database.close()
    db.open = false
    this.eventEmitter.emit('dbUpdate')
  }

  //Drop the local database
  async delete(dbId) {
    var db = this.find(dbId)
    await db.database.drop()
    this.databases = this.databases.filter(db => db.id !== dbId)
    this.eventEmitter.emit('dbUpdate')
  }

  //Find a database in the current database list
  find(dbId) {
    return this.databases.find(db => db.id === dbId)
  }

  //Register the db in the opened DB list
  registerDb(db) {
    //Create the db updates events
    const replicateEvent = fromEvent(db.events, 'replicated')
    const writeEvent = fromEvent(db.events, 'write')
    const readyEvent = fromEvent(db.events, 'ready')

    //merge the observables
    const dbEvents = merge(replicateEvent, writeEvent, readyEvent)

    var database = {
      id: db.address.root,
      open: true,
      name: db.address.path,
      database: db,
      events: dbEvents
    }

    this.databases.push(database)
    //Send the event for database update
    this.eventEmitter.emit('dbUpdate')
    return database
  }

  //Get the public key of the orbitdb instance
  getPubKey() {
    return this.db.key.getPublic('hex')
  }

  //Get open databases
  getDatabases() {
    //Remove the useless objects from the return
    return this.databases.map(db => {
      const { database, events, ...rest } = db
      return { ...rest }
    })
  }
}
