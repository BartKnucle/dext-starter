import { NODE } from '../lib/node'

export default async ({ app }, inject) => {
  app.node = new NODE(app)
  await app.node.init()
  app.node.fill()

  app.node.started = true
  inject('node', app.node)
  app.logger.info('Plugin NODE loaded')
}
