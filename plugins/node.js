import Vue from 'vue'

export default async ({ app }) => {
  const ipfsAPI = require('ipfs-api')
  app.nodeIpfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')
  if (process.server) {
    const OrbitDB = require('orbit-db')

    app.orbitdb = new OrbitDB(app.nodeIpfs, './data/orbitdb')

    let ipfsData = await app.nodeIpfs.id()
    app.store.commit('node/setIpfsId', ipfsData.id)
    console.log('Node OrbitDB ready')

    //Set Node database store
    const nodeDb = await app.orbitdb.docs('node.databases', {
      indexBy: 'path'
    })
    await nodeDb.load()

    app.store.commit('node/setDbListId', nodeDb.id)

    //Register a new database inside the main db
    var addDatabase = async function(db) {
      await nodeDb.put({
        path: db.address.path,
        root: db.address.root,
        type: db.type
      })
    }

    //set Node start database
    const nodeLog = await app.orbitdb.feed('node.logs')
    addDatabase(nodeLog)
    nodeLog.add({ title: 'Hello', content: 'World' })
  }

  //register vue fonctions
  Vue.prototype.$getNodeSwarmAddrs = app.nodeIpfs.swarm.addrs
}
