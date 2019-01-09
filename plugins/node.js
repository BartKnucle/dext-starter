const os = require('os')

//class replace the old one
class node {
  constructor(app) {
    this.app = app
    this.system = {}
    this.createDb()
  }

  //Anounce the node
  announce() {
    setInterval(() => {
      this.app.ipfs.pubsub.publish('hello', Buffer.from(this.db.id), err => {
        if (err) {
          return console.error(err)
        }
      })
    }, 15 * 1000)
  }

  async createDb() {
    this.db = await this.app.orbitdb.docs('nodeDb', {
      indexBy: 'doc'
    })
    await this.db.load()
    this.announce()
    this.setSysInfo()
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
  }

  async getSysInfo() {
    return await this.db.get(nodeDbPath)
  }
}

export default async ({ app }, inject) => {
  if (process.server) {
    app.node = new node(app)
  } else {
    app.ipfs.on('ready', async () => {
      app.node = new node(app)
    })
  }
}
