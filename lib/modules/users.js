import MODULE from './_module'
import { isNode } from 'browser-or-node'

export default class USERS extends MODULE {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the swarm
  async init() {
    //Create the users database
    this.db = await this.node.orbitdb.create('USERS', {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      write: ['*']
    })

    await this.register()
    super.init()
  }
  //Register the user to the users db
  async register() {
    if (!isNode) {
      let user = {
        id: this.node.ipfs.id.id
      }
      await this.db.database.put(user)
    }
  }

  //Get a user record from the users db
  get(ipfsId) {
    var node = this.db.database.get(ipfsId)
    if (node.length === 1) {
      return node[0]
    }
  }

  //Remove a swarm record from the database
  delete(id) {
    this.db.database.del(id)
  }
}
