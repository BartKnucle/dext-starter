import { SWARM } from '../lib/swarm'

export default async ({ app }) => {
  app.swarm = new SWARM(app)
  await app.swarm.init()
  await app.swarm.listenNodes()
  app.logger.info('Swarm Plugin loaded')
}
