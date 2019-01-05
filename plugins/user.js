import Vue from 'vue'

export default async ({ app }) => {
  const OrbitDB = require('orbit-db')

  let IPFS = require('ipfs')

  let IpfsBrowseroptions = {
    repo: String('userDB'),
    EXPERIMENTAL: {
      pubsub: true
    },
    Bootstrap: []
  }

  var ipfs = new IPFS(IpfsBrowseroptions)

  //User event to await the ipfs ready status before loading the page
  var events = require('events')
  var eventEmitter = new events.EventEmitter()

  function waitForIpfsReady() {
    return new Promise(function(resolve) {
      eventEmitter.on('ready', resolve)
    })
  }

  ipfs.on('ready', async () => {
    app.orbitdb = new OrbitDB(ipfs)
    //register vue fonctions
    Vue.prototype.$orbitdb = app.orbitdb

    ipfs.swarm.connect(
      '/ip4/127.0.0.1/tcp/4003/ws/ipfs/' + app.store.state.node.ipfsId,
      err => {
        if (err) {
          console.log(err)
        }
        eventEmitter.emit('ready')
        console.log('connected') // if no err is present, connection is now open
      }
    )
  })

  await waitForIpfsReady()
  console.log('User OrbitDB ready')
}
