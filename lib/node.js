//Main node class
import { isNode } from 'browser-or-node'

export class Node {
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
    this.db = await this.orbitdb.create('node', {
      type: 'keyvalue',
      create: true
    })

    //Fill the default node informations
    this.setName()

    //With modules
    //Update the db with the system modules
    await this.db.database.put('modules', this.getModules())

    //Loading the customs modules
    for await (const module of this.customsModules) {
      await this.addCustomModule(module)
    }

    //Fill the database
    //Set node type
    await this.setType()

    //With IPFS Id
    await this.setIpfsId()

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
    console.log(modulesFunctions)
    return modulesFunctions
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

  //Set the node name
  async setName(name) {
    if (!name) {
      var name = this.getName()
      if (!name) {
        if (isNode) {
          const os = require('os')
          //If the the node is a NODEJS set the computer name
          name = os.hostname()
        } else {
          //Set Anonymous as default user
          name = 'Anonymous'
        }
      }
    }
    await this.db.database.put('name', name)

    //If the swarm is started register the node
    if (this.swarm) {
      this.swarm.register()
    }
  }

  //Get the node name
  getName() {
    return this.db.database.get('name')
  }

  //Set the node firstName
  async setFirstName(firstName) {
    await this.db.database.put('firstName', firstName)
  }

  //Set the node lastName
  async setLastName(lastName) {
    await this.db.database.put('lastName', lastName)
  }

  //Set the node type
  async setType() {
    if (!(await this.getType())) {
      if (isNode) {
        await this.db.database.put('type', 'computer')
      } else {
        await this.db.database.put('type', 'user')
      }
    }
  }

  async getType() {
    return await this.db.database.get('type')
  }

  async setIpfsId() {
    await this.db.database.put('id', this.ipfs.id.id)
  }

  //Start a module
  startModule() {}

  //Stop a module
  stopModule() {}
}
