class swarm {
  constructor(app) {
    this.app = app
    this.nodes = []
    if (process.server) {
      this.init()
    } else {
      this.app.db.ipfs.on('ready', async () => {
        this.init()
      })
    }
  }

  init() {
    this.subscribe()
    //this.createDb()
  }

  //Anounce the node
  announce() {
    setInterval(() => {
      this.app.db.ipfs.pubsub.publish('swarm', Buffer.from(this.db.id), err => {
        if (err) {
          this.app.logger.error(err)
        }
      })
    }, 15 * 1000)
  }

  subscribe() {
    this.app.db.ipfs.pubsub.subscribe(
      'nodeDb',
      receiveMsg => {
        var node = {
          id: receiveMsg.from,
          dbId: receiveMsg.data.toString()
        }
        this.addNode(node)
        this.app.logger.silly(
          'Receive node pubsub from: ' + node.id + ' data: ' + node.dbId
        )
      },
      err => {
        if (err) {
          this.app.logger.err(err)
        }
      }
    )
  }

  async createDb() {
    this.db = await this.app.db.orbitdb.docs('swarmDb', {
      indexBy: 'doc'
    })
  }

  dropDb() {}

  async getNodes(path) {
    let tmpNodes = await this.db.get(path)
    return tmpNodes
  }

  addNode(node) {
    let foundIndex = this.nodes.findIndex(element => element.id === node.id)
    if (foundIndex === -1) {
      this.nodes.push(node) //Add the peer
    } else {
      this.nodes.splice(foundIndex, 1, node) //replace the peer
    }

    //this.db.put({ doc: 'nodes', nodes: this.nodes })
  }

  removeNode(id) {}
}

export default async ({ app }, inject) => {
  app.swarm = new swarm(app)
  inject('swarm', app.swarm)
}
