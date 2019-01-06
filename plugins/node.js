import Vue from 'vue'

class node {
  ipfs
  orbitdb
  nodes
  dbId

  constructor() {
    this.init()
  }

  async init() {
    if (process.server) {
      let ipfsAPI = require('ipfs-api')
      this.ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')
      this.ipfs.swarm.addrs(function(err, addrs) {
        if (err) {
          throw err
        }
      })
    } else {
      let IPFS = require('ipfs')
      let IpfsBrowseroptions = {
        repo: String('userDB'),
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Bootstrap: []
        }
      }
      this.ipfs = new IPFS(IpfsBrowseroptions)
    }

    const OrbitDB = require('orbit-db')

    if (process.server) {
      this.orbitdb = new OrbitDB(this.ipfs, './data/orbitdb')
      this.nodes = await this.loadNodes()
      this.subscribeHello()
    } else {
      this.ipfs.on('ready', async () => {
        this.orbitdb = new OrbitDB(this.ipfs)
        this.nodes = await this.loadNodes()
        this.subscribeHello()
      })
    }
  }

  //Browser only, connect the IPFS instance to the local node. Thr local node use mDns
  connect(remoteIpfsNode) {
    if (!process.server) {
      this.ipfs.on('ready', async () => {
        await this.ipfs.swarm.connect(
          '/ip4/127.0.0.1/tcp/4003/ws/ipfs/' + remoteIpfsNode,
          err => {
            if (err) {
              console.log(err)
            }
            this.sayHello()
          }
        )
      })
    }
  }

  //register to the hello pubsub
  subscribeHello() {
    this.ipfs.pubsub.subscribe(
      'hello',
      receiveMsg => {
        console.log(receiveMsg)
      },
      err => {
        if (err) {
          console.error(err)
        }
      }
    )
  }

  //Say hello to the network and send the database path
  sayHello() {
    this.ipfs.pubsub.publish('hello', Buffer.from(this.dbId), err => {
      if (err) {
        return console.error(err)
      }
    })
  }

  //load local nodes record
  async loadNodes() {
    let db = await this.orbitdb.docs('node.db', {
      indexBy: 'doc'
    })
    this.dbId = db.id
  }

  //Sync node record with another peer
  async syncNodes() {
    let db = await this.orbitdb.docs('node.db', {
      indexBy: 'doc'
    })

    await db.load()
    await db.put({
      doc: 'nodes',
      nodes: this.nodes
    })
  }
}

export default async ({ app }) => {
  app.node = new node()

  //signaling server ipfs id and connect browser
  if (process.server) {
    let serverIpfsId = await app.node.ipfs.id()
    app.store.commit('server/setIpfsId', serverIpfsId.id)
  } else {
    app.node.connect(app.store.state.server.ipfsId)
  }

  function myFunc() {
    app.node.sayHello()
  }
  setInterval(myFunc, 1500)
}
