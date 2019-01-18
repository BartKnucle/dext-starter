import { NODE } from '../lib/node'

module.exports = async function node() {
  this.node = new NODE(this)
  await this.node.loadDb()
  await this.node.setOs()
  console.log(await this.node.getOs())
  console.log(this.node.getDbId())
  this.logger.info('Module NODE loaded')
}
