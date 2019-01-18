import { IPFS } from '../lib/ipfs'

module.exports = async function ipfs() {
  this.ipfs = new IPFS(this)
  await this.ipfs.spawn()
  this.ipfs.create()
  this.logger.info('Module IPFS loaded')
}
