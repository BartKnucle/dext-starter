module.exports = async function swarmMgmt() {
  var app = this.nuxt.renderer.app

  var dbNode = await app.orbitdb.docs('swarm.hello', { indexBy: 'node' })
  await dbNode.load()

  app.ipfs.pubsub.subscribe(
    'swarm/hello',
    async msg => {
      console.log(msg)
      await dbNode.put({ node: msg })
    },
    err => {
      if (err) {
        console.log(err)
      }
    }
  )

  app.ipfs.pubsub.publish('swarm/hello', Buffer.from(app.orbitdb.id), err => {
    if (err) {
      console.error(err)
    }
  })

  const path = require('path')
  this.addPlugin({
    src: path.resolve(__dirname, 'swarm-template.js'),
    fileName: 'swarm.js'
  })

  console.log('Module swarm loaded')
}
