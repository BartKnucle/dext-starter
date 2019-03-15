import MODULE from './_module'
import { isNode } from 'browser-or-node'

export default class SWARM extends MODULE {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the swarm
  async init() {
    //Create the node database
    this.db = await this.node.orbitdb.create('SWARM', {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      write: ['*']
    })

    await this.register()
    super.init()
  }
  //Register the node to the swarm
  async register(name) {
    //Check if the record exist
    var node = this.get(this.node.ipfs.id.id)

    //Set the default names if note specified
    if (!name) {
      var name = ''
      if (isNode) {
        const os = require('os')
        //If the the node is a NODEJS set the computer name
        name = os.hostname()
      } else {
        //Set Anonymous as default user
        name = 'Anonymous'
      }
    }

    var newNode = {
      id: this.node.ipfs.id.id,
      name: name,
      dbId: this.node.db.database.address.root,
      messagesDbId: this.node.messages.db.database.address.root
    }

    if (!node) {
      await this.db.database.put(newNode)
    } else {
      //Update only if datas are differents
      if (node != newNode) {
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
