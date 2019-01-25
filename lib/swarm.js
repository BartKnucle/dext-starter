import { MODULE } from './module'

export class SWARM extends MODULE {
  //Liste for nodes messages
  listenNodes() {
    this.app.msg.listen('NODE', this.onMsgNodeReceived)
  }

  //On node messages received
  onMsgNodeReceived(message) {
    console.log(message)
  }
}
