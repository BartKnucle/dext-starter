import { MODULE } from './module'

export class SWARM extends MODULE {
  //Set database options
  async init() {
    var options = {
      type: 'docstore',
      create: true,
      indexBy: 'id',
      write: ['*']
    }

    await super.init(null, options)
  }
}
