import { MODULE } from './module'

export class SWARM extends MODULE {
  //Fill the nodes with the inital data
  fill() {}

  //Liste for nodes messages
  listenNodes() {
    this.app.msg.listen('NODE', this.onMsgNodeReceived)
  }

  //On node messages received
  onMsgNodeReceived(message) {
    this.app.logger.info('Swarm received node: ' + Buffer.from(message.data))
  }

  //Add a node to the database
  add() {}

  //add a swarm node to the swarm list
  addSwarm() {}

  //Sync swarm database with remote db
  sync() {}
}
