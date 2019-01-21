import { isNode } from 'browser-or-node'
const IPFSAPI = require('ipfs-api')
const JSIPFS = require('ipfs')
const events = require('events')
const os = require('os')

export class IPFS {
  constructor(app) {
    //Use the app oject to access app functionnality (logger etc)
    this.app = app
    this.ipfsStatus = false
  }

  //Check if the ipfs server api is alive
  async isIpfsAlive() {
    let ipfs = IPFSAPI('/ip4/127.0.0.1/tcp/5001')
    let ipfsStatus = true
    try {
      await ipfs.version()
    } catch (error) {
      ipfsStatus = false
    }
    return ipfsStatus
  }

  //Spaw a js ipfs process
  async spawn() {
    if (isNode) {
      //Spawn the detached process if the server api does not respond
      if (!(await this.isIpfsAlive())) {
        let ipfsExecutable =
          os.platform() === 'linux'
            ? './node_modules/.bin/jsipfs'
            : 'node_modules\\.bin\\jsipfs.cmd'

        this.app.logger.info('Spaw IPFS node')
        let ipfsExecutableArgs = ['daemon', '--enable-pubsub-experiment']
        const spawn = require('child_process').spawn
        this.ipfsProcess = spawn(ipfsExecutable, ipfsExecutableArgs, {
          detached: true
        })
        this.app.logger.debug('Spawn: ' + ipfsExecutable + ipfsExecutableArgs)
      }

      var spawnEvent = new events.EventEmitter()
      //Wait for ipfs node online
      var checkIpfs = async () => {
        let timeOut = setTimeout(checkIpfs, 1500)
        if (await this.isIpfsAlive()) {
          clearTimeout(timeOut)
          spawnEvent.emit('spawnReady')
        } else {
          timeOut
        }
      }
      checkIpfs()

      return new Promise(function(resolve) {
        spawnEvent.on('spawnReady', resolve)
      })
    } else {
      this.app.logger.error('You cannot spaw process from browser')
    }
  }

  //Create the IPFS object
  async create() {
    //Event used to track the js-ipfs spawn start
    var ipfsEvent = new events.EventEmitter()

    if (isNode) {
      //server side ipfs-api object that connect to the spawned node
      this.ipfs = IPFSAPI('/ip4/127.0.0.1/tcp/5001')
      //Init the ipfs node
      await this.init()
    } else {
      //Client side js-ipfs node
      let options = {
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
          Bootstrap: [],
          Discovery: {
            webRTCStar: { enable: true } //, Enabled: true }
          }
        },
        preload: {
          enabled: false,
          addresses: []
        }
      }

      this.ipfs = new JSIPFS(options)

      this.ipfs.on('ready', async () => {
        //Init the ipfs node
        await this.init()
        ipfsEvent.emit('ipfsReady')
      })

      return new Promise(function(resolve) {
        ipfsEvent.on('ipfsReady', resolve)
      })
    }
  }

  //Stop ipfs
  async stop() {
    await this.ipfs.stop()
    this.app.logger.debug('Ipfs Stopped: ' + address)
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

  //Unsubscribe all pubsub
  async unSubscribeAll() {
    topics = await this.ipfs.pubsub.ls()
    console.log(topics)
    await topics.forEach(async topic => {
      await ipfs.pubsub.unsubscribe(topic)
    })
    this.app.logger.debug('Unsubscribe to all pub sub: ' + address)
  }
}
