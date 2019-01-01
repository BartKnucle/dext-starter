export default ({ app }) => {
  if (!process.server) {
    console.log('start ipfs')
    const IPFS = require('ipfs')
    const OrbitDB = require('orbit-db')

    var options = {
      repo: String(Math.random() + Date.now()),
      EXPERIMENTAL: {
        pubsub: true
      }
    }

    const ipfs = new IPFS(options)
    app.ipfs = ipfs
    ipfs.on('ready', () => {
      console.log('ipfs ready')
      var orbitdb = new OrbitDB(app.ipfs)
      app.orbitdb = orbitdb

      ipfs.swarm.connect(
        '/ip4/127.0.0.1/tcp/9999/ws/ipfs/QmdpE4uAjXBfn4eQjTGLMuKirqjPsNy2VnRKJMkqDRX8Tk',
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
            console.log(peerInfos)
            ipfs.stats.bw((err, stats) => console.log(stats))
          })
        }
      )
    })
  }
}
