import { WEBRTC } from '../lib/webrtc'
import { WEBSOCKET } from '../lib/websocket'

module.exports = function webrtc() {
  /*this.webrtc = new WEBRTC()
  this.logger.info('Module WEBRTC loaded')*/

  this.websocket = new WEBSOCKET()
  this.logger.info('Module WEBSOCKET loaded')
}
