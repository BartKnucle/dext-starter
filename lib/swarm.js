import { MODULE } from './module'
import { NODE } from './node'

export class SWARM extends MODULE {
  constructor(app, id) {
    super(app, id)
    this.nodes = []
  }

  //Fill the nodes with the inital data
  fill() {}

  //Liste for nodes messages
  listenNodes() {
    this.app.msg.listen('NODE', this.onMsgNodeReceived)
  }

  //On node messages received
  onMsgNodeReceived(message) {
    var nodeDbId = Buffer.from(message.data).toString()
    if (!this.nodeExist(nodeDbId)) {
      this.app.logger.info('Swarm received node: ' + nodeDbId)
      this.addNode(nodeDbId)
    }
  }

  nodeExist(nodeDbId) {
    if (this.nodes.find(x => x.id === nodeDbId)) {
      return true
    } else {
      return false
    }
  }

  //Add a node to the swarm
  async addNode(nodeDbId) {
    //get node database
    let nodeDb = new NODE(this.app, nodeDbId)
    //this.nodes.push(nodeDb)
    await nodeDb.init()

    this.nodes.push({
      id: nodeDbId,
      db: nodeDb
    })

    this.app.logger.info('Swarm Synced node: ' + nodeDbId)

    //Register the node in the swarm db
    let node = {
      id: nodeDbId,
      type: await nodeDb.get('plateform.type').data,
      alive: true
    }

    this.add(node)
    this.app.logger.info('Swarm Registered: ' + nodeDbId)
  }

  //add a swarm node to the swarm list
  addSwarm() {}

  //Sync swarm database with remote db
  sync() {}
}
