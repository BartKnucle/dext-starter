import { isNode } from 'browser-or-node'
import { IPFS } from '../lib/ipfs'

export default async ({ store, app }, inject) => {
  app.ipfs = new IPFS(app)

  //Connect ths browser to the local node
  if (isNode) {
    //app.store.commit('ipfs/set_ssrAddrs', app.ipfs.getAddresses())
    //app.logger.debug('Storing Ipfs SSR adresses ' + app.ipfs.getAddresses())
  } else {
    await app.ipfs.create()
    await app.ipfs.connect(
      '/ip4/127.0.0.1/tcp/4001/ws/ipfs/QmSKdUDLaQDD3zCWMwWjULyFccjoGeWdtS8yCJMA4AoFAo'
    )
    /*store.state.ipfs.ssrAddrs.forEach(async address => {
      await app.ipfs.connect(address)
    })*/
  }
  app.logger.info('Ipfs Plugin loaded')
}
