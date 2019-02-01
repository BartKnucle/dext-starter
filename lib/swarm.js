import { MODULE } from './module'
import { NODE } from './node'

export class SWARM extends MODULE {
  constructor(app, id) {
    super(app, id)
  }

  //Fill the nodes with the inital data
  fill() {}

  //Liste for nodes messages
  listenNodes() {
    this.app.msg.listen('NODE', this.onMsgNodeReceived)
  }

  //On node messages received
  async onMsgNodeReceived(message) {
    var nodeDbId = Buffer.from(message.data).toString()
    this.addNode(nodeDbId)
    this.app.logger.silly('Swarm received node: ' + nodeDbId)
  }

  //Add a node to the swarm
  async addNode(nodeDbId) {
    //Add the node in the database
    this.add({
      id: nodeDbId,
      data: {}
    })

    this.app.logger.silly('Swarm added node: ' + nodeDbId + ' to database')
  }

  //add a swarm node to the swarm list
  addSwarm() {}

  //Sync swarm database with remote db
  sync() {}
}
