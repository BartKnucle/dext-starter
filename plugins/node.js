import { Node } from '../lib/node'

export default async ({ app, redirect }, inject) => {
  app.node = new Node()
  await app.node.init()
  inject('node', app.node)
  console.log(app.node.modules)
  app.store.dispatch('node/openDb')
  app.store.dispatch('swarm/openDb')
  app.store.dispatch('messages/openDb')
  app.store.dispatch('permissions/openDb')
}
