import { MODULE } from './module'
import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE extends MODULE {
  async fill() {
    super.fill()

    //Basic node informations
    var infos = {
      _id: 'infos',
      data: {
        type: '', //Node type Browser or Computer
        plateform: {
          //Plateform that run the node or execute the browser (Windows, Linux etc...)
          name: '', //Name of the plateform
          version: '', //Version of the plateform
          userAgent: '' //userAgent string (only for the browsers)
        }
      }
    }

    if (isNode) {
      infos.data.type = 'computer'
      infos.data.plateform.name = os.platform()
      infos.data.plateform.version = os.release()
    } else {
      let platform = require('platform')
      infos.data.type = 'browser'
      infos.data.plateform.name = platform.name
      infos.data.plateform.version = platform.version
      infos.data.plateform.os = platform.os
      infos.data.plateform.osVersion = platform.description
    }
    await this.add(infos)

    //Get local user information (For computer only)
    var user = {
      _id: 'user',
      data: {
        userId: '', //local user guid
        userName: '', //Local username
        userDir: '' //Local data directory
      }
    }

    if (isNode) {
      user.data.userId = os.userInfo().uid
      user.data.userName = os.userInfo().username
      user.data.userDir = os.userInfo().homedir
    }
    await this.add(user)

    this.started = true
  }
}
