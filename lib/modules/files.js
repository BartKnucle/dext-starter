import Module from './module'

export default class Files extends Module {
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
        write: [this.node.orbitdb.getPubKey()]
      }
    })

    super.init()
  }

  //Get all files
  getAll() {
    var files = this.db.database.get('')
    return files
  }

  //Get files from a node Id
  async getByNode(nodeId) {
    var files = await this.db.database.query(files => files.id === nodeId)
    if (files.length !== 0) {
      return files[0]
    }
  }

  //Add a permission
  async add(file) {
    await this.db.database.put(file)
  }

  //remove a file
  del(id) {
    this.db.database.del(id)
  }
}
