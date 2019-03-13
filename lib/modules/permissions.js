import MODULE from './_module'

export default class PERMISSIONS extends MODULE {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the permissions
  async init() {
    //Create the permissions databases
    this.db = await this.node.orbitdb.create('PERMISSIONS', {
      type: 'docstore',
      create: true,
      write: [this.node.orbitdb.getPubKey()]
    })

    super.init()
  }

  //Get a local or remote permissions database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.node.orbitdb.open('PERMISSIONS', dbId)
    return db
  }

  //Get all node permissions
  getAll() {
    var permissions = this.db.database.get('')
    return permissions
  }

  //Add a permission
  async add(permission) {
    await this.db.database.put(permission)
  }

  //remove a permission
  del(id) {
    this.db.database.del(id)
  }
}
