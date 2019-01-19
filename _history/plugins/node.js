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
    this.announce()
  }

  //Anounce the node
  announce() {
    setInterval(() => {
      this.app.db.ipfs.pubsub.publish('nodeDb', Buffer.from(this.dbId), err => {
        if (err) {
          this.app.logger.err(err)
        }
        this.app.logger.silly('Announce node: ' + this.dbId)
      })
    }, 15 * 1000)
  }

  async createDb() {
    this.app.logger.debug('Create nodeDb database')
    this.db = await this.app.db.orbitdb.docs('nodeDb', {
      indexBy: 'doc'
    })
    await this.db.load()
    this.dbId = this.db.address.root
    this.app.logger.silly('Node Database ID: ' + this.dbId)
    this.setSysInfo()
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
    if (nodeDbID !== 'nodeDb') {
      nodeDbID = '/orbitdb/' + nodeDbID + '/nodeDb'
    }

    this.app.logger.debug('Get node system information for ' + nodeDbID)
    var tmpDb = await this.app.db.orbitdb.docs(nodeDbID)
    await tmpDb.load()
    var tmpSystem = await tmpDb.get('system')
    return tmpSystem[0]
  }
}

export default async ({ app }, inject) => {
  app.node = new node(app)
  inject('node', app.node)
}
