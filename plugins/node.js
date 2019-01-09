const OrbitDB = require('orbit-db')
const os = require('os')
const ipfsAPI = require('ipfs-api')

class node {
  constructor() {
    this.system = {}
    this.peers = []
  }

  initIpfs() {
    if (process.server) {
      this.ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')
    } else {
      let IPFS = require('ipfs')
      let IpfsBrowseroptions = {
        repo: String('userDB'),
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: [
              '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
            ]
          },
          Bootstrap: [],
          Discovery: {
            webRTCStar: { enable: true, Enabled: true }
          },
          preload: {
            enabled: false,
            addresses: []
          }
        }
      }
      this.ipfs = new IPFS(IpfsBrowseroptions)
    }
  }

  async initDatabase() {
    this.subscribeHello()

    if (process.server) {
      this.orbitdb = new OrbitDB(this.ipfs, './data/orbitdb')
    } else {
      this.orbitdb = new OrbitDB(this.ipfs)
    }

    await this.createDatabase()
    await this.setSysInfo()
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
    if (this.db.id) {
      this.ipfs.pubsub.publish('hello', Buffer.from(this.db.id), err => {
        if (err) {
          return console.error(err)
        }
      })
    }
  }

  //create and load node database
  async createDatabase() {
    this.db = await this.orbitdb.docs('nodeDb', {
      indexBy: 'doc'
    })
    await this.db.load()
  }

  //Get system information
  setSysInfo() {
    if (process.server) {
      this.system.platform = os.platform()
    } else {
      this.system.platform = navigator.userAgent
    }

    this.db.put({ doc: 'system', infos: this.system })
  }

  async getSysInfo(nodeDbPath) {
    return await this.db.get(nodeDbPath)
  }
}

export default async ({ app }, inject) => {
  app.node = new node()
  app.node.initIpfs()

  if (process.server) {
    app.node.initDatabase()
  } else {
    app.node.ipfs.on('ready', async () => {
      await app.node.initDatabase()
    })
  }

  inject('node', app.node)

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
}
