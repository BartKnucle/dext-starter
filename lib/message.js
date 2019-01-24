const Channel = require('ipfs-pubsub-1on1')

export class MESSAGE {
  constructor(app) {
    this.app = app
    this.privateChannels = []
  }

  //Open a channel to another peer
  async openTo(ipfsId) {
    if (this.privateChannels.find(channel => channel.id === ipfsId)) {
      let channel = await Channel.open(this.app.db.ipfs, ipfsId)
      await channel.connect()
      this.privateChannels.push({
        id: ipfsId,
        channel: channel
      })
      this.app.logger.info('Opened a private channel to', ipfs)
    }
  }

  //Send a message to another peer
  async sendTo(ipfsId, message) {
    this.privateChannels.find(channel => channel.id === ipfsId)
    await channel.send(message)
    this.app.logger.info('Msg send', message, 'to', ipfsId)
  }

  //Listen a message on our node
  listenToMe(callback) {
    channel.on('message', message => {
      callback(message)
      this.app.logger.info('Msg', message, 'received from', message.from)
    })
  }

  //Send message to pubsub channel
  send(channel, message) {
    app.ipfs.pubsub.publish(channel, Buffer.from(message), err => {
      if (err) {
        this.app.logger.err(err)
      }
      this.app.logger.info('Msg', message, 'sent to', channel)
    })
  }

  //Listen on pubsub channel
  listen(channel, callback) {
    app.ipfs.pubsub.subscribe(
      channel,
      async message => {
        callback(message)
        this.app.logger.info(
          'Msg',
          message,
          'received from',
          message.from,
          'to',
          ipfsId
        )
      },
      err => {
        if (err) {
          this.app.logger.error(err)
        }
      }
    )
  }
}
