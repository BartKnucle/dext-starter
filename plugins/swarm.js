import { SWARM } from '../lib/swarm'

export default async ({ app }, inject) => {
  app.swarm = new SWARM(app)
  await app.swarm.init()
  inject('swarm', app.swarm)
  app.logger.info('Swarm Plugin loaded')
}
