import Module from './module'

export default class Messages extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the messages
  async init() {
    this.db = await this.node.orbitdb.create(this.name, {
      type: 'docstore',
      indexBy: 'id',
      create: true,
      write: [this.node.orbitdb.getPubKey()]
    })

    super.init()
  }

  //Get the unread messages
  getUnRead() {
    var messages = this.db.database.get('')
    return this.node.incoming.getAllIncoming().filter(message => {
      return !messages.find(msg => msg.id === message.id)
    })
  }

  //Send a message with the ipfs ID
  async send(ipfsId, data) {
    //Get the remote node messages database
    let remoteIncomingDb = await this.node.incoming.getDb(
      this.node.swarm.get(ipfsId).incomingDbId
    )

    var message = {
      from: this.node.ipfs.id.id,
      to: ipfsId,
      date: new Date(),
      data: data
    }

    var hash = await remoteIncomingDb.database.add(message)
    message.read = true
    message.notification = false
    message.type = 'out'
    await this.db.database.put({
      id: hash,
      message: message
    })
  }

  //On message reception database update
  async onReceived() {
    let unreadMsg = this.getUnRead()
    await unreadMsg.forEach(async msg => {
      msg.message.read = false
      msg.message.type = 'in'
      msg.message.notification = true
      if (msg.message.data.type === 'action') {
        var permissions = {
          module: msg.message.data.module,
          function: msg.message.data.function
        }
        var isAuth = await this.node.permissions.check(
          msg.message.from,
          permissions
        )
        if (isAuth) {
          if (permissions.module === 'node') {
            this.node[permissions.function](msg.message.data.payload)
          } else {
            this.node[permissions.module][permissions.function](
              msg.message.data.payload
            )
          }
        }
      }
      await this.db.database.put(msg)
    })
  }

  //Get a message with is ID
  getMsg(msgId) {
    return this.db.database.get(msgId)
  }

  //When the user read the message
  async setRead(msgId) {
    var message = this.getMsg(msgId)
    message.read = true
    await this.db.database.put(message)
  }

  //When the user remove the notification
  async setNotif(msgId) {
    var message = this.getMsg(msgId)
    message.notification = false
    await this.db.database.put(message)
  }
}
