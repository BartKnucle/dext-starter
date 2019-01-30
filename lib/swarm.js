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
    let nodeDbId = Buffer.from(message.data)
    this.app.logger.info('Swarm received node: ' + nodeDbId)
    this.addNode(nodeDbId)
  }

  //Add a node to the swarm
  async addNode(nodeDbId) {
    //get node database
    var nodeDb = new NODE(this.app, nodeDbId)
    this.nodes.push(nodeDb)
    await nodeDb.init()
    this.app.logger.info('Swarm Synced node: ' + nodeDbId)

    //Register the node in the swarm db
    let node = {
      id: nodeDbId,
      type: nodeDb.get('infos.type'),
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
