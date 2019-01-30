import { SWARM } from '../lib/swarm'

module.exports = async function swarm() {
  this.swarm = new SWARM(this)
  await this.swarm.init()
  await this.swarm.listenNodes()
  this.logger.info('Module SWARM loaded')
}
