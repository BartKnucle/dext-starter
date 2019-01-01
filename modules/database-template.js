export default ({ app }) => {
  if (process.server) {
    app.store.commit('database/setNodeDbPath', process.env.nodeOrbitDbPath)
    app.store.commit('database/setNodeIpfsId', process.env.nodeIpfsId)
  }

  if (!process.server) {
    console.log('start ipfs')
    const IPFS = require('ipfs')
    const OrbitDB = require('orbit-db')

    var Ipfsoptions = {
      repo: String('userDB'),
      EXPERIMENTAL: {
        pubsub: true
      }
    }

    const ipfs = new IPFS(Ipfsoptions)
    app.ipfs = ipfs
    ipfs.on('ready', () => {
      console.log('ipfs ready')
      var orbitdb = new OrbitDB(app.ipfs)
      app.orbitdb = orbitdb
      app.store.commit('database/setUserIpfsId', app.orbitdb.id)

      ipfs.swarm.connect(
        '/ip4/127.0.0.1/tcp/9999/ws/ipfs/' +
          app.store.state.database.nodeIpfsId,
        function(err) {
          if (err) {
            throw err
          }
          console.log('connected') // if no err is present, connection is now open

          const load = async () => {
            console.log('open db')
            var db = await orbitdb.open(
              '/orbitdb/QmWvMuoxAR7cjfz119Cj3vt6oT8z82GCsUHtTJxhEqz6TM/systemlogstart',
              { sync: true }
            )

            console.log('load db')
            await db.load()

            console.log('db loaded')

            db.events.on('ready', () => {
              console.log('Db loaded')
            })

            db.events.on('replicated', address => {
              console.log(address)
            })
          }

          load()

          ipfs.swarm.peers(function(err, peerInfos) {
            if (err) {
              throw err
            }
            //console.log(peerInfos)
            //ipfs.stats.bw((err, stats) => console.log(stats))
          })
        }
      )
    })
  }
}
