import { isNode } from 'browser-or-node'
import { NODE } from '../lib/node'

export default async ({ app }, inject) => {
  app.node = new NODE(app)
  if (!isNode) {
    await app.node.init()
    app.node.fill()
  }
  //inject('node', app.node)
  app.logger.info('Plugin NODE loaded')
}
