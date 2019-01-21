import { isNode } from 'browser-or-node'
import { SWARM } from '../lib/swarm'

export default async ({ store, app }, inject) => {
  //Get the swarm ID and store it)
  if (isNode) {
    app.swarm = new SWARM(app)
    await app.swarm.loadDb()
    app.store.commit('swarm/set_dbId', app.swarm.dbId)
    app.logger.debug('Storing Swarm Id ' + app.swarm.dbId)
  } else {
    app.swarm = new SWARM(app, store.state.swarm.dbId)
    await app.swarm.loadDb()
  }
  inject('swarm', app.swarm)
  app.logger.info('Swarm Plugin loaded')
}
