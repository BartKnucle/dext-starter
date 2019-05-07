import { Node } from '../lib/node'
import { isNode } from 'browser-or-node'

export default async ({ app, redirect }, inject) => {
  app.node = new Node()
  await app.node.init()
  inject('node', app.node)
  app.store.dispatch('node/openDb')
  app.store.dispatch('nodes/openDb', app.node.ipfs.id.id)
  app.store.dispatch('swarm/openDb')
  app.store.dispatch('messages/openDb')
  app.store.dispatch('permissions/openDb')
}
