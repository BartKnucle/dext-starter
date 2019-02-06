import { WEBRTC } from '../lib/webrtc'

module.exports = function webrtc() {
  this.webrtc = new WEBRTC()
  this.logger.info('Module WEBRTC loaded')
}
