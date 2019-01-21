import { isNode } from 'browser-or-node'
import { NODE } from '../lib/node'

export default async ({ app }, inject) => {
  if (!isNode) {
    app.node = new NODE(app)
    await app.node.loadDb()
    await app.node.setDb()
    app.node.announce()
    inject('node', app.node)
    app.logger.info('Plugin NODE loaded')
  }
}
