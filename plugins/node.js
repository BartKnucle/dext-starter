import { NODE } from '../lib/node'

export default async ({ app }, inject) => {
  app.node = new NODE(app)
  await app.node.init()
  app.node.fill()
  app.node.announce()

  app.node.started = true
  app.logger.info('Plugin NODE loaded')
}
