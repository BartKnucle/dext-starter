import { MODULE } from './module'
import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE extends MODULE {
  fill() {
    super.fill()

    var infos = {
      _id: 'infos',
      data: {}
    }

    if (isNode) {
      infos.data.type = 'computer'
      infos.data.plateform = os.platform()
    } else {
      infos.data.type = 'user'
      infos.data.plateform = navigator.userAgent
    }
    this.add(infos)
  }
}
