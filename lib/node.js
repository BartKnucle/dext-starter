import { isNode } from 'browser-or-node'
const events = require('events')

export class NODE {
  constructor() {
    this.eventEmitter = new events.EventEmitter()
    this.modules = []
    this.startModules = ['logger', 'ipfs', 'orbitdb']
  }

  //Startup method
  async init() {
    //Loading the startup modules (waiting for each module to stop before startting the next)
    for await (const module of this.startModules) {
      await this.addModule(module)
    }

    //Create the node database
    this.db = await this.orbitdb.create('NODE', {
      type: 'keyvalue',
      create: true
    })

    //Fill the database

    //With modules
    await this.db.database.put('modules', this.getModules())

    //With databases
    await this.db.database.put('databases', this.getDatabases())
    //Assign the event handler to an event:
    this.eventEmitter.on('dbUpdate', async () => {
      await this.db.database.put('databases', this.getDatabases())
    })

    //Update the ipfs peer list each time a peer connect
    this.ipfs.ipfs._libp2pNode.on('peer:connect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    })

    //Update the ipfs peer list each time a peer disconnect
    this.ipfs.ipfs._libp2pNode.on('peer:disconnect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    })

    this.logger.info('Plugin NODE loaded')
  }

  //Add a module to the node
  async addModule(moduleName, args) {
    //If the module is not allready loaded
    if (!this[moduleName]) {
      //Dynamic module import
      var moduleImport = require('./modules/' + moduleName + '.js')
      //Module object creation with dynamic instanciation
      if (isNode) {
        this[moduleName] = new moduleImport(this, args)
      } else {
        this[moduleName] = new moduleImport.default(this, args)
      }
      //Initialise the module
      await this[moduleName].init()
      //Add the modules to the database
      this.modules.push({
        name: moduleName,
        started: this[moduleName].started,
        isStoppable: this[moduleName].isStoppable,
        object: this[moduleName]
      })
    }
  }

  //Get a local or node database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.orbitdb.open('NODE', dbId)
    return db
  }

  //Get the modules list
  getModules() {
    //Remove the useless objects from the return
    return this.modules.map(module => {
      const { object, ...rest } = module
      return { ...rest }
    })
  }

  //Get the database list
  getDatabases() {
    //Remove the useless objects from the return
    return this.orbitdb.databases.map(databases => {
      const { database, events, ...rest } = databases
      return { ...rest }
    })
  }
}
