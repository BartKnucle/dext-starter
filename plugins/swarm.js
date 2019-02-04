import { SWARM } from '../lib/swarm'

export default async ({ app }, inject) => {
  app.swarm = new SWARM(app)
  app.swarm.listen()
  inject('swarm', app.swarm)
  app.logger.info('Swarm Plugin loaded')
}
