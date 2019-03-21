//import { WEBRTC } from '../lib/webrtc'
import { websocket } from '../lib/websocket'

module.exports = function webrtc() {
  this.websocket = new websocket()
  console.log('Module WEBSOCKET loaded')
}
