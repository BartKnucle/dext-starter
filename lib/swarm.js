import { NODE } from './node'

export class SWARM {
  constructor(app, dbId) {
    this.app = app
    this.dbId = dbId
      ? '/orbitdb/' + dbId + '/' + this.constructor.name.toString()
      : this.constructor.name.toString()
  }

  //Annouce swarm node to others swarm
  announce() {}

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
        this.app.logger.debug(
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
    this.db = await this.app.db.orbitdb.docs(this.dbId)
    this.dbId = this.db.id
    await this.db.load()

    //Update the local node to set the swarm properties
    let nodeDb = await this.app.db.orbitdb.docs('NODE')
    await nodeDb.load()
    await nodeDb.put({
      _id: 'SWARM',
      doc: { dbId: this.dbId }
    })
  }

  //Drop the swarm database
  dropDb() {}

  //Sync swarm database with other swarms
  async() {}

  //add a new node to the swarm
  addNode(nodeId) {
    let node = new NODE(this.app, nodeId)
  }
}
