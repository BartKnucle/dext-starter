export default async ({ app }) => {
  var ipfsAPI = require('ipfs-api')
  // or connect with multiaddr
  var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')

  const OrbitDB = require('orbit-db')

  if (process.server) {
    var orbitdb = new OrbitDB(ipfs, './data/orbitdb')
  } else {
    var orbitdb = new OrbitDB(ipfs)
  }

  var db = await orbitdb.docs('test.api', { indexBy: 'module' })

  db.put({ module: 'api', address: 'test dapi' })
}
