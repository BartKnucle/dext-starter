import { isNode } from 'browser-or-node'
import { IPFS } from '../lib/ipfs'

export default async ({ store, app }, inject) => {
  if (!isNode) {
    app.ipfs = new IPFS(app)
    await app.ipfs.create()

    //Connect ths browser to the local node
    if (isNode) {
      app.store.commit('ipfs/set_ssrAddrs', app.ipfs.getAddresses())
      app.logger.debug('Storing Ipfs SSR adresses ' + app.ipfs.getAddresses())
    } else {
      await app.ipfs.connect(
        '/ip4/127.0.0.1/tcp/4001/ws/ipfs/QmSwaAhW27J8Kkr3DKH5kwt31QneqFK8JGhxdNTYpA3ksB'
      )
      /*store.state.ipfs.ssrAddrs.forEach(async address => {
        await app.ipfs.connect(address)
      })*/
    }
    inject('ipfs', app.ipfs)
    app.logger.info('Ipfs Plugin loaded')
  }
}
