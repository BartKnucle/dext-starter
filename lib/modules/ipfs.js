import MODULE from './_module'
import { isNode } from 'browser-or-node'
const JSIPFS = require('ipfs')
const events = require('events')
const wrtc = require('wrtc') // or require('electron-webrtc')()
const WStar = require('libp2p-webrtc-star')
const wstar = new WStar({ wrtc })

export default class IPFS extends MODULE {
  constructor(node) {
    super(node)
  }

  //Create the IPFS object
  async init() {
    //Event used to track the js-ipfs spawn start
    var ipfsEvent = new events.EventEmitter()
    if (isNode) {
      const MulticastDNS = require('libp2p-mdns')
      var options = {
        repo: 'data/ipfs',
        /*relay: {
          enabled: true, // enable relay dialer/listener (STOP)
          hop: {
            enabled: true // make this node a relay (HOP)
          }
        },*/
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: [
              /*'/ip4/0.0.0.0/tcp/4002',
              '/ip4/127.0.0.1/tcp/4003/ws',
              '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star'*/
              '/ip4/127.0.0.1/tcp/9091/ws/p2p-websocket-star'
            ]
          },
          /*Announce: [],
          NoAnnounce: [],*/
          /*API: '/ip4/127.0.0.1/tcp/5001',
          Gateway: '/ip4/127.0.0.1/tcp/8080',*/
          Bootstrap: [],
          peerDiscovery: {
            mdns: {
              Enabled: true,
              Interval: 10
            }
          }
        },
        modules: {
          transport: [wstar],
          peerDiscovery: [MulticastDNS, wstar.discovery]
        },
        preload: {
          enabled: false,
          addresses: []
        }
      }
      this.ipfs = new JSIPFS(options)
    } else {
      //Client side js-ipfs node
      var wsSignalSrv =
        window.location.hostname === 'localhost'
          ? '/dns4/' +
            window.location.hostname +
            '/tcp/9091/ws/p2p-websocket-star'
          : '/ip4/' +
            window.location.hostname +
            '/tcp/9091/ws/p2p-websocket-star'

      var options = {
        repo: String('node'),
        EXPERIMENTAL: {
          pubsub: true
        },
        config: {
          Addresses: {
            Swarm: [
              /*'/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',*/
              wsSignalSrv
            ]
          },
          Bootstrap: []
        },
        preload: {
          enabled: false,
          addresses: []
        }
      }
      this.ipfs = new JSIPFS(options)
    }

    this.ipfs.on('ready', async () => {
      //Init the ipfs node
      super.init()
      ipfsEvent.emit('ipfsReady')
    })

    return new Promise(function(resolve) {
      ipfsEvent.on('ipfsReady', resolve)
    })
  }
  /*
  async _started() {
    //Set node id informations
    this.id = await this.ipfs.id()
    this.started = true
  }*/

  //Get the ipfs node addresses list from id
  getAddresses() {
    return this.id.addresses
  }

  //Get the liste of the swarm peers
  getSwarmPeers() {
    const PeerId = require('peer-id')
    const multiaddr = require('multiaddr')

    var swarmPeers = []
    this.ipfs.swarm.peers(function(err, peerInfos) {
      if (err) {
        this.app.logger.error(err)
      }
      peerInfos.forEach(element => {
        swarmPeers.push({
          id: new PeerId(element.peer.id).toB58String(),
          addrs: multiaddr(element.addr.buffer).toString()
        })
      })
    })
    return swarmPeers
  }

  //Connect to remote ipfs node
  /*async connect(address) {
    await this.ipfs.swarm.connect(
      address,
      err => {
        if (err) {
          this.app.logger.error(err)
        }
        this.app.logger.debug('connected ipfs to: ' + address)
      }
    )
  }*/
}
