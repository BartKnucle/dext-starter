class swarm {
  constructor() {
    this.nodes = []
    this.savedNodes = []
  }

  announce() {}

  subscribe() {
    this.ipfs.pubsub.subscribe(
      'hello',
      receiveMsg => {
        var peer = {
          id: receiveMsg.from,
          dbPath: receiveMsg.data.toString()
        }

        let foundIndex = this.peers.findIndex(element => element.id === peer.id)
        if (foundIndex === -1) {
          this.peers.push(peer) //Add the peer
        } else {
          this.peers.splice(foundIndex, 1, peer) //replace the peer
        }
      },
      err => {
        if (err) {
          console.error(err)
        }
      }
    )
  }

  createDb() {}

  dropDb() {}

  loadDb(path) {}

  addNode(id) {}

  removeNode(id) {}
}

export default async ({ app }, inject) => {
  app.swarm = new swarm()
}
