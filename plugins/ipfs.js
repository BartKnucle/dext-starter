import { isNode } from 'browser-or-node'
import { IPFS } from '../lib/ipfs'

export default async ({ store, app }, inject) => {
  inject('app', app)
  app.ipfs = new IPFS(app)

  //Connect ths browser to the local node
  if (isNode) {
    //app.store.commit('ipfs/set_ssrAddrs', app.ipfs.getAddresses())
    //app.logger.debug('Storing Ipfs SSR adresses ' + app.ipfs.getAddresses())
  } else {
    await app.ipfs.create()
    await app.ipfs.connect(
      '/ip4/172.20.9.33/tcp/4001/ws/ipfs/QmQitRpHMfYCTefSiZ6qCGybbABuoHYkv8aztexWQz2uZN'
    )
    /*store.state.ipfs.ssrAddrs.forEach(async address => {
      await app.ipfs.connect(address)
    })*/
  }
  app.logger.info('Ipfs Plugin loaded')
}
