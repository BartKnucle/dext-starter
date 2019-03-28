import Module from './module'

export default class Permissions extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the permissions
  async init() {
    //Create the permissions databases
    this.db = await this.node.orbitdb.create('permissions', {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      write: [this.node.orbitdb.getPubKey()]
    })

    super.init()
  }

  //Get a local or remote permissions database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.node.orbitdb.open('permissions', dbId)
    return db
  }

  //Get all node permissions
  getAll() {
    var permissions = this.db.database.get('')
    return permissions
  }

  //Get permissions from a node Id
  async getByNode(nodeId) {
    var permissions = await this.db.database.get(nodeId)
    console.log(permissions)
    if (permissions.length !== 0) {
      return permissions[0].permissions
    }
  }

  //Add a permission
  async add(permissions) {
    await this.db.database.put(permissions)
  }

  //check
  async check(nodeId, permissions) {
    var nodePermissions = await this.getByNode(nodeId)
    console.log(nodeId)
    console.log(nodePermissions)
    if (nodePermissions) {
      console.log(nodePermissions.find(x => x === permissions))
      return nodePermissions.find(x => x === permissions)
    }
  }

  //remove a permission
  del(id) {
    this.db.database.del(id)
  }
}
