import Module from './module'

export default class Incoming extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = false
  }

  //Init the incoming messages
  async init() {
    //Create the incoming databases
    this.db = await this.node.orbitdb.create(this.name, {
      type: 'eventlog',
      create: true,
      write: [this.node.orbitdb.getPubKey(), '*']
    })

    //On incoming database update
    this.db.events.subscribe(async () => {
      await this.node.messages.onReceived()
    })
    super.init()
  }

  //Get all incoming messages
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
}