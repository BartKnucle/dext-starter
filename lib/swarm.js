const autoBind = require('auto-bind')
import { MODULE } from './module'
import { NODE } from './node'

export class SWARM extends MODULE {
  constructor(app, dbId) {
    super(app, dbId)
  }

  //Set database options
  async init() {
    this.db = await this.app.db.orbitdb.docs('SWARM', {
      indexBy: 'id',
      write: ['*']
    })

    this.db.events.on('replicated', async address => {
      console.log('replicated ' + address)
    })

    this.db.events.on('write', address => {
      console.log('write ' + address)
    })

    this.db.events.on('ready', async () => {
      console.log('Database ready')
    })

    this.db.events.on(
      'load.progress',
      (address, hash, entry, progress, total) => {
        console.log('Loading database... ' + progress + '/' + total)
      }
    )

    await this.db.load()

    this.app.logger.info('Loading DB: ' + this.dbPath)
    this.dbId = this.db.address.root
  }

  //Add ths local node to the swarm
  async registerSelf() {
    //Add the node in the database
    await this.add({
      id: this.app.node.dbId,
      data: this.app.node.get('')
    })

    this.app.logger.silly('Swarm added local node to the swarm')
  }

  //Listen for swarm database announcement
  async listen() {
    var dbId = this.app.node.get('module.swarm.dbAddress')
    if (dbId.length === 0) {
      super.listen(this.register)
    } else {
      await this.init(dbId[0].data)
      await this.registerSelf()
    }
  }

  //Annouce the swarm every 10 seconds
  announce() {
    setInterval(() => {
      super.announce()
    }, 10000)
  }

  //Register the swarm database into the local node database
  async register(message) {
    var dbId = Buffer.from(message.data).toString()
    await this.app.node.add({
      id: 'module.swarm.dbAddress',
      data: dbId
    })

    this.stopListen(this.register)
    await this.init(dbId)
  }
}
