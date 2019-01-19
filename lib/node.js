import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE {
  constructor(app, dbPath) {
    this.app = app
    //this.dbPath = dbPath ? dbPath : this.constructor.name.toString()
    this.dbPath = this.constructor.name.toString()
  }

  //loading initial database create it if don't exist
  async loadDb() {
    this.db = await this.app.db.orbitdb.docs(this.dbPath)
    await this.db.load()

    //Listen for updates from peers
    this.db.events.on('replicated', address => {
      this.onDbUpdate(address)
    })
  }

  onDbUpdate(address) {
    console.log(address)
    console.log(this.db.iterator({ limit: -1 }).collect())
  }

  getDbId() {
    return this.db.address.root
  }

  async setPlateform() {
    if (isNode) {
      await this.db.put({ _id: 'plateform', doc: os.platform() })
    } else {
      await this.db.put({
        _id: 'plateform',
        doc: navigator.userAgent
      })
    }
  }

  async getPlateform() {
    let plateform = await this.db.get('plateform')
    return plateform[0].doc
  }
}
