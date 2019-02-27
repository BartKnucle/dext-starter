import MODULE from './_module'

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
  async register() {
    let node = {
      id: this.node.ipfs.id.id,
      dbId: this.node.db.database.address.root,
      updated: new Date()
    }

    await this.db.database.put(node)
  }

  //Check if a node exist
  check(ipfsId) {
    let node = this.db.database.get(ipfsId)
    if (node.length === 1) {
      return node[0]
    }
  }

  //Remove a swarm record from the database
  delete(id) {
    this.db.database.del(id)
  }
}
