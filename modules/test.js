import { TEST } from '../lib/test'

module.exports = async function test() {
  this.test = new TEST(this)
  await this.test.init()
  this.test.fill()
  this.logger.info('Module TEST loaded')
}
