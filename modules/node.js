import { NODE } from '../lib/node'

module.exports = async function node() {
  this.node = new NODE(this)
  await this.node.loadDb()
  await this.node.setPlateform()
  await this.node.closeDb()
  this.node.announce()
  this.logger.info('Module NODE loaded')
}
