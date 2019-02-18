import { MODULE } from './module'
import { isNode } from 'browser-or-node'
const os = require('os')

export class NODE extends MODULE {
  async init(id) {
    await super.init(id, null)

    this.db.events.on('write', address => {
      this.register()
    })
  }

  async fill() {
    super.fill()
    //Basic node informations
    await this.add({
      id: 'ipfs.id',
      data: this.app.ipfs.id.id
    })

    if (isNode) {
      await this.add({
        id: 'user.fullname',
        data: os.userInfo().username
      })

      await this.add({
        id: 'plateform.hostname',
        data: os.hostname()
      })

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
        data: plateform.os.family
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

    this.register()
    this.started = true
  }

  //Add ths local node to the swarm
  async register() {
    var swarmData = {
      id: this.dbId,
      data: {
        type: this.get('plateform.type').data,
        alive: true
      }
    }

    if (isNode) {
      swarmData.data.name = this.get('plateform.hostname').data
    } else {
      swarmData.data.name = this.get('user.fullname').data
    }

    //Add the node in the database
    await this.app.swarm.add(swarmData)

    this.app.logger.silly('Swarm added local node to the swarm')
  }
}
