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
    if (!process.server) {
      this.createIpfs()
    }
  }

  async createIpfs() {
    this.app.logger.info('Create IPFS')
    if (process.server) {
      this.ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
      this.ipfsId = await this.ipfs.id()
      //Create OrbitDb
      this.createOrbitDb()
    } else {
      //this.app.store.commit('server/setIpfsId', serverIpfsId.id)
      this.ipfs = new IPFS(ipfsBrowserOptions)
      this.ipfs.on('ready', async () => {
        this.createOrbitDb()
        this.ipfsId = await this.ipfs.id()
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
              this.app.logger.error(err)
            }
            this.app.logger.debug('connected ipfs to: ' + remoteIpfsNode)
          }
        )
      })
    }
  }

  createOrbitDb() {
    this.app.logger.info('Create OrbitDb')
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
    await app.db.createIpfs()
    app.store.commit('server/setIpfsId', app.db.ipfsId.id)
    app.logger.debug('Storing Ipfs node ID: ' + app.db.ipfsId.id)
  } else {
    app.db.connect(app.store.state.server.ipfsId)
  }
  inject('db', app.db)
}
