import { NODE } from '../lib/node'

export default async ({ app }, inject) => {
  app.node = new NODE()
  await app.node.init()
  inject('node', app.node)
}
