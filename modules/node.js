module.exports = async function node() {
  const IPFS = require('ipfs')
  const OrbitDB = require('orbit-db')
  const MulticastDNS = require('libp2p-mdns')

  const IPFSFactory = require('ipfsd-ctl')

  var ipfsConfig = {
    Addresses: {
      Swarm: ['/ip4/0.0.0.0/tcp/3001', '/ip4/127.0.0.1/tcp/9999/ws'],
      API: '/ip4/127.0.0.1/tcp/5002'
    },
    Bootstrap: []
  }

  //IPFSFactory.create({ exec: './node_modules/go-ipfs-dep/go-ipfs/ipfs' }).spawn( //for go-ipfs usage
  IPFSFactory.create({ exec: './node_modules/.bin/jsipfs' }).spawn(
    {
      disposable: false,
      config: ipfsConfig,
      init: false,
      start: true,
      args: ['--enable-pubsub-experiment']
    },
    (err, ipfsd) => {
      if (err) {
        throw err
      }
    }
  )

  /*var ipfs = new IPFS({
    repo: 'data/ipfs',
    EXPERIMENTAL: {
      pubsub: true
    } ,
    modules: {
      peerDiscovery: [MulticastDNS]
    },
    config: {
      Addresses: {
        Swarm: ['/ip4/0.0.0.0/tcp/3001', '/ip4/127.0.0.1/tcp/9999/ws'],
        API: '/ip4/127.0.0.1/tcp/5002'
      },
      peerDiscovery: {
        mdns: {
          Enabled: true,
          Interval: 10
        }
      },
      Bootstrap: []
    }
  })*/

  var events = require('events')
  var eventEmitter = new events.EventEmitter()

  function waitForIpfsReady() {
    return new Promise(function(resolve) {
      eventEmitter.on('ready', resolve)
    })
  }

  /*ipfs.on('error', error => {
    console.log(error)
  })

  ipfs.on('ready', async function() {
    console.log('Database ready')
    eventEmitter.emit('ready')
  })*/

  //await waitForIpfsReady()

  /*const path = require('path')
  this.addPlugin({
    src: path.resolve(__dirname, 'node-template.js'),
    fileName: 'node.js',
    ssr: true
  })*/

  console.log('Node module loaded')
}
