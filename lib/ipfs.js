import { isNode } from 'browser-or-node'
const IPFSAPI = require('ipfs-api')
const JSIPFS = require('ipfs')
const events = require('events')
const os = require('os')

export class IPFS {
  constructor(app) {
    //Use the app oject to access app functionnality (logger etc)
    this.app = app
  }

  //Spaw a js ipfs process
  async spawn() {
    if (isNode) {
      let ipfsExecutable =
        os.platform() === 'linux'
          ? './node_modules/.bin/jsipfs'
          : 'node_modules\\.bin\\jsipfs.cmd'

      this.app.logger.info('Spaw IPFS node')

      let ipfsExecutableArgs = ['daemon', '--enable-pubsub-experiment']

      const spawn = require('child_process').spawn
      this.ipfsProcess = spawn(ipfsExecutable, ipfsExecutableArgs)
      this.app.logger.debug('Spawn: ' + ipfsExecutable + ipfsExecutableArgs)

      //Event used to track the js-ipfs spawn start
      var spawnEvent = new events.EventEmitter()
      this.ipfsProcess.stdout.on(
        'data',
        function(data) {
          this.app.logger.info(data)
          if (Buffer.from(data).toString() == 'Daemon is ready\n') {
            spawnEvent.emit('spawnReady')
          }
        }.bind(this)
      )

      this.ipfsProcess.stderr.on(
        'data',
        function(data) {
          this.app.logger.error(data)
          //Stop the node process if we have an error on the ipfs spawn
          process.exit()
        }.bind(this)
      )

      this.ipfsProcess.on(
        'exit',
        function(code) {
          this.app.logger.info(code)
        }.bind(this)
      )

      //Wait for the process fully started to continue the process
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
              '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
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
