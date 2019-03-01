//Web socket signalig server
const signalling = require('libp2p-websocket-star-rendezvous/src/index')
export class WEBSOCKET {
  constructor() {
    let server

    signalling.start(
      {
        port: 9091,
        host: '0.0.0.0'
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
      server.stop(err => {
        console.log('Rendezvous server stopped')
        process.exit(err ? 2 : 0)
      })
    })
  }
}
