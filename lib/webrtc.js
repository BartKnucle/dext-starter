//Web rtc signaling server
const signalling = require('libp2p-webrtc-star/src/sig-server/index')
export class webrtc {
  constructor() {
    let server

    signalling.start(
      {
        port: 9090,
        host: '0.0.0.0'
        /*,metrics: !(argv.disableMetrics || process.env.DISABLE_METRICS)*/
      },
      (err, _server) => {
        if (err) {
          throw err
        }
        server = _server
        console.log('Listening on:', server.info.uri)
      }
    )

    process.on('SIGINT', () => {
      server.stop(() => {
        console.log('Signalling server stopped')
        process.exit()
      })
    })
  }
}
