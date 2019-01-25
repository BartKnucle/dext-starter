import { NODE } from './node'
import { isNode } from 'browser-or-node'

export class SWARM {
  constructor(app, dbId) {
    this.app = app
    this.dbId = dbId
  }

  //listen for nodes annoucements
  listen() {
    this.app.db.ipfs.pubsub.subscribe(
      'NODE',
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

  //Create the database
  async loadDb() {
    this.dbPath = this.dbId
      ? '/orbitdb/' + this.dbId + '/' + this.constructor.name.toString()
      : this.constructor.name.toString()

    this.app.logger.info('Loadind node datbase: ' + this.dbPath)

    this.db = await this.app.db.orbitdb.docs(this.dbPath)
    this.dbId = this.db.address.root
    await this.db.load()

    if (isNode) {
      //Update the local node to set the swarm properties
      let nodeDb = await this.app.db.orbitdb.docs('NODE')
      await nodeDb.load()

      //Declare the node as swarm
      await nodeDb.put({
        _id: 'swarm',
        doc: { dbId: this.dbId }
      })
    }
  }

  //Drop the swarm database
  dropDb() {}

  //Sync swarm database with other swarms
  sync() {}

  //add a new node to the swarm
  async addNode(nodeId) {
    //If node does not exist in the swarm database
    if (this.db.get(nodeId)) {
      let node = new NODE(this.app, nodeId.dbId)
      await node.loadDb()

      let properties = {}
      properties.alive = true

      this.db.put({ _id: nodeId, doc: properties })
    }
  }
}
