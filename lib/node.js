import { MODULE } from './module'
import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE extends MODULE {
  async fill() {
    super.fill()

    //Basic node informations
    await this.add({
      id: 'ipfs.id',
      data: this.app.ipfs.id.id
    })

    if (isNode) {
      await this.add({
        id: 'plateform.type',
        data: 'computer'
      })

      await this.add({
        id: 'plateform.os',
        data: os.platform()
      })

      await this.add({
        id: 'plateform.version',
        data: os.release()
      })
    } else {
      let plateform = require('platform')

      await this.add({
        id: 'plateform.type',
        data: 'user'
      })

      await this.add({
        id: 'plateform.os',
        data: plateform.os
      })

      await this.add({
        id: 'plateform.version',
        data: plateform.version
      })

      await this.add({
        id: 'plateform.osVersion',
        data: plateform.description
      })

      await this.add({
        id: 'plateform.name',
        data: plateform.name
      })
    }

    /*    //Get local user information (For computer only)
    var user = {
      id: 'user',
      name: 'User',
      children: []
    }

    if (isNode) {
      user.children.push({
        id: 'user.userId',
        name: os.userInfo().uid
      })

      user.children.push({
        id: 'user.userName',
        name: os.userInfo().username
      })

      user.children.push({
        id: 'user.userDir',
        name: os.userInfo().homedir
      })
    }
    await this.add(user) */

    this.started = true
  }

  //Annouce the node every minutes
  announce() {
    setInterval(() => {
      super.announce()
    }, 60000)
  }
}
