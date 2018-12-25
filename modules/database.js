module.exports = function database() {
  const IPFS = require('ipfs')
  const OrbitDB = require('orbit-db')
  const MulticastDNS = require('libp2p-mdns')

  console.log('Start IPFS Server side')
  var ipfs = new IPFS({
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

  ipfs.on('error', error => {
    console.log(error)
  })

  ipfs.on('ready', () => {
    var orbitdb = new OrbitDB(ipfs)
    store.commit('setLocalNodeId', orbitdb.id)

    const saveNode = async () => {
      let dbNode = await orbitdb.docs('docs.test', { indexBy: 'name' })
      await dbNode.load()
      await dbNode.put({ name: 'settings', data: { node: 'ce noeud' } })
    }

    saveNode()
  })
}
