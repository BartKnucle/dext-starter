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

    this.app.logger.info('Loadind node datbase: ' + this.dbPath)

    this.db = await this.app.db.orbitdb.docs(this.dbPath)
    this.dbId = this.db.address.root
    await this.db.load()
  }

  async closeDb() {
    await this.db.close()
  }

  getDbId() {
    return this.db.address.root
  }

  //Fill the database
  async setDb() {
    var properties = {}
    if (isNode) {
      properties.type = 'computer'
      properties.plateform = os.platform()
    } else {
      properties.type = 'user'
      properties.plateform = navigator.userAgent
    }
    if (this.getDb() !== properties) {
      await this.db.put({ _id: 'properties', doc: properties })
    }
  }

  //Get the database
  async getDb() {
    let properties = await this.db.get('properties')
    if (properties[0]) {
      return properties[0].doc
    } else {
      return {}
    }
  }
}
