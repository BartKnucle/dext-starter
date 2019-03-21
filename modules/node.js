import { Node } from '../lib/node'

module.exports = async function node() {
  this.node = new Node(this)
  await this.node.init()
}
