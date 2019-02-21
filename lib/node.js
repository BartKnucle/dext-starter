import { isNode } from 'browser-or-node'

export class NODE {
  constructor() {
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
    await this.db.put('modules', this.getModules())

    //Update the ipfs peer list each time a peer connect
    this.ipfs.ipfs._libp2pNode.on('peer:connect', async peer => {
      console.log(this.ipfs.getSwarmPeers())
      await this.db.put('peers', this.ipfs.getSwarmPeers())
    })

    //Update the ipfs peer list each time a peer disconnect
    this.ipfs.ipfs._libp2pNode.on('peer:disconnect', async peer => {
      console.log(this.ipfs.getSwarmPeers())
      await this.db.put('peers', this.ipfs.getSwarmPeers())
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
      //Add the module to the modules list
      this.modules.push({
        name: moduleName,
        started: this[moduleName].started,
        isStoppable: this[moduleName].isStoppable,
        object: this[moduleName]
      })
      //Add the modules to the database
    }
  }

  //Get all node informations
  async getDb(id) {
    let dbId = id ? id : this.db.address.root
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
}
