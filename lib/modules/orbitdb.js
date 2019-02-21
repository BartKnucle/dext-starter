import MODULE from './_module'
import { isNode } from 'browser-or-node'
const OrbitDB = require('orbit-db')

export default class ORBITDB extends MODULE {
  constructor(node) {
    super(node)
    this.ipfs = this.node.ipfs.ipfs
    this.databases = []
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
    this.registerDb(db)
    return db
  }

  //Open a remote database
  async open(dbName, dbId) {
    //If DB is open return the opened db. Else, return a new db
    let db = this.databases.find(db => db.id === dbId)

    if (db) {
      db = db.db
    } else {
      db = await this.db.open('/orbitdb/' + dbId + '/' + dbName)
      await db.load()
      this.registerDb(db)
    }

    return db
  }

  //Register the db in the opened DB list
  registerDb(db) {
    var database = {
      id: db.address.root,
      db: db
    }

    this.databases.push(database)
  }

  //Get the public key of the orbitdb instance
  getID() {
    return this.db.key.getPublic('hex')
  }

  //Get open databases
  getDatabases() {
    //Remove the useless objects from the return
    return this.databases.map(database => {
      const { db, ...rest } = database
      return { ...rest }
    })
  }
}
