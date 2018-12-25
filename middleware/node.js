export default function({ store, route, isClient, isServer, app }) {
  if (isServer) {
    app.ipfs.on('ready', () => {
      console.log(app.orbitdb)
    })
  } else {
    console.log(app.orbitdb)
    console.log(route)
  }
}
