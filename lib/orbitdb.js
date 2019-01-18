const OrbitDB = require('orbit-db')
import { isNode } from 'browser-or-node'

export class ORBITDB {
  constructor(app) {
    //App to acces logger etc
    this.app = app
  }

  create() {
    if (isNode) {
      this.orbitdb = new OrbitDB(this.app.ipfs, './data/orbitdb')
    } else {
      this.orbitdb = new OrbitDB(this.app.ipfs)
    }
    this.id = this.orbitdb.key.getPublic('hex')
    this.app.logger.info('Created OrbitDb')
  }
}
