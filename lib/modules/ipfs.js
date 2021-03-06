import Module from './module'
import { isNode } from 'browser-or-node'
const JSIPFS = require('ipfs')
const events = require('events')
const wrtc = require('wrtc') // or require('electron-webrtc')()
const WStar = require('libp2p-webrtc-star')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const wstar = new WStar({ wrtc })
const fs = require('fs')
const Protector = require('libp2p-pnet')
const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const MulticastDNS = require('libp2p-mdns')

export default class Ipfs extends Module {
  constructor(node) {
    super(node)
    //this.setPrivateKey()
    //this.privateKey = this.getPrivateKey()
  }

  //Create the IPFS object
  async init() {
    //Event used to track the js-ipfs spawn start
    var ipfsEvent = new events.EventEmitter()
    var ipAddress = '172.20.9.131'

    if (isNode) {
      //Construct the swarm addresses
      var swarm = []
      var os = require('os')
      var ifaces = os.networkInterfaces()

      Object.keys(ifaces).forEach(ifname => {
        var alias = 0

        ifaces[ifname].forEach(iface => {
          if ('IPv4' !== iface.family) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return
          }

          if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            swarm.push('/ip4/' + iface.address + '/tcp/4001')
            swarm.push('/ip4/' + iface.address + '/tcp/4002/ws')
            swarm.push(
              '/ip4/' + iface.address + '/tcp/9091/ws/p2p-websocket-star'
            )
          } else {
            swarm.push('/ip4/' + iface.address + '/tcp/4001')
            swarm.push('/ip4/' + iface.address + '/tcp/4002/ws')
            swarm.push(
              '/ip4/' + iface.address + '/tcp/9091/ws/p2p-websocket-star'
            )
          }
          ++alias
        })
      })

      console.log(swarm)


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
        modules: {
          transport: [TCP, WS, wstar],
          peerDiscovery: [MulticastDNS, wstar.discovery]
        },
        config: {
          /*Addresses: {
            Swarm: [
              '/dns4/' + os.hostname() + '/tcp/4001',
              '/dns4/' + os.hostname() + '/tcp/4002/ws',
              '/dns4/' + os.hostname() + '/tcp/9091/ws/p2p-websocket-star',
              // '/ip4/127.0.0.1/tcp/9091/ws/p2p-websocket-star'
              '/dns4/localhost/tcp/9091/ws/p2p-websocket-star'
            ]
          },*/
          /*Announce: [],
          NoAnnounce: [],*/
          /*API: '/ip4/127.0.0.1/tcp/5001',
          Gateway: '/ip4/127.0.0.1/tcp/8080',*/
          Addresses: {
            Swarm: swarm
          },
          Bootstrap: [],
          peerDiscovery: {
            mdns: {
              Enabled: true,
              Interval: 10
            }
          }
        },
        preload: {
          enabled: false,
          addresses: []
        }
      }
      this.ipfs = new JSIPFS(options)
    } else {
      //Client side js-ipfs node
      var options = {
        repo: String('node'),
        EXPERIMENTAL: {
          pubsub: true
        },
        modules: {
          //connProtector: new Protector(this.privateKey)
        },
        config: {
          Addresses: {
            Swarm: [
              //'/ip4/' + ipAddress + '/tcp/9091/ws/p2p-websocket-star',
              '/dns4/' +
                window.location.hostname +
                '/tcp/9091/ws/p2p-websocket-star'
              //'/dns4/localhost/tcp/9091/ws/p2p-websocket-star'
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
      this.id = await this.ipfs.id()
      super.init()
      ipfsEvent.emit('ipfsReady')
    })

    return new Promise(function(resolve) {
      ipfsEvent.on('ipfsReady', resolve)
    })
  }

  //Generate a new swarm private key
  generatePrivateKey() {
    var key = Buffer.alloc(95)
    require('libp2p-pnet').generate(key)
    this.node.logger.silly(`Generate private key: ${key}`)
    return key
  }

  //Get the current swarm private key
  getPrivateKey() {
    var key = ''
    if (isNode) {
      //If the key file exist
      /*if (fs.existsSync('./data/ipfs/swarm.key')) {
        
      } else {
        //generate a random key
        key = this.generatePrivateKey()
      }*/
      key = fs.readFileSync('./data/ipfs/swarm.key', 'utf8')
    } else {
      key = localStorage.getItem('swarm.key')
      if (!key) {
        key = this.generatePrivateKey()
      }
    }
    return key
  }

  //Set and save the swarm private key
  setPrivateKey(key) {
    //Create key server side
    if (!key) {
      var key = this.generatePrivateKey()
    }
    if (isNode) {
      fs.writeFileSync('./data/ipfs/swarm.key', key)
    } else {
      if (key) {
        localStorage.setItem('swarm.key', key)
      }
    }

    this.privateKey = key
    //Restart ipfs
    this.restart()
  }

  //Get the ipfs node addresses list from id
  getAddresses() {
    this.node.logger.silly(`Get adresses: ${this.id.addresses}`)
    return this.id.addresses
  }

  //Get the liste of the swarm peers
  getSwarmPeers() {
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
  async connect(address) {
    await this.ipfs.swarm.connect(
      address,
      err => {
        if (err) {
          this.node.logger.error(err)
        }
        this.node.logger.debug(`connected ipfs to: ${address}`)
      }
    )
  }

  //Stop the ipfs node
  stop() {
    this.ipfs.stop(() => {
      super.stop()
    })
  }

  //Start the ipfs node
  start() {
    this.ipfs.start(() => {
      super.start()
    })
  }

  //restart the ipfs node
  restart() {
    super.restart()
  }
}
