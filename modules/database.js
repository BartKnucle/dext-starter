module.exports = async function database() {
  const IPFS = require('ipfs')
  const OrbitDB = require('orbit-db')
  const MulticastDNS = require('libp2p-mdns')

  var thisModule = this

  console.log('Start IPFS Server side')
  this.ipfs = new IPFS({
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

  this.ipfs.on('error', error => {
    console.log(error)
  })

  function waitForIpfsReady() {
    return new Promise(function(resolve) {
      thisModule.ipfs.on('ready', resolve)
    })
  }

  this.ipfs.on(
    'ready',
    async function() {
      thisModule.orbitdb = new OrbitDB(thisModule.ipfs)
      process.env.nodeIpfsId = thisModule.orbitdb.id
      var dbNode = await this.orbitdb.docs('docs.test', { indexBy: 'name' })
      process.env.nodeOrbitDbPath = dbNode.id
      await dbNode.load()
      await dbNode.put({ name: 'settings', data: { node: 'ce noeud' } })
      console.log('Database ready')
    }.bind(this)
  )

  const path = require('path')
  thisModule.addPlugin({
    src: path.resolve(__dirname, 'database-plug.js'),
    fileName: 'database-plug.js'
  })
}

/*
  ///////// DESTROY
  if (process.server) {

    const MulticastDNS = require('libp2p-mdns') //Server side only
    //options server side
    options.repo = 'data/ipfs'
    options.config = {
      Addresses: {
        Swarm: ['/ip4/0.0.0.0/tcp/3001', '/ip4/127.0.0.1/tcp/9999/ws']
      },
      modules: {
        peerDiscovery: [MulticastDNS]
      },
      peerDiscovery: {
        mdns: {
          Enabled: true,
          Interval: 10
        }
      },
      Bootstrap: []
    }
  }


*/
