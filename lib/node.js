import { isNode } from 'browser-or-node'

export class NODE {
  constructor() {
    this.data = []
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
    await this.db.database.put('modules', this.getModules())

    //Update the ipfs peer list each time a peer connect
    this.ipfs.ipfs._libp2pNode.on('peer:connect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    })

    //Update the ipfs peer list each time a peer disconnect
    this.ipfs.ipfs._libp2pNode.on('peer:disconnect', async peer => {
      await this.db.database.put('peers', this.ipfs.getSwarmPeers())
    })

    this.setData(this.db)

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

  //Get a node database
  async getDb(id) {
    let dbId = id ? id : this.db.database.address.root
    let db = await this.orbitdb.open('NODE', dbId)
    return db
  }

  //Set the data object
  setData(db) {
    this.data[db.id] = {
      modules: db.database.get('modules'),
      peers: db.database.get('peers'),
      databases: this.orbitdb.getDatabases()
    }

    return this.data[db.id]
  }

  async getData(id) {
    //If data exist
    if (this.data[id]) {
      return this.data[id]
    } else {
      //Get the database
      var db = await this.getDb(id)
      //add the update event
      //Subscribe to the database observer
      db.events.subscribe(() => {
        console.log(db)
        this.setData(db)
        console.log('data update')
      })
      return this.setData(db)
    }
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
