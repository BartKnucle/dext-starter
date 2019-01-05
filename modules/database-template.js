export default async ({ app }) => {
  var ipfsAPI = require('ipfs-api')
  const OrbitDB = require('orbit-db')

  if (process.server) {
    var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')
    app.orbitdb = new OrbitDB(ipfs, './data/orbitdb')

    let ipfsData = await ipfs.id()
    app.store.commit('database/setNodeIpfsId', ipfsData.id)

  } else {
    let IPFS = require('ipfs')

    let IpfsBrowseroptions = {
      repo: String('userDB'),
      EXPERIMENTAL: {
        pubsub: true
      }
    }

    var ipfs = new IPFS(IpfsBrowseroptions)
    ipfs.on('ready', async () => {
      app.orbitdb = new OrbitDB(ipfs)

      ipfs.swarm.connect(
        '/ip4/127.0.0.1/tcp/9999/ws/ipfs/' +
          app.store.state.database.nodeIpfsId,
        err => {
          if (err) {
            console.log(err)
          }
          console.log('connected') // if no err is present, connection is now open
        }
      )
    })
  }

  console.log('OrbitDB ready')
}
