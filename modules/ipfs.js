import { IPFS } from '../lib/ipfs'

module.exports = async function ipfs() {
  //Clean the application on exit
  process.on('SIGINT', async () => {
    if (this.orbitdb) await this.orbitdb.stop()
    if (this.ipfs) await this.ipfs.stop()
    this.logger.info('Server stopper stopped')
  })

  this.ipfs = new IPFS(this)
  await this.ipfs.spawn()
  this.ipfs.create()
  this.logger.info('Module IPFS loaded')
}
