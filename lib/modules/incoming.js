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
      accessController: {
        write: [this.node.orbitdb.getPubKey(), '*']
      }
    })

    //On incoming database update
    this.db.events.subscribe(async () => {
      await this.node.messages.onReceived()
    })
    super.init()
  }

  //Get all incoming messages
  getAllIncoming() {
    this.node.logger.silly(`Get all incoming messages`)
    const all = this.db.database
      .iterator({ limit: -1 })
      .collect()
      .map(e => {
        var message = {
          data: e.payload.value.data,
          date: e.payload.value.date,
          from: e.payload.value.from,
          to: e.payload.value.to
        }

        return {
          id: e.hash,
          message: message
        }
      })
    return all
  }
}
