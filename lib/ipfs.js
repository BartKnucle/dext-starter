import { isNode } from 'browser-or-node'
const JSIPFS = require('ipfs')
const events = require('events')

export class IPFS {
  constructor(app) {
    //Use the app oject to access app functionnality (logger etc)
    this.app = app
  }

  //Create the IPFS object
  async create() {
    //Event used to track the js-ipfs spawn start
    var ipfsEvent = new events.EventEmitter()
    if (isNode) {
      const MulticastDNS = require('libp2p-mdns')
      var options = {
        repo: 'data/ipfs',
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: ['/ip4/127.0.0.1/tcp/4001/ws', '/ip4/0.0.0.0/tcp/4002']
          },
          Bootstrap: [],
          peerDiscovery: {
            mdns: {
              Enabled: true,
              Interval: 10
            }
          }
        },
        modules: {
          peerDiscovery: [MulticastDNS]
        }
      }
      this.ipfs = new JSIPFS(options)
    } else {
      //Client side js-ipfs node
      var options = {
        repo: String('userDB'),
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: [
              //'/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
            ]
          },
          Bootstrap: []
        }
      }
      this.ipfs = new JSIPFS(options)
    }

    this.ipfs.on('ready', async () => {
      //Init the ipfs node
      await this.init()
      ipfsEvent.emit('ipfsReady')
    })

    return new Promise(function(resolve) {
      ipfsEvent.on('ipfsReady', resolve)
    })
  }

  async init() {
    //Set node id informations
    this.id = await this.ipfs.id()
  }

  //Get the ipfs node addresses list from id
  getAddresses() {
    return this.id.addresses
  }

  //Connect to remote ipfs node
  async connect(address) {
    await this.ipfs.swarm.connect(
      address,
      err => {
        if (err) {
          this.app.logger.error(err)
        }
        this.app.logger.debug('connected ipfs to: ' + address)
      }
    )
  }
}
