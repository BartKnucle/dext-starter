import { Node } from '../lib/node'

export default async ({ app }, inject) => {
  app.node = new Node()
  await app.node.init()
  inject('node', app.node)
}
