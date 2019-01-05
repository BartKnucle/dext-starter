import Vue from 'vue'

export default ({ app }) => {
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
  ipfs.on('ready', async () => {
    app.orbitdb = new OrbitDB(ipfs)
    //register vue fonctions
    Vue.prototype.$orbitdb = app.orbitdb

    ipfs.swarm.connect(
      '/ip4/127.0.0.1/tcp/9999/ws/ipfs/' + app.store.state.node.ipfsId,
      err => {
        if (err) {
          console.log(err)
        }
        console.log('connected') // if no err is present, connection is now open
      }
    )
  })

  console.log('User OrbitDB ready')
}
