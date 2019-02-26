import MODULE from './_module'

export default class swarm extends MODULE {
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

    this.register()
    super.init()
  }
  //Register the node to the swarm
  async register() {
    let node = {
      id: this.node.ipfs.id.id
    }

    await this.db.database.put(node)
  }
}
