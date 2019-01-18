import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE {
  constructor(app, dbPath) {
    this.app = app
    this.dbPath = dbPath ? dbPath : this.constructor.name.toString()
  }

  //loading initial database create it if don't exist
  async loadDb() {
    this.db = await this.app.db.orbitdb.docs(this.dbPath)
    await this.db.load()

    //Listen for updates from peers
    db.events.on('replicated', address => {
      this.onDbUpdate(address)
    })
  }

  onDbUpdate(address) {
    console.log(address)
    console.log(db.iterator({ limit: -1 }).collect())
  }

  getDbId() {
    return this.db.address.root
  }

  async setOs() {
    if (isNode) {
      await this.db.put({ _doc: 'os', doc: os.platform() })
    } else {
      this.app.logger.error('Cannot get OS from browser')
    }
  }

  async getOs() {
    return await this.db.get('os')
  }
}
