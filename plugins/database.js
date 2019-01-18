
class database {
  constructor(app) {
    this.peers = []
    this.app = app
    if (!process.server) {
      this.createIpfs()
    }
  }

  //Browser only, connect the IPFS instance to the local node. Thr local node use mDns
  connect(remoteIpfsNode) {
    if (!process.server) {
      this.ipfs.on('ready', async () => {
        
      })
    }
  }

  createOrbitDb() {
    
  }
}

export default async ({ app }, inject) => {
  app.db = new database(app)
  //signaling server ipfs id and connect browser
  
  inject('db', app.db)
}
