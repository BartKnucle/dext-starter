import Module from './module'

export default class Swarm extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the swarm
  async init() {
    //Create the node database
    this.db = await this.node.orbitdb.create(this.name, {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      accessController: {
        admin: ['*'],
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
      id: this.node.ipfs.id.id,
      name: this.node.getName(),
      type: this.node.getType(),
      dbId: this.node.db.database.address.root,
      incomingDbId: this.node.incoming.db.database.address.root
    }

    if (!node) {
      await this.db.database.put(newNode)
    } else {
      //Update only if datas are differents
      if (JSON.stringify(node) !== JSON.stringify(newNode)) {
        await this.db.database.put(newNode)
        this.node.logger.info(`Update swarm for node ${newNode.id}`)
      }
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
