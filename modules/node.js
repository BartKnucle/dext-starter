import { NODE } from '../lib/node'

module.exports = async function node() {
  this.node = new NODE(this)
  await this.node.init()
  await this.node.fill()
  this.logger.info('Module NODE loaded')
}
