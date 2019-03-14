import MODULE from './_module'

export default class MESSAGES extends MODULE {
  constructor(node) {
    super(node)
    //this.isStoppable = false
  }

  //Init the messages
  async init() {
    //Create the message databases
    this.db = await this.node.orbitdb.create('MESSAGES', {
      type: 'eventlog',
      create: true,
      write: [this.node.orbitdb.getPubKey(), '*']
    })

    super.init()
  }

  //Get a local or messages database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.node.orbitdb.open('MESSAGES', dbId)
    return db
  }

  //Get all node messages
  getAll() {
    const all = this.db.database
      .iterator({ limit: -1 })
      .collect()
      .map(e => e.payload.value)
    return all
  }

  //Send a message with the ipfs ID
  async send(ipfsId, data) {
    //Get the remote node messages database
    let messagesDb = await this.getDb(this.node.swarm.get(ipfsId).messagesDbId)

    message.from = this.node.ipfs.id.id
    message.sent = new Date()
    message.data = data

    const hash = await messagesDb.database.add(message)
    return hash
  }
}
