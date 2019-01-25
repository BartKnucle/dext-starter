const OrbitDB = require('orbit-db')
import { isNode } from 'browser-or-node'

export class ORBITDB {
  constructor(app) {
    //App to acces logger etc
    this.app = app
    this.ipfs = this.app.ipfs.ipfs
  }

  create() {
    if (isNode) {
      this.orbitdb = new OrbitDB(this.ipfs, './data/orbitdb')
    } else {
      this.orbitdb = new OrbitDB(this.ipfs)
    }
    this.id = this.orbitdb.key.getPublic('hex')
    this.app.logger.info('Created OrbitDb')
    this.started = true
  }

  async stop() {
    await this.orbitdb.stop()
  }

  //Construct a full BD path from the DB and PATH
  getPath(dbId, dbName) {
    return '/orbitdb/' + dbId + '/' + dbName
  }
}
