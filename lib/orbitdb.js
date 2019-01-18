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
  }
}
