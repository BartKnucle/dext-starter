const ipfsAPI = require('ipfs-api')
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const ipfsBrowserOptions = {
  repo: String('userDB'),
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      //Swarm: ['/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star']
    },
    Bootstrap: [],
    Discovery: {
      //webRTCStar: { enable: true, Enabled: true }
    }
  },
  preload: {
    enabled: false,
    addresses: []
  }
}

class database {
  constructor(app) {
    this.app = app
    this.createIpfs()
  }

  async createIpfs() {
    if (process.server) {
      this.ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')
      //Create OrbitDb
      this.createOrbitDb()
    } else {
      //this.app.store.commit('server/setIpfsId', serverIpfsId.id)
      this.ipfs = new IPFS(ipfsBrowserOptions)
      this.ipfs.on('ready', () => {
        this.createOrbitDb()
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

  createOrbitDb() {
    if (process.server) {
      this.orbitdb = new OrbitDB(this.ipfs, './data/orbitdb')
    } else {
      this.orbitdb = new OrbitDB(this.ipfs)
    }
  }
}

export default async ({ app }, inject) => {
  app.db = new database(app)
  //signaling server ipfs id and connect browser
  if (process.server) {
    let serverIpfsId = await app.db.ipfs.id()
    app.store.commit('server/setIpfsId', serverIpfsId.id)
  } else {
    app.db.connect(app.store.state.server.ipfsId)
  }
  inject('db', app.db)
}