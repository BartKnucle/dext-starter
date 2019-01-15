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
      this.app.db.ipfs.pubsub.publish('hello', Buffer.from(this.db.id), err => {
        if (err) {
          this.app.logger.err(err)
        }
        this.app.logger.debug('Announce node: ' + this.db.id)
      })
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

  async getSysInfo(nodeID) {
    console.log(nodeID)
    console.log(Buffer.from(nodeID, 'hex'))

    /*const dbAddress = await orbitdb.determineAddress('user.posts', 'eventlog', {
      write: [
        // This could be someone else's public key
        '042c07044e7ea51a489c02854db5e09f0191690dc59db0afd95328c9db614a2976e088cab7c86d7e48183191258fc59dc699653508ce25bf0369d67f33d5d77839'
      ]
    })*/

    this.app.logger.debug('Get node system information for ' + nodeID)
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
