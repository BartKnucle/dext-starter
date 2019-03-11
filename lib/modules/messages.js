import MODULE from './_module'

export default class MESSAGES extends MODULE {
  constructor(node) {
    super(node)
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

  //Send a message with the ipfs ID
  async send(ipfsId) {
    //Get the node database infos from the swarm
    let nodeInfos = this.node.swarm.get(ipfsId)
    //Get the node remote database
    let nodeDb = await this.node.getDb(nodeInfos.dbId)
    //Get the remote node messages database
    let messagesDb = await this.getDb(nodeDb.database.get('messagesDbId'))

    var message = {
      from: this.node.ipfs.id
    }

    const hash = await messagesDb.add(message)
    return hash
  }
}
