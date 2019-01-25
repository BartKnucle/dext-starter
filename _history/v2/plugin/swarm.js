import { isNode } from 'browser-or-node'
import { SWARM } from '../lib/swarm'

export default app => {
  this.app.swarm = new SWARM(app)
  app.logger.info('Swarm Plugin loaded')
}
