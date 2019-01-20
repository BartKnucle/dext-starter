import { IPFS } from '../lib/ipfs'

module.exports = async function ipfs() {
  this.ipfs = new IPFS(this)
  await this.ipfs.spawn()
  this.ipfs.create()

  //Gracefull exit
  process.on('SIGTERM', async () => {
    await this.ipfs.stop()
    this.logger.info('Daemon IPFS stopped')
  })

  process.on('SIGINT', async () => {
    await this.ipfs.stop()
    this.logger.info('Daemon IPFS stopped')
  })

  this.logger.info('Module IPFS loaded')
}
