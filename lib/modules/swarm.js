import Module from './module'
import { isNode } from 'browser-or-node'

export default class Swarm extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the swarm
  async init() {
    //Create the node database
    this.db = await this.node.orbitdb.create('swarm', {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      write: ['*']
    })

    await this.register()
    super.init()
  }
  //Register the node to the swarm
  async register() {
    //Check if the record exist
    var node = this.get(this.node.ipfs.id.id)

    var newNode = {
      id: this.node.ipfs.id.id,
      name: this.node.getName(),
      dbId: this.node.db.database.address.root,
      messagesDbId: this.node.messages.db.database.address.root
    }

    if (!node) {
      await this.db.database.put(newNode)
    } else {
      //Update only if datas are differents
      if (node != newNode && newNode.name != 'Anonymous') {
        await this.db.database.put(newNode)
      }
    }
  }

  //Get a node record from the swarm
  get(id) {
    var node = this.db.database.get(id)
    if (node.length === 1) {
      return node[0]
    }
  }

  //Remove a swarm record from the database
  delete(id) {
    this.db.database.del(id)
  }
}
