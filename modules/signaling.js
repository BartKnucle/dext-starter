//import { WEBRTC } from '../lib/webrtc'
import { WEBSOCKET } from '../lib/websocket'

module.exports = function webrtc() {
  this.websocket = new WEBSOCKET()
  console.log('Module WEBSOCKET loaded')
}
