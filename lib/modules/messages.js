import Module from './module'

export default class Messages extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the messages
  async init() {
    //Create the message databases
    this.db = await this.node.orbitdb.create('messages', {
      type: 'eventlog',
      create: true,
      write: [this.node.orbitdb.getPubKey(), '*']
    })

    //On incoming database update
    this.db.events.subscribe(async () => {
      await this.onReceived()
    })

    this.msgDb = await this.node.orbitdb.create('messagesDb', {
      type: 'docstore',
      indexBy: 'id',
      create: true,
      write: [this.node.orbitdb.getPubKey()]
    })

    super.init()
  }

  //Get a local or remote messages database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.node.orbitdb.open('messages', dbId)
    return db
  }

  //Get all node messages
  getAllIncoming() {
    const all = this.db.database
      .iterator({ limit: -1 })
      .collect()
      .map(e => {
        var message = {
          from: e.payload.value.from,
          to: e.payload.value.to,
          date: e.payload.value.date,
          data: e.payload.value.data
        }

        return {
          id: e.hash,
          message: message
        }
      })
    return all
  }

  //Get the unread
  getUnRead() {
    var messages = this.msgDb.database.get('')
    return this.getAllIncoming().filter(message => {
      return !messages.find(msg => msg.id === message.id)
    })
  }

  //Send a message with the ipfs ID
  async send(ipfsId, data) {
    //Get the remote node messages database
    let messagesDb = await this.getDb(this.node.swarm.get(ipfsId).messagesDbId)

    var message = {
      from: this.node.ipfs.id.id,
      to: ipfsId,
      date: new Date(),
      data: data
    }

    var hash = await messagesDb.database.add(message)
    message.read = true
    message.notification = false
    message.type = 'out'
    await this.msgDb.database.put({
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
        console.log(isAuth)
        if (isAuth) {
          console.log('check ok')
          if (permissions.module === 'node') {
            console.log('typenode ok')
            this.node[permissions.function](msg.message.data.payload)
          } else {
            this.node[permissions.module][permissions.function](
              msg.message.data.payload
            )
          }
        }
      }
      await this.msgDb.database.put(msg)
    })
  }

  //Get a message with is ID
  getMsg(msgId) {
    return this.msgDb.database.get(msgId)
  }

  //When the user read the message
  async setRead(msgId) {
    var message = this.getMsg(msgId)
    message.read = true
    await this.msgDb.database.put(message)
  }

  //When the user remove the notification
  async setNotif(msgId) {
    var message = this.getMsg(msgId)
    message.notification = false
    await this.msgDb.database.put(message)
  }
}
