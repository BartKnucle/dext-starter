import Module from './module'

export default class Messages extends Module {
  constructor(node) {
    super(node)
  }

  //Init the messages
  async init() {
    this.db = await this.node.orbitdb.create(this.name, {
      type: 'docstore',
      indexBy: 'id',
      create: true,
      accessController: {
        write: [this.node.orbitdb.getPubKey()]
      }
    })

    super.init()
  }

  //Get the unread messages
  getUnRead() {
    this.node.logger.silly(`Get unread messages`)
    var messages = this.db.database.get('')
    return this.node.incoming.getAllIncoming().filter(message => {
      return !messages.find(msg => msg.id === message.id)
    })
  }

  //Send a message with the ipfs ID
  async send(ipfsId, data) {
    this.node.logger.silly(`Send message to: ${ipfsId} with data: ${data}`)
    //Get the remote node messages database
    let remoteIncomingDb = await this.node.incoming.getDb(
      this.node.swarm.get(ipfsId).incomingDbId
    )

    var message = {
      data: data,
      date: new Date().toISOString(),
      from: this.node.ipfs.id.id,
      to: ipfsId
    }

    var hash = await remoteIncomingDb.database.add(message)
    message.read = true
    message.notification = false
    message.type = 'out'
    await this.db.database.put({
      id: hash,
      message: message
    })

    this.node.logger.silly(`Sent message with id: ${hash}`)
  }

  //On message reception database update
  async onReceived() {
    let unreadMsg = this.getUnRead()
    await unreadMsg.forEach(async msg => {
      msg.message.read = false
      msg.message.type = 'in'
      msg.message.notification = true
      if (msg.message.data.type === 'action') {
        var isAuth = true
        var permissions = {
          module: msg.message.data.module,
          function: msg.message.data.function
        }

        //Check if the remote node have the autorisation to execute the command
        isAuth = await this.node.permissions.check(
          msg.message.from,
          permissions
        )

        if (isAuth) {
          this.node.execute(
            msg.message.data.module,
            msg.message.data.function,
            msg.message.data.payload
          )
        }
      }
      this.node.logger.silly(`Add received message: ${msg.id} to database`)
      await this.db.database.put(msg)
    })
  }

  //Get a message with is ID
  getMsg(msgId) {
    this.node.logger.silly(`Get message with Id: ${msgId}`)
    return this.db.database.get(msgId)
  }

  //When the user read the message
  async setRead(msgId) {
    this.node.logger.silly(`Set message with Id: ${msgId} to status READ`)
    var message = this.getMsg(msgId)
    message.read = true
    await this.db.database.put(message)
  }

  //When the user remove the notification
  async setNotif(msgId) {
    this.node.logger.silly(`Set message with Id: ${msgId} to status UNNOTIFIED`)
    var message = this.getMsg(msgId)
    message.notification = false
    await this.db.database.put(message)
  }
}
