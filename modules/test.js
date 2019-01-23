import { MODULE } from '../lib/module'

module.exports = async function test() {
  this.test = new MODULE(this)
  await this.test.init()
  this.test.fill()
  this.logger.info('Module TEST loaded')
}
