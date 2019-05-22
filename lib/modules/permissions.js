import Module from './module'

export default class Permissions extends Module {
  constructor(node) {
    super(node)
  }

  //Init the permissions
  async init() {
    //Create the permissions databases
    this.db = await this.node.orbitdb.create(this.name, {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      accessController: {
        write: [this.node.orbitdb.db.identity.id]
      }
    })

    super.init()
  }

  //Get all node permissions
  getAll() {
    var permissions = this.db.database.get('')
    return permissions
  }

  //Get permissions from a node Id
  async getByNode(nodeId) {
    var permissions = await this.db.database.query(
      permissions => permissions.id === nodeId
    )
    if (permissions.length !== 0) {
      return permissions[0].permissions
    }
  }

  //Add a permission
  async add(permissions) {
    await this.db.database.put(permissions)
  }

  //check permissions
  async check(nodeId, permissions) {
    var nodePermissions = await this.getByNode(nodeId)

    var isAuth = false
    if (this.getAll().length === 0) {
      isAuth = true
    } else {
      if (nodePermissions) {
        nodePermissions.forEach(element => {
          if (
            element.module === permissions.module &&
            element.function === permissions.function
          ) {
            isAuth = true
          }
        })
      }
    }
    return isAuth
  }

  //remove a permission
  del(id) {
    this.db.database.del(id)
  }
}
