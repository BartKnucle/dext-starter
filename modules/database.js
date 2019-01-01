module.exports = async function database() {
  const IPFS = require('ipfs')
  const OrbitDB = require('orbit-db')
  const MulticastDNS = require('libp2p-mdns')
  var app = this.nuxt.renderer.app

  app.ipfs = new IPFS({
    repo: 'data/ipfs',
    EXPERIMENTAL: {
      pubsub: true
    },
    modules: {
      peerDiscovery: [MulticastDNS]
    },
    config: {
      Addresses: {
        Swarm: ['/ip4/0.0.0.0/tcp/3001', '/ip4/127.0.0.1/tcp/9999/ws']
      },
      peerDiscovery: {
        mdns: {
          Enabled: true,
          Interval: 10
        }
      },
      Bootstrap: []
    }
  })

  var events = require('events')
  var eventEmitter = new events.EventEmitter()

  function waitForIpfsReady() {
    return new Promise(function(resolve) {
      eventEmitter.on('ready', resolve)
    })
  }

  app.ipfs.on('error', error => {
    console.log(error)
  })

  app.ipfs.on('ready', async function() {
    app.orbitdb = new OrbitDB(app.ipfs, './data/orbitdb')
    process.env.nodeIpfsId = app.orbitdb.id

    let dbNode = await app.orbitdb.docs('docs.test', { indexBy: 'name' })
    process.env.nodeOrbitDbPath = dbNode.id
    await dbNode.load()
    await dbNode.put({ name: 'settings', data: { node: 'ce noeud' } })

    console.log('Database ready')
    eventEmitter.emit('ready')
  })

  const path = require('path')
  this.addPlugin({
    src: path.resolve(__dirname, 'database-template.js'),
    fileName: 'database.js'
  })

  await waitForIpfsReady()

  console.log('Database module loaded')
}
