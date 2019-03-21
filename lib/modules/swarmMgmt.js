import Module from './module'

export default class SwarmMgmt extends Module {
  constructor(node) {
    super(node)
    this.isStoppable = true
    this.monitor = false
    this.monitoredNodes = []
  }

  //Init the swarm
  async init() {
    //Create the node database
    this.db = await this.node.orbitdb.create('swarmMgmt', {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      write: ['*']
    })

    this.startMonitor()

    super.init()
  }

  //Start the module
  start() {
    this.monitor = true
  }

  //Stop the module
  stop() {
    this.monitor = false
  }

  //Monitor the swarm database to register the nodes informations on updates
  async startMonitor() {
    this.monitor = true
    this.fill()
    this.node.swarm.db.events.subscribe(() => {
      //update the data on swarm update if monitoring is On
      this.fill()
    })
  }

  //Check if the node is allready under monitoring
  isMonitored(node) {
    let monitoredNode = this.monitoredNodes.find(
      monitoredNode => monitoredNode === node.id
    )

    if (monitoredNode) {
      return monitoredNode
    }
  }

  //Inital swarm mgmt
  fill() {
    if (this.monitor) {
      //Open all the nodes databases for updates sync
      var nodes = this.node.swarm.db.database.get('')
      nodes.forEach(async node => {
        //Check if the node is allready monitored
        if (!this.isMonitored(node)) {
          var db = await this.node.getDb(node.dbId)
          let newNode = db.database.all()
          await this.register(newNode)
          this.monitoredNodes.push(node.id)
          db.events.subscribe(async () => {
            //update the data on swarm update if monitoring is On
            if (this.monitor) {
              let newNode = db.database.all()
              await this.register(newNode)
            }
          })
        }
      })
    }
  }

  //Register the node to the swarm managment
  async register(newNode) {
    const {
      databases,
      peers,
      modules,
      messages,
      permissions,
      ...rest
    } = newNode

    newNode = { ...rest }

    var node = this.get(newNode.id)
    console.log(node)
    console.log(newNode)
    if (node != newNode) {
      await this.db.database.put(newNode)
    }
  }

  //Get a node from the swarm_mgmt db
  get(nodeId) {
    var node = this.db.database.get(nodeId)
    if (node.length === 1) {
      return node[0]
    }
  }

  //Remove a swarm management record from the database
  delete(id) {
    this.db.database.del(id)
  }
}