import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE {
  constructor(app, dbId) {
    this.app = app
    this.dbId = dbId
      ? '/orbitdb/' + dbId + '/' + this.constructor.name.toString()
      : this.constructor.name.toString()
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
    this.db = await this.app.db.orbitdb.docs(this.dbId)
    this.dbId = this.db.id
    //events
    this.db.events.on('load', dbname => {
      this.app.logger.info('Loading database: ' + dbname)
    })

    this.db.events.on(
      'load.progress',
      (address, hash, entry, progress, total) => {
        this.app.logger.info('Loading database: ' + progress)
      }
    )

    this.db.events.on('replicate.progress', () => {
      this.app.logger.info('Database replicating')
    })

    this.db.events.on('replicated', () => {
      this.app.logger.info('Database replicated: ')
    })

    this.db.events.on('ready', (dbname, heads) => {
      this.app.logger.info('Database ready: ' + dbname)
    })

    await this.db.load()
    /*
    //Listen for updates from peers
    this.db.events.on('replicated', address => {
      this.onDbUpdate(address)
    })*/
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
    if (plateform[0]) {
      return plateform[0].doc
    } else {
      return 'nothing'
    }
  }
}
