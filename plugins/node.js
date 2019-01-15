const os = require('os')

//class replace the old one
class node {
  constructor(app) {
    this.app = app
    this.system = {}

    if (process.server) {
      this.init()
    } else {
      this.app.db.ipfs.on('ready', async () => {
        this.init()
      })
    }
  }

  //Init the object
  async init() {
    await this.createDb()
    this.setSysInfo()
    this.announce()
  }

  //Anounce the node
  announce() {
    setInterval(() => {
      this.app.db.ipfs.pubsub.publish(
        'hello',
        Buffer.from(this.app.db.orbitdbId),
        err => {
          if (err) {
            this.app.logger.err(err)
          }
          this.app.logger.debug('Announce node: ' + this.app.db.orbitdbId)
        }
      )
    }, 15 * 1000)
  }

  async createDb() {
    this.app.logger.debug('Create nodeDb database')
    this.db = await this.app.db.orbitdb.docs('nodeDb', {
      indexBy: 'doc'
    })
    //await this.db.load()
  }

  dropDb() {}

  //Get system information
  setSysInfo() {
    this.app.logger.debug('Set node system information')
    if (process.server) {
      this.system.type = 'computer'
      this.system.platform = os.platform()
    } else {
      this.system.type = 'user'
      this.system.platform = navigator.userAgent
    }

    this.db.put({ doc: 'system', infos: this.system })
  }

  async getSysInfo(nodeDbID) {
    /*let dbAddress = await this.app.db.orbitdb.determineAddress(
      'nodeDb',
      'docs',
      {
        write: [nodeDbID]
      }
    )
    console.log(dbAddress)*/

    this.app.logger.debug('Get node system information for ' + nodeDbID)
    let tmpDb = await this.app.db.orbitdb.docs('nodeDb', {
      indexBy: 'doc'
    })
    //await tmpDb.load()
    let tmpSystem = await this.db.get('system')
    console.log(tmpSystem)
    return tmpSystem[0]
  }
}

export default async ({ app }, inject) => {
  app.node = new node(app)
  inject('node', app.node)
}
