import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE {
  constructor(app, dbId) {
    this.app = app
    this.dbId = dbId
  }

  //Anounnce node to the swarm
  announce() {
    setInterval(() => {
      this.app.db.ipfs.pubsub.publish(
        this.constructor.name.toString(),
        Buffer.from(this.dbId),
        err => {
          if (err) {
            this.app.logger.error(err)
          }
          this.app.logger.silly(
            'Announce ' + this.dbId + ' on ' + this.constructor.name.toString()
          )
        }
      )
    }, 15 * 1000)
  }

  //Stop the node announcement
  stopAnnounce() {}

  //loading initial database create it if don't exist
  async loadDb() {
    //If no Id is passed to the constructor, load the local database
    this.dbPath = this.dbId
      ? this.app.db.getPath(this.dbId, this.constructor.name.toString())
      : this.constructor.name.toString()

    this.db = await this.app.db.orbitdb.docs(this.dbPath)
    this.dbId = this.db.address.root
    await this.db.load()
  }

  async closeDb() {
    await this.db.close()
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
      if (this.getPlateform() !== os.platform()) {
        await this.db.put({ _id: 'plateform', doc: os.platform() })
      }
    } else {
      if (this.getPlateform() !== navigator.userAgent) {
      }
      await this.db.put({
        _id: 'plateform',
        doc: navigator.userAgent
      })
    }
  }

  async getPlateform() {
    let plateform = await this.db.get('plateform')
    if (plateform[0]) {
      return plateform[0].doc
    } else {
      return 'nothing'
    }
  }
}
