import Module from './module'
var stringify = require('json-stable-stringify')

export default class Swarm extends Module {
  constructor(node) {
    super(node)
  }

  //Init the swarm
  async init() {
    //Create the node database
    this.db = await this.node.orbitdb.create(this.name, {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      accessController: {
        write: ['*']
      }
    })

    await this.register()
    super.init()
  }
  //Register the node to the swarm
  async register() {
    //Check if the record exist
    var node = this.get(this.node.ipfs.id.id)

    var newNode = {
      dbId: this.node.db.database.address.root,
      id: this.node.ipfs.id.id,
      incomingDbId: this.node.incoming.db.database.address.root,
      name: this.node.getName(),
      type: this.node.getType(),
      online: true
    }

    if (!node) {
      await this.db.database.put(newNode)
    } else {
      //Update only if datas are differents
      if (stringify(node) !== stringify(newNode)) {
        await this.db.database.put(newNode)
        this.node.logger.info(`Update swarm for node ${newNode.id}`)
      }
    }
  }

  //Set a node status online
  async setOnline(id) {
    var node = this.get(id)
    if (node.online === false) {
      node.online = true
      await this.db.database.put(node)
    }
  }
  //Set a node status offline
  async setOffline(id) {
    var node = this.get(id)
    if (node.online === true) {
      node.online = false
      await this.db.database.put(node)
    }
  }

  //Get a node record from the swarm
  get(id) {
    this.node.logger.silly(`Get node ${id} from swarm`)
    var node = this.db.database.get(id)
    if (node.length === 1) {
      return node[0]
    }
  }

  //Remove a swarm record from the database
  delete(id) {
    this.node.logger.silly(`Delete node ${id} from swarm`)
    this.db.database.del(id)
  }
}
