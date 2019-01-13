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
          return console.error(err)
        }
      })
    }, 15 * 1000)
  }

  async createDb() {
    this.db = await this.app.db.orbitdb.docs('nodeDb', {
      indexBy: 'doc'
    })
    await this.db.load()
  }

  dropDb() {}

  //Get system information
  setSysInfo() {
    if (process.server) {
      this.system.type = 'computer'
      this.system.platform = os.platform()
    } else {
      this.system.type = 'user'
      this.system.platform = navigator.userAgent
    }

    this.db.put({ doc: 'system', infos: this.system })
    console.log('db created')
  }

  async getSysInfo(nodeDbPath) {
    let tmpDb = await this.app.db.orbitdb.docs(nodeDbPath, {
      indexBy: 'doc'
    })
    await tmpDb.load()
    let tmpSystem = await this.db.get('system')
    console.log(tmpSystem)
    return tmpSystem[0]
  }
}

export default async ({ app }, inject) => {
  app.node = new node(app)
  inject('node', app.node)
}
