import { isNode } from 'browser-or-node'
import { IPFS } from '../lib/ipfs'

export default async ({ store, app }) => {
  app.ipfs = new IPFS(app)
  await app.ipfs.create()

  if (isNode) {
    app.store.commit('ipfs/set_ssrAddrs', app.ipfs.getAddresses())
    app.logger.debug('Storing Ipfs SSR adresses ' + app.ipfs.getAddresses())
  } else {
    store.state.ipfs.ssrAddrs.forEach(async address => {
      await app.ipfs.connect(address)
    })
  }
  app.logger.info('Ipfs Plugin loaded')
}
