//Main node class
import { isNode } from 'browser-or-node'

export class NODE {
  constructor() {
    this.modules = []
    this.systemModules = ['logger', 'ipfs', 'orbitdb']
    this.customsModules = ['permissions', 'messages', 'swarm']
  }

  //Startup method
  async init() {
    //Loading the startup modules (waiting for each module to stop before starting the next)
    for await (const module of this.systemModules) {
      await this.addModule(module, 'system')
    }

    //Create the node database
    this.db = await this.orbitdb.create('NODE', {
      type: 'keyvalue',
      create: true
    })

    //With modules
    //Update the db with the system modules
    await this.db.database.put('modules', this.getModules())

    //Loading the customs modules
    for await (const module of this.customsModules) {
      await this.addCustomModule(module)
    }

    //Fill the database
    //With IPFS Id
    await this.db.database.put('id', this.ipfs.id.id)

    //With databases
    await this.db.database.put('databases', this.orbitdb.getDatabases())
    //Assign the event handler to an event:
    this.orbitdb.eventEmitter.on('dbUpdate', async () => {
      await this.db.database.put('databases', this.orbitdb.getDatabases())
    })

    //Update the ipfs peer list each time a peer connect
    await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    this.ipfs.ipfs._libp2pNode.on('peer:connect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    })

    //Update the ipfs peer list each time a peer disconnect
    this.ipfs.ipfs._libp2pNode.on('peer:disconnect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    })

    //With messages
    await this.db.database.put('messages', this.messages.getAll())
    //Assign the event handler to an event:
    this.messages.db.events.subscribe(async () => {
      await this.db.database.put('messages', this.messages.getAll())
    })

    //With permissions
    await this.db.database.put('permissions', this.permissions.getAll())
    //Assign the event handler to an event:
    this.permissions.db.events.subscribe(async () => {
      await this.db.database.put('permissions', this.permissions.getAll())
    })

    this.logger.info('Plugin NODE loaded')
  }

  //Add a module to the node
  async addModule(moduleName, type, args) {
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
        type: type,
        started: this[moduleName].started,
        isStoppable: this[moduleName].isStoppable,
        object: this[moduleName]
      })
    }
  }

  //Add a custom module to the node (after the system modules)
  async addCustomModule(moduleName, args) {
    //Add the module
    await this.addModule(moduleName, 'custom', args)
    //Update the node DB
    await this.db.database.put('modules', this.getModules())
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

  //Turn the module state On/Off
  async switchModule(id, name, value) {
    //get the module
    var module = this.modules.find(module => module.name === name)
    //If the module can be switched
    if (module.isStoppable) {
      //Switch the module value
      module.object.switch(value)
      module.started = value
      //Update the database
      var dbId = this.swarm.get(id).dbId
      let db = await this.getDb(dbId)
      await db.database.put('modules', this.getModules())
    }
  }

  //Set the node profile
  setName(name) {
    this.db.database.put('name', name)
    this.swarm.register(name)
  }

  //Start a module
  startModule() {}

  //Stop a module
  stopModule() {}
}
