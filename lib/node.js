//Main node class
import { isNode } from 'browser-or-node'

export class Node {
  constructor() {
    this.modules = []
    this.systemModules = ['logger', 'ipfs', 'orbitdb']
    this.customsModules = [
      'permissions',
      'messages',
      'incoming',
      'swarm' //,
      //      'swarmMgmt'
    ]
  }

  //Startup method
  async init() {
    //Loading the startup modules (waiting for each module to stop before starting the next)
    for await (const module of this.systemModules) {
      await this.addModule(module, 'system')
    }

    //Create the node database
    this.db = await this.orbitdb.create('node', {
      type: 'keyvalue',
      create: true,
      accessController: {
        write: [this.orbitdb.db.identity.publicKey]
      }
    })
    //With IPFS Id
    await this.setIpfsId()

    //Fill the default node informations
    if (!this.getName()) {
      if (isNode) {
        const os = require('os')
        await this.setName(os.hostname())
      } else {
        await this.setName('Anonymous')
      }
    }

    //Fill the database
    //Set node type
    if (isNode) {
      await this.setType('computer')
    } else {
      await this.setType('user')
    }

    //With modules
    //Update the db with the system modules
    await this.db.database.put('modules', this.getModules())

    //Loading the customs modules
    for await (const module of this.customsModules) {
      await this.addCustomModule(module)
    }

    //With databases
    await this.db.database.put('databases', this.orbitdb.getDatabases())
    //Assign the event handler to an event:
    this.orbitdb.eventEmitter.on('dbUpdate', async () => {
      await this.db.database.put('databases', this.orbitdb.getDatabases())
      this.logger.silly(`update node databases list`)
    })

    //Update the ipfs peer list each time a peer connect
    await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    this.ipfs.ipfs.libp2p.on('peer:connect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
      this.logger.silly(`New peer connected`)
    })

    //Update the ipfs peer list each time a peer disconnect
    this.ipfs.ipfs.libp2p.on('peer:disconnect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
      this.logger.silly(`Peer dicconnected`)
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
      this[moduleName] = new moduleImport.default(this, args)
      //Initialise the module
      await this[moduleName].init()
      //Add the modules to the database
      var module = {
        name: moduleName,
        started: this[moduleName].started,
        stoppable: this[moduleName].stoppable,
        type: type,
        object: this[moduleName]
      }

      this.modules.push(module)
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
    let db = await this.orbitdb.open('node', dbId)
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

  getFunctions(moduleName) {
    return Object.getPrototypeOf(this[moduleName])
  }

  //Get all the modules functions
  getModulesFunctions() {
    var modulesFunctions = {}
    this.getModules().forEach(module => {
      modulesFunctions[module.name] = {}
      modulesFunctions[module.name] = Object.getPrototypeOf(this[module.name])
    })
    return modulesFunctions
  }

  //Turn the module state On/Off
  async switchModule(id, name) {
    //get the module
    var module = this.modules.find(module => module.name === name)
    //If the module can be switched
    if (module.stoppable) {
      //Switch the module value
      module.object.switch()
      module.started = !module.started
      //Update the database
      var dbId = this.swarm.get(id).dbId
      let db = await this.getDb(dbId)
      await db.database.put('modules', this.getModules())
    }
  }

  //Set the node name
  async setName(name) {
    if (name != this.getName()) {
      await this.db.database.put('name', name)
      this.logger.silly(`Set node name: ${name}`)

      //If the swarm is started register the node
      if (this.swarm) {
        await this.swarm.register()
      }
    }
  }

  //Get the node name
  getName() {
    return this.db.database.get('name')
  }

  //Set the node firstName
  async setFirstName(firstName) {
    if (firstName != this.getName()) {
      await this.db.database.put('firstName', firstName)
      this.logger.silly(`Set node firstName: ${firstName}`)
    }
  }

  //Get the first name
  getFirstName() {
    return this.db.database.get('firstName')
  }

  //Set the node lastName
  async setLastName(lastName) {
    if (lastName != this.getName()) {
      await this.db.database.put('lastName', lastName)
      this.logger.silly(`Set node lastName: ${lastName}`)
    }
  }

  //Get the node lastName
  getLastName() {
    return this.db.database.get('lastName')
  }

  //Set the node type
  async setType(type) {
    if (type != this.getType()) {
      await this.db.database.put('type', type)
      this.logger.silly(`Set node type: ${type}`)
    }
  }

  getType() {
    return this.db.database.get('type')
  }

  async setIpfsId() {
    await this.db.database.put('id', this.ipfs.id.id)
  }

  getIpfsId() {
    return this.db.database.get('id')
  }

  //Execute a local or remote command
  async execute(mod, func, pay, id) {
    if (id === this.getIpfsId() || !id) {
      if (mod === 'node') {
        await this[func](pay)
      } else {
        await this[mod][func](pay)
      }
      this.logger.info(`Execute command: ${mod} -> ${func} -> ${pay}`)
    } else {
      var data = {
        type: 'action',
        module: mod,
        function: func,
        payload: pay
      }

      await this.messages.send(id, data)
    }
  }

  //Start a module
  startModule() {}

  //Stop a module
  stopModule() {}
}
