class node {
  constructor() {
    this.system = {
      plateform: ''
    }

    this.peers = []
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
          Bootstrap: [],
          Discovery: {
            webRTCStar: { enable: false }
          },
          preload: {
            enabled: false,
            addresses: []
          }
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
        var peer = {
          id: receiveMsg.from,
          dbPath: receiveMsg.data.toString()
        }

        let foundIndex = this.peers.findIndex(element => element.id === peer.id)
        if (foundIndex === -1) {
          this.peers.push(peer) //Add the peer
        } else {
          this.peers.splice(foundIndex, 1, peer) //replace the peer
        }
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
    if (this.dbId) {
      this.ipfs.pubsub.publish('hello', Buffer.from(this.dbId), err => {
        if (err) {
          return console.error(err)
        }
      })
    }
  }

  //load local nodes record
  async loadNodes() {
    let db = await this.orbitdb.docs('node.db', {
      indexBy: 'doc'
    })
    this.dbId = db.id
  }

  //Get system information
  getSysInfo() {
    if (process.server) {
      const os = require('os')
      this.system.platform = os.platform()
    } else {
      this.system.platform = navigator.userAgent
    }

    console.log(this.system.platform)
  }
}

export default async ({ app }, inject) => {
  app.node = new node()

  //signaling server ipfs id and connect browser
  if (process.server) {
    let serverIpfsId = await app.node.ipfs.id()
    app.store.commit('server/setIpfsId', serverIpfsId.id)
  } else {
    app.node.connect(app.store.state.server.ipfsId)
  }

  setInterval(() => {
    app.node.sayHello()
  }, 15 * 1000)

  app.node.getSysInfo()
  inject('node', app.node)

  app.node.ipfs.config.get((err, config) => {
    if (err) {
      throw err
    }
    console.log(config)
  })
}
