import { SWARM } from '../lib/swarm'

module.exports = async function swarm() {
  this.swarm = new SWARM(this)
  await this.swarm.loadDb()
  await this.swarm.listen()
  this.logger.info('Module SWARM loaded')
}
