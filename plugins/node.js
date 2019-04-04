import { Node } from '../lib/node'

export default async ({ app, redirect }, inject) => {
  app.node = new Node()
  await app.node.init()
  inject('node', app.node)
  console.log(app.node.modules)
  app.store.dispatch('node/openDb')
}
