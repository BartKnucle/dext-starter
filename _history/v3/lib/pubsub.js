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
    this.app.db.ipfs.pubsub.publish(channel, Buffer.from(message), err => {
      if (err) {
        this.app.logger.err(err)
      }
      this.app.logger.silly('Msg ' + message + ' sent to ' + channel)
    })
  }

  //Listen on pubsub channel
  listen(channel, callback) {
    this.app.logger.info('Starting listening on: ' + channel)
    this.app.db.ipfs.pubsub.subscribe(
      channel,
      message => {
        callback(message)
        this.app.logger.silly(
          'Msg : ' +
            Buffer.from(message.data) +
            ' received from ' +
            message.from +
            ' to ' +
            channel
        )
      },
      err => {
        if (err) {
          this.app.logger.error(err)
        }
      }
    )
  }

  //Stop listening on pub sub channel
  stopListen(channel, callback) {
    this.app.logger.info('Stopping listening on: ' + channel)
    this.app.db.ipfs.pubsub.unsubscribe(channel, callback, err => {
      if (err) {
        this.app.logger.error(err)
      }
      this.app.logger.info('Unsubscribed from: ' + channel)
    })
  }
}
