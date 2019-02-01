import { SWARM } from '../lib/swarm'

export default async ({ app }, inject) => {
  app.swarm = new SWARM(app)
  await app.swarm.init()
  app.swarm.fill()
  await app.swarm.listenNodes()
  app.swarm.started = true
  inject('swarm', app.swarm)
  app.logger.info('Swarm Plugin loaded')
}
