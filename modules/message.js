import { MESSAGE } from '../lib/message'

module.exports = async function message() {
  this.msg = new MESSAGE(this)
  this.logger.info('Module Messages loaded')
}
