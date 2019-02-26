import MODULE from './_module'
import { isNode } from 'browser-or-node'
import { fromEvent, Observable, merge } from 'rxjs'
const OrbitDB = require('orbit-db')
const events = require('events')

export default class ORBITDB extends MODULE {
  constructor(node) {
    super(node)
    this.isStoppable = false
    this.ipfs = this.node.ipfs.ipfs
    this.databases = []
    this.eventEmitter = new events.EventEmitter()
  }

  init() {
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

  //Create a local database
  async create(dbName, dbOptions) {
    var db = await this.db.open(dbName, dbOptions)
    await db.load()
    return this.registerDb(db)
  }

  //Open a remote database
  async open(dbName, dbId) {
    //If DB is open return the opened db. Else, return a new db
    let db = this.databases.find(db => db.id === dbId)
    if (db) {
      return db
    } else {
      return this.create('/orbitdb/' + dbId + '/' + dbName)
    }
  }

  //Register the db in the opened DB list
  registerDb(db) {
    //Create the db updates events
    const replicateEvent = fromEvent(db.events, 'replicated')
    const writeEvent = fromEvent(db.events, 'write')

    //merge the observables
    const dbEvents = merge(replicateEvent, writeEvent)

    var database = {
      id: db.address.root,
      database: db,
      events: dbEvents
    }

    this.databases.push(database)
    //Send the event for database update
    this.eventEmitter.emit('dbUpdate')
    return database
  }

  //Get the public key of the orbitdb instance
  getID() {
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
