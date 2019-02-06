import { SWARM } from '../lib/swarm'

export default async ({ app }, inject) => {
  app.swarm = new SWARM(app)
  await app.swarm.init()
  await app.swarm.registerSelf()
  app.node.db.events.on('replicated', async address => {
    await app.swarm.registerSelf()
  })
  inject('swarm', app.swarm)
  app.logger.info('Swarm Plugin loaded')
}
