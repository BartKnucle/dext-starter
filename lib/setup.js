//Initial node configuration
export default class SETUP {
  constructor() {
    this.isSetup = false
  }

  //Check the swarm key
  checkSwarm() {
    //https://stackoverflow.com/questions/26165725/nodejs-check-file-exists-if-not-wait-till-it-exist
  }

  //Create swarm private key
  //https://github.com/libp2p/js-libp2p-pnet/issues/3
  //https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/libp2p-nodejs.js
  // Protector library https://github.com/libp2p/js-libp2p-pnet

  //https://github.com/libp2p/js-libp2p-pnet/pull/4/commits/b37b762bee7cb428c57c981475145f2a09c9e0f4
  //Libp2p option with protector and encryption from last link
  /*{
    peerInfo,
    peerBook,
    modules: {
      transport: [ TCP ], // We're only using the TCP transport for this example
      streamMuxer: [ MPLEX ], // We're only using mplex muxing
      // Let's make sure to use identifying crypto in our pnet since the protector doesn't
      // care about node identity, and only the presence of private keys
      connEncryption: [ SECIO ],
      // Leave peer discovery empty, we don't want to find peers. We could omit the property, but it's
      // being left in for explicit readability.
      // We should explicitly dial pnet peers, or use a custom discovery service for finding nodes in our pnet
      peerDiscovery: [ ],
      connProtector: new Protector(fs.readFileSync(swarmKeyPath))
    }
  }*/

  createKey(
    //Key generation
    const writeKey = require('libp2p-pnet').generate
    const swarmKey = Buffer.alloc(95)
    writeKey(swarmKey)
    fs.writeFileSync('swarm.key', swarmKey)
  ) {}

  //add swarm key
  addKey(key) {}

  //Check the node owner
  checkOwner() {}

  //Add Owner
  addOwner() {}
}
