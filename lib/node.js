import { MODULE } from './module'
import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE extends MODULE {
  async fill() {
    super.fill()

    //Basic node informations
    var infos = {
      id: 'infos',
      name: 'Informations',
      children: []
    }

    infos.children.push({
      id: 'infos.ipfs',
      name: 'Ipfs',
      children: [
        {
          id: 'infos.ipfs.id',
          name: this.app.ipfs.id.id
        }
      ]
    })

    var plateformInfos = {
      id: 'infos.plateform',
      name: 'Plateform',
      children: []
    }

    if (isNode) {
      plateformInfos.children.push(
        {
          id: 'infos.plateform.type',
          name: 'computer'
        },
        {
          id: 'infos.plateform.os',
          name: os.platform()
        },
        {
          id: 'infos.plateform.version',
          name: os.release()
        }
      )
    } else {
      let platformLib = require('platform')

      plateformInfos.children.push(
        {
          id: 'infos.plateform.type',
          name: 'browser'
        },
        {
          id: 'infos.plateform.os',
          name: platformLib.os
        },
        {
          id: 'infos.plateform.version',
          name: platformLib.version
        },
        {
          id: 'infos.plateform.osVersion',
          name: platformLib.description
        },
        {
          id: 'infos.plateform.name',
          name: platformLib.name
        }
      )
    }

    infos.children.push(plateformInfos)

    await this.add(infos)

    //Get local user information (For computer only)
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
    await this.add(user)

    this.started = true
  }

  //Annouce the node every minutes
  announce() {
    setInterval(() => {
      super.announce()
    }, 60000)
  }
}
