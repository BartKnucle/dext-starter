import { SWARM } from '../lib/swarm'

module.exports = async function swarm() {
  this.swarm = new SWARM(this)
  await this.swarm.init()
  this.swarm.registerSelf()
  this.swarm.announce()
  this.logger.info('Module SWARM loaded')
}
