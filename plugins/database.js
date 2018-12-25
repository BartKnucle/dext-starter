export default ({ app }) => {
  console.log('start ipfs')

  const IPFS = require('ipfs')
  const OrbitDB = require('orbit-db')

  var options = {
    repo: String(Math.random() + Date.now()),
    EXPERIMENTAL: {
      pubsub: true
    }
  }

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

  const ipfs = new IPFS(options)
  app.ipfs = ipfs
  ipfs.on('ready', () => {
    console.log('ipfs ready')
    var orbitdb = new OrbitDB(ipfs)
    app.orbitdb = orbitdb

    if (!process.server) {
      ipfs.swarm.connect(
        '/ip4/127.0.0.1/tcp/9999/ws/ipfs/QmYsRYcrQAftGS5U6XRsHdxiVDdGowAfCCYZLgxgL5JGpu',
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
    }
  })
}
